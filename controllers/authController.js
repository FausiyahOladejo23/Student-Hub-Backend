const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
  req.session.userId = user.id;
  res.status(201).json({ success: true, message: 'Account created successfully.', user: publicUser(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  await new Promise((resolve, reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
  req.session.userId = user.id;
  res.json({ success: true, message: 'Logged in successfully.', user: publicUser(user) });
});

exports.logout = asyncHandler(async (req, res) => {
  if (!req.session) return res.json({ success: true, message: 'Logged out.' });
  await new Promise((resolve, reject) => req.session.destroy(err => err ? reject(err) : resolve()));
  res.clearCookie('studenthub.sid', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  res.json({ success: true, message: 'Logged out successfully.' });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ success: false, message: 'Session user no longer exists. Please log in again.' });
  }
  res.json({ success: true, user: publicUser(user) });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.userId).select('+passwordHash');
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  await new Promise((resolve, reject) => req.session.destroy(err => err ? reject(err) : resolve()));
  res.clearCookie('studenthub.sid', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  res.json({ success: true, message: 'Password changed. Please log in again.' });
});
