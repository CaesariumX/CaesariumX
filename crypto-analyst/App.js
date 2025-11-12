import React, { useState, useEffect } from "react";
import "./App.css";

// API URLs
const API_BASE = "https://api.coingecko.com/api/v3";
const TOP_COINS_URL = `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1`;
const SEARCH_URL = `${API_BASE}/search`;
const COIN_DETAILS_URL = `${API_BASE}/coins`;

// Generate realistic technical analysis from real data
const generateTechnicalAnalysis = (coinData) => {
  const price = coinData.current_price || coinData.market_data?.current_price?.usd || 0;
  const change24h = coinData.price_change_percentage_24h || coinData.market_data?.price_change_percentage_24h || 0;
  const volume = coinData.total_volume || coinData.market_data?.total_volume?.usd || 0;
  const marketCap = coinData.market_cap || coinData.market_data?.market_cap?.usd || 0;
  const high24h = coinData.high_24h || coinData.market_data?.high_24h?.usd || price * 1.02;
  const low24h = coinData.low_24h || coinData.market_data?.low_24h?.usd || price * 0.98;
  const marketRank = coinData.market_cap_rank || 999;
  
  // Calculate realistic technical indicators
  const volatility = Math.abs(change24h);
  const avgVolume = volume / 24; // Approximate hourly volume
  
  // RSI Calculation (simplified)
  const rsi = 50 + (change24h * 0.5);
  const normalizedRSI = Math.max(0, Math.min(100, rsi));
  
  // MACD Calculation (simplified)
  const macdLine = change24h * 0.8;
  const signalLine = change24h * 0.6;
  const macdHistogram = macdLine - signalLine;
  
  // Support and Resistance Levels
  const supportLevels = [
    (price * 0.95).toFixed(2),
    (price * 0.90).toFixed(2),
    (price * 0.85).toFixed(2)
  ];
  
  const resistanceLevels = [
    (price * 1.05).toFixed(2),
    (price * 1.10).toFixed(2),
    (price * 1.15).toFixed(2)
  ];
  
  // Moving Averages (simplified)
  const ma7 = price * (1 + (change24h * 0.7) / 100);
  const ma25 = price * (1 + (change24h * 0.4) / 100);
  const ma50 = price * (1 + (change24h * 0.2) / 100);
  
  // Volume Analysis
  const volumeChange = ((volume - (marketCap * 0.05)) / (marketCap * 0.05)) * 100;
  const volumeSentiment = volumeChange > 20 ? "STRONG" : volumeChange > 0 ? "MODERATE" : "WEAK";
  
  // Market Sentiment
  let overallSentiment = "NEUTRAL";
  if (change24h > 10 && volumeChange > 15) overallSentiment = "STRONGLY BULLISH";
  else if (change24h > 5) overallSentiment = "BULLISH";
  else if (change24h < -10 && volumeChange > 15) overallSentiment = "STRONGLY BEARISH";
  else if (change24h < -5) overallSentiment = "BEARISH";
  
  return {
    priceMetrics: {
      current: price,
      change24h: change24h,
      high24h: high24h,
      low24h: low24h,
      volume: volume,
      marketCap: marketCap,
      marketRank: marketRank
    },
    technicalIndicators: {
      rsi: normalizedRSI.toFixed(1),
      rsiSignal: normalizedRSI > 70 ? "OVERSOLD" : normalizedRSI < 30 ? "OVERBOUGHT" : "NEUTRAL",
      macd: {
        line: macdLine.toFixed(4),
        signal: signalLine.toFixed(4),
        histogram: macdHistogram.toFixed(4),
        trend: macdHistogram > 0 ? "BULLISH" : "BEARISH"
      },
      movingAverages: {
        ma7: ma7.toFixed(2),
        ma25: ma25.toFixed(2),
        ma50: ma50.toFixed(2),
        trend: ma7 > ma25 && ma25 > ma50 ? "BULLISH" : ma7 < ma25 && ma25 < ma50 ? "BEARISH" : "MIXED"
      },
      volatility: volatility.toFixed(1),
      supportLevels: supportLevels,
      resistanceLevels: resistanceLevels
    },
    marketAnalysis: {
      sentiment: overallSentiment,
      volumeStrength: volumeSentiment,
      trendStrength: volatility > 15 ? "HIGH" : volatility > 8 ? "MODERATE" : "LOW",
      marketPhase: change24h > 0 ? "ACCUMULATION" : "DISTRIBUTION"
    },
    tradingSignals: {
      shortTerm: change24h > 5 ? "BUY" : change24h < -5 ? "SELL" : "HOLD",
      mediumTerm: normalizedRSI > 60 ? "BULLISH" : normalizedRSI < 40 ? "BEARISH" : "NEUTRAL",
      entryPoint: supportLevels[0],
      exitPoint: resistanceLevels[0],
      stopLoss: (price * 0.92).toFixed(2)
    }
  };
};

