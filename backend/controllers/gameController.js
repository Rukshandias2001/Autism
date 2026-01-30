import GameSession from '../models/GameSession.js';

export const submitGameResults = async (req, res) => {
  try {
    console.log("📥 Controller Hit! Body:", req.body);
    
    const { routine, transport, social, spatial } = req.body;

    // Validate logic here...
    const newSession = new GameSession({
      routineScore: routine,
      transportScore: transport,
      socialScore: social,
      spatialScore: spatial,
      totalScore: routine + transport + social + spatial
    });

    const savedSession = await newSession.save();

    res.status(201).json({
      success: true,
      message: "Scores saved successfully!",
      data: savedSession
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGameHistory = async (req, res) => {
  try {
    const history = await GameSession.find().sort({ playedAt: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};