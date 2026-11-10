export type AssetClass = 'stock' | 'crypto' | 'index' | 'forex' | 'commodity';

export interface Asset {
  symbol: string;
  name: string;
  exchange: string;
  assetClass: AssetClass;
  sector: string;
  price: number;
  change24h: number;
  change24hPercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  marketCap: number;
  peRatio?: number;
  sparkline: number[];
  decimals: number;
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadPercent: number;
}

export interface Trade {
  id: string;
  time: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  side: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  value: number;
  timestamp: number;
  takeProfit?: number;
  stopLoss?: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop';
  price: number;
  size: number;
  status: 'filled' | 'pending' | 'cancelled';
  timestamp: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: number;
  triggered: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'bullish' | 'neutral' | 'bearish';
  relatedSymbols: string[];
  summary: string;
  readTime: string;
}

export interface EconomicEvent {
  id: string;
  event: string;
  country: string;
  time: string;
  actual: string;
  consensus: string;
  previous: string;
  impact: 'high' | 'med' | 'low';
}

export type ChartType = 'candles' | 'heikin' | 'area' | 'bars';
export type Timeframe = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W' | 'ALL';

export interface IndicatorSettings {
  sma20: boolean;
  sma50: boolean;
  sma200: boolean;
  ema9: boolean;
  bollingerBands: boolean;
  rsi: boolean;
  macd: boolean;
  volume: boolean;
}

export type DrawingTool = 'crosshair' | 'trendline' | 'horizontal' | 'fibonacci' | 'eraser';

export interface DrawingItem {
  id: string;
  type: 'trendline' | 'horizontal' | 'fibonacci';
  p1: { xRatio: number; price: number };
  p2?: { xRatio: number; price: number };
  color?: string;
}
