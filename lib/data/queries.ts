import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { toTradeRow } from "@/lib/trades/parse";
import type { TradeRow } from "@/types/trade";
import type {
  PaperBalance,
  PatternRow,
  ReviewReport,
  SignalPerformanceRow,
  StrategyVersionRow,
  TrackedWalletRow,
} from "@/types/database";

import { missingCredentialsError, type DbResult } from "./types";

const asArray = <T>(data: unknown): T[] => (Array.isArray(data) ? data : []);

export const fetchPaperBalance = async (): Promise<
  DbResult<PaperBalance | null>
> => {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: missingCredentialsError };
  const { data, error } = await supabase
    .from("paper_balance")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1);
  if (error) return { ok: false, error: error.message };
  const row = asArray<PaperBalance>(data)[0] ?? null;
  return { ok: true, data: row };
};

export const fetchTradesForDashboard = async (): Promise<
  DbResult<TradeRow[]>
> => {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: missingCredentialsError };
  const table = env.tradesTable();
  const limit = env.fetchLimit();
  const orderCol = env.tradesOrderColumn();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(orderCol, { ascending: false })
    .limit(limit);
  if (error) {
    return {
      ok: false,
      error: `${error.message} (table: ${table})`,
    };
  }
  return { ok: true, data: asArray<unknown>(data).map(toTradeRow) };
};

export const fetchReviewReports = async (): Promise<DbResult<ReviewReport[]>> => {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: missingCredentialsError };
  const limit = env.listLimit();
  const { data, error } = await supabase
    .from("review_reports")
    .select(
      "id, created_at, window_number, window_start, window_end, total_trades, wins, losses, win_rate, pnl, discord_sent",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: asArray<ReviewReport>(data) };
};

export const fetchPatterns = async (): Promise<DbResult<PatternRow[]>> => {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: missingCredentialsError };
  const limit = env.listLimit();
  const { data, error } = await supabase
    .from("patterns")
    .select(
      "id, created_at, pattern_name, description, loss_correlation, trades_affected, status, asset, interval_mins",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: asArray<PatternRow>(data) };
};

export const fetchSignalPerformance = async (): Promise<
  DbResult<SignalPerformanceRow[]>
> => {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: missingCredentialsError };
  const limit = env.listLimit();
  const { data, error } = await supabase
    .from("signal_performance")
    .select(
      "id, created_at, signal_name, asset, interval_mins, total_trades, wins, losses, win_rate, avg_confidence, period_start, period_end",
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: asArray<SignalPerformanceRow>(data) };
};

export const fetchStrategyVersions = async (): Promise<
  DbResult<StrategyVersionRow[]>
> => {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: missingCredentialsError };
  const limit = env.listLimit();
  const { data, error } = await supabase
    .from("strategy_versions")
    .select(
      "id, created_at, version, win_rate_before, win_rate_after, backtest_improvement, deployed, review_window, reasoning",
    )
    .order("version", { ascending: false })
    .limit(limit);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: asArray<StrategyVersionRow>(data) };
};

export const fetchTrackedWallets = async (): Promise<
  DbResult<TrackedWalletRow[]>
> => {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: missingCredentialsError };
  const limit = env.listLimit();
  const { data, error } = await supabase
    .from("tracked_wallets")
    .select(
      "id, created_at, wallet_address, win_rate, total_trades, total_profit, is_active, last_trade_at, rank",
    )
    .order("rank", { ascending: true })
    .limit(limit);
  if (error) {
    const fallback = await supabase
      .from("tracked_wallets")
      .select(
        "id, created_at, wallet_address, win_rate, total_trades, total_profit, is_active, last_trade_at, rank",
      )
      .order("last_trade_at", { ascending: false })
      .limit(limit);
    if (fallback.error) return { ok: false, error: fallback.error.message };
    return { ok: true, data: asArray<TrackedWalletRow>(fallback.data) };
  }
  return { ok: true, data: asArray<TrackedWalletRow>(data) };
};
