/** Mirrors Supabase `public.trades` (subset used in UI). */
export type Trade = {
  id: string;
  created_at: string | null;
  market_id: string;
  asset: string;
  interval_mins: number;
  direction: "UP" | "DOWN";
  bet_size: number;
  entry_odds: number;
  confidence: number;
  strategy: string;
  signals: unknown;
  mirofish_consensus: unknown;
  paper_trade: boolean | null;
  status: "open" | "won" | "lost" | "cancelled";
  exit_odds: number | null;
  profit_loss: number | null;
  resolved_at: string | null;
  loss_reason: string | null;
  window_start: string | null;
  window_end: string | null;
  agent_votes: number | null;
  odds_up: number | null;
  odds_down: number | null;
  reasoning: string | null;
};

export type PaperBalance = {
  id: string;
  created_at: string | null;
  starting_balance: number | null;
  current_balance: number | null;
  total_bets: number | null;
  total_wins: number | null;
  total_losses: number | null;
  best_win: number | null;
  worst_loss: number | null;
  updated_at: string | null;
};

export type ReviewReport = {
  id: string;
  created_at: string | null;
  window_number: number | null;
  window_start: string | null;
  window_end: string | null;
  total_trades: number | null;
  wins: number | null;
  losses: number | null;
  win_rate: number | null;
  pnl: number | null;
  discord_sent: boolean | null;
};

export type PatternRow = {
  id: string;
  created_at: string | null;
  pattern_name: string;
  description: string;
  loss_correlation: number | null;
  trades_affected: number | null;
  status: string | null;
  asset: string | null;
  interval_mins: number | null;
};

export type SignalPerformanceRow = {
  id: string;
  created_at: string | null;
  signal_name: string;
  asset: string;
  interval_mins: number;
  total_trades: number | null;
  wins: number | null;
  losses: number | null;
  win_rate: number | null;
  avg_confidence: number | null;
  period_start: string | null;
  period_end: string | null;
};

export type StrategyVersionRow = {
  id: string;
  created_at: string | null;
  version: number;
  win_rate_before: number | null;
  win_rate_after: number | null;
  backtest_improvement: number | null;
  deployed: boolean | null;
  review_window: string | null;
  reasoning: string | null;
};

export type TrackedWalletRow = {
  id: string;
  created_at: string | null;
  wallet_address: string;
  win_rate: number | null;
  total_trades: number | null;
  total_profit: number | null;
  is_active: boolean | null;
  last_trade_at: string | null;
  rank: number | null;
};
