const StudyGoal = require('../models/StudyGoal');
const asyncHandler = require('../middleware/asyncHandler');
exports.list = asyncHandler(async (req, res) => { const goals = await StudyGoal.find({ user: req.userId }).sort({ createdAt: -1 }); res.json({ success: true, count: goals.length, goals }); });
exports.create = asyncHandler(async (req, res) => { const goal = await StudyGoal.create({ ...req.body, user: req.userId }); res.status(201).json({ success: true, goal }); });
exports.update = asyncHandler(async (req, res) => {
  const updates = { ...req.body }; delete updates.user;
  if (updates.completedHours !== undefined && updates.targetHours !== undefined && updates.targetHours > 0) updates.isCompleted = updates.completedHours >= updates.targetHours;
  const goal = await StudyGoal.findOneAndUpdate({ _id: req.params.id, user: req.userId }, updates, { new: true, runValidators: true });
  if (!goal) return res.status(404).json({ success: false, message: 'Study goal not found.' });
  res.json({ success: true, goal });
});
exports.remove = asyncHandler(async (req, res) => { const goal = await StudyGoal.findOneAndDelete({ _id: req.params.id, user: req.userId }); if (!goal) return res.status(404).json({ success: false, message: 'Study goal not found.' }); res.json({ success: true, message: 'Study goal deleted.' }); });
