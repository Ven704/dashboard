/** Row shape from Supabase; extra columns are preserved in `raw`. */
export type TradeRow = {
  id: string;
  created_at: string | null;
  raw: Record<string, unknown>;
};

export type TradeMetrics = {
  totalTrades: number;
  tradesLast24h: number;
  tradesLast7d: number;
  openTrades: number;
  sumNotional: number | null;
  winRate: number | null;
  sumPnl: number | null;
};
