import { Asset, Candle, EconomicEvent, NewsItem, OrderBook, OrderBookLevel, Timeframe, Trade } from '../types/terminal';

export const INITIAL_ASSETS: Asset[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    assetClass: 'stock',
    sector: 'Semiconductors',
    price: 145.24,
    change24h: 4.86,
    change24hPercent: 3.46,
    high24h: 147.80,
    low24h: 141.10,
    volume: 86420000,
    marketCap: 3568000000000,
    peRatio: 64.2,
    decimals: 2,
    sparkline: [141.2, 142.0, 141.8, 143.5, 143.1, 144.6, 145.0, 144.2, 145.8, 146.5, 145.24],
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    assetClass: 'stock',
    sector: 'Consumer Electronics',
    price: 228.45,
    change24h: 1.75,
    change24hPercent: 0.77,
    high24h: 229.60,
    low24h: 226.50,
    volume: 48900000,
    marketCap: 3480000000000,
    peRatio: 34.5,
    decimals: 2,
    sparkline: [226.5, 227.1, 226.8, 227.4, 228.0, 227.8, 228.2, 228.9, 228.45],
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    exchange: 'COINBASE',
    assetClass: 'crypto',
    sector: 'Digital Assets',
    price: 89420.00,
    change24h: 3640.00,
    change24hPercent: 4.24,
    high24h: 90150.00,
    low24h: 85200.00,
    volume: 4215000000,
    marketCap: 1765000000000,
    decimals: 2,
    sparkline: [85400, 86100, 85900, 87400, 88200, 87900, 89100, 90150, 89420],
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    exchange: 'BINANCE',
    assetClass: 'crypto',
    sector: 'Smart Contracts',
    price: 3185.50,
    change24h: 92.40,
    change24hPercent: 2.99,
    high24h: 3240.00,
    low24h: 3075.00,
    volume: 1840000000,
    marketCap: 383000000000,
    decimals: 2,
    sparkline: [3080, 3105, 3090, 3130, 3175, 3150, 3210, 3240, 3185.5],
  },
  {
    symbol: 'SPX',
    name: 'S&P 500 Index',
    exchange: 'CBOE',
    assetClass: 'index',
    sector: 'Broad Market',
    price: 5884.20,
    change24h: 24.60,
    change24hPercent: 0.42,
    high24h: 5898.40,
    low24h: 5860.10,
    volume: 3850000000,
    marketCap: 45000000000000,
    peRatio: 26.8,
    decimals: 2,
    sparkline: [5862, 5868, 5874, 5871, 5882, 5888, 5895, 5884.2],
  },
  {
    symbol: 'NDX',
    name: 'Nasdaq 100 Index',
    exchange: 'NASDAQ',
    assetClass: 'index',
    sector: 'Technology',
    price: 20491.50,
    change24h: 158.80,
    change24hPercent: 0.78,
    high24h: 20550.00,
    low24h: 20340.00,
    volume: 4950000000,
    marketCap: 21000000000000,
    peRatio: 31.4,
    decimals: 2,
    sparkline: [20350, 20380, 20420, 20410, 20470, 20520, 20491.5],
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    assetClass: 'stock',
    sector: 'Automotive & Clean Tech',
    price: 328.60,
    change24h: 18.40,
    change24hPercent: 5.93,
    high24h: 335.00,
    low24h: 308.50,
    volume: 98500000,
    marketCap: 1055000000000,
    peRatio: 88.0,
    decimals: 2,
    sparkline: [310, 314, 312, 321, 326, 322, 332, 328.6],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    assetClass: 'stock',
    sector: 'Cloud & Software',
    price: 422.80,
    change24h: -1.40,
    change24hPercent: -0.33,
    high24h: 426.50,
    low24h: 420.10,
    volume: 22100000,
    marketCap: 3140000000000,
    peRatio: 35.8,
    decimals: 2,
    sparkline: [425, 424.5, 423.8, 424.1, 422.9, 421.5, 422.8],
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    exchange: 'NASDAQ',
    assetClass: 'stock',
    sector: 'E-Commerce & Cloud',
    price: 208.15,
    change24h: 2.85,
    change24hPercent: 1.39,
    high24h: 209.80,
    low24h: 205.20,
    volume: 38400000,
    marketCap: 2180000000000,
    peRatio: 44.2,
    decimals: 2,
    sparkline: [205.5, 206.2, 206.0, 207.4, 208.5, 207.9, 208.15],
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    assetClass: 'stock',
    sector: 'Internet & Search',
    price: 182.40,
    change24h: 1.95,
    change24hPercent: 1.08,
    high24h: 183.90,
    low24h: 180.20,
    volume: 24300000,
    marketCap: 2250000000000,
    peRatio: 24.1,
    decimals: 2,
    sparkline: [180.5, 181.1, 181.0, 182.2, 183.1, 182.4],
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    exchange: 'NASDAQ',
    assetClass: 'stock',
    sector: 'Social Media & AI',
    price: 588.90,
    change24h: 7.20,
    change24hPercent: 1.24,
    high24h: 593.40,
    low24h: 581.00,
    volume: 16700000,
    marketCap: 1490000000000,
    peRatio: 28.5,
    decimals: 2,
    sparkline: [582, 584, 583.5, 587, 591, 588.9],
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    exchange: 'NYSE',
    assetClass: 'stock',
    sector: 'Enterprise AI & Defense',
    price: 58.70,
    change24h: 2.45,
    change24hPercent: 4.35,
    high24h: 59.80,
    low24h: 56.10,
    volume: 82400000,
    marketCap: 132000000000,
    peRatio: 114.0,
    decimals: 2,
    sparkline: [56.2, 56.9, 57.3, 58.0, 59.4, 58.7],
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    exchange: 'FX',
    assetClass: 'forex',
    sector: 'Currencies',
    price: 1.0742,
    change24h: -0.0022,
    change24hPercent: -0.20,
    high24h: 1.0785,
    low24h: 1.0725,
    volume: 98000000000,
    marketCap: 0,
    decimals: 4,
    sparkline: [1.0765, 1.0760, 1.0752, 1.0748, 1.0735, 1.0742],
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    exchange: 'FX',
    assetClass: 'forex',
    sector: 'Currencies',
    price: 153.85,
    change24h: 0.65,
    change24hPercent: 0.42,
    high24h: 154.20,
    low24h: 153.10,
    volume: 76000000000,
    marketCap: 0,
    decimals: 2,
    sparkline: [153.2, 153.4, 153.6, 153.9, 154.1, 153.85],
  },
  {
    symbol: 'XAU/USD',
    name: 'Gold Spot / US Dollar',
    exchange: 'COMM',
    assetClass: 'commodity',
    sector: 'Precious Metals',
    price: 2684.50,
    change24h: 14.80,
    change24hPercent: 0.55,
    high24h: 2695.20,
    low24h: 2668.00,
    volume: 38200000000,
    marketCap: 17800000000000,
    decimals: 2,
    sparkline: [2670, 2674, 2672, 2681, 2692, 2684.5],
  },
  {
    symbol: 'BRENT',
    name: 'Brent Crude Oil',
    exchange: 'ICE',
    assetClass: 'commodity',
    sector: 'Energy',
    price: 73.45,
    change24h: -0.65,
    change24hPercent: -0.88,
    high24h: 74.80,
    low24h: 72.90,
    volume: 14200000000,
    marketCap: 0,
    decimals: 2,
    sparkline: [74.2, 74.5, 73.9, 73.6, 73.1, 73.45],
  },
];

