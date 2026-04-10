import type { Metadata } from "next";

import ConnectPrompt from "@/components/ConnectPrompt";
import GenericTable from "@/components/GenericTable";
import { missingCredentialsError } from "@/lib/data/types";
import { fetchSignalPerformance } from "@/lib/data/queries";
import { env } from "@/lib/env";
import { asRecordRows } from "@/lib/rows";
import { SIGNAL_PERF_COLUMNS } from "@/lib/tableColumns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signals",
};

const SignalsPage = async () => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return <ConnectPrompt message={missingCredentialsError} />;
  }

  const result = await fetchSignalPerformance();
  if (!result.ok) {
    return (
      <main className="px-4 py-10">
        <h1 className="text-2xl font-semibold">Signal performance</h1>
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
          {result.error}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Signal performance
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <code className="rounded bg-zinc-800 px-1 font-mono text-xs">
            signal_performance
          </code>{" "}
          — rollups per signal / asset / interval.
        </p>
      </header>
      <GenericTable
        title="Signal rollups"
        rows={asRecordRows(result.data)}
        columns={SIGNAL_PERF_COLUMNS}
      />
    </main>
  );
};

export default SignalsPage;
