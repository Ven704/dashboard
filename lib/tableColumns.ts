export const REVIEW_REPORT_COLUMNS = [
  "created_at",
  "window_number",
  "window_start",
  "window_end",
  "total_trades",
  "wins",
  "losses",
  "win_rate",
  "pnl",
  "discord_sent",
  "id",
] as const;

export const PATTERN_COLUMNS = [
  "created_at",
  "pattern_name",
  "status",
  "asset",
  "interval_mins",
  "loss_correlation",
  "trades_affected",
  "description",
  "id",
] as const;

export const SIGNAL_PERF_COLUMNS = [
  "signal_name",
  "asset",
  "interval_mins",
  "total_trades",
  "wins",
  "losses",
  "win_rate",
  "avg_confidence",
  "period_start",
  "period_end",
  "created_at",
  "id",
] as const;

export const STRATEGY_VERSION_COLUMNS = [
  "version",
  "deployed",
  "win_rate_before",
  "win_rate_after",
  "backtest_improvement",
  "review_window",
  "created_at",
  "reasoning",
  "id",
] as const;

export const TRACKED_WALLET_COLUMNS = [
  "rank",
  "wallet_address",
  "win_rate",
  "total_trades",
  "total_profit",
  "is_active",
  "last_trade_at",
  "created_at",
  "id",
] as const;
