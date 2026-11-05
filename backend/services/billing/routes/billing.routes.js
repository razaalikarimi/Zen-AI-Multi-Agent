import express from "express";
import {
  createOrder,
  verifyPayment,
  handleWebhook,
  getTransactions,
  getPlans,
} from "../controllers/billing.controller.js";

const router = express.Router();

router.get("/plans", getPlans);
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/webhook", handleWebhook);
router.get("/transactions", getTransactions);

export default router;
