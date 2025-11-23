// models/Team.js
const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }],
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
