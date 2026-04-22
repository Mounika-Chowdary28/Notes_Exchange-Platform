const Report = require('../models/Report');
const Note = require('../models/Note');

// @desc    Report a note
// @route   POST /api/notes/:id/report
exports.reportNote = async (req, res) => {
  try {
    const { reason, details } = req.body;
    const noteId = req.params.id;
    const userId = req.user._id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    const report = await Report.create({
      noteId,
      userId,
      reason,
      details
    });

    note.reportCount = (note.reportCount || 0) + 1;
    await note.save();

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/notes/reports
exports.getReports = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    const reports = await Report.find().populate('noteId').populate('userId', 'name email');
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};