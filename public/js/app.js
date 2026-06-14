// Global variables
let currentSymbol = null;
let currentStock = null;
let historicalChart = null;
let predictionsChart = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadFavorites();
});

// Setup event listeners
function setupEventListeners() {
  document.getElementById('searchBtn').addEventListener('click', searchStock);
  document.getElementById('stockSymbol').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchStock();
  });
  document.getElementById('addFavoriteBtn').addEventListener('click', addToFavorites);
}

// Search stock
async function searchStock() {
  const symbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
  
  if (!symbol) {
    showError('Please enter a stock symbol');
    return;
  }

  try {
    showLoading(true);
    clearError();

    // Fetch stock data
    const response = await fetch(`/api/stocks/${symbol}`);
    
    if (!response.ok) {
      throw new Error('Stock not found. Please check the symbol.');
    }

    const stock = await response.json();
    currentSymbol = symbol;
    currentStock = stock;

    // Display stock info
    displayStockInfo(stock);

    // Fetch and display historical data
    await fetchAndDisplayHistoricalData(symbol);

    // Fetch and display predictions
    await fetchAndDisplayPredictions(symbol);

    // Load favorites
    await loadFavorites();

  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Failed to fetch stock data. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Display stock info
function displayStockInfo(stock) {
  const stockInfo = document.getElementById('stockInfo');
  const isPositive = stock.change >= 0;

  document.getElementById('stockSymbolDisplay').textContent = stock.symbol;
  document.getElementById('currentPrice').textContent = `$${stock.price.toFixed(2)}`;
  document.getElementById('changePercent').textContent = `${stock.changePercent.toFixed(2)}%`;
  document.getElementById('volume').textContent = stock.volume.toLocaleString();

  const changeElement = document.getElementById('priceChange');
  changeElement.textContent = `${isPositive ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)`;
  changeElement.className = `price-change ${isPositive ? 'positive' : 'negative'}`;

  stockInfo.style.display = 'block';
  document.getElementById('addFavoriteBtn').style.display = 'inline-block';
}

// Fetch historical data
async function fetchAndDisplayHistoricalData(symbol) {
  try {
    const response = await fetch(`/api/stocks/${symbol}/history`);
    if (!response.ok) throw new Error('Failed to fetch historical data');

    const historicalData = await response.json();
    displayHistoricalChart(historicalData, symbol);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    showError('Failed to load historical data');
  }
}

// Fetch predictions
async function fetchAndDisplayPredictions(symbol) {
  try {
    const response = await fetch(`/api/predictions/${symbol}?days=30`);
    if (!response.ok) throw new Error('Failed to fetch predictions');

    const predictionData = await response.json();
    displayPredictionsChart(predictionData);
    displayPredictionsTable(predictionData.predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    showError('Failed to load predictions');
  }
}

// Add to favorites
async function addToFavorites() {
  if (!currentSymbol) return;

  try {
    const response = await fetch('/api/stocks/favorite/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: currentSymbol })
    });

    if (response.ok) {
      alert(`${currentSymbol} added to favorites!`);
      await loadFavorites();
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    showError('Failed to add favorite');
  }
}

// Load favorites
async function loadFavorites() {
  try {
    const response = await fetch('/api/stocks/favorite/list');
    if (!response.ok) throw new Error('Failed to fetch favorites');

    const favorites = await response.json();
    displayFavorites(favorites);
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
}

// Display favorites
function displayFavorites(favorites) {
  const favoritesList = document.getElementById('favoritesList');
  const favoritesSection = document.getElementById('favoritesSection');

  if (favorites.length === 0) {
    favoritesSection.style.display = 'none';
    return;
  }

  favoritesList.innerHTML = favorites.map(fav => `
    <div class="favorite-item" onclick="searchStockFromFavorite('${fav.symbol}')">
      <div class="symbol">${fav.symbol}</div>
      <button class="remove-btn" onclick="removeFavorite('${fav.symbol}', event)">Remove</button>
    </div>
  `).join('');

  favoritesSection.style.display = 'block';
}

// Remove favorite
async function removeFavorite(symbol, event) {
  event.stopPropagation();
  
  try {
    const response = await fetch(`/api/stocks/favorite/${symbol}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await loadFavorites();
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

// Search from favorite
function searchStockFromFavorite(symbol) {
  document.getElementById('stockSymbol').value = symbol;
  searchStock();
}

// Show/hide loading
function showLoading(show) {
  const stockInfo = document.getElementById('stockInfo');
  if (show) {
    stockInfo.classList.add('loading');
  } else {
    stockInfo.classList.remove('loading');
  }
}

// Show error
function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

// Clear error
function clearError() {
  document.getElementById('errorMessage').style.display = 'none';
}

// Display predictions table
function displayPredictionsTable(predictions) {
  const tableBody = document.getElementById('predTableBody');
  const table = document.getElementById('predictionsTable');

  tableBody.innerHTML = predictions.slice(0, 15).map((pred, index) => `
    <tr>
      <td>Day ${pred.day}</td>
      <td>$${pred.linearRegression.toFixed(2)}</td>
      <td>$${pred.movingAverage.toFixed(2)}</td>
      <td><strong>$${pred.average.toFixed(2)}</strong></td>
    </tr>
  `).join('');

  table.style.display = 'block';
}
