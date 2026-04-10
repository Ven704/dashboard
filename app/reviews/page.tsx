import type { Metadata } from "next";

import ConnectPrompt from "@/components/ConnectPrompt";
import GenericTable from "@/components/GenericTable";
import { missingCredentialsError } from "@/lib/data/types";
import { fetchReviewReports } from "@/lib/data/queries";
import { env } from "@/lib/env";
import { asRecordRows } from "@/lib/rows";
import { REVIEW_REPORT_COLUMNS } from "@/lib/tableColumns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
};

const ReviewsPage = async () => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return <ConnectPrompt message={missingCredentialsError} />;
  }

  const result = await fetchReviewReports();
  if (!result.ok) {
    return (
      <main className="px-4 py-10">
        <h1 className="text-2xl font-semibold">Hourly reviews</h1>
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
          Hourly reviews
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <code className="rounded bg-zinc-800 px-1 font-mono text-xs">
            review_reports
          </code>{" "}
          — AI review windows from the bot. JSON blobs (
          <span className="font-mono text-xs">patterns_found</span>, etc.) are
          not selected here to keep the grid light.
        </p>
      </header>
      <GenericTable
        title="Review reports"
        rows={asRecordRows(result.data)}
        columns={REVIEW_REPORT_COLUMNS}
      />
    </main>
  );
};

export default ReviewsPage;
