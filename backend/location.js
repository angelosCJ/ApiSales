const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  city: String,
  region: String,
  country: String,
  latitude: Number,
  longitude: Number,
  deviceId: String,  // Store unique device ID
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Location', locationSchema);
