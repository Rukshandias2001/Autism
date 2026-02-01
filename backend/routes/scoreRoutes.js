import express from 'express';
import { submitGameResults, getGameHistory } from '../controllers/gameController.js';

const router = express.Router();

router.use((req, res, next) => {
  console.log(`🔍 Request reached Game Router: ${req.method} ${req.url}`);
  next();
});

router.post('/submit', submitGameResults);
router.get('/history', getGameHistory);

export default router;