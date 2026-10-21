const { validationResult } = require('express-validator');
module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Please check the submitted fields.', errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })) });
  }
  next();
};
