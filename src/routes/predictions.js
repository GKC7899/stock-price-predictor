const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// Get predictions for a stock
router.get('/:symbol', predictionController.getPredictions);

// Get prediction accuracy
router.get('/:symbol/accuracy', predictionController.getAccuracy);

module.exports = router;
