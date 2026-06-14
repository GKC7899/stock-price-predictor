const db = require('../db/database');
const linearRegression = require('../ml/linearRegression');
const movingAverage = require('../ml/movingAverage');

// Get predictions
exports.getPredictions = (req, res) => {
  try {
    const { symbol } = req.params;
    const days = parseInt(req.query.days) || 30;

    // Get stock id
    db.get(
      'SELECT id FROM stocks WHERE symbol = ?',
      [symbol.toUpperCase()],
      (err, stock) => {
        if (err || !stock) {
          return res.status(404).json({ error: 'Stock not found' });
        }

        // Get historical data
        db.all(
          'SELECT close FROM historical_data WHERE stock_id = ? ORDER BY date DESC LIMIT 60',
          [stock.id],
          (err, historicalRows) => {
            if (err || !historicalRows || historicalRows.length < 10) {
              return res.status(400).json({ error: 'Insufficient historical data' });
            }

            const prices = historicalRows.map(row => row.close).reverse();

            // Generate predictions using both models
            const lrPredictions = linearRegression.predict(prices, days);
            const maPredictions = movingAverage.predict(prices, days);

            // Average the predictions
            const predictions = lrPredictions.map((price, index) => ({
              day: index + 1,
              linearRegression: parseFloat(price.toFixed(2)),
              movingAverage: parseFloat(maPredictions[index].toFixed(2)),
              average: parseFloat(((price + maPredictions[index]) / 2).toFixed(2))
            }));

            res.json({
              symbol: symbol.toUpperCase(),
              predictions,
              lastPrice: prices[prices.length - 1],
              daysForecasted: days
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error generating predictions:', error);
    res.status(500).json({ error: 'Failed to generate predictions' });
  }
};

// Get prediction accuracy
exports.getAccuracy = (req, res) => {
  try {
    const { symbol } = req.params;

    db.all(
      `SELECT model_type, AVG(error_percentage) as avg_error, COUNT(*) as predictions 
       FROM prediction_accuracy 
       WHERE stock_id = (SELECT id FROM stocks WHERE symbol = ?)
       GROUP BY model_type`,
      [symbol.toUpperCase()],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch accuracy' });
        }
        res.json(rows || []);
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accuracy' });
  }
};
