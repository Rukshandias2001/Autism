const GameSession = require('../models/GameSession');

// @desc    Save game results
// @route   POST /api/games/submit
// @access  Public
exports.submitGameResults = async (req, res) => {
  try {
    const { routine, transport, social, spatial } = req.body;

    // Calculate total
    const total = routine + transport + social + spatial;

    const newSession = new GameSession({
      userId: "child_user_01", // Hardcoded for now, or send from frontend
      routineScore: routine,
      transportScore: transport,
      socialScore: social,
      spatialScore: spatial,
      totalScore: total
    });

    const savedSession = await newSession.save();

    res.status(201).json({
      success: true,
      message: "Scores saved successfully!",
      data: savedSession
    });

  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get all past scores
// @route   GET /api/games/history
exports.getGameHistory = async (req, res) => {
  try {
    const history = await GameSession.find().sort({ playedAt: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};