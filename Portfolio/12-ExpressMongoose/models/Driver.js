// models/Driver.js
const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  number: { type: Number},
  code: { type: String },
  forename: { type: String },
  surname: { type: String },
  dob: { type: String },
  nationality: { type: String },
  url: { type: String },
  team: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);
