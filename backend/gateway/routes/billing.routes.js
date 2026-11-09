import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { proxyWithUser } from "../utils/proxyWithHeaders.js";
import {
  handleCreateOrder,
  handleVerifyPayment,
  handleGetTransactions,
} from "../controllers/billing.controller.js";

const router = express.Router();
const BILLING_SERVICE = process.env.BILLING_SERVICE;

router.post("/create-order", protect, handleCreateOrder);
router.post("/verify-payment", protect, handleVerifyPayment);
router.get("/transactions", protect, handleGetTransactions);

// Remote proxy if external microservice configured
if (BILLING_SERVICE && !BILLING_SERVICE.includes("localhost") && BILLING_SERVICE !== "self") {
  router.use("/", protect, proxyWithUser(BILLING_SERVICE));
}

export default router;
