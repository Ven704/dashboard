import { fetchTradesForDashboard } from "@/lib/data/queries";
import type { TradeRow } from "@/types/trade";

export type FetchTradesResult =
  | { ok: true; trades: TradeRow[] }
  | { ok: false; error: string };

export const fetchTrades = async (): Promise<FetchTradesResult> => {
  const r = await fetchTradesForDashboard();
  if (!r.ok) return { ok: false, error: r.error };
  return { ok: true, trades: r.data };
};
