const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, minlength: 1, maxlength: 160 },
  course: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 3000, default: '' },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false });
assignmentSchema.index({ user: 1, dueDate: 1 });
module.exports = mongoose.model('Assignment', assignmentSchema);
