const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  movieEpisode: {
    type: String,
    required: true,
    unique: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Vote', VoteSchema);
