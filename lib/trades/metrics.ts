import type { TradeMetrics, TradeRow } from "@/types/trade";

const num = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const pickNumber = (
  row: Record<string, unknown>,
  keys: readonly string[],
): number | null => {
  for (const key of keys) {
    const n = num(row[key]);
    if (n !== null) return n;
  }
  return null;
};

const parseTime = (iso: string | null): number | null => {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
};

const notionalFromRow = (row: Record<string, unknown>): number | null => {
  const direct = pickNumber(row, [
    "bet_size",
    "notional",
    "notional_usd",
    "usd_amount",
    "amount_usd",
    "size_usd",
  ]);
  if (direct !== null) return direct;
  const size = pickNumber(row, ["size", "amount", "quantity", "shares"]);
  const price = pickNumber(row, ["price", "avg_price", "fill_price"]);
  if (size !== null && price !== null) return size * price;
  return null;
};

const pnlFromRow = (row: Record<string, unknown>): number | null =>
  pickNumber(row, [
    "profit_loss",
    "pnl",
    "profit",
    "realized_pnl",
    "realized_pnl_usd",
  ]);

const isWin = (row: Record<string, unknown>): boolean | null => {
  const st = row.status;
  if (st === "won") return true;
  if (st === "lost") return false;
  const w = row.won ?? row.win ?? row.is_win;
  if (typeof w === "boolean") return w;
  const p = pnlFromRow(row);
  if (p !== null) return p > 0;
  return null;
};

export const computeMetrics = (trades: TradeRow[]): TradeMetrics => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  let tradesLast24h = 0;
  let tradesLast7d = 0;
  const notionals: number[] = [];
  const pnls: number[] = [];
  let wins = 0;
  let winSamples = 0;
  let openTrades = 0;

  for (const t of trades) {
    if (t.raw.status === "open") openTrades += 1;
    const ts = parseTime(t.created_at);
    if (ts !== null) {
      if (now - ts <= day) tradesLast24h += 1;
      if (now - ts <= 7 * day) tradesLast7d += 1;
    }
    const n = notionalFromRow(t.raw);
    if (n !== null) notionals.push(n);
    const p = pnlFromRow(t.raw);
    if (p !== null) pnls.push(p);
    const win = isWin(t.raw);
    if (win !== null) {
      winSamples += 1;
      if (win) wins += 1;
    }
  }

  const sumNotional =
    notionals.length > 0
      ? notionals.reduce((a, b) => a + b, 0)
      : null;
  const sumPnl =
    pnls.length > 0 ? pnls.reduce((a, b) => a + b, 0) : null;
  const winRate =
    winSamples > 0 ? wins / winSamples : null;

  return {
    totalTrades: trades.length,
    tradesLast24h,
    tradesLast7d,
    openTrades,
    sumNotional,
    winRate,
    sumPnl,
  };
};
