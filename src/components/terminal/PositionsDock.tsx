import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, X } from 'lucide-react';
import { Order, Position, PriceAlert } from '../../types/terminal';

interface PositionsDockProps {
  positions: Position[];
  orders: Order[];
  priceAlerts: PriceAlert[];
  onClosePosition: (positionId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onRemoveAlert: (alertId: string) => void;
  onSelectSymbol?: (symbol: string) => void;
}

export const PositionsDock: React.FC<PositionsDockProps> = ({
  positions,
  orders,
  priceAlerts,
  onClosePosition,
  onCancelOrder,
  onRemoveAlert,
  onSelectSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history' | 'alerts'>('positions');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const filledOrders = orders.filter((o) => o.status === 'filled');

  // Compute total portfolio unrealized P&L
  const totalUnrealizedPnL = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="flex flex-col border-t border-[#e0e3eb] dark:border-[#242938] bg-white dark:bg-[#0e1118] select-none text-xs">
      {/* Header Bar with Tabs and Total PnL */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#e0e3eb] dark:border-[#242938] bg-[#fbfbfe] dark:bg-[#131722]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveTab('positions');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
              activeTab === 'positions' && !isCollapsed
                ? 'bg-[#2962ff] text-white'
                : 'text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
            }`}
          >
            Positions ({positions.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
              activeTab === 'orders' && !isCollapsed
                ? 'bg-[#2962ff] text-white'
                : 'text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
            }`}
          >
            Open Orders ({pendingOrders.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
              activeTab === 'history' && !isCollapsed
                ? 'bg-[#2962ff] text-white'
                : 'text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
            }`}
          >
            Trade History ({filledOrders.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('alerts');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
              activeTab === 'alerts' && !isCollapsed
                ? 'bg-[#2962ff] text-white'
                : 'text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
            }`}
          >
            Alerts ({priceAlerts.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          {positions.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono-tabular">
              <span className="text-[#737687]">Unrealized P&L:</span>
              <span
                className={`font-semibold ${
                  totalUnrealizedPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toFixed(2)}
              </span>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-[#737687] hover:text-[#131722] dark:hover:text-white rounded"
            title={isCollapsed ? 'Expand dock' : 'Collapse dock'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dock Body */}
      {!isCollapsed && (
        <div className="max-h-52 overflow-y-auto no-scrollbar font-mono-tabular">
          {/* Tab 1: Positions */}
          {activeTab === 'positions' && (
            <div>
              {positions.length === 0 ? (
                <div className="py-8 text-center text-[#737687] text-xs">
                  No active open positions. Submit orders in the order pad on the right to start trading.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#f0f3fa] dark:border-[#1a202c] text-[10px] text-[#737687] uppercase">
                      <th className="py-2 px-3">Symbol</th>
                      <th className="py-2 px-3">Side</th>
                      <th className="py-2 px-3 text-right">Size</th>
                      <th className="py-2 px-3 text-right">Entry Price</th>
                      <th className="py-2 px-3 text-right">Mark Price</th>
                      <th className="py-2 px-3 text-right">Market Value</th>
                      <th className="py-2 px-3 text-right">Unrealized P&L</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos) => {
                      const isUp = pos.pnl >= 0;
                      return (
                        <tr
                          key={pos.id}
                          className="border-b border-[#f0f3fa] dark:border-[#1a202c] hover:bg-[#f8f9fd] dark:hover:bg-[#161b26]"
                        >
                          <td className="py-2 px-3 font-semibold text-[#131722] dark:text-[#eaedfd]">
                            <button
                              onClick={() => onSelectSymbol && onSelectSymbol(pos.symbol)}
                              className="hover:underline text-left"
                            >
                              {pos.symbol}
                            </button>
                          </td>
                          <td className="py-2 px-3">
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
                          <td className="py-2 px-3 text-right text-[#131722] dark:text-white">
                            {pos.size}
                          </td>
                          <td className="py-2 px-3 text-right text-[#737687]">
                            ${pos.entryPrice.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right text-[#131722] dark:text-white font-medium">
                            ${pos.markPrice.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right text-[#131722] dark:text-white">
                            ${pos.value.toFixed(2)}
                          </td>
                          <td
                            className={`py-2 px-3 text-right font-semibold ${
                              isUp ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {isUp ? '+' : ''}${pos.pnl.toFixed(2)} ({isUp ? '+' : ''}
                            {pos.pnlPercent.toFixed(2)}%)
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => onClosePosition(pos.id)}
                              className="px-2 py-0.5 bg-red-50 dark:bg-red-950/30 text-[#f23645] hover:bg-red-100 dark:hover:bg-red-900/40 rounded text-[10px] font-medium transition-colors"
                            >
                              Market Close
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Tab 2: Open Pending Orders */}
          {activeTab === 'orders' && (
            <div>
              {pendingOrders.length === 0 ? (
                <div className="py-8 text-center text-[#737687] text-xs">
                  No active pending limit orders.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#f0f3fa] dark:border-[#1a202c] text-[10px] text-[#737687] uppercase">
                      <th className="py-2 px-3">Order ID</th>
                      <th className="py-2 px-3">Symbol</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Side</th>
                      <th className="py-2 px-3 text-right">Price</th>
                      <th className="py-2 px-3 text-right">Size</th>
                      <th className="py-2 px-3 text-right">Total</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.map((ord) => (
                      <tr
                        key={ord.id}
                        className="border-b border-[#f0f3fa] dark:border-[#1a202c] hover:bg-[#f8f9fd] dark:hover:bg-[#161b26]"
                      >
                        <td className="py-2 px-3 text-[#737687] text-[11px]">{ord.id}</td>
                        <td className="py-2 px-3 font-semibold text-[#131722] dark:text-[#eaedfd]">
                          {ord.symbol}
                        </td>
                        <td className="py-2 px-3 uppercase text-[11px]">{ord.type}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`font-semibold ${
                              ord.side === 'buy' ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {ord.side.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">${ord.price.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right">{ord.size}</td>
                        <td className="py-2 px-3 text-right">${(ord.price * ord.size).toFixed(2)}</td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => onCancelOrder(ord.id)}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#131722] dark:text-white rounded text-[10px] font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Tab 3: Trade History */}
          {activeTab === 'history' && (
            <div>
              {filledOrders.length === 0 ? (
                <div className="py-8 text-center text-[#737687] text-xs">
                  No executed trade history yet.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#f0f3fa] dark:border-[#1a202c] text-[10px] text-[#737687] uppercase">
                      <th className="py-2 px-3">Time</th>
                      <th className="py-2 px-3">Symbol</th>
                      <th className="py-2 px-3">Side</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3 text-right">Fill Price</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                      <th className="py-2 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filledOrders.map((ord) => (
                      <tr
                        key={ord.id}
                        className="border-b border-[#f0f3fa] dark:border-[#1a202c] hover:bg-[#f8f9fd] dark:hover:bg-[#161b26]"
                      >
                        <td className="py-2 px-3 text-[#737687] text-[11px]">
                          {new Date(ord.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2 px-3 font-semibold text-[#131722] dark:text-[#eaedfd]">
                          {ord.symbol}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`font-semibold ${
                              ord.side === 'buy' ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {ord.side.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2 px-3 uppercase text-[11px]">{ord.type}</td>
                        <td className="py-2 px-3 text-right">${ord.price.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right">{ord.size}</td>
                        <td className="py-2 px-3 text-right text-[#089981] font-semibold">FILLED</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Tab 4: Price Alerts */}
          {activeTab === 'alerts' && (
            <div className="p-3">
              {priceAlerts.length === 0 ? (
                <div className="py-6 text-center text-[#737687] text-xs">
                  No active price alerts set.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {priceAlerts.map((al) => (
                    <div
                      key={al.id}
                      className="flex items-center justify-between p-2.5 bg-[#fbfbfe] dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] rounded"
                    >
                      <div>
                        <span className="font-semibold text-xs text-[#131722] dark:text-[#eaedfd]">
                          {al.symbol}
                        </span>
                        <div className="text-[11px] text-[#737687]">
                          Trigger when {al.direction} ${al.targetPrice.toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveAlert(al.id)}
                        className="p-1 text-[#737687] hover:text-[#f23645] rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
