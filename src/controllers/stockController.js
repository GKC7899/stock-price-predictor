const axios = require('axios');
const db = require('../db/database');

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Get stock data
exports.getStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const upperSymbol = symbol.toUpperCase();
    
    // Fetch from Alpha Vantage API
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: upperSymbol,
        apikey: API_KEY
      }
    });

    const data = response.data['Global Quote'];
    
    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const stockData = {
      symbol: upperSymbol,
      price: parseFloat(data['05. price']),
      change: parseFloat(data['09. change']),
      changePercent: parseFloat(data['10. change percent']),
      volume: parseInt(data['06. volume']),
      timestamp: new Date()
    };

    // Store in database
    db.run(
      `INSERT OR REPLACE INTO stocks (symbol, price, change, change_percent, last_updated) 
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [stockData.symbol, stockData.price, stockData.change, stockData.changePercent],
      (err) => {
        if (err) console.error('DB Error:', err);
      }
    );

    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
};

// Get historical data
exports.getHistoricalData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: upperSymbol,
        apikey: API_KEY
      }
    });

    const timeSeries = response.data['Time Series (Daily)'];
    
    if (!timeSeries) {
      return res.status(404).json({ error: 'Historical data not found' });
    }

    const historicalData = Object.entries(timeSeries).slice(0, 60).map(([date, data]) => ({
      date,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseInt(data['5. volume'])
    }));

    res.json(historicalData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
};

// Add favorite stock
exports.addFavorite = (req, res) => {
  try {
    const { symbol } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    db.run(
      'INSERT OR IGNORE INTO favorite_stocks (symbol) VALUES (?)',
      [symbol.toUpperCase()],
      function(err) {
        if (err) {
          console.error('Error adding favorite:', err);
          return res.status(500).json({ error: 'Failed to add favorite' });
        }
        res.json({ success: true, symbol: symbol.toUpperCase() });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// Get favorites
exports.getFavorites = (req, res) => {
  try {
    db.all(
      'SELECT symbol, added_at FROM favorite_stocks ORDER BY added_at DESC',
      [],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch favorites' });
        }
        res.json(rows || []);
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// Remove favorite
exports.removeFavorite = (req, res) => {
  try {
    const { symbol } = req.params;

    db.run(
      'DELETE FROM favorite_stocks WHERE symbol = ?',
      [symbol.toUpperCase()],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to remove favorite' });
        }
        res.json({ success: true });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