/**
 * Generates realistic candlestick chart series for a given asset and timeframe
 */
export function generateCandles(basePrice: number, timeframe: Timeframe = '1D', count: number = 85): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();

  let intervalMs = 24 * 60 * 60 * 1000; // 1D default
  switch (timeframe) {
    case '1m': intervalMs = 60 * 1000; break;
    case '5m': intervalMs = 5 * 60 * 1000; break;
    case '15m': intervalMs = 15 * 60 * 1000; break;
    case '1H': intervalMs = 60 * 60 * 1000; break;
    case '4H': intervalMs = 4 * 60 * 60 * 1000; break;
    case '1D': intervalMs = 24 * 60 * 60 * 1000; break;
    case '1W': intervalMs = 7 * 24 * 60 * 60 * 1000; break;
    case 'ALL': intervalMs = 14 * 24 * 60 * 60 * 1000; break;
  }

  let currentPrice = basePrice * (0.85 + Math.random() * 0.1);
  const startTime = now - count * intervalMs;

  for (let i = 0; i < count; i++) {
    const timestamp = startTime + i * intervalMs;
    // Volatility between 0.4% and 2.2%
    const volatility = basePrice * 0.012;
    const trend = (basePrice - currentPrice) / (count - i + 5);
    const delta = (Math.random() - 0.48) * volatility + trend;

    const open = currentPrice;
    const close = Math.max(0.01, open + delta);
    const upperWick = Math.random() * volatility * 0.7;
    const lowerWick = Math.random() * volatility * 0.7;

    const high = Math.max(open, close) + upperWick;
    const low = Math.min(open, close) - lowerWick;
    const volume = Math.floor(Math.random() * 800000 + 200000);

    candles.push({
      timestamp,
      open: Number(open.toFixed(basePrice < 10 ? 4 : 2)),
      high: Number(high.toFixed(basePrice < 10 ? 4 : 2)),
      low: Number(low.toFixed(basePrice < 10 ? 4 : 2)),
      close: Number(close.toFixed(basePrice < 10 ? 4 : 2)),
      volume,
    });

    currentPrice = close;
  }

  // Ensure last candle matches real basePrice closely
  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = basePrice;
    last.high = Math.max(last.high, basePrice);
    last.low = Math.min(last.low, basePrice);
  }

  return candles;
}

