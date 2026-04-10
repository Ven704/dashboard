import type { Metadata } from "next";
import Link from "next/link";

import ConnectPrompt from "@/components/ConnectPrompt";
import FullAnalyticsBoard from "@/components/analytics/FullAnalyticsBoard";
import MetricCard from "@/components/MetricCard";
import PageHeader from "@/components/PageHeader";
import { computeTradeAnalytics } from "@/lib/analytics/tradeAnalytics";
import { missingCredentialsError } from "@/lib/data/types";
import { fetchTradesForDashboard } from "@/lib/data/queries";
import { env } from "@/lib/env";
import {
  formatInt,
  formatPercent,
  formatProfitFactor,
  formatUsd,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics",
};

const AnalyticsPage = async () => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return <ConnectPrompt message={missingCredentialsError} />;
  }

  const result = await fetchTradesForDashboard();
  if (!result.ok) {
    return (
      <main className="px-4 py-10">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
          {result.error}
        </p>
      </main>
    );
  }

  const a = computeTradeAnalytics(result.data);
  const updatedAt = new Date().toISOString().replace("T", " ").slice(0, 19);

  return (
    <main className="mx-auto max-w-[100rem] px-4 py-8">
      <PageHeader
        title="Analytics"
        description="Performance analytics inspired by institutional dashboards: equity-style cumulative P&L, profit factor, expectancy, time-of-day and asset/strategy breakdowns. All stats use the current Supabase sample (raise TRADES_FETCH_LIMIT for deeper history)."
        updatedAtLabel={`${updatedAt} UTC`}
      />

      <p className="mb-8 text-sm text-zinc-500">
        Sample:{" "}
        <span className="font-mono text-zinc-400">{a.sampleSize}</span> rows
        loaded (max {env.fetchLimit()}).{" "}
        <Link href="/" className="text-emerald-400 hover:underline">
          Overview
        </Link>{" "}
        ·{" "}
        <Link href="/trades" className="text-emerald-400 hover:underline">
          Trades
        </Link>
      </p>

      <section
        className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
        aria-label="Core performance KPIs"
      >
        <MetricCard
          label="Net P&L (resolved)"
          value={formatUsd(a.netPnl)}
          variant={a.netPnl >= 0 ? "profit" : "loss"}
        />
        <MetricCard
          label="Win rate"
          value={a.winRate === null ? "—" : formatPercent(a.winRate)}
          subValue={`${formatInt(a.winCount)}W / ${formatInt(a.lossCount)}L`}
        />
        <MetricCard
          label="Profit factor"
          value={formatProfitFactor(
            a.profitFactor,
            a.grossProfit,
            a.grossLossAbs,
          )}
          hint="Gross wins ÷ |gross losses|"
          variant="accent"
        />
        <MetricCard
          label="Expectancy / trade"
          value={
            a.expectancy === null ? "—" : formatUsd(a.expectancy)
          }
          hint="Net P&L ÷ resolved trades"
        />
        <MetricCard
          label="Open exposure"
          value={formatUsd(a.openNotional)}
          subValue={`${formatInt(a.openCount)} open`}
          variant="warn"
        />
        <MetricCard
          label="Avg win"
          value={a.avgWin === null ? "—" : formatUsd(a.avgWin)}
          variant="profit"
        />
        <MetricCard
          label="Avg loss"
          value={a.avgLossAbs === null ? "—" : formatUsd(-a.avgLossAbs)}
          variant="loss"
        />
        <MetricCard
          label="Largest win"
          value={a.largestWin === null ? "—" : formatUsd(a.largestWin)}
        />
        <MetricCard
          label="Largest loss"
          value={a.largestLoss === null ? "—" : formatUsd(a.largestLoss)}
        />
        <MetricCard
          label="Avg confidence"
          value={
            a.avgConfidence === null
              ? "—"
              : formatPercent(a.avgConfidence)
          }
        />
      </section>

      <FullAnalyticsBoard data={a} />
    </main>
  );
};

export default AnalyticsPage;
