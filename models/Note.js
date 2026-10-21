const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, minlength: 1, maxlength: 160 },
  content: { type: String, trim: true, maxlength: 10000, default: '' },
  color: { type: String, enum: ['purple', 'blue', 'yellow', 'green', 'pink'], default: 'purple' },
  isPinned: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });
module.exports = mongoose.model('Note', noteSchema);
