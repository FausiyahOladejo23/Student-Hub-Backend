const Assignment = require('../models/Assignment');
const asyncHandler = require('../middleware/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const filter = { user: req.userId };
  if (req.query.status === 'completed') filter.isCompleted = true;
  if (req.query.status === 'pending') filter.isCompleted = false;
  if (req.query.priority && ['low', 'medium', 'high'].includes(req.query.priority)) filter.priority = req.query.priority;
  const assignments = await Assignment.find(filter).sort({ dueDate: 1, createdAt: -1 });
  res.json({ success: true, count: assignments.length, assignments });
});
exports.create = asyncHandler(async (req, res) => {
  const assignment = await Assignment.create({ ...req.body, user: req.userId });
  res.status(201).json({ success: true, assignment });
});
exports.getOne = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findOne({ _id: req.params.id, user: req.userId });
  if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });
  res.json({ success: true, assignment });
});
exports.update = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates.user;
  if (updates.isCompleted === true) updates.completedAt = new Date();
  if (updates.isCompleted === false) updates.completedAt = null;
  const assignment = await Assignment.findOneAndUpdate({ _id: req.params.id, user: req.userId }, updates, { new: true, runValidators: true });
  if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });
  res.json({ success: true, assignment });
});
exports.remove = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found.' });
  res.json({ success: true, message: 'Assignment deleted.' });
});
