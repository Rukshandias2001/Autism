import GameSession from '../models/GameSession.js';

export const submitGameResults = async (req, res) => {
  try {
    console.log("📥 Controller Hit! Body:", req.body);
    console.log("📥 User from token:", req.user);

    // Get childId from the authenticated user (set by requireAuth middleware)
    const childId = req.user?.childId || req.user?.sub;
    if (!childId) {
      return res.status(401).json({ success: false, message: "Child authentication required" });
    }

    const { routine, transport, social, spatial } = req.body;

    // Validate scores are within valid range (0-5)
    const scores = [routine, transport, social, spatial];
    for (const score of scores) {
      if (typeof score !== 'number' || score < 0 || score > 5) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid score value. Scores must be between 0 and 5." 
        });
      }
    }

    const newSession = new GameSession({
      childId,
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
    // Get childId from the authenticated user
    const childId = req.user?.childId || req.user?.sub;
    if (!childId) {
      return res.status(401).json({ success: false, message: "Child authentication required" });
    }

    // Only return history for this specific child
    const history = await GameSession.find({ childId }).sort({ playedAt: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
}; 