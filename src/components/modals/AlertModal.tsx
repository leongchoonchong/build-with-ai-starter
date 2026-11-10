import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Asset } from '../../types/terminal';
import { terminalAudio } from '../../utils/audio';

interface AlertModalProps {
  isOpen: boolean;
  asset: Asset;
  onClose: () => void;
  onSaveAlert: (symbol: string, targetPrice: number, direction: 'above' | 'below') => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  asset,
  onClose,
  onSaveAlert,
}) => {
  const [targetPrice, setTargetPrice] = useState<string>((asset.price * 1.02).toFixed(asset.decimals));
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (!priceNum || priceNum <= 0) return;

    terminalAudio.playAlert();
    onSaveAlert(asset.symbol, priceNum, direction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-sm bg-white dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#2a3040] rounded-lg shadow-xl p-4 text-xs font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb] dark:border-[#242938]">
          <div className="flex items-center gap-2 font-bold text-sm text-[#131722] dark:text-white">
            <Bell className="w-4 h-4 text-[#2962ff]" />
            <span>Set Price Alert for {asset.symbol}</span>
          </div>
          <button onClick={onClose} className="text-[#737687] hover:text-[#131722] dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-[#737687] mb-1">Condition</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('above')}
                className={`py-1.5 rounded font-medium text-xs transition-colors ${
                  direction === 'above'
                    ? 'bg-[#089981] text-white shadow-xs'
                    : 'bg-[#f0f3fa] dark:bg-[#1c2230] text-[#737687]'
                }`}
              >
                Crosses Above
              </button>
              <button
                type="button"
                onClick={() => setDirection('below')}
                className={`py-1.5 rounded font-medium text-xs transition-colors ${
                  direction === 'below'
                    ? 'bg-[#f23645] text-white shadow-xs'
                    : 'bg-[#f0f3fa] dark:bg-[#1c2230] text-[#737687]'
                }`}
              >
                Crosses Below
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-[#737687] mb-1">
              <span>Target Price ($)</span>
              <span className="font-mono-tabular">Current: ${asset.price.toFixed(asset.decimals)}</span>
            </div>
            <input
              type="number"
              step="any"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full bg-[#f0f3fa] dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] focus:border-[#2962ff] focus:outline-hidden rounded py-1.5 px-3 font-mono-tabular text-sm text-[#131722] dark:text-white"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-[#737687] hover:bg-[#f0f3fa] dark:hover:bg-[#1c2230] rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white font-semibold rounded shadow-xs"
            >
              Save Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
