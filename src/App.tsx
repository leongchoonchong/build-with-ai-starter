/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from './components/layout/Header';
import { TopTickerTape } from './components/layout/TopTickerTape';
import { AlertModal } from './components/modals/AlertModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { NewsIntelligence } from './components/news/NewsIntelligence';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { MarketScreener } from './components/screener/MarketScreener';
import { OrderBook } from './components/terminal/OrderBook';
import { OrderTicket } from './components/terminal/OrderTicket';
import { PositionsDock } from './components/terminal/PositionsDock';
import { SymbolHeader } from './components/terminal/SymbolHeader';
import { TradingChart } from './components/terminal/TradingChart';
import {
  generateCandles,
  generateInitialTrades,
  generateOrderBook,
  INITIAL_ASSETS,
  MOCK_ECONOMIC_EVENTS,
  MOCK_NEWS,
} from './data/mockAssets';
import { Asset, Candle, Order, OrderBook as OrderBookType, Position, PriceAlert, Timeframe, Trade } from './types/terminal';
import { terminalAudio } from './utils/audio';

export default function App() {
  // Navigation & Theme State
  const [activeScreen, setActiveScreen] = useState<'terminal' | 'screener' | 'portfolio' | 'news'>('terminal');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  // Command Palette & Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [selectedTicketPrice, setSelectedTicketPrice] = useState<number | undefined>(undefined);

  // Core Market Data
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'BTC/USD', 'AAPL', 'SPX', 'TSLA', 'XAU/USD']);

  // Active Symbol & Candles
  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  }, [assets, selectedSymbol]);

  const [candles, setCandles] = useState<Candle[]>(() => {
    return generateCandles(INITIAL_ASSETS[0].price, '1D', 80);
  });

  // Level 2 Order Book & Trades
  const [orderBook, setOrderBook] = useState<OrderBookType>(() => {
    return generateOrderBook(INITIAL_ASSETS[0].price);
  });
  const [trades, setTrades] = useState<Trade[]>(() => {
    return generateInitialTrades(INITIAL_ASSETS[0].price);
  });

  // Paper Trading Portfolio State
  const [cashBalance, setCashBalance] = useState<number>(85420.00);
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 'pos-1',
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      side: 'buy',
      size: 50,
      entryPrice: 138.50,
      markPrice: 145.24,
      pnl: (145.24 - 138.50) * 50,
      pnlPercent: ((145.24 - 138.50) / 138.50) * 100,
      value: 145.24 * 50,
      timestamp: Date.now() - 3600000 * 24,
    },
    {
      id: 'pos-2',
      symbol: 'BTC/USD',
      name: 'Bitcoin / US Dollar',
      side: 'buy',
      size: 0.1,
      entryPrice: 86200.00,
      markPrice: 89420.00,
      pnl: (89420.00 - 86200.00) * 0.1,
      pnlPercent: ((89420.00 - 86200.00) / 86200.00) * 100,
      value: 89420.00 * 0.1,
      timestamp: Date.now() - 3600000 * 12,
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-101',
      symbol: 'NVDA',
      side: 'buy',
      type: 'limit',
      price: 138.50,
      size: 50,
      status: 'filled',
      timestamp: Date.now() - 3600000 * 24,
    },
    {
      id: 'ord-102',
      symbol: 'BTC/USD',
      side: 'buy',
      type: 'market',
      price: 86200.00,
      size: 0.1,
      status: 'filled',
      timestamp: Date.now() - 3600000 * 12,
    },
    {
      id: 'ord-103',
      symbol: 'AAPL',
      side: 'buy',
      type: 'limit',
      price: 220.00,
      size: 25,
      status: 'pending',
      timestamp: Date.now() - 3600000 * 4,
    },
  ]);

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert-1',
      symbol: 'NVDA',
      targetPrice: 150.00,
      direction: 'above',
      createdAt: Date.now() - 86400000,
      triggered: false,
    },
    {
      id: 'alert-2',
      symbol: 'BTC/USD',
      targetPrice: 90000.00,
      direction: 'above',
      createdAt: Date.now() - 43200000,
      triggered: false,
    },
  ]);

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keyboard shortcut for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Whenever selected asset or timeframe changes, regenerate candles and orderbook
  useEffect(() => {
    setCandles(generateCandles(selectedAsset.price, timeframe, 85));
    setOrderBook(generateOrderBook(selectedAsset.price));
    setTrades(generateInitialTrades(selectedAsset.price));
    setSelectedTicketPrice(undefined);
  }, [selectedAsset.symbol, timeframe]);

  // Real-time market tick engine
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick random asset to update
      setAssets((prevAssets) => {
        const randIndex = Math.floor(Math.random() * prevAssets.length);
        const target = prevAssets[randIndex];
        const pctDelta = (Math.random() - 0.49) * 0.003; // ~0.15% max tick
        const priceChange = target.price * pctDelta;
        const newPrice = Number(Math.max(0.0001, target.price + priceChange).toFixed(target.decimals));
        const newChange24h = Number((target.change24h + priceChange).toFixed(target.decimals));
        const newChange24hPct = Number(((newChange24h / (target.price - target.change24h)) * 100).toFixed(2));
        const newHigh = Math.max(target.high24h, newPrice);
        const newLow = Math.min(target.low24h, newPrice);

        const updated = [...prevAssets];
        updated[randIndex] = {
          ...target,
          price: newPrice,
          change24h: newChange24h,
          change24hPercent: newChange24hPct,
          high24h: newHigh,
          low24h: newLow,
          sparkline: [...target.sparkline.slice(1), newPrice],
        };

        // If target is currently selected asset, update candle and orderbook
        if (target.symbol === selectedSymbol) {
          if (isAudioEnabled && Math.random() > 0.6) {
            terminalAudio.playTick();
          }

          // Update latest candle close
          setCandles((prevCandles) => {
            if (prevCandles.length === 0) return prevCandles;
            const copy = [...prevCandles];
            const last = { ...copy[copy.length - 1] };
            last.close = newPrice;
            last.high = Math.max(last.high, newPrice);
            last.low = Math.min(last.low, newPrice);
            last.volume += Math.floor(Math.random() * 500 + 50);
            copy[copy.length - 1] = last;
            return copy;
          });

          // Refresh orderbook slightly
          setOrderBook(generateOrderBook(newPrice));

          // Add trade to tape
          const isBuy = priceChange >= 0;
          const now = new Date();
          const time = now.toTimeString().split(' ')[0] + '.' + Math.floor(now.getMilliseconds() / 100);
          setTrades((prevTrades) => [
            {
              id: `tr-${Date.now()}-${Math.random()}`,
              time,
              price: newPrice,
              size: Math.floor(Math.random() * 200 + 10),
              side: isBuy ? 'buy' : 'sell',
            },
            ...prevTrades.slice(0, 30),
          ]);
        }

        // Check alerts
        priceAlerts.forEach((alert) => {
          if (alert.symbol === target.symbol && !alert.triggered) {
            if (
              (alert.direction === 'above' && newPrice >= alert.targetPrice) ||
              (alert.direction === 'below' && newPrice <= alert.targetPrice)
            ) {
              terminalAudio.playAlert();
              setPriceAlerts((prev) =>
                prev.map((a) => (a.id === alert.id ? { ...a, triggered: true } : a))
              );
            }
          }
        });

        // Update positions markPrice & PnL
        setPositions((prevPositions) =>
          prevPositions.map((pos) => {
            if (pos.symbol === target.symbol) {
              const diff = pos.side === 'buy' ? newPrice - pos.entryPrice : pos.entryPrice - newPrice;
              const pnl = diff * pos.size;
              const pnlPercent = (diff / pos.entryPrice) * 100;
              const value = newPrice * pos.size;
              return {
                ...pos,
                markPrice: newPrice,
                pnl: Number(pnl.toFixed(2)),
                pnlPercent: Number(pnlPercent.toFixed(2)),
                value: Number(value.toFixed(2)),
              };
            }
            return pos;
          })
        );

        return updated;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [selectedSymbol, isAudioEnabled, priceAlerts]);

  // Order Placement Handler
  const handlePlaceOrder = (newOrderData: Omit<Order, 'id' | 'timestamp'>) => {
    const id = `ord-${Date.now().toString().slice(-4)}`;
    const newOrder: Order = {
      ...newOrderData,
      id,
      timestamp: Date.now(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // If filled immediately (market order or limit fill)
    if (newOrder.status === 'filled') {
      const orderCost = newOrder.price * newOrder.size;
      setCashBalance((prev) => prev - (newOrder.side === 'buy' ? orderCost : -orderCost));

      // Add to positions
      setPositions((prev) => {
        const existingIdx = prev.findIndex((p) => p.symbol === newOrder.symbol && p.side === newOrder.side);
        if (existingIdx !== -1) {
          const exist = prev[existingIdx];
          const totalSize = exist.size + newOrder.size;
          const avgEntry = (exist.entryPrice * exist.size + newOrder.price * newOrder.size) / totalSize;
          const diff = exist.side === 'buy' ? selectedAsset.price - avgEntry : avgEntry - selectedAsset.price;
          const pnl = diff * totalSize;
          const pnlPercent = (diff / avgEntry) * 100;
          const value = selectedAsset.price * totalSize;

          const updated = [...prev];
          updated[existingIdx] = {
            ...exist,
            size: totalSize,
            entryPrice: avgEntry,
            markPrice: selectedAsset.price,
            pnl: Number(pnl.toFixed(2)),
            pnlPercent: Number(pnlPercent.toFixed(2)),
            value: Number(value.toFixed(2)),
          };
          return updated;
        } else {
          const value = newOrder.price * newOrder.size;
          return [
            ...prev,
            {
              id: `pos-${Date.now()}`,
              symbol: newOrder.symbol,
              name: selectedAsset.name,
              side: newOrder.side,
              size: newOrder.size,
              entryPrice: newOrder.price,
              markPrice: selectedAsset.price,
              pnl: 0,
              pnlPercent: 0,
              value: Number(value.toFixed(2)),
              timestamp: Date.now(),
            },
          ];
        }
      });
    }
  };

  // Close Position
  const handleClosePosition = (positionId: string) => {
    terminalAudio.playExecution();
    const pos = positions.find((p) => p.id === positionId);
    if (!pos) return;

    // Return capital to cash balance
    setCashBalance((prev) => prev + pos.value);
    setPositions((prev) => prev.filter((p) => p.id !== positionId));

    // Log closing fill in orders
    setOrders((prev) => [
      {
        id: `ord-close-${Date.now().toString().slice(-4)}`,
        symbol: pos.symbol,
        side: pos.side === 'buy' ? 'sell' : 'buy',
        type: 'market',
        price: pos.markPrice,
        size: pos.size,
        status: 'filled',
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  };

  // Cancel Pending Order
  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    );
  };

  // Watchlist Toggle
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Switch symbol
  const handleSelectAsset = (asset: Asset) => {
    setSelectedSymbol(asset.symbol);
    if (activeScreen !== 'terminal') {
      setActiveScreen('terminal');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#faf8ff] dark:bg-[#0e1118] text-[#131722] dark:text-[#eaedfd]">
      {/* 1. Global Benchmark Ticker Tape */}
      <TopTickerTape
        assets={assets}
        onSelectAsset={(a) => {
          setSelectedSymbol(a.symbol);
          if (activeScreen !== 'terminal') setActiveScreen('terminal');
        }}
      />

      {/* 2. Top Header Navigation (Strict 3-zone contract) */}
      <Header
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => {
          terminalAudio.enabled = !isAudioEnabled;
          setIsAudioEnabled(!isAudioEnabled);
        }}
        cashBalance={cashBalance}
      />

      {/* 3. Main Dynamic Screen Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* SCREEN 1: Trading Terminal */}
        {activeScreen === 'terminal' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Primary Symbol Header Bar */}
            <SymbolHeader
              asset={selectedAsset}
              isStarred={watchlist.includes(selectedAsset.symbol)}
              onToggleWatchlist={handleToggleWatchlist}
              onOpenAlertModal={() => setIsAlertModalOpen(true)}
            />

            {/* Split Middle Workspace */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              {/* Left / Center: Interactive Trading Chart */}
              <div className="flex-1 flex flex-col h-full min-h-[360px] overflow-hidden">
                <TradingChart
                  asset={selectedAsset}
                  candles={candles}
                  timeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                  onPriceClick={(p) => setSelectedTicketPrice(p)}
                />
              </div>

              {/* Right Panel: Level 2 Order Book & Order Ticket Pad */}
              <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-[#e0e3eb] dark:border-[#242938] bg-white dark:bg-[#0e1118] overflow-hidden">
                <div className="flex-1 flex flex-col sm:flex-row lg:flex-col overflow-hidden">
                  {/* Order Book Section */}
                  <div className="flex-1 min-h-[220px] overflow-hidden">
                    <OrderBook
                      asset={selectedAsset}
                      orderBook={orderBook}
                      trades={trades}
                      onSelectPrice={(p) => setSelectedTicketPrice(p)}
                    />
                  </div>

                  {/* Order Ticket Pad */}
                  <div className="w-full sm:w-1/2 lg:w-full border-t border-[#e0e3eb] dark:border-[#242938] shrink-0">
                    <OrderTicket
                      asset={selectedAsset}
                      buyingPower={cashBalance}
                      initialPrice={selectedTicketPrice}
                      onPlaceOrder={handlePlaceOrder}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Dock: Positions, Orders, Trade History */}
            <div className="shrink-0">
              <PositionsDock
                positions={positions}
                orders={orders}
                priceAlerts={priceAlerts}
                onClosePosition={handleClosePosition}
                onCancelOrder={handleCancelOrder}
                onRemoveAlert={(id) => setPriceAlerts((prev) => prev.filter((a) => a.id !== id))}
                onSelectSymbol={(sym) => {
                  const target = assets.find((a) => a.symbol === sym);
                  if (target) setSelectedSymbol(target.symbol);
                }}
              />
            </div>
          </div>
        )}

        {/* SCREEN 2: Institutional Market Screener */}
        {activeScreen === 'screener' && (
          <MarketScreener
            assets={assets}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectAsset={handleSelectAsset}
          />
        )}

        {/* SCREEN 3: Portfolio & Risk Management */}
        {activeScreen === 'portfolio' && (
          <PortfolioView
            cashBalance={cashBalance}
            positions={positions}
            orders={orders}
            assets={assets}
            onClosePosition={handleClosePosition}
            onResetPortfolio={() => {
              setCashBalance(100000);
              setPositions([]);
            }}
            onAddFunds={(amt) => setCashBalance((prev) => prev + amt)}
            onSelectSymbol={(sym) => {
              const target = assets.find((a) => a.symbol === sym);
              if (target) handleSelectAsset(target);
            }}
          />
        )}

        {/* SCREEN 4: News & Macro Intelligence */}
        {activeScreen === 'news' && (
          <NewsIntelligence
            news={MOCK_NEWS}
            economicEvents={MOCK_ECONOMIC_EVENTS}
            onSelectSymbol={(sym) => {
              const target = assets.find((a) => a.symbol === sym);
              if (target) handleSelectAsset(target);
            }}
          />
        )}
      </main>

      {/* Quick Search Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        assets={assets}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAsset={handleSelectAsset}
      />

      {/* Price Alert Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        asset={selectedAsset}
        onClose={() => setIsAlertModalOpen(false)}
        onSaveAlert={(sym, price, dir) => {
          setPriceAlerts((prev) => [
            {
              id: `alert-${Date.now()}`,
              symbol: sym,
              targetPrice: price,
              direction: dir,
              createdAt: Date.now(),
              triggered: false,
            },
            ...prev,
          ]);
        }}
      />
    </div>
  );
}
