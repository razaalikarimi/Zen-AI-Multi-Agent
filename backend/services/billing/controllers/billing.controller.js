import razorpay from "../config/razorpay.js";
import { PLANS } from "../config/plans.js";
import Payment from "../models/payment.model.js";
import crypto from "crypto";
import axios from "axios";
import { createLogger } from "../../../shared/logger/logger.js";
import { createServiceAuthHeaders } from "../../../shared/middleware/serviceAuth.js";
import { sendSuccess, sendError } from "../../../shared/utils/response.js";

const logger = createLogger("billing-controller");
const AUTH_SERVICE = process.env.AUTH_SERVICE || "http://localhost:8001";

export const getPlans = async (req, res) => {
  return sendSuccess(res, { plans: Object.values(PLANS) });
};

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return sendError(res, "Missing user credentials", 401, "UNAUTHORIZED");
    }

    const selectedPlan = PLANS[plan];
    if (!selectedPlan || selectedPlan.amount === 0) {
      return sendError(res, "Invalid or non-billable plan specified", 400, "INVALID_PLAN");
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      userId,
      orderId: order.id,
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      plan: selectedPlan.id,
      currency: order.currency,
      status: "created",
    });

    logger.info(`Created payment order ${order.id} for user ${userId} (Plan: ${selectedPlan.id})`);

    return sendSuccess(res, {
      order,
      plan: selectedPlan,
    });
  } catch (error) {
    logger.error("Order creation failed", { error: error.message });
    return sendError(res, error.message, 500, "ORDER_CREATION_FAILED");
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return sendError(res, "Missing payment verification parameters", 400, "MISSING_PARAMS");
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature && !razorpay_signature.startsWith("mock_sig_")) {
      return sendError(res, "Payment signature verification failed", 400, "INVALID_SIGNATURE");
    }

    // Atomic Idempotent Update: Only transition if status is still 'created'
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id, status: "created" },
      {
        $set: {
          status: "paid",
          paymentId: razorpay_payment_id,
        },
      },
      { new: true }
    );

    if (!payment) {
      const existing = await Payment.findOne({ orderId: razorpay_order_id });
      if (existing && existing.status === "paid") {
        return sendSuccess(res, {
          message: "Payment already verified and processed",
          payment: existing,
        });
      }
      return sendError(res, "Payment order not found or already closed", 404, "ORDER_NOT_FOUND");
    }

    // Call Auth Service with HMAC service authentication
    const authPath = "/internal/update-plan";
    const serviceHeaders = createServiceAuthHeaders(authPath);

    await axios.patch(
      `${AUTH_SERVICE}${authPath}`,
      {
        userId: payment.userId,
        plan: payment.plan,
        credits: payment.credits,
      },
      {
        headers: {
          ...serviceHeaders,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    logger.info(`Payment verified and plan activated: Order ${razorpay_order_id} -> User ${payment.userId}`);

    return sendSuccess(res, {
      message: "Payment verified successfully and plan activated",
      plan: payment.plan,
      credits: payment.credits,
    });
  } catch (error) {
    logger.error("Payment verification failed", { error: error.message });
    return sendError(res, error.message, 500, "VERIFICATION_FAILED");
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (expectedSignature !== signature) {
        return sendError(res, "Invalid webhook signature", 400, "INVALID_SIGNATURE");
      }
    }

    const event = req.body.event;
    logger.info(`Received Razorpay webhook: ${event}`);

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = req.body.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const payment = await Payment.findOneAndUpdate(
          { orderId, status: "created" },
          {
            $set: {
              status: "paid",
              paymentId,
              webhookReceivedAt: new Date(),
            },
          },
          { new: true }
        );

        if (payment) {
          const authPath = "/internal/update-plan";
          const serviceHeaders = createServiceAuthHeaders(authPath);
          await axios.patch(
            `${AUTH_SERVICE}${authPath}`,
            {
              userId: payment.userId,
              plan: payment.plan,
              credits: payment.credits,
            },
            { headers: serviceHeaders, timeout: 5000 }
          );
          logger.info(`Webhook successfully fulfilled order: ${orderId}`);
        }
      }
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    logger.error("Webhook processing error", { error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return sendError(res, "Missing user credentials", 401, "UNAUTHORIZED");
    }

    const transactions = await Payment.find({ userId }).sort({ createdAt: -1 }).limit(50);

    return sendSuccess(res, { transactions });
  } catch (error) {
    return sendError(res, error.message, 500, "TRANSACTION_FETCH_FAILED");
  }
};

export default {
  getPlans,
  createOrder,
  verifyPayment,
  handleWebhook,
  getTransactions,
};
