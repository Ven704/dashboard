import type { Metadata } from "next";

import ConnectPrompt from "@/components/ConnectPrompt";
import GenericTable from "@/components/GenericTable";
import { missingCredentialsError } from "@/lib/data/types";
import { fetchStrategyVersions } from "@/lib/data/queries";
import { env } from "@/lib/env";
import { asRecordRows } from "@/lib/rows";
import { STRATEGY_VERSION_COLUMNS } from "@/lib/tableColumns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Strategy",
};

const StrategyPage = async () => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return <ConnectPrompt message={missingCredentialsError} />;
  }

  const result = await fetchStrategyVersions();
  if (!result.ok) {
    return (
      <main className="px-4 py-10">
        <h1 className="text-2xl font-semibold">Strategy versions</h1>
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
          Strategy versions
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <code className="rounded bg-zinc-800 px-1 font-mono text-xs">
            strategy_versions
          </code>
          . The <code className="font-mono text-xs">changes</code> jsonb column
          is omitted; expand the row JSON in Supabase if you need the full
          diff.
        </p>
      </header>
      <GenericTable
        title="Version history"
        rows={asRecordRows(result.data)}
        columns={STRATEGY_VERSION_COLUMNS}
      />
    </main>
  );
};

export default StrategyPage;
