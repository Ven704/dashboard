const tradesTable = (): string =>
  process.env.SUPABASE_TRADES_TABLE?.trim() || "trades";

const fetchLimit = (): number => {
  const n = Number(process.env.TRADES_FETCH_LIMIT ?? "500");
  if (!Number.isFinite(n) || n < 1) return 500;
  return Math.min(5000, Math.floor(n));
};

const tradesOrderColumn = (): string =>
  process.env.SUPABASE_TRADES_ORDER_COLUMN?.trim() || "created_at";

const listLimit = (): number => {
  const n = Number(process.env.SUPABASE_LIST_LIMIT ?? "200");
  if (!Number.isFinite(n) || n < 1) return 200;
  return Math.min(1000, Math.floor(n));
};

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  tradesTable,
  fetchLimit,
  tradesOrderColumn,
  listLimit,
} as const;
