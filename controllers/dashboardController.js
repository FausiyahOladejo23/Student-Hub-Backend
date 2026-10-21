const Assignment = require('../models/Assignment');
const StudyGoal = require('../models/StudyGoal');
const Note = require('../models/Note');
const asyncHandler = require('../middleware/asyncHandler');

exports.summary = asyncHandler(async (req, res) => {
  const now = new Date();
  const nextSevenDays = new Date(now);
  nextSevenDays.setDate(nextSevenDays.getDate() + 7);
  const [totalAssignments, completedAssignments, pendingAssignments, overdueAssignments, upcomingDeadlines, totalGoals, completedGoals, totalNotes] = await Promise.all([
    Assignment.countDocuments({ user: req.userId }),
    Assignment.countDocuments({ user: req.userId, isCompleted: true }),
    Assignment.countDocuments({ user: req.userId, isCompleted: false }),
    Assignment.countDocuments({ user: req.userId, isCompleted: false, dueDate: { $lt: now } }),
    Assignment.find({ user: req.userId, isCompleted: false, dueDate: { $gte: now, $lte: nextSevenDays } }).sort({ dueDate: 1 }).limit(5).select('title course dueDate priority isCompleted'),
    StudyGoal.countDocuments({ user: req.userId }),
    StudyGoal.countDocuments({ user: req.userId, isCompleted: true }),
    Note.countDocuments({ user: req.userId })
  ]);
  res.json({ success: true, summary: { totalAssignments, completedAssignments, pendingAssignments, overdueAssignments, totalGoals, completedGoals, totalNotes, upcomingDeadlines } });
});
