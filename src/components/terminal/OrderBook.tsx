import React, { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Asset, OrderBook as OrderBookType, Trade } from '../../types/terminal';

interface OrderBookProps {
  asset: Asset;
  orderBook: OrderBookType;
  trades: Trade[];
  onSelectPrice: (price: number) => void;
}

export const OrderBook: React.FC<OrderBookProps> = ({
  asset,
  orderBook,
  trades,
  onSelectPrice,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'trades' | 'depth'>('book');
  const [grouping, setGrouping] = useState<number>(0.01);

  // Maximum total volume in orderbook for depth percentage bar calculation
  const maxAskTotal = orderBook.asks.length > 0 ? orderBook.asks[0].total : 1;
  const maxBidTotal = orderBook.bids.length > 0 ? orderBook.bids[orderBook.bids.length - 1].total : 1;
  const maxVolume = Math.max(maxAskTotal, maxBidTotal, 1);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0e1118] border-l border-[#e0e3eb] dark:border-[#242938] select-none text-xs">
      {/* Tab Switcher Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#e0e3eb] dark:border-[#242938] bg-[#fbfbfe] dark:bg-[#131722]">
        <div className="flex items-center gap-1 bg-[#eaedfd]/60 dark:bg-[#1c2230] p-0.5 rounded text-[11px]">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              activeTab === 'book' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
            }`}
          >
            Order Book
          </button>
          <button
            onClick={() => setActiveTab('trades')}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              activeTab === 'trades' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
            }`}
          >
            Live Trades
          </button>
          <button
            onClick={() => setActiveTab('depth')}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              activeTab === 'depth' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
            }`}
          >
            Depth Visual
          </button>
        </div>

        {activeTab === 'book' && (
          <div className="flex items-center gap-1 text-[10px] text-[#737687]">
            <span>Tick:</span>
            <select
              value={grouping}
              onChange={(e) => setGrouping(Number(e.target.value))}
              className="bg-transparent border border-[#e0e3eb] dark:border-[#242938] rounded px-1 py-0.5 text-[10px] text-[#131722] dark:text-[#eaedfd]"
            >
              <option value={0.01}>0.01</option>
              <option value={0.05}>0.05</option>
              <option value={0.1}>0.10</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Order Book */}
      {activeTab === 'book' && (
        <div className="flex flex-col flex-1 overflow-hidden font-mono-tabular">
          {/* Column Headers */}
          <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] font-semibold text-[#737687] border-b border-[#f0f3fa] dark:border-[#1a202c]">
            <span className="text-left">Price ({asset.symbol.split('/')[1] || 'USD'})</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (Sells) - Red */}
          <div className="flex-1 flex flex-col justify-end overflow-hidden">
            {orderBook.asks.slice(-9).map((ask, idx) => {
              const depthPct = Math.min(100, (ask.total / maxVolume) * 100);
              return (
                <div
                  key={`ask-${idx}`}
                  onClick={() => onSelectPrice(ask.price)}
                  className="relative grid grid-cols-3 px-3 py-[2.5px] cursor-pointer hover:bg-red-50/50 dark:hover:bg-red-950/20 text-[11px]"
                >
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-[#f23645]/10 pointer-events-none transition-all duration-150"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="text-left text-[#f23645] font-medium z-10">
                    {ask.price.toFixed(asset.decimals)}
                  </span>
                  <span className="text-right text-[#131722] dark:text-[#dfe2f2] z-10">
                    {ask.size.toLocaleString()}
                  </span>
                  <span className="text-right text-[#787b86] dark:text-[#888e9e] z-10">
                    {ask.total.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mid Spread Bar */}
          <div className="flex items-center justify-between px-3 py-2 my-0.5 border-y border-[#e0e3eb] dark:border-[#242938] bg-[#f8f9fd] dark:bg-[#131722]">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-bold flex items-center ${
                  asset.change24h >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {asset.price.toFixed(asset.decimals)}
                {asset.change24h >= 0 ? (
                  <ArrowUp className="w-3.5 h-3.5 inline ml-0.5" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5 inline ml-0.5" />
                )}
              </span>
            </div>
            <div className="text-[10px] text-[#737687]">
              Spread: <span className="text-[#131722] dark:text-[#eaedfd] font-medium">{orderBook.spread.toFixed(asset.decimals)}</span> ({orderBook.spreadPercent}%)
            </div>
          </div>

          {/* Bids (Buys) - Green */}
          <div className="flex-1 overflow-hidden">
            {orderBook.bids.slice(0, 9).map((bid, idx) => {
              const depthPct = Math.min(100, (bid.total / maxVolume) * 100);
              return (
                <div
                  key={`bid-${idx}`}
                  onClick={() => onSelectPrice(bid.price)}
                  className="relative grid grid-cols-3 px-3 py-[2.5px] cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-[11px]"
                >
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-[#089981]/10 pointer-events-none transition-all duration-150"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="text-left text-[#089981] font-medium z-10">
                    {bid.price.toFixed(asset.decimals)}
                  </span>
                  <span className="text-right text-[#131722] dark:text-[#dfe2f2] z-10">
                    {bid.size.toLocaleString()}
                  </span>
                  <span className="text-right text-[#787b86] dark:text-[#888e9e] z-10">
                    {bid.total.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Recent Trades Tape */}
      {activeTab === 'trades' && (
        <div className="flex flex-col flex-1 overflow-hidden font-mono-tabular">
          <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] font-semibold text-[#737687] border-b border-[#f0f3fa] dark:border-[#1a202c]">
            <span className="text-left">Price</span>
            <span className="text-right">Size</span>
            <span className="text-right">Time</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {trades.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-3 px-3 py-[3px] text-[11px] hover:bg-[#f0f3fa] dark:hover:bg-[#1a202c]"
              >
                <span
                  className={`text-left font-medium ${
                    t.side === 'buy' ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {t.price.toFixed(asset.decimals)}
                </span>
                <span className="text-right text-[#131722] dark:text-[#dfe2f2]">
                  {t.size.toLocaleString()}
                </span>
                <span className="text-right text-[#787b86] text-[10px]">
                  {t.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Market Depth Visualizer */}
      {activeTab === 'depth' && (
        <div className="flex flex-col flex-1 p-3">
          <div className="text-[10px] font-semibold text-[#737687] mb-2 uppercase tracking-wide">
            Cumulative Market Liquidity
          </div>
          <div className="flex-1 relative flex items-center justify-center bg-[#faf8ff] dark:bg-[#131722] rounded border border-[#e0e3eb] dark:border-[#242938] overflow-hidden p-2">
            <svg viewBox="0 0 300 160" className="w-full h-full">
              {/* Bids curve (Green on left) */}
              <path
                d="M 10 150 L 10 60 Q 70 80, 145 130 L 145 150 Z"
                fill="rgba(8, 153, 129, 0.18)"
              />
              <path
                d="M 10 60 Q 70 80, 145 130"
                fill="none"
                stroke="#089981"
                strokeWidth="2"
              />

              {/* Asks curve (Red on right) */}
              <path
                d="M 155 130 Q 230 80, 290 50 L 290 150 L 155 150 Z"
                fill="rgba(242, 54, 69, 0.18)"
              />
              <path
                d="M 155 130 Q 230 80, 290 50"
                fill="none"
                stroke="#f23645"
                strokeWidth="2"
              />

              {/* Mid line */}
              <line x1="150" y1="20" x2="150" y2="150" stroke="#787b86" strokeDasharray="2,2" />
              <text x="150" y="15" fill="#787b86" fontSize="9" textAnchor="middle" fontFamily="monospace">
                Mid ${asset.price.toFixed(asset.decimals)}
              </text>
              <text x="50" y="145" fill="#089981" fontSize="9" textAnchor="middle" fontWeight="bold">
                BIDS (54%)
              </text>
              <text x="245" y="145" fill="#f23645" fontSize="9" textAnchor="middle" fontWeight="bold">
                ASKS (46%)
              </text>
            </svg>
          </div>
          <div className="mt-2 text-[10px] text-[#737687] text-center">
            2.4M USD total market depth within ±2% price band
          </div>
        </div>
      )}
    </div>
  );
};
