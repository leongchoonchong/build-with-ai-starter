import { Candle } from '../types/terminal';

/**
 * Calculates Simple Moving Average
 */
export function calculateSMA(candles: Candle[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += candles[i - j].close;
      }
      result.push(sum / period);
    }
  }
  return result;
}

/**
 * Calculates Exponential Moving Average
 */
export function calculateEMA(candles: Candle[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);

  let initialSMA = 0;
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
      initialSMA += candles[i].close;
    } else if (i === period - 1) {
      initialSMA += candles[i].close;
      const sma = initialSMA / period;
      result.push(sma);
    } else {
      const prevEMA = result[i - 1] as number;
      const currentEMA = (candles[i].close - prevEMA) * multiplier + prevEMA;
      result.push(currentEMA);
    }
  }
  return result;
}

/**
 * Calculates Bollinger Bands (Period: 20, StdDev: 2)
 */
export interface BollingerBandsResult {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
}

export function calculateBollingerBands(candles: Candle[], period: number = 20, multiplier: number = 2): BollingerBandsResult {
  const upper: (number | null)[] = [];
  const middle: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      upper.push(null);
      middle.push(null);
      lower.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += candles[i - j].close;
      }
      const mean = sum / period;
      middle.push(mean);

      let varianceSum = 0;
      for (let j = 0; j < period; j++) {
        varianceSum += Math.pow(candles[i - j].close - mean, 2);
      }
      const stdDev = Math.sqrt(varianceSum / period);
      upper.push(mean + multiplier * stdDev);
      lower.push(mean - multiplier * stdDev);
    }
  }

  return { upper, middle, lower };
}

/**
 * Calculates Relative Strength Index (RSI 14)
 */
export function calculateRSI(candles: Candle[], period: number = 14): (number | null)[] {
  const rsi: (number | null)[] = [];
  if (candles.length <= period) {
    return candles.map(() => null);
  }

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    gains.push(diff >= 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  // First average gain and loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = 0; i < period; i++) {
    rsi.push(null);
  }

  const firstRS = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsi.push(100 - 100 / (1 + firstRS));

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - 100 / (1 + rs));
    }
  }

  return rsi;
}

/**
 * Calculates MACD (Moving Average Convergence Divergence)
 */
export interface MACDResult {
  macdLine: (number | null)[];
  signalLine: (number | null)[];
  histogram: (number | null)[];
}

export function calculateMACD(
  candles: Candle[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult {
  const fastEMA = calculateEMA(candles, fastPeriod);
  const slowEMA = calculateEMA(candles, slowPeriod);

  const macdLine: (number | null)[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (fastEMA[i] !== null && slowEMA[i] !== null) {
      macdLine.push((fastEMA[i] as number) - (slowEMA[i] as number));
    } else {
      macdLine.push(null);
    }
  }

  // Calculate signal line as EMA of macdLine
  const validMacdStartIndex = macdLine.findIndex((v) => v !== null);
  const signalLine: (number | null)[] = candles.map(() => null);
  const histogram: (number | null)[] = candles.map(() => null);

  if (validMacdStartIndex !== -1) {
    const validMacdValues = macdLine.slice(validMacdStartIndex) as number[];
    const mult = 2 / (signalPeriod + 1);

    if (validMacdValues.length >= signalPeriod) {
      let initialSum = 0;
      for (let i = 0; i < signalPeriod; i++) {
        initialSum += validMacdValues[i];
      }
      let currentSignal = initialSum / signalPeriod;
      const firstSignalIndex = validMacdStartIndex + signalPeriod - 1;
      signalLine[firstSignalIndex] = currentSignal;
      histogram[firstSignalIndex] = (macdLine[firstSignalIndex] as number) - currentSignal;

      for (let i = firstSignalIndex + 1; i < candles.length; i++) {
        const macdVal = macdLine[i] as number;
        currentSignal = (macdVal - currentSignal) * mult + currentSignal;
        signalLine[i] = currentSignal;
        histogram[i] = macdVal - currentSignal;
      }
    }
  }

  return { macdLine, signalLine, histogram };
}

/**
 * Convert standard candles to Heikin-Ashi candles
 */
export function calculateHeikinAshi(candles: Candle[]): Candle[] {
  if (candles.length === 0) return [];

  const result: Candle[] = [];
  for (let i = 0; i < candles.length; i++) {
    const curr = candles[i];
    const haClose = (curr.open + curr.high + curr.low + curr.close) / 4;
    let haOpen: number;

    if (i === 0) {
      haOpen = (curr.open + curr.close) / 2;
    } else {
      const prevHA = result[i - 1];
      haOpen = (prevHA.open + prevHA.close) / 2;
    }

    const haHigh = Math.max(curr.high, haOpen, haClose);
    const haLow = Math.min(curr.low, haOpen, haClose);

    result.push({
      timestamp: curr.timestamp,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
      volume: curr.volume,
    });
  }

  return result;
}
