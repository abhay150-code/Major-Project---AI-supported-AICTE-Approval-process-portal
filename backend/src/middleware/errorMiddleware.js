function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // Handle common Prisma database errors cleanly
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'A record with this unique value already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Requested record was not found' });
  }

  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
}

module.exports = errorMiddleware;
