"use client";

import { useMemo, useState } from "react";

import TradesTable from "@/components/TradesTable";
import { tradesToCsv } from "@/lib/csv";
import type { TradeRow } from "@/types/trade";

type TradesExplorerProps = {
  trades: TradeRow[];
  columnKeys: readonly string[];
};

const uniqSorted = (values: string[]): string[] =>
  [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b));

const TradesExplorer = ({ trades, columnKeys }: TradesExplorerProps) => {
  const [status, setStatus] = useState<string>("all");
  const [asset, setAsset] = useState<string>("all");
  const [strategy, setStrategy] = useState<string>("all");
  const [direction, setDirection] = useState<string>("all");
  const [q, setQ] = useState("");

  const statuses = useMemo(
    () =>
      uniqSorted(
        trades.map((t) => String(t.raw.status ?? "")).filter((s) => s.length),
      ),
    [trades],
  );
  const assets = useMemo(
    () =>
      uniqSorted(
        trades.map((t) => String(t.raw.asset ?? "")).filter((s) => s.length),
      ),
    [trades],
  );
  const strategies = useMemo(
    () =>
      uniqSorted(
        trades
          .map((t) => String(t.raw.strategy ?? ""))
          .filter((s) => s.length),
      ),
    [trades],
  );
  const directions = useMemo(
    () =>
      uniqSorted(
        trades
          .map((t) => String(t.raw.direction ?? ""))
          .filter((s) => s.length),
      ),
    [trades],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return trades.filter((t) => {
      const r = t.raw;
      if (status !== "all" && String(r.status) !== status) return false;
      if (asset !== "all" && String(r.asset) !== asset) return false;
      if (strategy !== "all" && String(r.strategy) !== strategy) return false;
      if (direction !== "all" && String(r.direction) !== direction)
        return false;
      if (!needle) return true;
      return JSON.stringify(r).toLowerCase().includes(needle);
    });
  }, [trades, status, asset, strategy, direction, q]);

  const handleExportCsv = () => {
    const csv = tradesToCsv(filtered, columnKeys);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trades-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectClass =
    "rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-emerald-500/30 focus:ring-2";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-zinc-900/30 p-4 ring-1 ring-white/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-zinc-300">Filters & export</p>
          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          >
            Export CSV ({filtered.length})
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            Status
            <select
              className={selectClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            Asset
            <select
              className={selectClass}
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              aria-label="Filter by asset"
            >
              <option value="all">All</option>
              {assets.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            Strategy
            <select
              className={selectClass}
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              aria-label="Filter by strategy"
            >
              <option value="all">All</option>
              {strategies.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            Direction
            <select
              className={selectClass}
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              aria-label="Filter by direction"
            >
              <option value="all">All</option>
              {directions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            Search
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Id, market, text…"
              className={selectClass}
              aria-label="Search in row JSON"
              autoComplete="off"
            />
          </label>
        </div>
      </div>

      <TradesTable
        trades={filtered}
        columnKeys={[...columnKeys]}
        hideSearch
        title="Results"
        totalHint={`${trades.length} loaded from Supabase`}
      />
    </div>
  );
};

export default TradesExplorer;
