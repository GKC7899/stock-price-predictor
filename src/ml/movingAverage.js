/**
 * Moving Average Model
 * Predicts future values based on moving average trend
 */

function simpleMovingAverage(data, period) {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
}

function predict(historicalPrices, daysToPredict) {
  // Calculate 10-day moving average
  const maShort = simpleMovingAverage(historicalPrices, 10);
  
  // Calculate 20-day moving average
  const maLong = simpleMovingAverage(historicalPrices, 20);
  
  // Get last values
  const lastPriceShort = maShort[maShort.length - 1];
  const lastPriceLong = maLong[maLong.length - 1];
  const currentPrice = historicalPrices[historicalPrices.length - 1];
  
  // Calculate trend
  const trend = (lastPriceShort - lastPriceLong) / lastPriceLong;
  
  // Generate predictions
  const predictions = [];
  let predictedPrice = currentPrice;
  
  for (let i = 0; i < daysToPredict; i++) {
    // Apply trend with slight decay
    predictedPrice = predictedPrice * (1 + trend * 0.95);
    predictions.push(Math.max(predictedPrice, 0.01));
  }
  
  return predictions;
}

module.exports = {
  simpleMovingAverage,
  predict
};
