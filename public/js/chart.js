// Display historical data chart
function displayHistoricalChart(data, symbol) {
  const ctx = document.getElementById('historicalChart').getContext('2d');
  const section = document.getElementById('historicalSection');

  // Prepare data
  const labels = data.reverse().map(d => d.date);
  const prices = data.map(d => d.close);

  // Destroy existing chart if any
  if (window.historicalChart) {
    window.historicalChart.destroy();
  }

  // Create chart
  window.historicalChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: `${symbol} Historical Price`,
          data: prices,
          borderColor: '#1e88e5',
          backgroundColor: 'rgba(30, 136, 229, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#1e88e5',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Price ($)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });

  section.style.display = 'block';
}

// Display predictions chart
function displayPredictionsChart(predictionData) {
  const ctx = document.getElementById('predictionsChart').getContext('2d');
  const section = document.getElementById('predictionsSection');
  const predictions = predictionData.predictions;

  // Prepare data
  const labels = predictions.map(p => `Day ${p.day}`);
  const lrPrices = predictions.map(p => p.linearRegression);
  const maPrices = predictions.map(p => p.movingAverage);
  const avgPrices = predictions.map(p => p.average);

  // Destroy existing chart if any
  if (window.predictionsChart) {
    window.predictionsChart.destroy();
  }

  // Create chart
  window.predictionsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Linear Regression',
          data: lrPrices,
          borderColor: '#43a047',
          backgroundColor: 'rgba(67, 160, 71, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          borderDash: [5, 5],
          pointRadius: 2,
          pointBackgroundColor: '#43a047'
        },
        {
          label: 'Moving Average',
          data: maPrices,
          borderColor: '#fb8c00',
          backgroundColor: 'rgba(251, 140, 0, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          borderDash: [5, 5],
          pointRadius: 2,
          pointBackgroundColor: '#fb8c00'
        },
        {
          label: 'Average Prediction',
          data: avgPrices,
          borderColor: '#1e88e5',
          backgroundColor: 'rgba(30, 136, 229, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#1e88e5',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Predicted Price ($)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Days'
          }
        }
      }
    }
  });

  section.style.display = 'block';
}
