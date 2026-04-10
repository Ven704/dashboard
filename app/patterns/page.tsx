import type { Metadata } from "next";

import ConnectPrompt from "@/components/ConnectPrompt";
import GenericTable from "@/components/GenericTable";
import { missingCredentialsError } from "@/lib/data/types";
import { fetchPatterns } from "@/lib/data/queries";
import { env } from "@/lib/env";
import { asRecordRows } from "@/lib/rows";
import { PATTERN_COLUMNS } from "@/lib/tableColumns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Patterns",
};

const PatternsPage = async () => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return <ConnectPrompt message={missingCredentialsError} />;
  }

  const result = await fetchPatterns();
  if (!result.ok) {
    return (
      <main className="px-4 py-10">
        <h1 className="text-2xl font-semibold">Patterns</h1>
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
          Patterns
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <code className="rounded bg-zinc-800 px-1 font-mono text-xs">
            patterns
          </code>
          . Column{" "}
          <code className="font-mono text-xs">conditions</code> (jsonb) is
          omitted from this view.
        </p>
      </header>
      <GenericTable
        title="Detected patterns"
        rows={asRecordRows(result.data)}
        columns={PATTERN_COLUMNS}
      />
    </main>
  );
};

export default PatternsPage;
