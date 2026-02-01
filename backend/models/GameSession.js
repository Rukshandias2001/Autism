import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  routineScore: { type: Number, required: true },
  transportScore: { type: Number, required: true },
  socialScore: { type: Number, required: true },
  spatialScore: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  playedAt: { type: Date, default: Date.now }
});

const GameSession = mongoose.model('GameSession', gameSessionSchema);
export default GameSession;