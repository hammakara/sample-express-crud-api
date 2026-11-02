/**
 * Global error-handling middleware.
 *
 * Express recognises this as error middleware because it has four arguments.
 * It converts Mongoose errors into the same JSON response format used by
 * every other endpoint.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors;

  // Mongoose validation errors (missing fields, bad age, invalid email, etc.)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((error) => error.message);
  }

  // MongoDB duplicate key error (the unique email index was violated).
  if (err.code === 11000) {
    statusCode = 409;
    message = "A student with this email already exists";
  }

  // Mongoose CastError, for example an invalid ObjectId.
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid student ID";
  }

  // express.json() throws this when the request body is not valid JSON.
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  const response = {
    success: false,
    message,
  };

  // Include field-level validation messages when they exist.
  if (errors) {
    response.errors = errors;
  }

  // Never send a stack trace to clients in production.
  if (process.env.NODE_ENV === "development" && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
