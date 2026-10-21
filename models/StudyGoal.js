const mongoose = require('mongoose');

const studyGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, minlength: 1, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  targetDate: { type: Date, default: null },
  targetHours: { type: Number, min: 0, max: 10000, default: 0 },
  completedHours: { type: Number, min: 0, max: 10000, default: 0 },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });
module.exports = mongoose.model('StudyGoal', studyGoalSchema);
