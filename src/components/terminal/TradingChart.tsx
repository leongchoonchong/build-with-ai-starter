import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart2,
  Camera,
  Maximize2,
  Minus,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import { Asset, Candle, ChartType, DrawingItem, DrawingTool, IndicatorSettings, Timeframe } from '../../types/terminal';
import {
  calculateBollingerBands,
  calculateEMA,
  calculateHeikinAshi,
  calculateMACD,
  calculateRSI,
  calculateSMA,
} from '../../utils/indicators';

interface TradingChartProps {
  asset: Asset;
  candles: Candle[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  onPriceClick?: (price: number) => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  asset,
  candles,
  timeframe,
  onTimeframeChange,
  onPriceClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Chart configuration state
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [activeSubPane, setActiveSubPane] = useState<'volume' | 'rsi' | 'macd'>('volume');
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingTool>('crosshair');
  const [showIndicatorsModal, setShowIndicatorsModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Indicators toggle
  const [indicators, setIndicators] = useState<IndicatorSettings>({
    sma20: true,
    sma50: false,
    sma200: false,
    ema9: false,
    bollingerBands: false,
    rsi: false,
    macd: false,
    volume: true,
  });

  // Drawings list
  const [drawings, setDrawings] = useState<DrawingItem[]>([]);
  const [drawingStart, setDrawingStart] = useState<{ xRatio: number; price: number } | null>(null);

  // Pan & Zoom state
  const [visibleCount, setVisibleCount] = useState<number>(65);
  const [offsetIndex, setOffsetIndex] = useState<number>(0); // 0 means latest candles visible
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartOffset, setDragStartOffset] = useState<number>(0);

  // Crosshair state
  const [crosshair, setCrosshair] = useState<{ x: number; y: number; candleIndex: number } | null>(null);

  // Effective candles based on chart type (e.g. Heikin Ashi)
  const displayCandles = useMemo(() => {
    if (chartType === 'heikin') {
      return calculateHeikinAshi(candles);
    }
    return candles;
  }, [candles, chartType]);

  // Sliced visible candles
  const totalCount = displayCandles.length;
  const startIndex = Math.max(0, totalCount - visibleCount - offsetIndex);
  const endIndex = Math.min(totalCount, startIndex + visibleCount);
  const visibleCandles = useMemo(() => {
    return displayCandles.slice(startIndex, endIndex);
  }, [displayCandles, startIndex, endIndex]);

  // Compute indicators across full candle set
  const sma20 = useMemo(() => calculateSMA(displayCandles, 20), [displayCandles]);
  const sma50 = useMemo(() => calculateSMA(displayCandles, 50), [displayCandles]);
  const sma200 = useMemo(() => calculateSMA(displayCandles, 200), [displayCandles]);
  const ema9 = useMemo(() => calculateEMA(displayCandles, 9), [displayCandles]);
  const bb = useMemo(() => calculateBollingerBands(displayCandles, 20, 2), [displayCandles]);
  const rsi = useMemo(() => calculateRSI(displayCandles, 14), [displayCandles]);
  const macd = useMemo(() => calculateMACD(displayCandles, 12, 26, 9), [displayCandles]);

  // Main canvas render loop
  const renderChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (visibleCandles.length === 0) return;

    // Dimensions
    const rightMargin = 72; // price scale width
    const bottomMargin = 26; // time scale height
    const subPaneHeight = activeSubPane !== 'volume' || indicators.volume ? Math.floor(height * 0.22) : 0;
    const mainChartHeight = height - bottomMargin - subPaneHeight - 10;
    const chartWidth = width - rightMargin;

    // Min and Max price in visible range
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    visibleCandles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    // Add padding to price scale (8% top and bottom)
    const priceRange = maxPrice - minPrice || 1;
    minPrice -= priceRange * 0.08;
    maxPrice += priceRange * 0.08;
    const adjustedRange = maxPrice - minPrice;

    // Coordinate helpers
    const candleWidth = chartWidth / visibleCandles.length;
    const priceToY = (price: number) => {
      return mainChartHeight - ((price - minPrice) / adjustedRange) * mainChartHeight;
    };
    const yToPrice = (y: number) => {
      return maxPrice - (y / mainChartHeight) * adjustedRange;
    };

    // Draw background grid lines (horizontal price lines)
    ctx.lineWidth = 1;
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#1e2330' : '#f0f3fa';

    const priceStep = adjustedRange / 6;
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#73788b' : '#888e9e';
    ctx.textAlign = 'left';

    for (let i = 0; i <= 6; i++) {
      const p = minPrice + i * priceStep;
      const y = priceToY(p);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price label on right rail
      ctx.fillText(p.toFixed(asset.decimals), chartWidth + 8, y + 4);
    }

    // Vertical time gridlines
    const timeStep = Math.max(1, Math.floor(visibleCandles.length / 6));
    ctx.textAlign = 'center';
    for (let i = 0; i < visibleCandles.length; i += timeStep) {
      const c = visibleCandles[i];
      const x = i * candleWidth + candleWidth / 2;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height - bottomMargin);
      ctx.stroke();

      // Date label
      const d = new Date(c.timestamp);
      const timeStr =
        timeframe === '1m' || timeframe === '5m' || timeframe === '15m' || timeframe === '1H'
          ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : d.toLocaleDateString([], { month: 'short', day: 'numeric' });

      ctx.fillText(timeStr, x, height - 8);
    }

