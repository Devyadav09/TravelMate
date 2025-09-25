import { ApiError } from "../utils/ApiError.js";


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized: No user found");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: You do not have access to this resource");
    }

    next();
  };
};
