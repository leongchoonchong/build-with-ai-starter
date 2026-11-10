import React from 'react';
import { Bell, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { Asset } from '../../types/terminal';

interface SymbolHeaderProps {
  asset: Asset;
  isStarred: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onOpenAlertModal: () => void;
}

export const SymbolHeader: React.FC<SymbolHeaderProps> = ({
  asset,
  isStarred,
  onToggleWatchlist,
  onOpenAlertModal,
}) => {
  const isUp = asset.change24h >= 0;

  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-white dark:bg-[#0e1118] border-b border-[#e0e3eb] dark:border-[#242938] select-none text-xs gap-3">
      {/* Left: Symbol, Name, Price, Delta */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Star Button */}
        <button
          onClick={() => onToggleWatchlist(asset.symbol)}
          className={`p-1 rounded transition-colors ${
            isStarred ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600 hover:text-amber-400'
          }`}
          title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>

        {/* Symbol & Exchange */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#131722] dark:text-white tracking-tight">
            {asset.symbol}
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#f0f3fa] dark:bg-[#1a202c] text-[#737687] uppercase">
            {asset.exchange}
          </span>
          <span className="hidden md:inline text-xs text-[#737687]">
            {asset.name}
          </span>
        </div>

        {/* Live Price */}
        <div className="flex items-baseline gap-2 font-mono-tabular">
          <span className="text-xl font-bold text-[#131722] dark:text-white">
            ${asset.price.toFixed(asset.decimals)}
          </span>

          {/* Delta Badge */}
          <div
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
              isUp
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#089981]'
                : 'bg-red-50 dark:bg-red-950/30 text-[#f23645]'
            }`}
          >
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>
              {isUp ? '+' : ''}${asset.change24h.toFixed(asset.decimals)} ({isUp ? '+' : ''}
              {asset.change24hPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Right: Key Micro-stats & Alert Trigger */}
      <div className="flex items-center gap-4 text-[11px] font-mono-tabular text-[#737687]">
        <div className="hidden lg:flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase block text-[#9ea4b6]">24h High</span>
            <span className="text-[#131722] dark:text-[#eaedfd] font-medium">${asset.high24h.toFixed(asset.decimals)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase block text-[#9ea4b6]">24h Low</span>
            <span className="text-[#131722] dark:text-[#eaedfd] font-medium">${asset.low24h.toFixed(asset.decimals)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase block text-[#9ea4b6]">24h Volume</span>
            <span className="text-[#131722] dark:text-[#eaedfd] font-medium">
              {asset.volume >= 1000000000
                ? `${(asset.volume / 1000000000).toFixed(2)}B`
                : `${(asset.volume / 1000000).toFixed(2)}M`}
            </span>
          </div>
          {asset.marketCap > 0 && (
            <div>
              <span className="text-[10px] uppercase block text-[#9ea4b6]">Market Cap</span>
              <span className="text-[#131722] dark:text-[#eaedfd] font-medium">
                ${(asset.marketCap / 1000000000000).toFixed(2)}T
              </span>
            </div>
          )}
          {asset.peRatio && (
            <div>
              <span className="text-[10px] uppercase block text-[#9ea4b6]">P/E</span>
              <span className="text-[#131722] dark:text-[#eaedfd] font-medium">{asset.peRatio}x</span>
            </div>
          )}
        </div>

        {/* Set Price Alert Button */}
        <button
          onClick={onOpenAlertModal}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#434656] dark:text-[#a0a5b8] bg-[#f0f3fa] dark:bg-[#161b26] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330] rounded transition-colors"
          title="Create Price Alert"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Set Alert</span>
        </button>
      </div>
    </div>
  );
};
