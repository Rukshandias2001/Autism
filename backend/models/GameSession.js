import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  routineScore: { type: Number, required: true },
  transportScore: { type: Number, required: true },
  socialScore: { type: Number, required: true },
  spatialScore: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  playedAt: { type: Date, default: Date.now }
});

// Index for efficient queries by child
gameSessionSchema.index({ childId: 1, playedAt: -1 });

const GameSession = mongoose.model('GameSession', gameSessionSchema);
export default GameSession;