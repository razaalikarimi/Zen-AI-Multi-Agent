import { sendSuccess } from "../../shared/utils/response.js";

const transactionsStore = [];

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    amount: 0,
    credits: 100,
    validity: 30,
    features: ["100 Free Credits", "Standard Response Speed", "Access to Basic Agents", "Community Support"],
  },
  starter: {
    id: "starter",
    name: "Starter",
    amount: 199,
    credits: 500,
    validity: 30,
    features: ["500 AI Credits", "Code Generation & Artifacts", "PDF & Presentation Agents", "Real-Time Web Search"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    amount: 499,
    credits: 1000,
    validity: 30,
    popular: true,
    features: [
      "1,000 AI Credits",
      "Everything in Starter",
      "Priority Multi-Agent Orchestration",
      "High-Res Image Generation",
      "Dedicated Document Analysis",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    amount: 1499,
    credits: 5000,
    validity: 30,
    features: [
      "5,000 AI Credits",
      "Everything in Pro",
      "Unlimited Knowledge Base Storage",
      "Dedicated High-Throughput Queue",
      "Custom Model Fine-Tuning & Priority Support",
    ],
  },
};

export const handleGetPlans = (req, res) => {
  return sendSuccess(res, { plans: Object.values(PLANS) });
};

export const handleCreateOrder = (req, res) => {
  const { planId, plan: planParam, amount } = req.body || {};
  const selectedPlanId = planId || planParam || "pro";
  const planDetails = PLANS[selectedPlanId] || PLANS.pro;
  const orderAmount = amount || (planDetails.amount ? planDetails.amount * 100 : 49900);
  return res.status(200).json({
    order: {
      id: "order_" + Date.now(),
      amount: orderAmount,
      currency: "INR",
    },
    plan: planDetails,
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
  PLANS,
  handleGetPlans,
  handleCreateOrder,
  handleVerifyPayment,
  handleGetTransactions,
};

