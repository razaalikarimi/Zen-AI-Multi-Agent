import express from "express";
import proxy from "express-http-proxy";
import { handleLogin, handleLogout } from "../controllers/auth.controller.js";

const router = express.Router();
const AUTH_SERVICE = process.env.AUTH_SERVICE;

// Direct resilient login/logout with remote fallback
router.post("/login", handleLogin);
router.all("/logout", handleLogout);

if (AUTH_SERVICE && !AUTH_SERVICE.includes("localhost") && AUTH_SERVICE !== "self") {
  router.use("/", proxy(AUTH_SERVICE, {
    parseReqBody: true,
    proxyReqOptDecorator: (opts, req) => {
      opts.headers["x-correlation-id"] = req.correlationId;
      return opts;
    },
  }));
}

export default router;
