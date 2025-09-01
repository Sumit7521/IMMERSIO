const express = require('express');
const router = express.Router();
const Avatar = require('../models/avatar.model');
const User = require('../models/user.model');
const { authMiddleware } = require('../middlewares/auth.middleware'); // updated import

// POST /api/avatar/save
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { url, avatarData } = req.body;

    if (!url) return res.status(400).json({ message: 'Avatar URL is required' });

    // Create new Avatar
    const avatar = new Avatar({
      user: req.user._id,
      url,
      avatarData
    });

    await avatar.save();

    // Add reference to user's avatars array
    const user = await User.findById(req.user._id);
    user.avatars = user.avatars || [];
    user.avatars.push(avatar._id);
    await user.save();

    res.status(201).json({ message: 'Avatar saved successfully', avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
