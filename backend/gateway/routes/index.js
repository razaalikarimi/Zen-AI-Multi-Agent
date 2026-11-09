import express from "express";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { proxyWithUser } from "../utils/proxyWithHeaders.js";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import chatRoutes from "./chat.routes.js";
import agentRoutes from "./agent.routes.js";
import billingRoutes from "./billing.routes.js";

const apiRouter = express.Router();
const AUTH_SERVICE = process.env.AUTH_SERVICE;

// Mount resource routers
apiRouter.use("/auth", authRoutes);
apiRouter.use("/chat", chatRoutes);
apiRouter.use("/agent", agentRoutes);
apiRouter.use("/billing", billingRoutes);
apiRouter.use("/", userRoutes); // Mounts /me directly under /api/me

// Admin proxy routes
if (AUTH_SERVICE && !AUTH_SERVICE.includes("localhost") && AUTH_SERVICE !== "self") {
  apiRouter.use("/admin", protect, requireRole("admin"), proxyWithUser(AUTH_SERVICE));
}

export default apiRouter;
