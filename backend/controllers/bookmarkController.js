const Bookmark = require('../models/Bookmark');
const Note = require('../models/Note');

// @desc    Toggle bookmark for a note
// @route   POST /api/notes/:id/bookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    const existingBookmark = await Bookmark.findOne({ userId, noteId });

    if (existingBookmark) {
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      note.bookmarkCountBase = Math.max(0, (note.bookmarkCountBase || 0) - 1);
      await note.save();
      return res.json({ success: true, bookmarked: false, data: note.bookmarkCountBase });
    } else {
      await Bookmark.create({ userId, noteId });
      note.bookmarkCountBase = (note.bookmarkCountBase || 0) + 1;
      await note.save();
      return res.json({ success: true, bookmarked: true, data: note.bookmarkCountBase });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all bookmarked notes for a user
// @route   GET /api/notes/bookmarks
exports.getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).populate('noteId');
    const notes = bookmarks.map(b => b.noteId).filter(n => n !== null);
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};