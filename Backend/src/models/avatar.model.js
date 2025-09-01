const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the user who owns this avatar

  url: { 
    type: String, 
    required: true 
  }, // Ready Player avatar URL

  avatarData: {
    type: Object, 
    default: {} 
  }, // Optional additional avatar data (e.g., customization)

  createdAt: {
    type: Date, 
    default: Date.now 
  }
});

const Avatar = mongoose.model('Avatar', avatarSchema);

module.exports = Avatar;
