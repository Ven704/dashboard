export const formatInt = (n: number): string =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

export const formatUsd = (n: number): string =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

export const formatPercent = (rate: number): string =>
  `${(rate * 100).toFixed(1)}%`;

export const formatDecimal = (n: number, digits = 3): string =>
  n.toFixed(digits);

/** Table cells: shorten JSON so rows stay readable. */
export const formatCellDisplay = (value: unknown, maxLen = 72): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") {
    const s = JSON.stringify(value);
    return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s;
  }
  return String(value);
};
