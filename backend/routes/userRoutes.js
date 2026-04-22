const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  rewardUser,
  getLeaderboard
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.get('/leaderboard', getLeaderboard);
router.post('/reward', protect, rewardUser);

module.exports = router;