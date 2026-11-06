import { sendSuccess, sendError } from "../../shared/utils/response.js";

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return sendError(res, "User not authenticated", 401, "UNAUTHORIZED");
    }

    const userData = {
      userId: req.user.userId || req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar,
      role: req.user.role || "user",
      plan: req.user.plan || "free",
      credits: req.user.credits ?? 100,
      totalCredits: req.user.totalCredits ?? 100,
    };

    return res.status(200).json({
      success: true,
      user: userData,
      data: { user: userData },
      meta: {
        correlationId: req.correlationId || "unknown",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return sendError(res, error.message, 500, "INTERNAL_ERROR");
  }
};

export default { getCurrentUser };
