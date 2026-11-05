import crypto from "crypto";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";
import { app } from "../config/firebase.js";
import { createLogger } from "../../../shared/logger/logger.js";
import { sendSuccess, sendError } from "../../../shared/utils/response.js";

const logger = createLogger("auth-controller");

const AGENT_CREDIT_COSTS = {
  auto: 2,
  chat: 1,
  search: 3,
  research: 5,
  coding: 5,
  document: 5,
  pdf: 5,
  ppt: 5,
  data: 5,
  image: 8,
  vision: 5,
};

export const login = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return sendError(res, "Authentication token is required", 400, "MISSING_TOKEN");
    }

    let decoded;

    // Secure dev mock token: only permitted in dev/test with explicit env flag
    if (token === "mock-user-token") {
      const isAllowedMock =
        process.env.ALLOW_DEV_MOCK_LOGIN === "true" ||
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test";

      if (!isAllowedMock) {
        return sendError(res, "Mock authentication is disabled in production", 403, "FORBIDDEN");
      }

      decoded = {
        uid: "mock-developer-uid-001",
        email: "developer@zen.ai",
        name: "Zen Architect",
        picture: "https://avatar.iran.liara.run/public/38",
        firebase: {
          sign_in_provider: "google.com",
        },
      };
    } else {
      decoded = await getAuth(app).verifyIdToken(token);
    }

    let user = await User.findOne({
      $or: [{ firebaseUid: decoded.uid }, { email: decoded.email?.toLowerCase() }],
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email?.toLowerCase(),
        name: decoded.name || "Zen User",
        avatar: decoded.picture || "https://avatar.iran.liara.run/public/38",
        provider: decoded.firebase?.sign_in_provider || "google.com",
        role: decoded.email === "developer@zen.ai" ? "admin" : "user",
        plan: "free",
        credits: 100,
        totalCredits: 100,
      });
      logger.info(`Created new user account: ${user.email} (${user._id})`);
    } else if (!user.firebaseUid && decoded.uid) {
      user.firebaseUid = decoded.uid;
      await user.save();
    }

    const sessionId = crypto.randomUUID();

    const sessionPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role || "user",
      plan: user.plan,
      credits: user.credits,
      totalCredits: user.totalCredits,
    };

    const sessionDurationSeconds = 60 * 60 * 24 * 7; // 7 days

    await redis.set(`user-session:${user._id}`, sessionId, "EX", sessionDurationSeconds);
    await redis.set(`session:${sessionId}`, JSON.stringify(sessionPayload), "EX", sessionDurationSeconds);

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * sessionDurationSeconds,
    });

    return res.json({
      success: true,
      user,
      sessionId,
    });
  } catch (error) {
    logger.error("Authentication failed", { error: error.message });
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTH_FAILED",
        message: error.message || "Failed to verify authentication token",
      },
    });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session || req.headers.authorization?.replace("Bearer ", "");

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return sendSuccess(res, { message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout error", { error: error.message });
    return sendError(res, error.message, 500, "LOGOUT_ERROR");
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { userId, plan, credits } = req.body;

    if (!userId || !plan) {
      return sendError(res, "Missing userId or plan", 400, "VALIDATION_ERROR");
    }

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404, "NOT_FOUND");
    }

    const additionalCredits = parseInt(credits || 0, 10);
    user.plan = plan;
    user.credits += additionalCredits;
    user.totalCredits += additionalCredits;
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await user.save();

    // Refresh active session in Redis
    const sessionId = await redis.get(`user-session:${user._id}`);
    if (sessionId) {
      const updatedSession = {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
      };
      await redis.set(`session:${sessionId}`, JSON.stringify(updatedSession), "EX", 60 * 60 * 24 * 7);
    }

    logger.info(`Updated user plan: ${user.email} -> ${plan} (+${additionalCredits} credits)`);
    return sendSuccess(res, { user });
  } catch (error) {
    logger.error("Plan update failed", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export const deductCredits = async (req, res) => {
  try {
    const { userId, agent } = req.body;

    if (!userId) {
      return sendError(res, "Missing userId parameter", 400, "VALIDATION_ERROR");
    }

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404, "NOT_FOUND");
    }

    const requiredCredits = AGENT_CREDIT_COSTS[agent] || 1;

    if (user.credits < requiredCredits) {
      return res.status(402).json({
        success: false,
        error: {
          code: "INSUFFICIENT_CREDITS",
          message: `Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}. Please upgrade your plan.`,
          required: requiredCredits,
          available: user.credits,
        },
      });
    }

    user.credits -= requiredCredits;
    user.usage.totalPromptsSent += 1;
    await user.save();

    // Sync session
    const sessionId = await redis.get(`user-session:${user._id}`);
    if (sessionId) {
      const existing = await redis.get(`session:${sessionId}`);
      if (existing) {
        const parsed = JSON.parse(existing);
        parsed.credits = user.credits;
        await redis.set(`session:${sessionId}`, JSON.stringify(parsed), "EX", 60 * 60 * 24 * 7);
      }
    }

    return sendSuccess(res, {
      credits: user.credits,
      deducted: requiredCredits,
    });
  } catch (error) {
    logger.error("Credit deduction error", { error: error.message });
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

// Admin Operations
export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const paidSubscriptions = await User.countDocuments({ plan: { $in: ["starter", "pro", "enterprise"] } });
    const freeUsers = totalUsers - paidSubscriptions;

    const creditAggregation = await User.aggregate([
      { $group: { _id: null, totalRemaining: { $sum: "$credits" }, totalAllocated: { $sum: "$totalCredits" } } },
    ]);

    return sendSuccess(res, {
      metrics: {
        totalUsers,
        paidSubscriptions,
        freeUsers,
        totalRemainingCredits: creditAggregation[0]?.totalRemaining || 0,
        totalAllocatedCredits: creditAggregation[0]?.totalAllocated || 0,
      },
    });
  } catch (error) {
    return sendError(res, error.message, 500, "ADMIN_ERROR");
  }
};

export const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    return sendSuccess(res, {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendError(res, error.message, 500, "ADMIN_ERROR");
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return sendError(res, "Invalid role specified", 400, "VALIDATION_ERROR");
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return sendError(res, "User not found", 404, "NOT_FOUND");
    }

    return sendSuccess(res, { user });
  } catch (error) {
    return sendError(res, error.message, 500, "ADMIN_ERROR");
  }
};

export default {
  login,
  logout,
  updatePlan,
  deductCredits,
  getAdminOverview,
  listUsers,
  updateUserRole,
};
