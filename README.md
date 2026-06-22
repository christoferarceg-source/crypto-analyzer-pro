# 🚀 CryptoScan Pro - AI-Powered Cryptocurrency Analyzer

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF.svg)](https://vitejs.dev/)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204-purple.svg)](https://www.anthropic.com/claude)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A powerful, real-time cryptocurrency analysis dashboard powered by Claude AI. Track market trends, analyze coins with AI-driven insights, manage your portfolio, and get intelligent trading recommendations.

![CryptoScan Pro Screenshot](https://via.placeholder.com/800x400/050810/00f5c4?text=CryptoScan+Pro)

## ✨ Features

### 📈 **Real-Time Market Analysis**
- Live cryptocurrency data from CoinGecko API
- Track top 100 coins with real-time price updates
- Custom scoring algorithm for BUY/SELL/HOLD signals
- Advanced risk assessment (LOW/MEDIUM/HIGH)
- Sortable tables with multiple metrics

### 🌡️ **Market Heatmap**
- Visual representation of market movements
- Size based on market capitalization
- Color-coded by 24h price change
- Interactive click-to-detail view

### 💼 **Portfolio Management**
- Track your crypto holdings
- Real-time P&L calculations
- Distribution pie charts
- Buy price tracking with profit/loss percentages
- Position-level signal analysis

### 💬 **AI-Powered Chat Assistant**
- Contextual market analysis using Claude AI
- Portfolio-aware recommendations
- Market sentiment interpretation
- Quick-action buttons for common queries
- Risk assessment and rebalancing suggestions

### 🎯 **Advanced Analytics**
- Technical indicators and metrics
- On-chain data visualization
- Proprietary scoring system (0-100)
- AI sentiment analysis per coin
- TradingView chart integration

### 😱 **Fear & Greed Index**
- Real-time market sentiment gauge
- Historical trend tracking
- Integration with trading signals

## 🛠️ Tech Stack

- **Frontend**: React 18.3 with Hooks
- **Build Tool**: Vite 5.3
- **AI**: Anthropic Claude (Sonnet 4)
- **APIs**: 
  - CoinGecko (Market Data)
  - Alternative.me (Fear & Greed Index)
  - Anthropic (AI Analysis)
- **Styling**: Custom CSS with modern design system

## 📋 Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm
- Anthropic API key ([Get one here](https://console.anthropic.com/settings/keys))

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/crypto-analyzer-pro.git
cd crypto-analyzer-pro
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Copy the example environment file and add your API key:

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

> **⚠️ Important**: Never commit your `.env` file to GitHub. The `.gitignore` file is already configured to exclude it.

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will open at `http://localhost:3000`

## 🔑 Getting an Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. Click **Create Key**
5. Copy the key and paste it in your `.env` file

> **Note**: The free tier includes $5 in credits. For pricing details, visit [anthropic.com/pricing](https://www.anthropic.com/pricing)

## 📖 Usage Guide

### Market View
- **Filter by Signal**: Show only BUY, SELL, or HOLD recommendations
- **Filter by Risk**: Filter by LOW, MEDIUM, or HIGH risk coins
- **Sort**: Click any column header to sort
- **Select Coin**: Click any row to view detailed analysis

### Heatmap View
- Visualize the entire market at a glance
- Larger tiles = higher market cap
- Color intensity = 24h price change
- Click any tile to jump to detailed view

### Portfolio View
1. **Add Position**: Search for a coin, enter amount and buy price
2. **Track P&L**: See real-time profit/loss per position
3. **View Distribution**: Pie chart shows portfolio allocation
4. **Get Signals**: Each holding shows current BUY/SELL/HOLD signal

### AI Chat
- Ask questions about the market
- Get portfolio-specific advice
- Use quick-action buttons for common queries
- Context-aware responses based on your holdings

## 🎨 Features in Detail

### Scoring Algorithm

The proprietary scoring system (0-100) considers:
- **Momentum**: 24h and 7d price changes
- **Liquidity**: Volume to market cap ratio
- **Market Position**: Rank and capitalization
- **Supply Dynamics**: Circulating vs total supply
- **ATH Distance**: Distance from all-time high

**Signals**:
- **BUY** (62-100): Strong positive momentum
- **HOLD** (41-61): Neutral or consolidating
- **SELL** (0-40): Weak momentum or overextended

### Risk Assessment

Risk levels based on:
- **Volatility**: 24h and 7d price swings
- **Market Cap**: Lower cap = higher risk
- **Market Rank**: Top 10 get risk reduction

## 📁 Project Structure

```
crypto-analyzer-pro/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # React entry point
│   └── index.css       # Base styles
├── .env.example        # Environment template
├── .gitignore         # Git ignore rules
├── index.html         # HTML template
├── package.json       # Dependencies
├── vite.config.js     # Vite configuration
└── README.md          # This file
```

## 🔧 Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The optimized build will be in the `dist/` folder.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add `VITE_ANTHROPIC_API_KEY` in Environment Variables
4. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Import project on [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add `VITE_ANTHROPIC_API_KEY` in Environment Variables
6. Deploy

## ⚠️ Disclaimer

**This tool is for educational and informational purposes only.**

- Not financial advice
- Always DYOR (Do Your Own Research)
- Cryptocurrency investments carry high risk
- Past performance does not guarantee future results
- The AI analysis is experimental and should not be solely relied upon

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for cryptocurrency data
- [Anthropic](https://www.anthropic.com/) for Claude AI
- [Alternative.me](https://alternative.me/) for Fear & Greed Index
- [TradingView](https://www.tradingview.com/) for chart widgets

## 📧 Contact

For questions or feedback, reach out to [rc.team.arce@gmail.com](mailto:rc.team.arce@gmail.com)

---

**Made with ❤️ and powered by Claude AI**
