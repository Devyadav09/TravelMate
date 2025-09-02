// middlewares/error.middleware.js
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  // If it's an instance of ApiError (our custom errors)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || [],
      data: err.data || null
    });
  }

  // Fallback for unexpected errors
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: err.message || "Internal Server Error",
    errors: [],
    data: null
  });
};
