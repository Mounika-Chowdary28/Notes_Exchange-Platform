const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add points to user
// @route   POST /api/users/reward
exports.rewardUser = async (req, res) => {
  try {
    const { kind } = req.body;
    const map = { upload: 50, vote: 2, comment: 8, download: 1, helpful: 15 };
    const pts = map[kind] ?? 0;

    if (!pts) {
      return res.status(400).json({ success: false, error: 'Invalid reward kind' });
    }

    const user = await User.findById(req.user._id);
    user.points = (user.points || 0) + pts;
    await user.save();

    res.json({ success: true, data: user.points });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name points badges role')
      .sort({ points: -1 })
      .limit(12);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};