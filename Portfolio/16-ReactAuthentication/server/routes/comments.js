const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');

// GET comments for a specific movie
router.get('/:episode', async (req, res) => {
  try {
    const comments = await Comment.find({ movieEpisode: req.params.episode }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new comment (protected - requires authentication)
router.post('/', authMiddleware, async (req, res) => {
  const comment = new Comment({
    movieEpisode: req.body.movieEpisode,
    name: req.user.username, // Use authenticated user's username
    comment: req.body.comment,
    userId: req.user._id // Store user ID
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
