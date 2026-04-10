import type { TradeRow } from "@/types/trade";

const asRecord = (row: unknown): Record<string, unknown> =>
  row !== null && typeof row === "object" && !Array.isArray(row)
    ? (row as Record<string, unknown>)
    : {};

const stableRowId = (row: Record<string, unknown>): string => {
  const keys = Object.keys(row).sort();
  const payload = JSON.stringify(row, keys);
  let h = 2166136261;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `row-${(h >>> 0).toString(16)}`;
};

const pickId = (row: Record<string, unknown>): string => {
  const id = row.id ?? row.trade_id ?? row.uuid;
  if (typeof id === "string" && id.length > 0) return id;
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  return stableRowId(row);
};

const pickCreatedAt = (row: Record<string, unknown>): string | null => {
  const keys = [
    "created_at",
    "inserted_at",
    "timestamp",
    "ts",
    "executed_at",
    "time",
  ] as const;
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
};

export const toTradeRow = (row: unknown): TradeRow => {
  const raw = asRecord(row);
  return {
    id: pickId(raw),
    created_at: pickCreatedAt(raw),
    raw,
  };
};

export const formatCell = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};
