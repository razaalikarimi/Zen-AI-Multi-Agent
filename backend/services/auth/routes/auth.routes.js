import express from "express";
import {
  deductCredits,
  login,
  logout,
  updatePlan,
  getAdminOverview,
  listUsers,
  updateUserRole,
} from "../controllers/auth.controllers.js";
import { requireServiceAuth } from "../../../shared/middleware/serviceAuth.js";

const router = express.Router();

// Public Auth Endpoints
router.post("/login", login);
router.get("/logout", logout);
router.post("/logout", logout);

// Internal Microservice Operations (Protected via HMAC service authentication)
router.patch("/internal/update-plan", requireServiceAuth, updatePlan);
router.patch("/internal/deduct-credits", requireServiceAuth, deductCredits);

// Admin Operations (Gateway enforces requireRole('admin'))
router.get("/admin/overview", getAdminOverview);
router.get("/admin/users", listUsers);
router.patch("/admin/users/:id/role", updateUserRole);

export default router;
