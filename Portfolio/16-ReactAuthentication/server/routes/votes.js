const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const authMiddleware = require('../middleware/authMiddleware');

// GET votes for a specific movie
router.get('/:episode', async (req, res) => {
  try {
    let vote = await Vote.findOne({ movieEpisode: req.params.episode });
    if (!vote) {
      vote = new Vote({ movieEpisode: req.params.episode, likes: 0, dislikes: 0 });
      await vote.save();
    }
    res.json(vote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST/UPDATE vote (like) - protected, requires authentication
router.post('/:episode/like', authMiddleware, async (req, res) => {
  try {
    let vote = await Vote.findOne({ movieEpisode: req.params.episode });
    if (!vote) {
      vote = new Vote({ movieEpisode: req.params.episode, likes: 1, dislikes: 0 });
    } else {
      vote.likes += 1;
    }
    const updatedVote = await vote.save();
    res.json(updatedVote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST/UPDATE vote (dislike) - protected, requires authentication
router.post('/:episode/dislike', authMiddleware, async (req, res) => {
  try {
    let vote = await Vote.findOne({ movieEpisode: req.params.episode });
    if (!vote) {
      vote = new Vote({ movieEpisode: req.params.episode, likes: 0, dislikes: 1 });
    } else {
      vote.dislikes += 1;
    }
    const updatedVote = await vote.save();
    res.json(updatedVote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all votes
router.get('/', async (req, res) => {
  try {
    const votes = await Vote.find();
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
