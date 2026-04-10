/** Serializable snapshot for server → client charts. */
export type TradeAnalyticsSnapshot = {
  sampleSize: number;
  resolvedCount: number;
  openCount: number;
  cancelledCount: number;
  winCount: number;
  lossCount: number;
  winRate: number | null;
  netPnl: number;
  grossProfit: number;
  grossLossAbs: number;
  profitFactor: number | null;
  avgWin: number | null;
  avgLossAbs: number | null;
  expectancy: number | null;
  largestWin: number | null;
  largestLoss: number | null;
  openNotional: number;
  avgConfidence: number | null;
  byAsset: {
    name: string;
    trades: number;
    pnl: number;
    wins: number;
    losses: number;
  }[];
  byStrategy: {
    name: string;
    trades: number;
    pnl: number;
    wins: number;
    losses: number;
  }[];
  byInterval: { interval: number; trades: number; pnl: number }[];
  dailyPnl: {
    day: string;
    pnl: number;
    cumulative: number;
    trades: number;
  }[];
  byHourUtc: { hour: number; trades: number; pnl: number }[];
  byDow: { dow: number; label: string; trades: number; pnl: number }[];
  directionSplit: { direction: string; count: number; pnl: number }[];
};
