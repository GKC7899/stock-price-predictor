/**
 * Simple Linear Regression Model
 * Predicts future values based on historical trend
 */

function linearRegression(xValues, yValues) {
  const n = xValues.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += xValues[i];
    sumY += yValues[i];
    sumXY += xValues[i] * yValues[i];
    sumX2 += xValues[i] * xValues[i];
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function predict(historicalPrices, daysToPredict) {
  // Prepare data
  const xValues = Array.from({ length: historicalPrices.length }, (_, i) => i + 1);
  const yValues = historicalPrices;

  // Calculate linear regression
  const { slope, intercept } = linearRegression(xValues, yValues);

  // Generate predictions
  const predictions = [];
  const lastX = xValues.length;

  for (let i = 1; i <= daysToPredict; i++) {
    const predictedPrice = slope * (lastX + i) + intercept;
    predictions.push(Math.max(predictedPrice, 0.01)); // Ensure positive price
  }

  return predictions;
}

module.exports = {
  linearRegression,
  predict
};
