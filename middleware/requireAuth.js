module.exports = function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Please log in to continue.' });
  }
  req.userId = req.session.userId;
  next();
};
