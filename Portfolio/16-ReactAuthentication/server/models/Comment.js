const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  movieEpisode: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for backward compatibility
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
