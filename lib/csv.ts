import { formatCellDisplay } from "@/lib/format";
import type { TradeRow } from "@/types/trade";

const escapeCsv = (s: string): string => {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export const tradesToCsv = (
  trades: TradeRow[],
  columns: readonly string[],
): string => {
  const header = ["created_at", ...columns].map(escapeCsv).join(",");
  const lines = trades.map((t) => {
    const cells = [
      formatCellDisplay(t.created_at, 9999),
      ...columns.map((c) => formatCellDisplay(t.raw[c], 9999)),
    ];
    return cells.map(escapeCsv).join(",");
  });
  return [header, ...lines].join("\r\n");
};
