import {ApiError} from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const details = error.details.map((err) => err.message);
    return next(new ApiError(400, details.join(", ")));
  }

  next();
};
