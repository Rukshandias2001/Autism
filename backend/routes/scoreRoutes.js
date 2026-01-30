import express from 'express';
import { submitGameResults, getGameHistory } from '../controllers/gameController.js';

const router = express.Router();

console.log("--------------------------------------");
console.log("✅ GAME ROUTE FILE LOADED");
console.log("--------------------------------------");

// Debug middleware: Prints whenever a request hits this router
router.use((req, res, next) => {
  console.log(`🔍 Request reached Game Router: ${req.method} ${req.url}`);
  next();
});

// Path matches: /api/games/submit
router.post('/submit', submitGameResults);

// Path matches: /api/games/history
router.get('/history', getGameHistory);

export default router;