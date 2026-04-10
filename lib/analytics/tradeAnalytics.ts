import type { TradeAnalyticsSnapshot } from "@/types/analytics";
import type { TradeRow } from "@/types/trade";

const num = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const eventTimeMs = (row: Record<string, unknown>): number | null => {
  const r = row.resolved_at;
  const c = row.created_at;
  const iso =
    typeof r === "string" && r.length > 0
      ? r
      : typeof c === "string" && c.length > 0
        ? c
        : null;
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
};

const dayKeyUtc = (ms: number): string => {
  const d = new Date(ms);
  return d.toISOString().slice(0, 10);
};

const hourUtc = (ms: number): number => new Date(ms).getUTCHours();

const dowUtc = (ms: number): number => new Date(ms).getUTCDay();

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const computeTradeAnalytics = (
  trades: TradeRow[],
): TradeAnalyticsSnapshot => {
  let openCount = 0;
  let cancelledCount = 0;
  let winCount = 0;
  let lossCount = 0;
  let grossProfit = 0;
  let grossLossAbs = 0;
  let openNotional = 0;
  let confSum = 0;
  let confN = 0;
  let largestWin: number | null = null;
  let largestLoss: number | null = null;

  type Bucket = { trades: number; pnl: number; wins: number; losses: number };
  const assetMap = new Map<string, Bucket>();
  const stratMap = new Map<string, Bucket>();
  const intMap = new Map<number, { trades: number; pnl: number }>();
  const dayMap = new Map<
    string,
    { pnl: number; trades: number; lastMs: number }
  >();
  const hourMap = new Map<number, { trades: number; pnl: number }>();
  const dowMap = new Map<number, { trades: number; pnl: number }>();
  const dirMap = new Map<string, { count: number; pnl: number }>();

  const bump = (
    m: Map<string, Bucket>,
    key: string,
    pnl: number | null,
    outcome: "win" | "loss" | "other",
  ) => {
    const b = m.get(key) ?? { trades: 0, pnl: 0, wins: 0, losses: 0 };
    b.trades += 1;
    if (pnl !== null) b.pnl += pnl;
    if (outcome === "win") b.wins += 1;
    if (outcome === "loss") b.losses += 1;
    m.set(key, b);
  };

  for (const t of trades) {
    const row = t.raw;
    const st = row.status;
    const bs = num(row.bet_size);
    const cf = num(row.confidence);
    if (cf !== null) {
      confSum += cf;
      confN += 1;
    }

    if (st === "open") {
      openCount += 1;
      if (bs !== null) openNotional += bs;
    } else if (st === "cancelled") {
      cancelledCount += 1;
    }

    const asset = typeof row.asset === "string" ? row.asset : "—";
    const strat =
      typeof row.strategy === "string" ? row.strategy : "—";
    const interval = num(row.interval_mins);
    const dir = typeof row.direction === "string" ? row.direction : "—";

    const pnl =
      st === "won" || st === "lost" ? num(row.profit_loss) : null;
    const ms = eventTimeMs(row);

    if (st === "won") {
      winCount += 1;
      if (pnl !== null && pnl > 0) {
        grossProfit += pnl;
        if (largestWin === null || pnl > largestWin) largestWin = pnl;
      }
    } else if (st === "lost") {
      lossCount += 1;
      if (pnl !== null && pnl < 0) {
        grossLossAbs += Math.abs(pnl);
        if (largestLoss === null || pnl < largestLoss) largestLoss = pnl;
      }
    }

    const outcome: "win" | "loss" | "other" =
      st === "won" ? "win" : st === "lost" ? "loss" : "other";

    bump(assetMap, asset, pnl, outcome);
    bump(stratMap, strat, pnl, outcome);

    if (interval !== null) {
      const ib = intMap.get(interval) ?? { trades: 0, pnl: 0 };
      ib.trades += 1;
      if (pnl !== null) ib.pnl += pnl;
      intMap.set(interval, ib);
    }

    if (ms !== null && pnl !== null) {
      const dk = dayKeyUtc(ms);
      const db = dayMap.get(dk) ?? { pnl: 0, trades: 0, lastMs: ms };
      db.pnl += pnl;
      db.trades += 1;
      db.lastMs = Math.max(db.lastMs, ms);
      dayMap.set(dk, db);

      const h = hourUtc(ms);
      const hb = hourMap.get(h) ?? { trades: 0, pnl: 0 };
      hb.trades += 1;
      hb.pnl += pnl;
      hourMap.set(h, hb);

      const dw = dowUtc(ms);
      const wb = dowMap.get(dw) ?? { trades: 0, pnl: 0 };
      wb.trades += 1;
      wb.pnl += pnl;
      dowMap.set(dw, wb);
    }

    const db = dirMap.get(dir) ?? { count: 0, pnl: 0 };
    db.count += 1;
    if (pnl !== null) db.pnl += pnl;
    dirMap.set(dir, db);
  }

  const resolvedCount = winCount + lossCount;
  const winRate = resolvedCount > 0 ? winCount / resolvedCount : null;
  const netPnl = grossProfit - grossLossAbs;
  const profitFactor =
    grossLossAbs > 0 ? grossProfit / grossLossAbs : grossProfit > 0 ? null : null;

  const avgWin = winCount > 0 ? grossProfit / winCount : null;
  const avgLossAbs = lossCount > 0 ? grossLossAbs / lossCount : null;
  const expectancy = resolvedCount > 0 ? netPnl / resolvedCount : null;
  const avgConfidence = confN > 0 ? confSum / confN : null;

  const sortedDays = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  let cum = 0;
  const dailyPnl = sortedDays.map(([day, v]) => {
    cum += v.pnl;
    return {
      day,
      pnl: v.pnl,
      cumulative: cum,
      trades: v.trades,
    };
  });

  const byAsset = [...assetMap.entries()]
    .map(([name, b]) => ({ name, ...b }))
    .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl));

  const byStrategy = [...stratMap.entries()]
    .map(([name, b]) => ({ name, ...b }))
    .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl));

  const byInterval = [...intMap.entries()]
    .map(([interval, b]) => ({ interval, ...b }))
    .sort((a, b) => a.interval - b.interval);

  const byHourUtc = Array.from({ length: 24 }, (_, hour) => {
    const b = hourMap.get(hour) ?? { trades: 0, pnl: 0 };
    return { hour, ...b };
  });

  const byDow = [0, 1, 2, 3, 4, 5, 6].map((dow) => {
    const b = dowMap.get(dow) ?? { trades: 0, pnl: 0 };
    return { dow, label: DOW_LABELS[dow], ...b };
  });

  const directionSplit = [...dirMap.entries()]
    .map(([direction, b]) => ({ direction, ...b }))
    .sort((a, b) => b.count - a.count);

  return {
    sampleSize: trades.length,
    resolvedCount,
    openCount,
    cancelledCount,
    winCount,
    lossCount,
    winRate,
    netPnl,
    grossProfit,
    grossLossAbs,
    profitFactor,
    avgWin,
    avgLossAbs,
    expectancy,
    largestWin,
    largestLoss,
    openNotional,
    avgConfidence,
    byAsset,
    byStrategy,
    byInterval,
    dailyPnl,
    byHourUtc,
    byDow,
    directionSplit,
  };
};
