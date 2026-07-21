/**
 * Global error handler middleware.
 * Catches any unhandled errors from controllers/routes.
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    return res.status(400).json({ error: `Duplicate value for: ${field}` });
  }

  // Mongoose cast error (invalid ObjectId etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for ${err.path}` });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
};
