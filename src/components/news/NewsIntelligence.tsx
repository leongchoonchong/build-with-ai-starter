import React, { useState } from 'react';
import { Calendar, Globe, Newspaper, Search, TrendingUp } from 'lucide-react';
import { EconomicEvent, NewsItem } from '../../types/terminal';

interface NewsIntelligenceProps {
  news: NewsItem[];
  economicEvents: EconomicEvent[];
  onSelectSymbol?: (symbol: string) => void;
}

export const NewsIntelligence: React.FC<NewsIntelligenceProps> = ({
  news,
  economicEvents,
  onSelectSymbol,
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNews = news.filter((item) => {
    if (filterTag === 'bullish' && item.sentiment !== 'bullish') return false;
    if (filterTag === 'bearish' && item.sentiment !== 'bearish') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.relatedSymbols.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col flex-1 h-full bg-[#faf8ff] dark:bg-[#0e1118] overflow-y-auto no-scrollbar p-4 lg:p-6 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#131722] dark:text-[#eaedfd] tracking-tight">
            Market Intelligence & Economic Wire
          </h1>
          <p className="text-xs text-[#737687] mt-0.5">
            Real-time financial news, central bank economic releases, and algorithmic sentiment scoring.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#737687]" />
          <input
            type="text"
            placeholder="Search news & macro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] focus:border-[#2962ff] focus:outline-hidden rounded-full py-1.5 pl-8 pr-3 text-xs text-[#131722] dark:text-white w-56 sm:w-64"
          />
        </div>
      </div>

      {/* Top Grid: Market Gauge & Macro Alert Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Macro Sentiment Gauge */}
        <div className="p-4 bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#131722] dark:text-[#eaedfd] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#089981]" />
              Composite Sentiment Index
            </span>
            <span className="text-[11px] font-bold text-[#089981] font-mono-tabular">68 / 100 GREED</span>
          </div>

          <div className="h-2 w-full bg-[#f0f3fa] dark:bg-[#1c2230] rounded-full overflow-hidden flex">
            <div className="w-[18%] bg-red-500" />
            <div className="w-[20%] bg-amber-500" />
            <div className="w-[62%] bg-emerald-500" />
          </div>

          <div className="flex justify-between text-[10px] text-[#737687] mt-1.5 font-medium">
            <span>Extreme Fear</span>
            <span>Neutral</span>
            <span>Bullish Momentum</span>
          </div>

          <div className="mt-3 pt-3 border-t border-[#f0f3fa] dark:border-[#1c2230] text-[11px] text-[#434656] dark:text-[#a0a5b8] leading-relaxed">
            Breadth metrics favor technology and semiconductor capital expenditures following strong quarterly hyperscaler backlog releases.
          </div>
        </div>

        {/* Global Economic Calendar Preview (2 cols) */}
        <div className="lg:col-span-2 p-4 bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#131722] dark:text-[#eaedfd] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#2962ff]" />
              Scheduled Economic Announcements
            </span>
            <span className="text-[11px] text-[#737687]">US Eastern Time</span>
          </div>

          <div className="overflow-x-auto font-mono-tabular">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#f0f3fa] dark:border-[#1a202c] text-[10px] text-[#737687]">
                  <th className="py-1.5 px-2">Time</th>
                  <th className="py-1.5 px-2">Currency</th>
                  <th className="py-1.5 px-2">Event</th>
                  <th className="py-1.5 px-2 text-right">Actual</th>
                  <th className="py-1.5 px-2 text-right">Forecast</th>
                  <th className="py-1.5 px-2 text-right">Prior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3fa] dark:divide-[#1c2230]">
                {economicEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#f8f9fd] dark:hover:bg-[#161b26]">
                    <td className="py-2 px-2 text-[#737687] text-[11px] whitespace-nowrap">{ev.time}</td>
                    <td className="py-2 px-2 font-semibold text-[#2962ff]">{ev.country}</td>
                    <td className="py-2 px-2 font-medium text-[#131722] dark:text-white flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ev.impact === 'high' ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                      />
                      <span>{ev.event}</span>
                    </td>
                    <td className="py-2 px-2 text-right font-bold text-[#089981]">{ev.actual}</td>
                    <td className="py-2 px-2 text-right text-[#737687]">{ev.consensus}</td>
                    <td className="py-2 px-2 text-right text-[#737687]">{ev.previous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filter Tabs for News */}
      <div className="flex items-center gap-1.5 mb-4">
        {[
          { id: 'all', label: 'All Breaking News' },
          { id: 'bullish', label: 'Bullish Catalysts' },
          { id: 'bearish', label: 'Bearish Catalysts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTag(tab.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterTag === tab.id
                ? 'bg-[#2962ff] text-white shadow-xs'
                : 'bg-white dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* News Feed Stream (Single elevation, zero pills) */}
      <div className="space-y-3">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs hover:border-[#2962ff]/40 transition-colors"
          >
            {/* Metadata (Clean typography with · separators, no static pill badge sandwich) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#737687] mb-1.5">
              <span className="font-semibold text-[#131722] dark:text-[#eaedfd] flex items-center gap-1">
                <Newspaper className="w-3.5 h-3.5 text-[#2962ff]" />
                {item.source}
              </span>
              <span aria-hidden="true">·</span>
              <span>{item.time}</span>
              <span aria-hidden="true">·</span>
              <span>{item.readTime}</span>
              <span aria-hidden="true">·</span>
              <span
                className={`font-semibold ${
                  item.sentiment === 'bullish'
                    ? 'text-[#089981]'
                    : item.sentiment === 'bearish'
                    ? 'text-[#f23645]'
                    : 'text-[#737687]'
                }`}
              >
                {item.sentiment.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-[#131722] dark:text-white leading-snug hover:text-[#2962ff] transition-colors cursor-pointer">
              {item.title}
            </h3>

            {/* Summary */}
            <p className="text-xs text-[#434656] dark:text-[#a0a5b8] mt-1.5 leading-relaxed">
              {item.summary}
            </p>

            {/* Related Symbols */}
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#f0f3fa] dark:border-[#1c2230]">
              <span className="text-[11px] text-[#737687]">Mentioned:</span>
              <div className="flex items-center gap-1.5 font-mono-tabular">
                {item.relatedSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => onSelectSymbol && onSelectSymbol(sym)}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#eaedfd]/60 dark:bg-[#1c2230] text-[#2962ff] dark:text-[#84f7db] hover:bg-[#dfe2f2] dark:hover:bg-[#242938] transition-colors"
                  >
                    ${sym}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
