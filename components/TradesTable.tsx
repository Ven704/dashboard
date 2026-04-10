"use client";

import { useMemo, useState } from "react";

import { formatCellDisplay } from "@/lib/format";
import type { TradeRow } from "@/types/trade";

type TradesTableProps = {
  trades: TradeRow[];
  columnKeys: string[];
  hideSearch?: boolean;
  title?: string;
  totalHint?: string;
};

const TradesTable = ({
  trades,
  columnKeys,
  hideSearch = false,
  title = "Trades",
  totalHint,
}: TradesTableProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (hideSearch) return trades;
    const q = query.trim().toLowerCase();
    if (!q) return trades;
    return trades.filter((t) => {
      const blob = JSON.stringify(t.raw).toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        (t.created_at?.toLowerCase().includes(q) ?? false) ||
        blob.includes(q)
      );
    });
  }, [trades, query, hideSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const subtitle = totalHint
    ? `Showing ${filtered.length} rows · ${totalHint}`
    : hideSearch
      ? `Showing ${filtered.length} rows`
      : `Showing ${filtered.length} of ${trades.length} loaded rows`;

  return (
    <section className="space-y-4" aria-labelledby="trades-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="trades-heading"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            {title}
          </h2>
          <p className="text-sm text-[var(--muted)]">{subtitle}</p>
        </div>
        {!hideSearch ? (
          <label className="flex w-full flex-col gap-1 sm:max-w-sm">
            <span className="text-xs font-medium text-[var(--muted)]">
              Filter
            </span>
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search id, time, market, side…"
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-green-500/40 placeholder:text-zinc-500 focus:ring-2"
              aria-label="Filter trades"
              autoComplete="off"
            />
          </label>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-zinc-900/50">
              <th
                scope="col"
                className="whitespace-nowrap px-3 py-3 font-medium text-[var(--muted)]"
              >
                When
              </th>
              {columnKeys.map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="whitespace-nowrap px-3 py-3 font-medium text-[var(--muted)]"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columnKeys.length + 1}
                  className="px-3 py-8 text-center text-[var(--muted)]"
                >
                  No rows match this filter.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-[var(--border)]/80 hover:bg-zinc-900/30"
                >
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-zinc-300">
                    {formatCellDisplay(t.created_at, 40)}
                  </td>
                  {columnKeys.map((key) => (
                    <td
                      key={`${t.id}-${key}`}
                      className="max-w-[14rem] truncate px-3 py-2 font-mono text-xs text-zinc-200"
                      title={formatCellDisplay(t.raw[key], 500)}
                    >
                      {formatCellDisplay(t.raw[key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TradesTable;
