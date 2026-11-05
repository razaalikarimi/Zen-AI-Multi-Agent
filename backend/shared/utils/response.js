/**
 * Standardized API Response Helpers
 */

export const sendSuccess = (res, data = {}, meta = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      correlationId: res.req?.correlationId || "unknown",
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
};

export const sendError = (res, message = "Error", statusCode = 400, code = "BAD_REQUEST", details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      correlationId: res.req?.correlationId || "unknown",
      timestamp: new Date().toISOString(),
    },
  });
};

export default {
  sendSuccess,
  sendError,
};

