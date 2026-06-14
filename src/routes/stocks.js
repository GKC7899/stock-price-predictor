const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Get stock data
router.get('/:symbol', stockController.getStock);

// Get historical data
router.get('/:symbol/history', stockController.getHistoricalData);

// Add favorite stock
router.post('/favorite/add', stockController.addFavorite);

// Get favorites
router.get('/favorite/list', stockController.getFavorites);

// Remove favorite
router.delete('/favorite/:symbol', stockController.removeFavorite);

module.exports = router;
