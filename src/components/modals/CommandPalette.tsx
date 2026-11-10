import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import { Asset } from '../../types/terminal';

interface CommandPaletteProps {
  isOpen: boolean;
  assets: Asset[];
  onClose: () => void;
  onSelectAsset: (asset: Asset) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  assets,
  onClose,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = assets.filter((a) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.sector.toLowerCase().includes(q);
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelectAsset(filtered[selectedIndex]);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelectAsset, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#2a3040] rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#e0e3eb] dark:border-[#242938]">
          <Search className="w-4 h-4 text-[#737687] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a ticker symbol or company name (e.g. NVDA, BTC, S&P 500)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent border-none outline-hidden text-sm text-[#131722] dark:text-white placeholder-[#737687]"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#737687] hover:text-[#131722] dark:hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto no-scrollbar divide-y divide-[#f0f3fa] dark:divide-[#1c2230]">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#737687]">
              No matching assets found for "{query}".
            </div>
          ) : (
            filtered.map((asset, index) => {
              const isSelected = index === selectedIndex;
              const isUp = asset.change24hPercent >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-xs font-mono-tabular transition-colors ${
                    isSelected ? 'bg-[#eaedfd] dark:bg-[#1f2636]' : 'hover:bg-[#f8f9fd] dark:hover:bg-[#1a202c]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#131722] dark:text-white font-sans w-16">
                      {asset.symbol}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-[#131722] dark:text-[#eaedfd] font-sans">
                        {asset.name}
                      </div>
                      <div className="text-[10px] text-[#737687] font-sans">
                        {asset.exchange} · {asset.sector}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-xs text-[#131722] dark:text-white">
                      ${asset.price.toFixed(asset.decimals)}
                    </div>
                    <div
                      className={`text-[11px] font-bold flex items-center justify-end ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? <ArrowUp className="w-3 h-3 inline mr-0.5" /> : <ArrowDown className="w-3 h-3 inline mr-0.5" />}
                      <span>{isUp ? '+' : ''}{asset.change24hPercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#e0e3eb] dark:border-[#242938] bg-[#fbfbfe] dark:bg-[#131722] text-[10px] text-[#737687]">
          <span>Use ↑↓ arrows to navigate, Enter to select</span>
          <span>ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
