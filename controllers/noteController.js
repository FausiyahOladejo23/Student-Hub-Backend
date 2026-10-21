const Note = require('../models/Note');
const asyncHandler = require('../middleware/asyncHandler');
exports.list = asyncHandler(async (req, res) => { const notes = await Note.find({ user: req.userId }).sort({ isPinned: -1, updatedAt: -1 }); res.json({ success: true, count: notes.length, notes }); });
exports.create = asyncHandler(async (req, res) => { const note = await Note.create({ ...req.body, user: req.userId }); res.status(201).json({ success: true, note }); });
exports.update = asyncHandler(async (req, res) => { const updates = { ...req.body }; delete updates.user; const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.userId }, updates, { new: true, runValidators: true }); if (!note) return res.status(404).json({ success: false, message: 'Note not found.' }); res.json({ success: true, note }); });
exports.remove = asyncHandler(async (req, res) => { const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId }); if (!note) return res.status(404).json({ success: false, message: 'Note not found.' }); res.json({ success: true, message: 'Note deleted.' }); });
