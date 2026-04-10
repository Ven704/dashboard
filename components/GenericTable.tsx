"use client";

import { useMemo, useState } from "react";

import { formatCellDisplay } from "@/lib/format";

type GenericTableProps = {
  title: string;
  description?: string;
  rows: Record<string, unknown>[];
  columns: readonly string[];
  rowKey?: (row: Record<string, unknown>, index: number) => string;
};

const GenericTable = ({
  title,
  description,
  rows,
  columns,
  rowKey,
}: GenericTableProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(q),
    );
  }, [rows, query]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const resolveKey = (row: Record<string, unknown>, index: number): string => {
    if (rowKey) return rowKey(row, index);
    const id = row.id;
    if (typeof id === "string" && id.length > 0) return id;
    if (typeof id === "number") return String(id);
    return `row-${index}`;
  };

  return (
    <section className="space-y-4" aria-labelledby={`table-${title}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id={`table-${title}`}
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            {title}
          </h2>
          {description ? (
            <p className="text-sm text-[var(--muted)]">{description}</p>
          ) : null}
          <p className="text-sm text-[var(--muted)]">
            Showing {filtered.length} of {rows.length} rows
          </p>
        </div>
        <label className="flex w-full flex-col gap-1 sm:max-w-sm">
          <span className="text-xs font-medium text-[var(--muted)]">
            Filter
          </span>
          <input
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search…"
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-emerald-500/30 placeholder:text-zinc-500 focus:ring-2"
            aria-label={`Filter ${title}`}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-zinc-900/50">
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="whitespace-nowrap px-3 py-3 font-medium text-[var(--muted)]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-[var(--muted)]"
                >
                  No rows match this filter.
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => (
                <tr
                  key={resolveKey(row, index)}
                  className="border-b border-[var(--border)]/80 hover:bg-zinc-900/30"
                >
                  {columns.map((col) => (
                    <td
                      key={`${resolveKey(row, index)}-${col}`}
                      className="max-w-[16rem] truncate px-3 py-2 font-mono text-xs text-zinc-200"
                      title={formatCellDisplay(row[col], 400)}
                    >
                      {formatCellDisplay(row[col])}
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

export default GenericTable;
