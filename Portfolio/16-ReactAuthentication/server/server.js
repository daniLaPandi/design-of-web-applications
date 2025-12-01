const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Debug logging
app.use((req, res, next) => {
  console.log(`[DEBUG] Request: ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/starwars';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const moviesRouter = require('./routes/movies');
const commentsRouter = require('./routes/comments');
const votesRouter = require('./routes/votes');
const authRouter = require('./routes/auth');
console.log('Auth Router loaded:', authRouter);

app.use('/api/movies', moviesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/votes', votesRouter);
app.use('/api/auth', authRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
