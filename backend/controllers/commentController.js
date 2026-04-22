const Comment = require('../models/Comment');
const Note = require('../models/Note');

// @desc    Add a comment to a note
// @route   POST /api/notes/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { body, parentId } = req.body;
    const noteId = req.params.id;
    const userId = req.user._id;
    const authorName = req.user.name;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    const comment = await Comment.create({
      noteId,
      userId,
      authorName,
      body,
      parentId: parentId || null
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all comments for a note
// @route   GET /api/notes/:id/comments
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ noteId: req.params.id }).sort({ createdAt: 1 });
    
    // Structure comments into a tree (with replies)
    const commentMap = {};
    const result = [];

    comments.forEach(c => {
      const commentObj = { ...c._doc, id: c._id, replies: [] };
      commentMap[c._id] = commentObj;
      if (c.parentId) {
        if (commentMap[c.parentId]) {
          commentMap[c.parentId].replies.push(commentObj);
        }
      } else {
        result.push(commentObj);
      }
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Mark comment as helpful
// @route   PUT /api/comments/:id/helpful
exports.markHelpful = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    comment.helpful += 1;
    await comment.save();

    res.json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Set comment as best answer
// @route   PUT /api/comments/:id/best
exports.setBestAnswer = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    // Optional: Check if the requester is the note owner
    const note = await Note.findById(comment.noteId);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to mark best answer' });
    }

    // Unset any previous best answer for this note
    await Comment.updateMany({ noteId: comment.noteId }, { bestAnswer: false });

    comment.bestAnswer = true;
    await comment.save();

    res.json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};