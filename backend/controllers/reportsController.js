// controllers/reportsController.js
import mongoose from "mongoose";
import PracticeAttempt from "../models/PracticeAttempt.js";
import GameSession from "../models/GameSession.js";
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);

export const getChildReport = asyncH(async (req,res)=>{
  const { childId } = req.params;

  const byEmotion = await PracticeAttempt.aggregate([
    { $match: { childId: new mongoose.Types.ObjectId(childId) } },
    { $group: {
      _id: "$emotionName",
      attempts: { $sum: 1 },
      passes: { $sum: { $cond: ["$passed", 1, 0] } },
      avgScore: { $avg: "$score" },
      avgStars: { $avg: "$stars" },
      lastAt: { $max: "$createdAt" },
    }},
    { $project: {
      _id:0, emotion:"$_id", attempts:1,
      passRate: { $cond:[{$eq:["$attempts",0]}, 0, {$divide:["$passes","$attempts"]}] },
      avgScore:1, avgStars:1, lastAt:1
    }},
    { $sort: { emotion:1 } }
  ]);

  const recent = await PracticeAttempt
    .find({ childId })
    .sort({ createdAt:-1 })
    .limit(10)
    .lean();

  const overallAgg = await PracticeAttempt.aggregate([
    { $match: { childId: new mongoose.Types.ObjectId(childId) } },
    { $group: {
      _id: null,
      attempts: { $sum: 1 },
      passes: { $sum: { $cond: ["$passed", 1, 0] } },
      avgScore: { $avg: "$score" },
      avgStars: { $avg: "$stars" },
    }},
    { $project: {
      _id:0, attempts:1, passes:1,
      passRate: { $cond:[{$eq:["$attempts",0]}, 0, {$divide:["$passes","$attempts"]}] },
      avgScore:1, avgStars:1
    }},
  ]);
  const overall = overallAgg[0] || { attempts:0, passRate:0, avgScore:0, avgStars:0 };

  // Interactive games aggregation
  const gamesAgg = await GameSession.aggregate([
    { $match: { childId: new mongoose.Types.ObjectId(childId) } },
    { $group: {
      _id: null,
      sessions: { $sum: 1 },
      avgRoutine: { $avg: "$routineScore" },
      avgTransport: { $avg: "$transportScore" },
      avgSocial: { $avg: "$socialScore" },
      avgSpatial: { $avg: "$spatialScore" },
      avgTotal: { $avg: "$totalScore" },
      lastPlayed: { $max: "$playedAt" }
    }},
    { $project: { _id:0, sessions:1, avgRoutine:1, avgTransport:1, avgSocial:1, avgSpatial:1, avgTotal:1, lastPlayed:1 } }
  ]);
  const gamesOverall = gamesAgg[0] || { sessions:0, avgRoutine:0, avgTransport:0, avgSocial:0, avgSpatial:0, avgTotal:0 };

  const recentGames = await GameSession.find({ childId }).sort({ playedAt: -1 }).limit(10).lean();

  res.json({ childId, overall, byEmotion, recent, games: { overall: gamesOverall, recent: recentGames } });
});