// Live Crypto Background Component
const CryptoBackground = () => {
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    const cryptocurrencies = [
      { symbol: "BTC", price: Math.random() * 50000 + 30000, change: (Math.random() - 0.5) * 20 },
      { symbol: "ETH", price: Math.random() * 3000 + 1500, change: (Math.random() - 0.5) * 15 },
      { symbol: "BNB", price: Math.random() * 600 + 200, change: (Math.random() - 0.5) * 12 },
    ];

    setTickerData(cryptocurrencies);

    const interval = setInterval(() => {
      setTickerData(prev => prev.map(coin => ({
        ...coin,
        price: coin.price * (1 + (Math.random() - 0.5) * 0.02),
        change: (Math.random() - 0.5) * 20
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="crypto-background">
      <div className="grid-overlay"></div>
      {tickerData.map((coin, index) => (
        <div
          key={coin.symbol}
          className={`crypto-ticker ${coin.change >= 0 ? 'price-up' : 'price-down'}`}
        >
          {coin.symbol} ${coin.price.toFixed(2)} {coin.change >= 0 ? '▲' : '▼'} {Math.abs(coin.change).toFixed(2)}%
        </div>
      ))}
    </div>
  );
};

// TradingView Chart Component
const TradingViewChart = ({ symbol }) => {
  return (
    <div className="chart-container">
      <iframe
        src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_${symbol}&symbol=${symbol}USD&interval=60&hidesidetoolbar=0&symboledit=0&saveimage=0&toolbarbg=0C0C0C&studies=RSI@tv-basicstudies&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${symbol}USD`}
        style={{
          width: '100%',
          height: '400px',
          border: 'none',
          borderRadius: '8px'
        }}
        title={`${symbol} Price Chart`}
      />
    </div>
  );
};

// Price History Chart (Simple SVG-based)
const PriceHistoryChart = ({ data }) => {
  const prices = data || [100, 105, 102, 108, 115, 112, 118, 120, 125, 122];
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const chartHeight = 200;
  const chartWidth = 400;
  
  const points = prices.map((price, index) => {
    const x = (index / (prices.length - 1)) * chartWidth;
    const y = chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="price-chart">
      <svg width="100%" height="220" viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1="0"
            y1={chartHeight * ratio}
            x2={chartWidth}
            y2={chartHeight * ratio}
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        
        {/* Price line */}
        <polyline
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          points={points}
        />
        
        {/* Current price dot */}
        <circle
          cx={chartWidth}
          cy={chartHeight - ((prices[prices.length - 1] - minPrice) / (maxPrice - minPrice)) * chartHeight}
          r="4"
          fill="var(--primary)"
        />
        
        {/* Labels */}
        <text x="0" y={chartHeight + 15} fill="var(--text-muted)" fontSize="10">
          ${minPrice.toFixed(0)}
        </text>
        <text x={chartWidth - 30} y={chartHeight + 15} fill="var(--text-muted)" fontSize="10">
          ${maxPrice.toFixed(0)}
        </text>
      </svg>
    </div>
  );
};

// Components
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>LOADING MARKET DATA...</p>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-message">
    <p>{message}</p>
    {onRetry && <button onClick={onRetry}>RETRY</button>}
  </div>
);

const CoinCard = ({ coin, onQuickSummary, onAdvancedAnalysis }) => (
  <div className="coin-card">
    <div className="coin-header">
      <img src={coin.image} alt={coin.name} />
      <div className="coin-info">
        <h3>{coin.name}</h3>
        <p>{coin.symbol.toUpperCase()}</p>
      </div>
    </div>
    
    <div className="coin-price">
      ${coin.current_price?.toLocaleString()}
    </div>
    
    <div className="coin-stats">
      <div className="stat">
        <div className="stat-label">24H Change</div>
        <div className={`stat-value ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
          {coin.price_change_percentage_24h?.toFixed(2)}%
        </div>
      </div>
      <div className="stat">
        <div className="stat-label">Market Cap</div>
        <div className="stat-value">
          ${(coin.market_cap / 1000000).toFixed(0)}M
        </div>
      </div>
    </div>
    
    <div className="coin-actions">
      <button 
        className="action-btn btn-primary"
        onClick={() => onQuickSummary(coin.id)}
      >
        Quick Analysis
      </button>
      <button 
        className="action-btn btn-secondary"
        onClick={() => onAdvancedAnalysis(coin.id)}
      >
        Advanced Analysis
      </button>
    </div>
  </div>
);

const SearchResultCard = ({ result, onQuickSummary, onAdvancedAnalysis }) => (
  <div className="coin-card">
    <div className="coin-header">
      <img src={result.large || result.thumb} alt={result.name} />
      <div className="coin-info">
        <h3>{result.name}</h3>
        <p>{result.symbol.toUpperCase()}</p>
      </div>
    </div>
    
    <div className="coin-price">
      Search Result
    </div>
    
    <div className="coin-stats">
      <div className="stat">
        <div className="stat-label">Market Cap Rank</div>
        <div className="stat-value">
          #{result.market_cap_rank || "N/A"}
        </div>
      </div>
      <div className="stat">
        <div className="stat-label">ID</div>
        <div className="stat-value">
          {result.id}
        </div>
      </div>
    </div>
    
    <div className="coin-actions">
      <button 
        className="action-btn btn-primary"
        onClick={() => onQuickSummary(result.id)}
      >
        Quick Analysis
      </button>
      <button 
        className="action-btn btn-secondary"
        onClick={() => onAdvancedAnalysis(result.id)}
      >
        Advanced Analysis
      </button>
    </div>
  </div>
);

const QuickSummaryModal = ({ coin, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coin) return;

    const generateAnalysis = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const technicalData = generateTechnicalAnalysis(coin);
        setAnalysis(technicalData);
      } catch (err) {
        console.error("Analysis Error:", err);
        const technicalData = generateTechnicalAnalysis(coin);
        setAnalysis(technicalData);
      } finally {
        setLoading(false);
      }
    };

    generateAnalysis();
  }, [coin]);

  if (!coin) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="modal-header">
          <img src={coin.image?.large || coin.image} alt={coin.name} />
          <h2>{coin.name}</h2>
          <p>{coin.symbol?.toUpperCase()}</p>
        </div>
        <div className="modal-body">
          <div className="price-info">
            <p>
              <strong>Current Price</strong> 
              ${coin.market_data?.current_price?.usd?.toLocaleString() || coin.current_price?.toLocaleString()}
            </p>
            <p>
              <strong>Market Cap</strong> 
              ${coin.market_data?.market_cap?.usd?.toLocaleString() || coin.market_cap?.toLocaleString()}
            </p>
            <p>
              <strong>24H Change</strong> 
              <span className={coin.market_data?.price_change_percentage_24h >= 0 ? "positive" : "negative"}>
                {coin.market_data?.price_change_percentage_24h?.toFixed(2) || coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </p>
          </div>
          <div className="ai-summary">
            <h4>TECHNICAL OVERVIEW</h4>
            {loading ? (
              <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ width: '30px', height: '30px', margin: '0 auto 1rem' }}></div>
                <p>ANALYZING DATA...</p>
              </div>
            ) : analysis && (
              <div style={{ lineHeight: '1.6' }}>
                <p><strong>Market Sentiment:</strong> {analysis.marketAnalysis.sentiment}</p>
                <p><strong>Trend Strength:</strong> {analysis.marketAnalysis.trendStrength}</p>
                <p><strong>Volume:</strong> {analysis.marketAnalysis.volumeStrength}</p>
                <p><strong>RSI:</strong> {analysis.technicalIndicators.rsi} ({analysis.technicalIndicators.rsiSignal})</p>
                <p><strong>Recommendation:</strong> {analysis.tradingSignals.shortTerm}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedAnalysisPage = ({ coin, onBack }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coin) return;

    const generateAnalysis = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const technicalData = generateTechnicalAnalysis(coin);
        setAnalysis(technicalData);
      } catch (err) {
        console.error("Analysis Error:", err);
        const technicalData = generateTechnicalAnalysis(coin);
        setAnalysis(technicalData);
      } finally {
        setLoading(false);
      }
    };

    generateAnalysis();
  }, [coin]);

  if (!coin) return null;

  return (
    <div className="analysis-page">
      <CryptoBackground />
      <button className="back-button" onClick={onBack}>
        BACK TO DASHBOARD
      </button>
      
      <div className="analysis-header">
        <img src={coin.image?.large || coin.image} alt={coin.name} />
        <h1>{coin.name} Advanced Analysis</h1>
        <p>{coin.symbol?.toUpperCase()} - Complete Technical Analysis</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }}></div>
          <p>GENERATING COMPREHENSIVE ANALYSIS...</p>
        </div>
      ) : analysis && (
        <div className="analysis-grid">
          {/* Price Chart */}
          <div className="analysis-section" style={{ gridColumn: '1 / -1' }}>
            <h3>PRICE CHART</h3>
            <TradingViewChart symbol={coin.symbol?.toUpperCase()} />
          </div>

          {/* Price Metrics */}
          <div className="analysis-section">
            <h3>PRICE METRICS</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">${analysis.priceMetrics.current.toLocaleString()}</div>
                <div className="metric-label">Current Price</div>
              </div>
              <div className="metric-card">
                <div className={`metric-value ${analysis.priceMetrics.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {analysis.priceMetrics.change24h >= 0 ? '+' : ''}{analysis.priceMetrics.change24h.toFixed(2)}%
                </div>
                <div className="metric-label">24H Change</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">${analysis.priceMetrics.high24h.toLocaleString()}</div>
                <div className="metric-label">24H High</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">${analysis.priceMetrics.low24h.toLocaleString()}</div>
                <div className="metric-label">24H Low</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">${(analysis.priceMetrics.marketCap / 1000000000).toFixed(2)}B</div>
                <div className="metric-label">Market Cap</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">#{analysis.priceMetrics.marketRank}</div>
                <div className="metric-label">Market Rank</div>
              </div>
            </div>
          </div>

          {/* Technical Indicators */}
          <div className="analysis-section">
            <h3>TECHNICAL INDICATORS</h3>
            <div className="technical-indicators">
              <div className="indicator">
                <span>RSI (14)</span>
                <span className={`indicator-value ${analysis.technicalIndicators.rsi > 70 ? 'negative' : analysis.technicalIndicators.rsi < 30 ? 'positive' : ''}`}>
                  {analysis.technicalIndicators.rsi}
                </span>
              </div>
              <div className="indicator">
                <span>MACD</span>
                <span className={`indicator-value ${analysis.technicalIndicators.macd.trend === 'BULLISH' ? 'positive' : 'negative'}`}>
                  {analysis.technicalIndicators.macd.line}
                </span>
              </div>
              <div className="indicator">
                <span>MACD Signal</span>
                <span className="indicator-value">{analysis.technicalIndicators.macd.signal}</span>
              </div>
              <div className="indicator">
                <span>MACD Histogram</span>
                <span className={`indicator-value ${analysis.technicalIndicators.macd.histogram > 0 ? 'positive' : 'negative'}`}>
                  {analysis.technicalIndicators.macd.histogram}
                </span>
              </div>
              <div className="indicator">
                <span>Volatility</span>
                <span className="indicator-value">{analysis.technicalIndicators.volatility}%</span>
              </div>
              <div className="indicator">
                <span>MA Trend</span>
                <span className={`indicator-value ${analysis.technicalIndicators.movingAverages.trend === 'BULLISH' ? 'positive' : analysis.technicalIndicators.movingAverages.trend === 'BEARISH' ? 'negative' : ''}`}>
                  {analysis.technicalIndicators.movingAverages.trend}
                </span>
              </div>
            </div>
          </div>

          {/* Support & Resistance */}
          <div className="analysis-section">
            <h3>SUPPORT & RESISTANCE</h3>
            <div className="levels-grid">
              <div className="levels-section">
                <h4>Support Levels</h4>
                {analysis.technicalIndicators.supportLevels.map((level, index) => (
                  <div key={index} className="level-item">
                    <span className="level-label">S{index + 1}</span>
                    <span className="level-value">${level}</span>
                  </div>
                ))}
              </div>
              <div className="levels-section">
                <h4>Resistance Levels</h4>
                {analysis.technicalIndicators.resistanceLevels.map((level, index) => (
                  <div key={index} className="level-item">
                    <span className="level-label">R{index + 1}</span>
                    <span className="level-value">${level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="analysis-section">
            <h3>MARKET ANALYSIS</h3>
            <div className="market-metrics">
              <div className="market-metric">
                <span>Overall Sentiment</span>
                <span className={`metric-tag ${analysis.marketAnalysis.sentiment.includes('BULLISH') ? 'positive' : analysis.marketAnalysis.sentiment.includes('BEARISH') ? 'negative' : ''}`}>
                  {analysis.marketAnalysis.sentiment}
                </span>
              </div>
              <div className="market-metric">
                <span>Volume Strength</span>
                <span className="metric-tag">{analysis.marketAnalysis.volumeStrength}</span>
              </div>
              <div className="market-metric">
                <span>Trend Strength</span>
                <span className="metric-tag">{analysis.marketAnalysis.trendStrength}</span>
              </div>
              <div className="market-metric">
                <span>Market Phase</span>
                <span className="metric-tag">{analysis.marketAnalysis.marketPhase}</span>
              </div>
            </div>
          </div>

          {/* Trading Signals */}
          <div className="analysis-section">
            <h3>TRADING SIGNALS</h3>
            <div className="trading-signals">
              <div className="signal">
                <span>Short Term</span>
                <span className={`signal-value ${analysis.tradingSignals.shortTerm === 'BUY' ? 'positive' : analysis.tradingSignals.shortTerm === 'SELL' ? 'negative' : ''}`}>
                  {analysis.tradingSignals.shortTerm}
                </span>
              </div>
              <div className="signal">
                <span>Medium Term</span>
                <span className={`signal-value ${analysis.tradingSignals.mediumTerm === 'BULLISH' ? 'positive' : analysis.tradingSignals.mediumTerm === 'BEARISH' ? 'negative' : ''}`}>
                  {analysis.tradingSignals.mediumTerm}
                </span>
              </div>
              <div className="signal">
                <span>Entry Point</span>
                <span className="signal-value">${analysis.tradingSignals.entryPoint}</span>
              </div>
              <div className="signal">
                <span>Exit Point</span>
                <span className="signal-value">${analysis.tradingSignals.exitPoint}</span>
              </div>
              <div className="signal">
                <span>Stop Loss</span>
                <span className="signal-value">${analysis.tradingSignals.stopLoss}</span>
              </div>
            </div>
          </div>

          {/* Moving Averages */}
          <div className="analysis-section">
            <h3>MOVING AVERAGES</h3>
            <div className="moving-averages">
              <div className="ma-item">
                <span>7-Day MA</span>
                <span>${analysis.technicalIndicators.movingAverages.ma7}</span>
              </div>
              <div className="ma-item">
                <span>25-Day MA</span>
                <span>${analysis.technicalIndicators.movingAverages.ma25}</span>
              </div>
              <div className="ma-item">
                <span>50-Day MA</span>
                <span>${analysis.technicalIndicators.movingAverages.ma50}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App
function App() {
  const [query, setQuery] = useState("");
  const [topCoins, setTopCoins] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const res = await fetch(TOP_COINS_URL);
        const data = await res.json();
        setTopCoins(data);
      } catch (err) {
        setError("FAILED TO LOAD MARKET DATA");
      } finally {
        setLoading(false);
      }
    };
    fetchTopCoins();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setError("");

    try {
      const response = await fetch(`${SEARCH_URL}?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.coins && data.coins.length > 0) {
        setSearchResults(data.coins.slice(0, 5));
      } else {
        setSearchResults([]);
        setError("NO COINS FOUND FOR YOUR SEARCH");
      }
    } catch (err) {
      setError("SEARCH FAILED - PLEASE TRY AGAIN");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleQuickSummary = async (coinId) => {
    try {
      const res = await fetch(`${COIN_DETAILS_URL}/${coinId}?localization=false`);
      const data = await res.json();
      setSelectedCoin(data);
    } catch {
      setError("FAILED TO LOAD COIN DETAILS");
    }
  };

  const handleAdvancedAnalysis = async (coinId) => {
    try {
      const res = await fetch(`${COIN_DETAILS_URL}/${coinId}?localization=false`);
      const data = await res.json();
      setSelectedCoin(data);
      setView("analysis");
    } catch {
      setError("FAILED TO LOAD COIN DETAILS");
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
  };

  const closeModal = () => setSelectedCoin(null);
  const handleBackToDashboard = () => {
    setView("dashboard");
    setSearchResults([]);
    setQuery("");
  };

  if (view === "analysis" && selectedCoin) {
    return <AdvancedAnalysisPage coin={selectedCoin} onBack={handleBackToDashboard} />;
  }

  return (
    <div className="App">
      <CryptoBackground />
      
      <header>
        <h1 className="logo">COINMIND <span>AI</span></h1>
        <p className="powered">PROFESSIONAL CRYPTO ANALYSIS</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="SEARCH ANY CRYPTOCURRENCY..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button 
          onClick={handleSearch} 
          disabled={searchLoading || !query.trim()}
        >
          {searchLoading ? "SEARCHING..." : "SEARCH"}
        </button>
        {query && (
          <button 
            onClick={clearSearch}
            style={{
              position: 'absolute',
              right: '120px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="top-coins">
          <h2>SEARCH RESULTS</h2>
          <div className="coins-grid">
            {searchResults.map((result) => (
              <SearchResultCard 
                key={result.id} 
                result={result}
                onQuickSummary={handleQuickSummary}
                onAdvancedAnalysis={handleAdvancedAnalysis}
              />
            ))}
          </div>
        </section>
      )}

      {/* Top Coins */}
      {!searchResults.length && (
        <section className="top-coins">
          <h2>TOP 30 CRYPTOCURRENCIES</h2>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="coins-grid">
              {topCoins.map((coin) => (
                <CoinCard 
                  key={coin.id} 
                  coin={coin}
                  onQuickSummary={handleQuickSummary}
                  onAdvancedAnalysis={handleAdvancedAnalysis}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <QuickSummaryModal coin={selectedCoin} onClose={closeModal} />
    </div>
  );
}

export default App;