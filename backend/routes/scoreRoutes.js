import express from 'express';
import { submitGameResults, getGameHistory } from '../controllers/gameController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

console.log("--------------------------------------");
console.log("✅ GAME ROUTE FILE LOADED");
console.log("--------------------------------------");

// Debug middleware: Prints whenever a request hits this router
router.use((req, res, next) => {
  console.log(`🔍 Request reached Game Router: ${req.method} ${req.url}`);
  next();
});

// All routes require child authentication
// Path matches: /api/scores/submit
router.post('/submit', requireAuth, requireRole('child'), submitGameResults);

// Path matches: /api/scores/history
router.get('/history', requireAuth, requireRole('child'), getGameHistory);

export default router;