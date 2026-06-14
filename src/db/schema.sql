-- Stocks Table
CREATE TABLE IF NOT EXISTS stocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL,
  change REAL,
  change_percent REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Historical Data Table
CREATE TABLE IF NOT EXISTS historical_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stock_id INTEGER NOT NULL,
  date DATE NOT NULL,
  open REAL,
  high REAL,
  low REAL,
  close REAL,
  volume INTEGER,
  FOREIGN KEY (stock_id) REFERENCES stocks(id),
  UNIQUE(stock_id, date)
);

-- Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stock_id INTEGER NOT NULL,
  date DATE NOT NULL,
  predicted_price REAL,
  model_type TEXT,
  confidence REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stock_id) REFERENCES stocks(id)
);

-- Favorite Stocks Table
CREATE TABLE IF NOT EXISTS favorite_stocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT UNIQUE NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Prediction Accuracy Table
CREATE TABLE IF NOT EXISTS prediction_accuracy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stock_id INTEGER NOT NULL,
  model_type TEXT,
  prediction_date DATE,
  actual_price REAL,
  predicted_price REAL,
  error_percentage REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stock_id) REFERENCES stocks(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stock_id ON historical_data(stock_id);
CREATE INDEX IF NOT EXISTS idx_date ON historical_data(date);
CREATE INDEX IF NOT EXISTS idx_prediction_stock ON predictions(stock_id);
