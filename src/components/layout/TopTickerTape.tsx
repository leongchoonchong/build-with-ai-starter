import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Asset } from '../../types/terminal';

interface TopTickerTapeProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

export const TopTickerTape: React.FC<TopTickerTapeProps> = ({ assets, onSelectAsset }) => {
  // Select top global macro assets
  const tapeAssets = assets.slice(0, 10);

  return (
    <div className="flex items-center h-8 bg-[#f5f7fc] dark:bg-[#0b0e14] border-b border-[#e0e3eb] dark:border-[#242938] overflow-x-auto no-scrollbar font-mono-tabular select-none text-[11px]">
      <div className="flex items-center divide-x divide-[#e0e3eb] dark:divide-[#242938] shrink-0">
        {tapeAssets.map((asset) => {
          const isUp = asset.change24hPercent >= 0;

          return (
            <button
              key={asset.symbol}
              onClick={() => onSelectAsset(asset)}
              className="flex items-center gap-2 px-3 py-1 hover:bg-[#eaedfd]/80 dark:hover:bg-[#161b26] transition-colors whitespace-nowrap text-left"
            >
              <span className="font-bold text-[#131722] dark:text-[#eaedfd] font-sans">
                {asset.symbol}
              </span>
              <span className="text-[#131722] dark:text-white font-medium">
                ${asset.price.toFixed(asset.decimals)}
              </span>
              <span
                className={`flex items-center font-semibold text-[10px] ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? <ArrowUp className="w-2.5 h-2.5 mr-0.5 inline" /> : <ArrowDown className="w-2.5 h-2.5 mr-0.5 inline" />}
                {isUp ? '+' : ''}{asset.change24hPercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