    // Draw Bollinger Bands if enabled
    if (indicators.bollingerBands) {
      const sliceUpper = bb.upper.slice(startIndex, endIndex);
      const sliceLower = bb.lower.slice(startIndex, endIndex);
      const sliceMiddle = bb.middle.slice(startIndex, endIndex);

      // Shaded corridor
      ctx.beginPath();
      let first = true;
      for (let i = 0; i < visibleCandles.length; i++) {
        const u = sliceUpper[i];
        if (u !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = priceToY(u);
          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      for (let i = visibleCandles.length - 1; i >= 0; i--) {
        const l = sliceLower[i];
        if (l !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = priceToY(l);
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(41, 98, 255, 0.05)';
      ctx.fill();

      // Upper and Lower lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(41, 98, 255, 0.4)';
      ctx.stroke();

      // Middle SMA line
      ctx.beginPath();
      let midFirst = true;
      for (let i = 0; i < visibleCandles.length; i++) {
        const m = sliceMiddle[i];
        if (m !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = priceToY(m);
          if (midFirst) {
            ctx.moveTo(x, y);
            midFirst = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.strokeStyle = 'rgba(41, 98, 255, 0.7)';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Helper to draw an indicator line (SMA, EMA)
    const drawIndicatorLine = (data: (number | null)[], color: string, width: number = 1.5) => {
      const slice = data.slice(startIndex, endIndex);
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      let started = false;

      for (let i = 0; i < visibleCandles.length; i++) {
        const val = slice[i];
        if (val !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = priceToY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    };

    if (indicators.sma20) drawIndicatorLine(sma20, '#00b4d8', 1.5); // Cyan
    if (indicators.sma50) drawIndicatorLine(sma50, '#f59e0b', 1.5); // Amber
    if (indicators.sma200) drawIndicatorLine(sma200, '#8b5cf6', 2.0); // Violet
    if (indicators.ema9) drawIndicatorLine(ema9, '#ec4899', 1.5); // Pink

    // Draw Candlesticks or Area Chart
    if (chartType === 'area') {
      ctx.beginPath();
      const firstX = candleWidth / 2;
      ctx.moveTo(firstX, priceToY(visibleCandles[0].close));

      for (let i = 1; i < visibleCandles.length; i++) {
        const x = i * candleWidth + candleWidth / 2;
        const y = priceToY(visibleCandles[i].close);
        ctx.lineTo(x, y);
      }

      // Close polygon to baseline for gradient fill
      const lastX = (visibleCandles.length - 1) * candleWidth + candleWidth / 2;
      ctx.lineTo(lastX, mainChartHeight);
      ctx.lineTo(firstX, mainChartHeight);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, 0, mainChartHeight);
      gradient.addColorStop(0, 'rgba(41, 98, 255, 0.25)');
      gradient.addColorStop(1, 'rgba(41, 98, 255, 0.00)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      ctx.moveTo(firstX, priceToY(visibleCandles[0].close));
      for (let i = 1; i < visibleCandles.length; i++) {
        const x = i * candleWidth + candleWidth / 2;
        const y = priceToY(visibleCandles[i].close);
        ctx.lineTo(x, y);
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#2962ff';
      ctx.stroke();
    } else if (chartType === 'bars') {
      // Traditional OHLC bars
      for (let i = 0; i < visibleCandles.length; i++) {
        const c = visibleCandles[i];
        const isUp = c.close >= c.open;
        const color = isUp ? '#089981' : '#f23645';
        const x = i * candleWidth + candleWidth / 2;
        const yOpen = priceToY(c.open);
        const yClose = priceToY(c.close);
        const yHigh = priceToY(c.high);
        const yLow = priceToY(c.low);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;

        // Vertical bar
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Left tick (open)
        ctx.beginPath();
        ctx.moveTo(x - candleWidth * 0.35, yOpen);
        ctx.lineTo(x, yOpen);
        ctx.stroke();

        // Right tick (close)
        ctx.beginPath();
        ctx.moveTo(x, yClose);
        ctx.lineTo(x + candleWidth * 0.35, yClose);
        ctx.stroke();
      }
    } else {
      // Candlesticks (Standard and Heikin-Ashi)
      const bodyWidth = Math.max(2, candleWidth * 0.72);

      for (let i = 0; i < visibleCandles.length; i++) {
        const c = visibleCandles[i];
        const isUp = c.close >= c.open;
        const color = isUp ? '#089981' : '#f23645';
        const x = i * candleWidth + candleWidth / 2;

        const yOpen = priceToY(c.open);
        const yClose = priceToY(c.close);
        const yHigh = priceToY(c.high);
        const yLow = priceToY(c.low);

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));
        ctx.fillStyle = color;
        ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
      }
    }

    // Render Sub-Pane (Volume, RSI, or MACD)
    if (subPaneHeight > 0) {
      const subPaneY = height - bottomMargin - subPaneHeight;

      // Divider line
      ctx.lineWidth = 1;
      ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#242938' : '#e0e3eb';
      ctx.beginPath();
      ctx.moveTo(0, subPaneY);
      ctx.lineTo(width, subPaneY);
      ctx.stroke();

      if (activeSubPane === 'volume' && indicators.volume) {
        // Volume bars
        const maxVol = Math.max(...visibleCandles.map((c) => c.volume), 1);
        const volWidth = Math.max(1.5, candleWidth * 0.7);

        for (let i = 0; i < visibleCandles.length; i++) {
          const c = visibleCandles[i];
          const isUp = c.close >= c.open;
          const vHeight = (c.volume / maxVol) * (subPaneHeight - 16);
          const x = i * candleWidth + candleWidth / 2;
          const y = height - bottomMargin - vHeight;

          ctx.fillStyle = isUp ? 'rgba(8, 153, 129, 0.45)' : 'rgba(242, 54, 69, 0.45)';
          ctx.fillRect(x - volWidth / 2, y, volWidth, vHeight);
        }

        // Sub-pane title
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#73788b' : '#888e9e';
        ctx.textAlign = 'left';
        ctx.fillText(`VOL (20) ${(visibleCandles[visibleCandles.length - 1]?.volume / 1000000).toFixed(2)}M`, 10, subPaneY + 14);
      } else if (activeSubPane === 'rsi') {
        // RSI Oscillator
        const sliceRSI = rsi.slice(startIndex, endIndex);

        // 70 and 30 reference lines
        const rsiToY = (val: number) => subPaneY + subPaneHeight - (val / 100) * subPaneHeight;

        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = 'rgba(242, 54, 69, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, rsiToY(70));
        ctx.lineTo(chartWidth, rsiToY(70));
        ctx.stroke();

        ctx.strokeStyle = 'rgba(8, 153, 129, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, rsiToY(30));
        ctx.lineTo(chartWidth, rsiToY(30));
        ctx.stroke();
        ctx.setLineDash([]);

        // RSI curve
        ctx.beginPath();
        let rsiStarted = false;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#a855f7'; // Purple
        for (let i = 0; i < visibleCandles.length; i++) {
          const r = sliceRSI[i];
          if (r !== null) {
            const x = i * candleWidth + candleWidth / 2;
            const y = rsiToY(r);
            if (!rsiStarted) {
              ctx.moveTo(x, y);
              rsiStarted = true;
            } else {
              ctx.lineTo(x, y);
            }
          }
        }
        ctx.stroke();

        const latestRSI = sliceRSI[sliceRSI.length - 1];
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#a855f7';
        ctx.textAlign = 'left';
        ctx.fillText(`RSI (14): ${latestRSI !== null ? latestRSI.toFixed(1) : '--'}`, 10, subPaneY + 14);
      } else if (activeSubPane === 'macd') {
        // MACD Oscillator
        const sliceHist = macd.histogram.slice(startIndex, endIndex);
        const sliceMacd = macd.macdLine.slice(startIndex, endIndex);
        const sliceSignal = macd.signalLine.slice(startIndex, endIndex);

        let maxHist = 0.01;
        sliceHist.forEach((h) => {
          if (h !== null && Math.abs(h) > maxHist) maxHist = Math.abs(h);
        });

        const zeroY = subPaneY + subPaneHeight / 2;
        const macdToY = (val: number) => zeroY - (val / (maxHist * 2.2)) * (subPaneHeight / 2);

        // Zero line
        ctx.strokeStyle = 'rgba(120, 123, 134, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, zeroY);
        ctx.lineTo(chartWidth, zeroY);
        ctx.stroke();

        // Histogram bars
        const barWidth = Math.max(1.5, candleWidth * 0.6);
        for (let i = 0; i < visibleCandles.length; i++) {
          const h = sliceHist[i];
          if (h !== null) {
            const x = i * candleWidth + candleWidth / 2;
            const y = macdToY(h);
            ctx.fillStyle = h >= 0 ? 'rgba(8, 153, 129, 0.6)' : 'rgba(242, 54, 69, 0.6)';
            ctx.fillRect(x - barWidth / 2, Math.min(y, zeroY), barWidth, Math.abs(y - zeroY));
          }
        }

        // MACD and Signal lines
        const drawMacdCurve = (arr: (number | null)[], strokeColor: string) => {
          ctx.beginPath();
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.2;
          let started = false;
          for (let i = 0; i < visibleCandles.length; i++) {
            const v = arr[i];
            if (v !== null) {
              const x = i * candleWidth + candleWidth / 2;
              const y = macdToY(v);
              if (!started) {
                ctx.moveTo(x, y);
                started = true;
              } else {
                ctx.lineTo(x, y);
              }
            }
          }
          ctx.stroke();
        };

        drawMacdCurve(sliceMacd, '#2962ff');
        drawMacdCurve(sliceSignal, '#f97316');

        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#2962ff';
        ctx.textAlign = 'left';
        ctx.fillText('MACD (12, 26, 9)', 10, subPaneY + 14);
      }
    }

    // Draw user annotations / drawings
    drawings.forEach((d) => {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = d.color || '#2962ff';
      const x1 = d.p1.xRatio * chartWidth;
      const y1 = priceToY(d.p1.price);

      if (d.type === 'horizontal') {
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, y1);
        ctx.lineTo(chartWidth, y1);
        ctx.stroke();
        ctx.setLineDash([]);

        // Price badge
        ctx.fillStyle = '#2962ff';
        ctx.fillRect(chartWidth + 2, y1 - 9, 65, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(d.p1.price.toFixed(asset.decimals), chartWidth + 6, y1 + 3);
      } else if (d.type === 'trendline' && d.p2) {
        const x2 = d.p2.xRatio * chartWidth;
        const y2 = priceToY(d.p2.price);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (d.type === 'fibonacci' && d.p2) {
        const y2 = priceToY(d.p2.price);
        const fibRatios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        const pDelta = d.p2.price - d.p1.price;

        fibRatios.forEach((ratio) => {
          const fibPrice = d.p1.price + pDelta * ratio;
          const fy = priceToY(fibPrice);
          ctx.setLineDash([2, 2]);
          ctx.strokeStyle = 'rgba(41, 98, 255, 0.4)';
          ctx.beginPath();
          ctx.moveTo(x1, fy);
          ctx.lineTo(chartWidth, fy);
          ctx.stroke();

          ctx.fillStyle = '#2962ff';
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillText(`${(ratio * 100).toFixed(1)}% (${fibPrice.toFixed(2)})`, x1 + 6, fy - 3);
        });
        ctx.setLineDash([]);
      }
    });

    // Current live price dotted horizontal line & badge
    const currentPrice = asset.price;
    const currentY = priceToY(currentPrice);
    const isUpAsset = asset.change24h >= 0;

    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = isUpAsset ? '#089981' : '#f23645';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(chartWidth, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current price badge on axis
    ctx.fillStyle = isUpAsset ? '#089981' : '#f23645';
    ctx.fillRect(chartWidth + 2, currentY - 9, 68, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(currentPrice.toFixed(asset.decimals), chartWidth + 6, currentY + 4);

    // Crosshair rendering
    if (crosshair && crosshair.x < chartWidth && crosshair.y < mainChartHeight) {
      const { x, y } = crosshair;
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.45)' : 'rgba(19, 23, 34, 0.45)';
      ctx.lineWidth = 1;

      // Vertical crosshair
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height - bottomMargin);
      ctx.stroke();

      // Horizontal crosshair
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Floating price badge on Y-axis
      const hoverPrice = yToPrice(y);
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#2a2e39' : '#131722';
      ctx.fillRect(chartWidth + 2, y - 9, 68, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(hoverPrice.toFixed(asset.decimals), chartWidth + 6, y + 4);

      // Date badge on X-axis
      const candleIdx = Math.min(visibleCandles.length - 1, Math.max(0, Math.floor(x / candleWidth)));
      const c = visibleCandles[candleIdx];
      if (c) {
        const d = new Date(c.timestamp);
        const fullDateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const textWidth = ctx.measureText(fullDateStr).width;

        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#2a2e39' : '#131722';
        ctx.fillRect(x - textWidth / 2 - 6, height - bottomMargin + 2, textWidth + 12, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fullDateStr, x, height - bottomMargin + 14);
      }
    }
  }, [
    visibleCandles,
    asset,
    chartType,
    activeSubPane,
    indicators,
    drawings,
    crosshair,
    startIndex,
    endIndex,
    sma20,
    sma50,
    sma200,
    ema9,
    bb,
    rsi,
    macd,
    timeframe,
  ]);

  // Resize canvas when container size changes
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      renderChart();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderChart]);

  // Re-render whenever dependencies update
  useEffect(() => {
    renderChart();
  }, [renderChart]);

  // Mouse interaction handlers (Pan, Zoom, Drawing, Crosshair)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const chartWidth = rect.width - 72;

    if (activeDrawingTool === 'crosshair') {
      setIsDragging(true);
      setDragStartX(e.clientX);
      setDragStartOffset(offsetIndex);
    } else if (activeDrawingTool === 'horizontal') {
      const mainChartHeight = rect.height - 26 - (activeSubPane !== 'volume' || indicators.volume ? rect.height * 0.22 : 0);
      let minP = Infinity;
      let maxP = -Infinity;
      visibleCandles.forEach((c) => {
        if (c.low < minP) minP = c.low;
        if (c.high > maxP) maxP = c.high;
      });
      const range = (maxP - minP) * 1.16;
      minP -= (maxP - minP) * 0.08;
      const clickedPrice = maxP - (y / mainChartHeight) * range;

      setDrawings((prev) => [
        ...prev,
        {
          id: `draw-${Date.now()}`,
          type: 'horizontal',
          p1: { xRatio: x / chartWidth, price: clickedPrice },
        },
      ]);
      setActiveDrawingTool('crosshair');
    } else if (activeDrawingTool === 'trendline' || activeDrawingTool === 'fibonacci') {
      const mainChartHeight = rect.height - 26;
      let minP = Infinity;
      let maxP = -Infinity;
      visibleCandles.forEach((c) => {
        if (c.low < minP) minP = c.low;
        if (c.high > maxP) maxP = c.high;
      });
      const range = (maxP - minP) * 1.16;
      const clickedPrice = maxP - (y / mainChartHeight) * range;

      if (!drawingStart) {
        setDrawingStart({ xRatio: x / chartWidth, price: clickedPrice });
      } else {
        setDrawings((prev) => [
          ...prev,
          {
            id: `draw-${Date.now()}`,
            type: activeDrawingTool,
            p1: drawingStart,
            p2: { xRatio: x / chartWidth, price: clickedPrice },
          },
        ]);
        setDrawingStart(null);
        setActiveDrawingTool('crosshair');
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const chartWidth = rect.width - 72;

    const candleWidth = chartWidth / visibleCandles.length;
    const candleIdx = Math.min(visibleCandles.length - 1, Math.max(0, Math.floor(x / candleWidth)));

    setCrosshair({ x, y, candleIndex: candleIdx });

    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      const candleShift = Math.round(deltaX / candleWidth);
      const maxOffset = totalCount - visibleCount;
      const newOffset = Math.max(0, Math.min(maxOffset, dragStartOffset + candleShift));
      setOffsetIndex(newOffset);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setCrosshair(null);
  };

  // Zoom via scroll wheel
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;
    const newCount = Math.round(visibleCount * zoomFactor);
    const clampedCount = Math.max(20, Math.min(totalCount, newCount));
    setVisibleCount(clampedCount);
  };

  // Take screenshot of chart
  const exportChartSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.symbol}_chart_${timeframe}_${Date.now()}.png`;
    a.click();
  };

  // Active inspected candle (from crosshair or latest)
  const inspectedCandle = crosshair
    ? visibleCandles[crosshair.candleIndex] || visibleCandles[visibleCandles.length - 1]
    : visibleCandles[visibleCandles.length - 1];

  const candleChange = inspectedCandle ? inspectedCandle.close - inspectedCandle.open : 0;
  const candleChangePct = inspectedCandle && inspectedCandle.open > 0 ? (candleChange / inspectedCandle.open) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col w-full h-full bg-white dark:bg-[#0e1118] border-b border-[#e0e3eb] dark:border-[#242938] select-none ${
        isFullscreen ? 'fixed inset-0 z-50 p-4' : ''
      }`}
    >
      {/* Top Chart Action Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 border-b border-[#e0e3eb] dark:border-[#242938] bg-[#fbfbfe] dark:bg-[#131722] text-xs gap-2">
        {/* Left: Timeframe selectors & Chart Types */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {(['1m', '5m', '15m', '1H', '4H', '1D', '1W', 'ALL'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                onTimeframeChange(tf);
                setOffsetIndex(0);
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
              }`}
            >
              {tf}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-[#e0e3eb] dark:bg-[#242938] mx-1" />

          {/* Chart Type selector */}
          <div className="flex items-center bg-[#eaedfd]/60 dark:bg-[#1c2230] p-0.5 rounded">
            <button
              onClick={() => setChartType('candles')}
              title="Candlesticks"
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                chartType === 'candles' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('heikin')}
              title="Heikin-Ashi"
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                chartType === 'heikin' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
              }`}
            >
              Heikin
            </button>
            <button
              onClick={() => setChartType('area')}
              title="Area Line"
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                chartType === 'area' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bars')}
              title="OHLC Bars"
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                chartType === 'bars' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
              }`}
            >
              Bars
            </button>
          </div>
        </div>

        {/* Center: Real-time Candle OHLC Inspect Data */}
        {inspectedCandle && (
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono-tabular text-[#434656] dark:text-[#9ea4b6]">
            <span>O: <strong className="text-[#131722] dark:text-[#eaedfd]">{inspectedCandle.open.toFixed(asset.decimals)}</strong></span>
            <span>H: <strong className="text-[#131722] dark:text-[#eaedfd]">{inspectedCandle.high.toFixed(asset.decimals)}</strong></span>
            <span>L: <strong className="text-[#131722] dark:text-[#eaedfd]">{inspectedCandle.low.toFixed(asset.decimals)}</strong></span>
            <span>C: <strong className="text-[#131722] dark:text-[#eaedfd]">{inspectedCandle.close.toFixed(asset.decimals)}</strong></span>
            <span className={candleChange >= 0 ? 'text-[#089981] font-semibold' : 'text-[#f23645] font-semibold'}>
              {candleChange >= 0 ? '+' : ''}{candleChange.toFixed(asset.decimals)} ({candleChangePct >= 0 ? '+' : ''}{candleChangePct.toFixed(2)}%)
            </span>
          </div>
        )}

        {/* Right: Technical Indicators & Drawing Tools */}
        <div className="flex items-center gap-1.5">
          {/* Subpane selector */}
          <div className="flex items-center bg-[#eaedfd]/60 dark:bg-[#1c2230] p-0.5 rounded text-[10px]">
            <button
              onClick={() => setActiveSubPane('volume')}
              className={`px-1.5 py-0.5 rounded font-medium ${
                activeSubPane === 'volume' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
              }`}
            >
              Vol
            </button>
            <button
              onClick={() => setActiveSubPane('rsi')}
              className={`px-1.5 py-0.5 rounded font-medium ${
                activeSubPane === 'rsi' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
              }`}
            >
              RSI
            </button>
            <button
              onClick={() => setActiveSubPane('macd')}
              className={`px-1.5 py-0.5 rounded font-medium ${
                activeSubPane === 'macd' ? 'bg-white dark:bg-[#2a3040] text-[#2962ff] shadow-xs' : 'text-[#737687]'
              }`}
            >
              MACD
            </button>
          </div>

          {/* Indicators dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setShowIndicatorsModal(!showIndicatorsModal)}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#434656] dark:text-[#a0a5b8] bg-[#eaedfd]/60 dark:bg-[#1c2230] hover:bg-[#dfe2f2] dark:hover:bg-[#242938] rounded transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Indicators</span>
            </button>

            {showIndicatorsModal && (
              <div className="absolute right-0 top-full mt-1 w-56 p-2.5 bg-white dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#2a3040] rounded shadow-lg z-30">
                <div className="text-[11px] font-semibold text-[#131722] dark:text-white mb-2">Overlays & Oscillators</div>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center justify-between cursor-pointer hover:bg-[#f0f3fa] dark:hover:bg-[#1e2330] p-1 rounded">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00b4d8]" />
                      SMA (20)
                    </span>
                    <input
                      type="checkbox"
                      checked={indicators.sma20}
                      onChange={(e) => setIndicators({ ...indicators, sma20: e.target.checked })}
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:bg-[#f0f3fa] dark:hover:bg-[#1e2330] p-1 rounded">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                      SMA (50)
                    </span>
                    <input
                      type="checkbox"
                      checked={indicators.sma50}
                      onChange={(e) => setIndicators({ ...indicators, sma50: e.target.checked })}
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:bg-[#f0f3fa] dark:hover:bg-[#1e2330] p-1 rounded">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                      SMA (200)
                    </span>
                    <input
                      type="checkbox"
                      checked={indicators.sma200}
                      onChange={(e) => setIndicators({ ...indicators, sma200: e.target.checked })}
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:bg-[#f0f3fa] dark:hover:bg-[#1e2330] p-1 rounded">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                      EMA (9)
                    </span>
                    <input
                      type="checkbox"
                      checked={indicators.ema9}
                      onChange={(e) => setIndicators({ ...indicators, ema9: e.target.checked })}
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:bg-[#f0f3fa] dark:hover:bg-[#1e2330] p-1 rounded">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2962ff]" />
                      Bollinger Bands (20, 2)
                    </span>
                    <input
                      type="checkbox"
                      checked={indicators.bollingerBands}
                      onChange={(e) => setIndicators({ ...indicators, bollingerBands: e.target.checked })}
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer hover:bg-[#f0f3fa] dark:hover:bg-[#1e2330] p-1 rounded">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                      Volume Profile
                    </span>
                    <input
                      type="checkbox"
                      checked={indicators.volume}
                      onChange={(e) => setIndicators({ ...indicators, volume: e.target.checked })}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Reset Zoom */}
          <button
            onClick={() => {
              setOffsetIndex(0);
              setVisibleCount(65);
            }}
            title="Reset View"
            className="p-1 text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330] rounded"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Snapshot */}
          <button
            onClick={exportChartSnapshot}
            title="Export Chart PNG"
            className="p-1 text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330] rounded"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
            className="p-1 text-[#434656] dark:text-[#a0a5b8] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330] rounded"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Drawing Toolbar (Left Float) */}
      <div className="absolute left-2 top-12 z-20 flex flex-col gap-1 p-1 bg-white/90 dark:bg-[#161b26]/90 backdrop-blur-xs border border-[#e0e3eb] dark:border-[#242938] rounded shadow-xs">
        <button
          onClick={() => setActiveDrawingTool('crosshair')}
          title="Crosshair & Pan"
          className={`p-1.5 rounded transition-colors ${
            activeDrawingTool === 'crosshair' ? 'bg-[#2962ff] text-white' : 'text-[#737687] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveDrawingTool('trendline')}
          title="Draw Trendline"
          className={`p-1.5 rounded transition-colors ${
            activeDrawingTool === 'trendline' ? 'bg-[#2962ff] text-white' : 'text-[#737687] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveDrawingTool('horizontal')}
          title="Horizontal Support/Resistance Ray"
          className={`p-1.5 rounded transition-colors ${
            activeDrawingTool === 'horizontal' ? 'bg-[#2962ff] text-white' : 'text-[#737687] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330]'
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        {drawings.length > 0 && (
          <button
            onClick={() => setDrawings([])}
            title="Clear All Drawings"
            className="p-1.5 rounded text-[#f23645] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <span className="text-[10px] font-bold">CLR</span>
          </button>
        )}
      </div>

      {/* Main Canvas Canvas Element */}
      <div className="relative flex-1 w-full h-full min-h-[380px]">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          onClick={(e) => {
            if (onPriceClick) {
              const canvas = canvasRef.current;
              if (!canvas) return;
              const rect = canvas.getBoundingClientRect();
              const y = e.clientY - rect.top;
              const mainH = rect.height - 26;
              let minP = Infinity;
              let maxP = -Infinity;
              visibleCandles.forEach((c) => {
                if (c.low < minP) minP = c.low;
                if (c.high > maxP) maxP = c.high;
              });
              const range = (maxP - minP) * 1.16;
              const clickedPrice = maxP - (y / mainH) * range;
              onPriceClick(Number(clickedPrice.toFixed(asset.decimals)));
            }
          }}
          className="w-full h-full cursor-crosshair"
        />
      </div>
    </div>
  );
};
