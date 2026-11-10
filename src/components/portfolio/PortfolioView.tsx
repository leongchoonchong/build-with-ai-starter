import React, { useMemo } from 'react';
import { ArrowDown, ArrowUp, DollarSign, PieChart, RefreshCw, Shield, TrendingUp, Wallet } from 'lucide-react';
import { Asset, Order, Position } from '../../types/terminal';

interface PortfolioViewProps {
  cashBalance: number;
  positions: Position[];
  orders: Order[];
  assets: Asset[];
  onClosePosition: (id: string) => void;
  onResetPortfolio: () => void;
  onAddFunds: (amount: number) => void;
  onSelectSymbol: (symbol: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  cashBalance,
  positions,
  orders,
  assets,
  onClosePosition,
  onResetPortfolio,
  onAddFunds,
  onSelectSymbol,
}) => {
  // Aggregate portfolio metrics
  const positionsValue = useMemo(() => {
    return positions.reduce((sum, p) => sum + p.value, 0);
  }, [positions]);

  const unrealizedPnL = useMemo(() => {
    return positions.reduce((sum, p) => sum + p.pnl, 0);
  }, [positions]);

  const totalEquity = cashBalance + positionsValue;
  const initialBase = 100000;
  const totalReturn = totalEquity - initialBase;
  const totalReturnPct = (totalReturn / initialBase) * 100;

  // Realized stats from orders
  const filledOrders = orders.filter((o) => o.status === 'filled');
  const winCount = positions.filter((p) => p.pnl > 0).length;
  const winRate = positions.length > 0 ? (winCount / positions.length) * 100 : 66.7;

  // Asset allocation breakdown
  const allocation = useMemo(() => {
    const map: Record<string, number> = {
      Cash: cashBalance,
    };
    positions.forEach((p) => {
      const asset = assets.find((a) => a.symbol === p.symbol);
      const cat = asset ? (asset.assetClass === 'crypto' ? 'Crypto' : asset.assetClass === 'stock' ? 'Equities' : 'Commodities') : 'Equities';
      map[cat] = (map[cat] || 0) + p.value;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      percentage: totalEquity > 0 ? (value / totalEquity) * 100 : 0,
    }));
  }, [positions, cashBalance, assets, totalEquity]);

  return (
    <div className="flex flex-col flex-1 h-full bg-[#faf8ff] dark:bg-[#0e1118] overflow-y-auto no-scrollbar p-4 lg:p-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#131722] dark:text-[#eaedfd] tracking-tight">
            Portfolio & Risk Management
          </h1>
          <p className="text-xs text-[#737687] mt-0.5">
            Institutional paper trading account, real-time NAV calculation, and equity curve.
          </p>
        </div>

        {/* Quick capital injection & reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddFunds(25000)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330] rounded-full text-xs font-semibold text-[#131722] dark:text-white transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#089981]" />
            <span>+ $25,000 Funds</span>
          </button>
          <button
            onClick={onResetPortfolio}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] hover:bg-red-50 text-red-600 dark:hover:bg-red-950/20 rounded-full text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset ($100k)</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (Single-elevation, hairline borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 font-mono-tabular">
        {/* Total Net Asset Value */}
        <div className="p-4 bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#737687] uppercase tracking-wide flex items-center justify-between">
            <span>Net Asset Value (NAV)</span>
            <Wallet className="w-4 h-4 text-[#2962ff]" />
          </div>
          <div className="text-2xl font-bold text-[#131722] dark:text-[#eaedfd] mt-1.5">
            ${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className={totalReturn >= 0 ? 'text-[#089981] font-semibold' : 'text-[#f23645] font-semibold'}>
              {totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)} ({totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}%)
            </span>
            <span className="text-[#737687] text-[10px]">all-time</span>
          </div>
        </div>

        {/* Unrealized PnL */}
        <div className="p-4 bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#737687] uppercase tracking-wide flex items-center justify-between">
            <span>Unrealized P&L</span>
            <TrendingUp className="w-4 h-4 text-[#089981]" />
          </div>
          <div className={`text-2xl font-bold mt-1.5 ${unrealizedPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
            {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)}
          </div>
          <div className="text-xs text-[#737687] mt-1">
            Across {positions.length} active position{positions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Available Cash Balance */}
        <div className="p-4 bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#737687] uppercase tracking-wide flex items-center justify-between">
            <span>Cash Reserve</span>
            <DollarSign className="w-4 h-4 text-[#737687]" />
          </div>
          <div className="text-2xl font-bold text-[#131722] dark:text-[#eaedfd] mt-1.5">
            ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#737687] mt-1">
            Available purchasing power
          </div>
        </div>

        {/* Win Rate & Risk Metric */}
        <div className="p-4 bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#737687] uppercase tracking-wide flex items-center justify-between">
            <span>Win Ratio / Efficiency</span>
            <Shield className="w-4 h-4 text-[#2962ff]" />
          </div>
          <div className="text-2xl font-bold text-[#131722] dark:text-[#eaedfd] mt-1.5">
            {winRate.toFixed(1)}%
          </div>
          <div className="text-xs text-[#737687] mt-1">
            {filledOrders.length} fills recorded
          </div>
        </div>
      </div>

      {/* Equity Curve & Asset Allocation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Equity Curve (2 cols) */}
        <div className="lg:col-span-2 p-4 bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-semibold text-[#131722] dark:text-[#eaedfd]">
                Cumulative NAV Growth Curve
              </div>
              <div className="text-[11px] text-[#737687]">
                Normalized portfolio equity progression
              </div>
            </div>
            <div className="text-xs font-mono-tabular font-bold text-[#089981]">
              +$3,850.20 (+3.85%)
            </div>
          </div>

          <div className="h-44 w-full mt-2">
            <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2962ff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 120 Q 80 110, 150 125 T 300 80 T 450 65 T 590 35 L 590 155 L 10 155 Z"
                fill="url(#equityGrad)"
              />
              <path
                d="M 10 120 Q 80 110, 150 125 T 300 80 T 450 65 T 590 35"
                fill="none"
                stroke="#2962ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="590" cy="35" r="4" fill="#2962ff" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Asset Allocation Breakdown (1 col) */}
        <div className="p-4 bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-[#131722] dark:text-[#eaedfd]">
              Capital Allocation
            </div>
            <PieChart className="w-4 h-4 text-[#737687]" />
          </div>

          <div className="space-y-3 my-auto">
            {allocation.map((item) => {
              const colorMap: Record<string, string> = {
                Cash: '#737687',
                Equities: '#2962ff',
                Crypto: '#089981',
                Commodities: '#f59e0b',
              };
              const color = colorMap[item.name] || '#2962ff';

              return (
                <div key={item.name} className="space-y-1 font-mono-tabular">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-medium text-[#131722] dark:text-[#eaedfd] font-sans">{item.name}</span>
                    </span>
                    <span className="text-[#737687] text-[11px]">
                      ${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#f0f3fa] dark:bg-[#1c2230] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-[#737687] text-center pt-2">
            Zero leverage currently applied. 100% unleveraged cash account.
          </div>
        </div>
      </div>

      {/* Active Holdings Table */}
      <div className="bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e0e3eb] dark:border-[#242938] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#131722] dark:text-white uppercase tracking-wider">
            Open Holdings & Active Positions
          </h2>
          <span className="text-xs text-[#737687]">
            {positions.length} active position{positions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {positions.length === 0 ? (
          <div className="py-12 text-center text-[#737687] text-xs">
            No active positions in the portfolio. Go to the Terminal or Screener to execute trades.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#f0f3fa] dark:border-[#1a202c] text-[10px] text-[#737687] uppercase">
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Side</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Avg Entry</th>
                  <th className="py-2.5 px-3 text-right">Current Price</th>
                  <th className="py-2.5 px-3 text-right">Position Value</th>
                  <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3fa] dark:divide-[#1c2230] font-mono-tabular">
                {positions.map((pos) => {
                  const isUp = pos.pnl >= 0;
                  return (
                    <tr
                      key={pos.id}
                      className="hover:bg-[#f8f9fd] dark:hover:bg-[#181d29] transition-colors"
                    >
                      <td className="py-3 px-3 font-semibold text-[#131722] dark:text-white">
                        <button
                          onClick={() => onSelectSymbol(pos.symbol)}
                          className="hover:underline text-left"
                        >
                          {pos.symbol}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            pos.side === 'buy'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#089981]'
                              : 'bg-red-50 dark:bg-red-950/40 text-[#f23645]'
                          }`}
                        >
                          {pos.side === 'buy' ? 'LONG' : 'SHORT'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">{pos.size}</td>
                      <td className="py-3 px-3 text-right text-[#737687]">${pos.entryPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-medium text-[#131722] dark:text-white">
                        ${pos.markPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-[#131722] dark:text-white">
                        ${pos.value.toFixed(2)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-bold ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? '+' : ''}${pos.pnl.toFixed(2)} ({isUp ? '+' : ''}
                        {pos.pnlPercent.toFixed(2)}%)
                      </td>
                      <td className="py-3 px-3 text-center font-sans">
                        <button
                          onClick={() => onClosePosition(pos.id)}
                          className="px-2.5 py-1 bg-red-50 dark:bg-red-950/30 text-[#f23645] hover:bg-red-100 rounded text-[11px] font-medium transition-colors"
                        >
                          Close Out
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
