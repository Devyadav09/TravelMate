// middlewares/validate.js
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, source = "body") => (req, res, next) => {
  const data = req[source];
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    const details = error.details.map((err) => err.message);
    return next(new ApiError(400, details.join(", ")));
  }

  next();
};
