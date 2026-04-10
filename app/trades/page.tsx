import type { Metadata } from "next";

import ConnectPrompt from "@/components/ConnectPrompt";
import TradesTable from "@/components/TradesTable";
import { missingCredentialsError } from "@/lib/data/types";
import { fetchTradesForDashboard } from "@/lib/data/queries";
import { env } from "@/lib/env";
import { TRADE_TABLE_COLUMN_KEYS } from "@/lib/trades/displayColumns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trades",
};

const TradesPage = async () => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return <ConnectPrompt message={missingCredentialsError} />;
  }

  const result = await fetchTradesForDashboard();
  if (!result.ok) {
    return (
      <main className="px-4 py-10">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Trades
        </h1>
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
          {result.error}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[100rem] px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Trades
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Maps to{" "}
          <code className="rounded bg-zinc-800 px-1 font-mono text-xs">
            public.trades
          </code>
          . Large JSON columns{" "}
          <code className="font-mono text-xs text-zinc-500">signals</code>,{" "}
          <code className="font-mono text-xs text-zinc-500">
            mirofish_consensus
          </code>{" "}
          are omitted here; add a detail view later if you need them in-grid.
          Loaded: {result.data.length} rows (max {env.fetchLimit()}).
        </p>
      </header>
      <TradesTable
        trades={result.data}
        columnKeys={[...TRADE_TABLE_COLUMN_KEYS]}
      />
    </main>
  );
};

export default TradesPage;
