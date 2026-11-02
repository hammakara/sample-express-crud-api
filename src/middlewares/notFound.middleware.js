import ApiError from "../utils/ApiError.js";

/**
 * Runs when no route matched the request.
 * Passes a 404 error to the global error middleware.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

export default notFound;