/**
 * Generate Level-2 Order Book around current price
 */
export function generateOrderBook(currentPrice: number, depth: number = 10): OrderBook {
  const step = currentPrice < 10 ? 0.001 : currentPrice > 1000 ? 2.5 : 0.05;
  const spread = step * 1.5;
  const asks: OrderBookLevel[] = [];
  const bids: OrderBookLevel[] = [];

  let askTotal = 0;
  for (let i = 1; i <= depth; i++) {
    const price = Number((currentPrice + spread / 2 + (i - 1) * step).toFixed(currentPrice < 10 ? 4 : 2));
    const size = Math.floor(Math.random() * 2500 + 400);
    askTotal += size;
    asks.push({ price, size, total: askTotal });
  }

  let bidTotal = 0;
  for (let i = 1; i <= depth; i++) {
    const price = Number((currentPrice - spread / 2 - (i - 1) * step).toFixed(currentPrice < 10 ? 4 : 2));
    const size = Math.floor(Math.random() * 2500 + 400);
    bidTotal += size;
    bids.push({ price, size, total: bidTotal });
  }

  // Asks are typically sorted highest to lowest when rendered top-to-bottom
  asks.reverse();

  return {
    asks,
    bids,
    spread: Number(spread.toFixed(currentPrice < 10 ? 4 : 2)),
    spreadPercent: Number(((spread / currentPrice) * 100).toFixed(3)),
  };
}

/**
 * Generate sample real-time trade ticks
 */
