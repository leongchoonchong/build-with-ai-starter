import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Grid, List, Search, Star } from 'lucide-react';
import { Asset, AssetClass } from '../../types/terminal';

interface MarketScreenerProps {
  assets: Asset[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: Asset) => void;
}

export const MarketScreener: React.FC<MarketScreenerProps> = ({
  assets,
  watchlist,
  onToggleWatchlist,
  onSelectAsset,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'gainers' | 'losers' | 'volume'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');
  const [sortField, setSortField] = useState<keyof Asset>('marketCap');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filtered and sorted assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Asset class filter
      if (selectedClass !== 'all') {
        if (selectedClass === 'watchlist') {
          if (!watchlist.includes(asset.symbol)) return false;
        } else if (asset.assetClass !== selectedClass) {
          return false;
        }
      }

      // Performance filter
      if (performanceFilter === 'gainers' && asset.change24hPercent <= 0) return false;
      if (performanceFilter === 'losers' && asset.change24hPercent >= 0) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return asset.symbol.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q) || asset.sector.toLowerCase().includes(q);
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField] ?? 0;
      let valB = b[sortField] ?? 0;
      if (sortField === 'volume' && performanceFilter === 'volume') {
        valA = a.volume;
        valB = b.volume;
      }
      if (typeof valA === 'string') {
        return sortAsc ? (valA as string).localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [assets, selectedClass, performanceFilter, searchQuery, sortField, sortAsc, watchlist]);

  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Sparkline renderer
  const renderSparkline = (data: number[], isUp: boolean) => {
    if (!data || data.length === 0) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isUp ? '#089981' : '#f23645';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-[#faf8ff] dark:bg-[#0e1118] overflow-y-auto no-scrollbar p-4 lg:p-6 select-none">
      {/* Title & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#131722] dark:text-[#eaedfd] tracking-tight">
            Institutional Market Screener
          </h1>
          <p className="text-xs text-[#737687] mt-0.5">
            Real-time multi-asset quotes, valuation multiples, and sectoral capital flows.
          </p>
        </div>

        {/* View Switcher & Search */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#737687]" />
            <input
              type="text"
              placeholder="Search ticker, name, sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] focus:border-[#2962ff] focus:outline-hidden rounded-full py-1.5 pl-8 pr-3 text-xs text-[#131722] dark:text-white w-48 sm:w-64"
            />
          </div>

          {/* Table vs Heatmap Toggle */}
          <div className="flex items-center bg-[#eaedfd]/60 dark:bg-[#1c2230] p-0.5 rounded-full">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'heatmap' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
              }`}
              title="Heatmap View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Category Class Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'stock', label: 'US Equities' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'index', label: 'Indices' },
            { id: 'forex', label: 'Currencies' },
            { id: 'commodity', label: 'Commodities' },
            { id: 'watchlist', label: `Watchlist (${watchlist.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedClass(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedClass === tab.id
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'bg-white dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Performance Sub-Filter */}
        <div className="flex items-center gap-1 bg-[#eaedfd]/50 dark:bg-[#161b26] p-1 rounded-full text-xs">
          <button
            onClick={() => setPerformanceFilter('all')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              performanceFilter === 'all' ? 'bg-white dark:bg-[#2a3040] text-[#131722] dark:text-white shadow-xs' : 'text-[#737687]'
            }`}
          >
            All Movers
          </button>
          <button
            onClick={() => setPerformanceFilter('gainers')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              performanceFilter === 'gainers' ? 'bg-emerald-500 text-white shadow-xs' : 'text-[#737687]'
            }`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => setPerformanceFilter('losers')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              performanceFilter === 'losers' ? 'bg-red-500 text-white shadow-xs' : 'text-[#737687]'
            }`}
          >
            Top Losers
          </button>
        </div>
      </div>

      {/* Content Mode 1: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#e0e3eb] dark:border-[#242938] bg-[#fbfbfe] dark:bg-[#161b26] text-[11px] font-semibold text-[#737687]">
                  <th className="py-2.5 px-3 w-8"></th>
                  <th
                    onClick={() => handleSort('symbol')}
                    className="py-2.5 px-3 cursor-pointer hover:text-[#131722] dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Ticker</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('price')}
                    className="py-2.5 px-3 text-right cursor-pointer hover:text-[#131722] dark:hover:text-white"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Price</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('change24hPercent')}
                    className="py-2.5 px-3 text-right cursor-pointer hover:text-[#131722] dark:hover:text-white"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>24h Change</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right hidden sm:table-cell">24h High / Low</th>
                  <th
                    onClick={() => handleSort('volume')}
                    className="py-2.5 px-3 text-right hidden md:table-cell cursor-pointer hover:text-[#131722] dark:hover:text-white"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Volume</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('marketCap')}
                    className="py-2.5 px-3 text-right hidden lg:table-cell cursor-pointer hover:text-[#131722] dark:hover:text-white"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Market Cap</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-center hidden xl:table-cell">7-Day Trend</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3fa] dark:divide-[#1c2230] font-mono-tabular">
                {filteredAssets.map((asset) => {
                  const isUp = asset.change24hPercent >= 0;
                  const isStarred = watchlist.includes(asset.symbol);

                  return (
                    <tr
                      key={asset.symbol}
                      className="hover:bg-[#f8f9fd] dark:hover:bg-[#181d29] transition-colors group"
                    >
                      {/* Watchlist Star */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onToggleWatchlist(asset.symbol)}
                          className={`p-1 rounded transition-colors ${
                            isStarred
                              ? 'text-amber-400'
                              : 'text-gray-300 dark:text-gray-600 hover:text-amber-400'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </td>

                      {/* Symbol & Name */}
                      <td className="py-3 px-3 font-sans">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#131722] dark:text-white">
                                {asset.symbol}
                              </span>
                              <span className="text-[10px] px-1 py-0.2 bg-[#f0f3fa] dark:bg-[#1c2230] text-[#737687] rounded uppercase">
                                {asset.exchange}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#737687] truncate max-w-[160px]">
                              {asset.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Last Price */}
                      <td className="py-3 px-3 text-right font-semibold text-xs text-[#131722] dark:text-[#eaedfd]">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.decimals, maximumFractionDigits: asset.decimals })}
                      </td>

                      {/* 24h Change */}
                      <td className="py-3 px-3 text-right">
                        <div
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isUp
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#089981]'
                              : 'bg-red-50 dark:bg-red-950/30 text-[#f23645]'
                          }`}
                        >
                          {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          <span>
                            {isUp ? '+' : ''}{asset.change24hPercent.toFixed(2)}%
                          </span>
                        </div>
                      </td>

                      {/* 24h High / Low */}
                      <td className="py-3 px-3 text-right hidden sm:table-cell text-[11px] text-[#737687]">
                        <div>${asset.high24h.toFixed(asset.decimals)}</div>
                        <div className="text-[10px] text-[#9ea4b6]">${asset.low24h.toFixed(asset.decimals)}</div>
                      </td>

                      {/* Volume */}
                      <td className="py-3 px-3 text-right hidden md:table-cell text-xs text-[#131722] dark:text-[#eaedfd]">
                        {asset.volume >= 1000000000
                          ? `${(asset.volume / 1000000000).toFixed(2)}B`
                          : `${(asset.volume / 1000000).toFixed(2)}M`}
                      </td>

                      {/* Market Cap */}
                      <td className="py-3 px-3 text-right hidden lg:table-cell text-xs text-[#131722] dark:text-[#eaedfd]">
                        {asset.marketCap > 0
                          ? asset.marketCap >= 1000000000000
                            ? `$${(asset.marketCap / 1000000000000).toFixed(2)}T`
                            : `$${(asset.marketCap / 1000000000).toFixed(1)}B`
                          : '--'}
                      </td>

                      {/* 7-Day Sparkline */}
                      <td className="py-3 px-3 text-center hidden xl:table-cell">
                        <div className="flex justify-center">
                          {renderSparkline(asset.sparkline, isUp)}
                        </div>
                      </td>

                      {/* Action Trade Button */}
                      <td className="py-3 px-3 text-center font-sans">
                        <button
                          onClick={() => onSelectAsset(asset)}
                          className="px-3 py-1 bg-[#2962ff] hover:bg-[#1e53e5] text-white text-[11px] font-semibold rounded transition-colors shadow-xs"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Mode 2: Market Heatmap View */}
      {viewMode === 'heatmap' && (
        <div className="bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded p-4 shadow-xs">
          <div className="text-xs font-semibold text-[#737687] mb-3 uppercase tracking-wide">
            Capital Weight & Directional Performance Map
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredAssets.map((asset) => {
              const isUp = asset.change24hPercent >= 0;
              const intensity = Math.min(1, Math.abs(asset.change24hPercent) / 5);
              const bgColor = isUp
                ? `rgba(8, 153, 129, ${0.15 + intensity * 0.75})`
                : `rgba(242, 54, 69, ${0.15 + intensity * 0.75})`;
              const textColor = intensity > 0.4 ? '#ffffff' : isUp ? '#089981' : '#f23645';

              return (
                <div
                  key={asset.symbol}
                  onClick={() => onSelectAsset(asset)}
                  style={{ backgroundColor: bgColor }}
                  className="flex flex-col justify-between p-3 rounded cursor-pointer hover:scale-[1.02] transition-transform duration-150 min-h-[90px] shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm tracking-tight text-[#131722] dark:text-white" style={{ color: intensity > 0.5 ? '#ffffff' : undefined }}>
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] font-medium opacity-80" style={{ color: intensity > 0.5 ? '#ffffff' : undefined }}>
                      {asset.sector.split(' ')[0]}
                    </span>
                  </div>

                  <div className="mt-2 font-mono-tabular">
                    <div className="text-xs font-semibold" style={{ color: textColor }}>
                      ${asset.price.toFixed(asset.decimals)}
                    </div>
                    <div className="text-[11px] font-bold" style={{ color: textColor }}>
                      {isUp ? '+' : ''}{asset.change24hPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
