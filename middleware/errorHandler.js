module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Validation failed.', errors: Object.values(err.errors).map(e => ({ field: e.path, message: e.message })) });
  }
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid resource ID.' });
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'That value is already in use.' });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, message: status >= 500 ? 'An unexpected server error occurred.' : err.message });
};