export function generateInitialTrades(currentPrice: number): Trade[] {
  const trades: Trade[] = [];
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const isBuy = Math.random() > 0.48;
    const delta = (Math.random() - 0.5) * (currentPrice * 0.001);
    const price = Number((currentPrice + delta).toFixed(currentPrice < 10 ? 4 : 2));
    const size = Math.floor(Math.random() * 500 + 10);
    const date = new Date(now - i * 1400);
    const time = date.toTimeString().split(' ')[0] + '.' + Math.floor(date.getMilliseconds() / 100);

    trades.push({
      id: `tr-${i}-${Math.random()}`,
      time,
      price,
      size,
      side: isBuy ? 'buy' : 'sell',
    });
  }
  return trades;
}

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'NVIDIA Accelerates Next-Gen Blackwell Architecture Volume Production Amid Cloud Surge',
    source: 'Bloomberg Markets',
    time: '4m ago',
    sentiment: 'bullish',
    relatedSymbols: ['NVDA', 'MSFT', 'AMZN'],
    summary: 'Data center infrastructure investments continue to outpace historical projections with hyperscalers locking in multi-year compute commitments.',
    readTime: '2 min read',
  },
  {
    id: 'n2',
    title: 'Federal Reserve Policy Committee Signals Cautious Path for Upcoming Interest Rate Decisions',
    source: 'Reuters Financial',
    time: '18m ago',
    sentiment: 'neutral',
    relatedSymbols: ['SPX', 'NDX', 'EUR/USD'],
    summary: 'Inflation metrics remain largely aligned with target projections while labor market resilience provides flexibility for balanced monetary policy.',
    readTime: '3 min read',
  },
  {
    id: 'n3',
    title: 'Institutional Inflows Into Digital Asset Spot ETFs Reach Record Weekly Momentum',
    source: 'Financial Times',
    time: '32m ago',
    sentiment: 'bullish',
    relatedSymbols: ['BTC/USD', 'ETH/USD', 'COIN'],
    summary: 'Global asset managers report sovereign and pension fund allocations transitioning to structured spot digital custody programs.',
    readTime: '2 min read',
  },
  {
    id: 'n4',
    title: 'Crude Oil Benchmarks Settle Lower Following Middle East Diplomatic Progress',
    source: 'Wall Street Journal',
    time: '1h ago',
    sentiment: 'bearish',
    relatedSymbols: ['BRENT'],
    summary: 'Supply interruption premiums eased as maritime transit corridors reported normalized container and tanker freight schedules.',
    readTime: '3 min read',
  },
  {
    id: 'n5',
    title: 'Apple Expands On-Device Spatial AI Compute Partnerships Ahead of Worldwide Developer Summit',
    source: 'CNBC Pro',
    time: '2h ago',
    sentiment: 'bullish',
    relatedSymbols: ['AAPL', 'GOOGL'],
    summary: 'Integration with custom silicon neural engines brings local inference latency below 15 milliseconds across flagship consumer hardware.',
    readTime: '4 min read',
  },
];

export const MOCK_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'e1',
    event: 'US Core CPI (MoM)',
    country: 'USD',
    time: '08:30 EST',
    actual: '0.3%',
    consensus: '0.3%',
    previous: '0.3%',
    impact: 'high',
  },
  {
    id: 'e2',
    event: 'Fed Interest Rate Decision',
    country: 'USD',
    time: '14:00 EST',
    actual: '4.75%',
    consensus: '4.75%',
    previous: '5.00%',
    impact: 'high',
  },
  {
    id: 'e3',
    event: 'Initial Jobless Claims',
    country: 'USD',
    time: 'Tomorrow 08:30',
    actual: 'Pending',
    consensus: '215K',
    previous: '221K',
    impact: 'med',
  },
  {
    id: 'e4',
    event: 'ECB Monetary Policy Statement',
    country: 'EUR',
    time: 'Thursday 07:45',
    actual: 'Pending',
    consensus: '3.25%',
    previous: '3.40%',
    impact: 'high',
  },
  {
    id: 'e5',
    event: 'Crude Oil Inventories',
    country: 'USD',
    time: 'Wednesday 10:30',
    actual: 'Pending',
    consensus: '+1.2M',
    previous: '-2.1M',
    impact: 'med',
  },
];
