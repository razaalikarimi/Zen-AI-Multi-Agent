import { sendSuccess } from "../../shared/utils/response.js";

const transactionsStore = [];

export const handleCreateOrder = (req, res) => {
  const { planId, amount } = req.body || {};
  return res.status(200).json({
    orderId: "order_" + Date.now(),
    amount: amount || 2900,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mockKeyId",
  });
};

export const handleVerifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, planId } = req.body || {};
  const tx = {
    _id: "tx-" + Date.now(),
    orderId: razorpay_order_id || "mock-order",
    paymentId: razorpay_payment_id || "mock-pay-" + Date.now(),
    planId: planId || "pro",
    amount: 2900,
    currency: "INR",
    status: "success",
    createdAt: new Date().toISOString(),
  };
  transactionsStore.unshift(tx);
  return res.status(200).json({ success: true, transaction: tx });
};

export const handleGetTransactions = (req, res) => {
  return res.status(200).json(transactionsStore);
};

export default {
  handleCreateOrder,
  handleVerifyPayment,
  handleGetTransactions,
};
