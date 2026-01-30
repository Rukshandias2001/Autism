const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: "guest" // You can change this later when you add Login
  },
  routineScore: { type: Number, required: true },
  transportScore: { type: Number, required: true },
  socialScore: { type: Number, required: true },
  spatialScore: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  playedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GameSession', gameSessionSchema);