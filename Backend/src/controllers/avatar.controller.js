const Avatar = require('../models/avatar.model');
const User = require('../models/user.model');
async function createavatar(req, res) {
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
}

async function getavatar(req, res) {
  try {
    // Find the user
    const user = await User.findById(req.user._id).populate('avatars');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Send back user's avatars
    res.status(200).json({ avatars: user.avatars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {createavatar,getavatar}