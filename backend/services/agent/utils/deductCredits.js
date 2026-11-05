import axios from "axios";
import { createServiceAuthHeaders } from "../../../shared/middleware/serviceAuth.js";

export const deductCredits = async (userId, agent) => {
  if (!userId) return;

  const authService = process.env.AUTH_SERVICE || "http://localhost:8001";
  const targetPath = "/internal/deduct-credits";
  const authHeaders = createServiceAuthHeaders(targetPath);

  try {
    await axios.patch(
      `${authService}${targetPath}`,
      {
        userId,
        agent,
      },
      {
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );
  } catch (error) {
    const response = error.response?.data;
    const err = new Error(response?.error?.message || response?.message || "Failed to deduct credits.");
    err.status = error.response?.status || 500;
    err.data = {
      success: false,
      title: response?.error?.code === "INSUFFICIENT_CREDITS" ? "Insufficient Credits" : "Billing Error",
      message: response?.error?.message || response?.message || "You don't have enough credits. Please upgrade your plan.",
    };
    throw err;
  }
};

export default deductCredits;
