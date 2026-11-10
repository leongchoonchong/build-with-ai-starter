import React, { useEffect, useState } from 'react';
import { Check, ShieldAlert } from 'lucide-react';
import { Asset, Order } from '../../types/terminal';
import { terminalAudio } from '../../utils/audio';

interface OrderTicketProps {
  asset: Asset;
  buyingPower: number;
  initialPrice?: number;
  onPlaceOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
}

export const OrderTicket: React.FC<OrderTicketProps> = ({
  asset,
  buyingPower,
  initialPrice,
  onPlaceOrder,
}) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stop'>('limit');
  const [price, setPrice] = useState<string>(asset.price.toFixed(asset.decimals));
  const [quantity, setQuantity] = useState<string>('10');
  const [enableTPSL, setEnableTPSL] = useState<boolean>(false);
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);

  // Sync price if asset or external click price changes
  useEffect(() => {
    if (initialPrice) {
      setPrice(initialPrice.toFixed(asset.decimals));
    } else {
      setPrice(asset.price.toFixed(asset.decimals));
    }
  }, [asset, initialPrice]);

  const numPrice = orderType === 'market' ? asset.price : parseFloat(price) || asset.price;
  const numQuantity = parseFloat(quantity) || 0;
  const orderValue = numPrice * numQuantity;

  // Percentage preset calculations
  const handlePercentPreset = (pct: number) => {
    const budget = buyingPower * pct;
    const estQty = numPrice > 0 ? (budget / numPrice) : 0;
    const roundedQty = asset.assetClass === 'crypto' ? Number(estQty.toFixed(4)) : Math.floor(estQty);
    setQuantity(roundedQty.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numQuantity <= 0 || (orderType !== 'market' && numPrice <= 0)) return;

    terminalAudio.playExecution();

    onPlaceOrder({
      symbol: asset.symbol,
      side,
      type: orderType,
      price: numPrice,
      size: numQuantity,
      status: orderType === 'market' ? 'filled' : 'pending',
    });

    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0e1118] border-l border-[#e0e3eb] dark:border-[#242938] p-3 text-xs select-none">
      {/* Side Selector (Buy Long vs Sell Short) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#eaedfd]/60 dark:bg-[#161b26] rounded mb-3">
        <button
          type="button"
          onClick={() => setSide('buy')}
          className={`py-1.5 rounded font-semibold text-xs transition-all ${
            side === 'buy'
              ? 'bg-[#089981] text-white shadow-xs'
              : 'text-[#434656] dark:text-[#a0a5b8] hover:text-[#131722]'
          }`}
        >
          Buy / Long
        </button>
        <button
          type="button"
          onClick={() => setSide('sell')}
          className={`py-1.5 rounded font-semibold text-xs transition-all ${
            side === 'sell'
              ? 'bg-[#f23645] text-white shadow-xs'
              : 'text-[#434656] dark:text-[#a0a5b8] hover:text-[#131722]'
          }`}
        >
          Sell / Short
        </button>
      </div>

      {/* Order Type Toggle */}
      <div className="flex items-center justify-between gap-1 p-0.5 bg-[#f0f3fa] dark:bg-[#1a202c] rounded mb-3">
        {(['limit', 'market', 'stop'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setOrderType(type)}
            className={`flex-1 py-1 rounded text-[11px] font-medium uppercase transition-colors ${
              orderType === type
                ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs'
                : 'text-[#737687]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-3">
          {/* Price Field */}
          {orderType !== 'market' ? (
            <div>
              <div className="flex items-center justify-between text-[11px] font-medium text-[#737687] mb-1">
                <span>{orderType === 'stop' ? 'Stop Trigger Price' : 'Limit Price'}</span>
                <span className="font-mono-tabular">Mid: ${asset.price.toFixed(asset.decimals)}</span>
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-[#737687] font-mono">$</span>
                <input
                  type="number"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#f0f3fa] dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] focus:border-[#2962ff] focus:outline-hidden rounded py-1.5 pl-6 pr-2.5 text-xs font-mono-tabular text-[#131722] dark:text-white"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="p-2 bg-[#f0f3fa] dark:bg-[#161b26] rounded border border-[#e0e3eb] dark:border-[#242938] text-[11px] text-[#737687]">
              Market orders fill immediately at best available order book price:
              <strong className="block text-[#131722] dark:text-[#eaedfd] font-mono-tabular mt-0.5">
                ~${asset.price.toFixed(asset.decimals)}
              </strong>
            </div>
          )}

          {/* Quantity Field */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-[#737687] mb-1">
              <span>Amount / Quantity</span>
              <span className="font-mono-tabular">{asset.symbol}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.0001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#f0f3fa] dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] focus:border-[#2962ff] focus:outline-hidden rounded py-1.5 px-2.5 text-xs font-mono-tabular text-[#131722] dark:text-white"
                required
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-1">
            {[0.25, 0.5, 0.75, 1.0].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentPreset(pct)}
                className="py-1 bg-[#eaedfd]/50 dark:bg-[#1a202c] hover:bg-[#eaedfd] dark:hover:bg-[#242938] text-[#2962ff] dark:text-[#84f7db] rounded text-[10px] font-semibold transition-colors font-mono"
              >
                {pct * 100}%
              </button>
            ))}
          </div>

          {/* TP / SL Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#434656] dark:text-[#a0a5b8]">
              <input
                type="checkbox"
                checked={enableTPSL}
                onChange={(e) => setEnableTPSL(e.target.checked)}
                className="rounded border-[#e0e3eb]"
              />
              <span>Take Profit & Stop Loss Protection</span>
            </label>

            {enableTPSL && (
              <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-[#f0f3fa] dark:bg-[#161b26] rounded border border-[#e0e3eb] dark:border-[#242938]">
                <div>
                  <span className="text-[10px] text-[#089981] font-semibold block mb-1">Take Profit</span>
                  <input
                    type="number"
                    step="any"
                    placeholder={(numPrice * 1.05).toFixed(2)}
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full bg-white dark:bg-[#0e1118] border border-[#e0e3eb] dark:border-[#242938] rounded px-1.5 py-1 text-[11px] font-mono-tabular"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#f23645] font-semibold block mb-1">Stop Loss</span>
                  <input
                    type="number"
                    step="any"
                    placeholder={(numPrice * 0.95).toFixed(2)}
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full bg-white dark:bg-[#0e1118] border border-[#e0e3eb] dark:border-[#242938] rounded px-1.5 py-1 text-[11px] font-mono-tabular"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary breakdown */}
          <div className="p-2.5 bg-[#fbfbfe] dark:bg-[#131722] rounded border border-[#e0e3eb] dark:border-[#242938] space-y-1.5 font-mono-tabular text-[11px]">
            <div className="flex justify-between text-[#737687]">
              <span>Order Value</span>
              <span className="text-[#131722] dark:text-white font-medium">
                ${orderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-[#737687]">
              <span>Est. Commission</span>
              <span className="text-[#089981] font-medium">$0.00 (Zero Fee)</span>
            </div>
            <div className="flex justify-between text-[#737687]">
              <span>Buying Power</span>
              <span className="text-[#131722] dark:text-white">
                ${buyingPower.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {orderValue > buyingPower && side === 'buy' && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#f23645] mb-2 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Insufficient buying power for this order size</span>
            </div>
          )}

          <button
            type="submit"
            disabled={orderValue > buyingPower && side === 'buy'}
            className={`w-full py-2.5 rounded font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 ${
              justSubmitted
                ? 'bg-emerald-600 text-white'
                : side === 'buy'
                ? 'bg-[#089981] hover:bg-[#07856f] text-white disabled:opacity-50'
                : 'bg-[#f23645] hover:bg-[#dc2638] text-white disabled:opacity-50'
            }`}
          >
            {justSubmitted ? (
              <>
                <Check className="w-4 h-4" />
                <span>Order Filled</span>
              </>
            ) : (
              <span>
                {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'} ({asset.symbol})
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
