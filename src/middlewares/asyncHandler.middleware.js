/**
 * Wraps an async controller function and forwards any rejected promise
 * to Express's error-handling middleware.
 *
 * Without this helper we would need try/catch inside every controller.
 */
const asyncHandler = (controller) => {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
};

export default asyncHandler;
