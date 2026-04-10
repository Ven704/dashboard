import type { Metadata } from "next";

import ConnectPrompt from "@/components/ConnectPrompt";
import PageHeader from "@/components/PageHeader";
import TradesExplorer from "@/components/trades/TradesExplorer";
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

  const updatedAt = new Date().toISOString().replace("T", " ").slice(0, 19);

  return (
    <main className="mx-auto max-w-[100rem] px-4 py-8">
      <PageHeader
        title="Trades"
        description={`Maps to public.trades. Large JSON columns (signals, mirofish_consensus) stay out of the grid. Loaded ${result.data.length} rows (max ${env.fetchLimit()}). Filter, search, and export CSV below.`}
        updatedAtLabel={`${updatedAt} UTC`}
      />
      <TradesExplorer
        trades={result.data}
        columnKeys={TRADE_TABLE_COLUMN_KEYS}
      />
    </main>
  );
};

export default TradesPage;
