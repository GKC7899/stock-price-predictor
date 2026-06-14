// ML Prediction functions (can be enhanced with TensorFlow.js)

/**
 * Simple Linear Regression Prediction
 * @param {number[]} historicalPrices - Historical price data
 * @param {number} daysToPredict - Number of days to predict
 * @returns {number[]} Predicted prices
 */
function linearRegressionPredict(historicalPrices, daysToPredict) {
  const n = historicalPrices.length;
  const xValues = Array.from({ length: n }, (_, i) => i + 1);
  
  // Calculate means
  const meanX = xValues.reduce((a, b) => a + b) / n;
  const meanY = historicalPrices.reduce((a, b) => a + b) / n;
  
  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - meanX) * (historicalPrices[i] - meanY);
    denominator += (xValues[i] - meanX) ** 2;
  }
  
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  
  // Generate predictions
  const predictions = [];
  for (let i = 1; i <= daysToPredict; i++) {
    const predictedPrice = slope * (n + i) + intercept;
    predictions.push(Math.max(predictedPrice, 0.01));
  }
  
  return predictions;
}

/**
 * Moving Average Prediction
 * @param {number[]} historicalPrices - Historical price data
 * @param {number} daysToPredict - Number of days to predict
 * @returns {number[]} Predicted prices
 */
function movingAveragePredict(historicalPrices, daysToPredict) {
  const period = 10;
  const prices = [...historicalPrices];
  
  // Calculate moving averages
  const movingAvgs = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    movingAvgs.push(sum / period);
  }
  
  // Get trend
  const lastMA = movingAvgs[movingAvgs.length - 1];
  const secondLastMA = movingAvgs[movingAvgs.length - 2];
  const trend = (lastMA - secondLastMA) / secondLastMA;
  
  // Generate predictions
  const predictions = [];
  let currentPrice = prices[prices.length - 1];
  
  for (let i = 0; i < daysToPredict; i++) {
    currentPrice = currentPrice * (1 + trend * 0.95);
    predictions.push(Math.max(currentPrice, 0.01));
  }
  
  return predictions;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    linearRegressionPredict,
    movingAveragePredict
  };
}
