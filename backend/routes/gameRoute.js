const express = require('express');
const router = express.Router();
const { submitGameResults, getGameHistory } = require('../controllers/gameController');

// POST http://localhost:5000/api/games/submit
router.post('/submit', submitGameResults);

// GET http://localhost:5000/api/games/history
router.get('/history', getGameHistory);

module.exports = router;