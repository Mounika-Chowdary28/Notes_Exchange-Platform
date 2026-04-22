const express = require('express');
const router = express.Router();
const { 
  getNotes, 
  getNoteById, 
  createNote, 
  voteNote,
  downloadNote,
  verifyNote,
  updateNote,
  deleteNote,
  getSystemStats
} = require('../controllers/noteController');
const {
  addComment,
  getComments,
  markHelpful,
  setBestAnswer
} = require('../controllers/commentController');
const {
  toggleBookmark,
  getUserBookmarks
} = require('../controllers/bookmarkController');
const {
  reportNote,
  getReports
} = require('../controllers/reportController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', optionalProtect, getNotes);
router.get('/stats', protect, getSystemStats);
router.get('/bookmarks', protect, getUserBookmarks);
router.get('/reports', protect, getReports);
router.get('/:id', optionalProtect, getNoteById);
router.post('/', protect, upload.single('file'), createNote);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);
router.post('/:id/vote', protect, voteNote);
router.post('/:id/download', downloadNote);
router.post('/:id/bookmark', protect, toggleBookmark);
router.post('/:id/report', protect, reportNote);
router.put('/:id/verify', protect, verifyNote);

// Comment routes
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, addComment);
router.put('/comments/:id/helpful', protect, markHelpful);
router.put('/comments/:id/best', protect, setBestAnswer);

module.exports = router;