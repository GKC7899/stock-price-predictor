# 📈 Stock Price Predictor

An AI-powered web application that predicts stock prices using machine learning models. Built with HTML, CSS, JavaScript, Node.js, and SQL.

## Features

✨ **Core Features**
- 🔍 Search and track multiple stocks
- 📊 Display historical stock data with interactive charts
- 🤖 AI-powered price predictions (Linear Regression & Moving Average)
- 📈 Prediction accuracy metrics
- 💾 Save favorite stocks
- 📱 Responsive design

## Tech Stack

**Frontend:**
- HTML5
- CSS3
- JavaScript (Chart.js for visualization)

**Backend:**
- Node.js + Express.js
- SQLite (Database)
- TensorFlow.js (ML Model)

**APIs:**
- Alpha Vantage (Free Stock Data API)

## Installation

### Prerequisites
- Node.js (v14+)
- npm

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/GKC7899/stock-price-predictor.git
cd stock-price-predictor
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in root directory:
```
API_KEY=your_alpha_vantage_api_key
PORT=3000
NODE_ENV=development
```

4. Get your **FREE** API key from:
   - Visit: https://www.alphavantage.co/
   - Sign up and get your API key instantly

5. Initialize database:
```bash
npm run db:init
```

6. Start the server:
```bash
npm start
```

7. Open browser and go to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
stock-price-predictor/
├── public/
│   ├── index.html              # Main HTML file
│   ├── css/
│   │   └── style.css           # Styling
│   └── js/
│       ├── app.js              # Main app logic
│       ├── chart.js            # Chart visualization
│       └── predictor.js        # ML predictions
├── src/
│   ├── server.js               # Express server
│   ├── routes/
│   │   ├── stocks.js           # Stock routes
│   │   └── predictions.js      # Prediction routes
│   ├── controllers/
│   │   ├── stockController.js  # Stock logic
│   │   └── predictionController.js
│   ├── ml/
│   │   ├── linearRegression.js # ML model
│   │   └── movingAverage.js    # MA model
│   └── db/
│       ├── database.js         # DB setup
│       └── schema.sql          # DB schema
├── .env                        # Environment variables
├── .gitignore                  # Git ignore
├── package.json                # Dependencies
└── README.md                   # This file
```

## Usage

1. **Search Stock**: Enter a stock symbol (e.g., AAPL, GOOGL, MSFT)
2. **View Charts**: See historical prices and trends
3. **Get Predictions**: AI predicts next 30 days of prices
4. **Track Performance**: Monitor prediction accuracy
5. **Save Favorites**: Save stocks to your watchlist

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/:symbol` | Get stock data |
| POST | `/api/stocks/favorite` | Save favorite stock |
| GET | `/api/predictions/:symbol` | Get price prediction |
| GET | `/api/stocks/history/:symbol` | Get historical data |

## ML Models Used

### 1. Linear Regression
- Simple trend-based prediction
- Good for identifying overall trends
- Fast and lightweight

### 2. Moving Average
- Smooths price data
- Identifies support/resistance levels
- Useful for trend confirmation

## Free Data Sources

- **Alpha Vantage**: https://www.alphavantage.co/ (Free tier: 5 requests/min)
- **Yahoo Finance**: https://finance.yahoo.com/ (Unofficial API)
- **Finnhub**: https://finnhub.io/ (Free tier available)

## Future Enhancements

- [ ] LSTM Neural Network model
- [ ] ARIMA forecasting
- [ ] User authentication
- [ ] Portfolio management
- [ ] Real-time price alerts
- [ ] Multiple stock comparison
- [ ] Email notifications
- [ ] Mobile app version

## Troubleshooting

**API Key Issues:**
- Make sure your `.env` file has the correct API key
- Check if you have free requests remaining (Alpha Vantage has rate limits)

**Database Issues:**
- Delete `database.db` file and run `npm run db:init` again

**Port Already in Use:**
- Change PORT in `.env` file to another port (e.g., 3001)

## License

MIT License - Feel free to use this project!

## Author

GKC7899

## Support

For issues and questions, please create an issue on GitHub.

---

**Happy Predicting! 📊🚀**