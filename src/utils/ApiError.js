/**
 * A small helper for creating errors that carry an HTTP status code.
 *
 * Example: throw new ApiError(404, "Student not found");
 * The global error middleware reads error.statusCode and sends that status.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

export default ApiError;
