import Link from "next/link";

import ConnectPrompt from "@/components/ConnectPrompt";
import OverviewMiniCharts from "@/components/analytics/OverviewMiniCharts";
import MetricCard from "@/components/MetricCard";
import PageHeader from "@/components/PageHeader";
import TradesTable from "@/components/TradesTable";
import { computeTradeAnalytics } from "@/lib/analytics/tradeAnalytics";
import { missingCredentialsError } from "@/lib/data/types";
import {
  fetchPaperBalance,
  fetchTradesForDashboard,
} from "@/lib/data/queries";
import { env } from "@/lib/env";
import {
  formatInt,
  formatPercent,
  formatProfitFactor,
  formatUsd,
} from "@/lib/format";
import { computeMetrics } from "@/lib/trades/metrics";

export const dynamic = "force-dynamic";

const OverviewPage = async () => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return <ConnectPrompt message={missingCredentialsError} />;
  }

  const [paperR, tradesR] = await Promise.all([
    fetchPaperBalance(),
    fetchTradesForDashboard(),
  ]);

  const paper = paperR.ok ? paperR.data : null;
  const paperErr = !paperR.ok ? paperR.error : null;
  const trades = tradesR.ok ? tradesR.data : [];
  const tradesErr = !tradesR.ok ? tradesR.error : null;

  const metrics = computeMetrics(trades);
  const analytics = computeTradeAnalytics(trades);
  const updatedAt = new Date().toISOString().replace("T", " ").slice(0, 19);

  const previewColumns = [
    "created_at",
    "asset",
    "interval_mins",
    "direction",
    "bet_size",
    "status",
    "profit_loss",
    "strategy",
  ] as const;

  const paperWinRate =
    paper &&
    paper.total_bets &&
    paper.total_bets > 0 &&
    paper.total_wins != null
      ? paper.total_wins / paper.total_bets
      : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader
        title="Overview"
        description="Command center for Ven704/polymarket-bot: paper balance, risk snapshot, performance KPIs on the loaded trade sample, and quick charts. Open Analytics for the full breakdown."
        updatedAtLabel={`${updatedAt} UTC`}
      />

      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/analytics"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Open full analytics
        </Link>
        <Link
          href="/trades"
          className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-400"
        >
          Trades & CSV export
        </Link>
      </div>

      {tradesErr ? (
        <p
          className="mb-6 rounded-lg border border-amber-500/40 bg-amber-950/25 p-3 text-sm text-amber-100"
          role="alert"
        >
          Trades query: {tradesErr}
        </p>
      ) : null}
      {paperErr ? (
        <p
          className="mb-6 rounded-lg border border-amber-500/40 bg-amber-950/25 p-3 text-sm text-amber-100"
          role="alert"
        >
          Paper balance: {paperErr}
        </p>
      ) : null}

      <section className="mb-10" aria-label="Paper trading balance">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Paper balance
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Current balance"
            value={
              paper?.current_balance != null
                ? formatUsd(Number(paper.current_balance))
                : "—"
            }
            variant="accent"
          />
          <MetricCard
            label="Starting balance"
            value={
              paper?.starting_balance != null
                ? formatUsd(Number(paper.starting_balance))
                : "—"
            }
          />
          <MetricCard
            label="Total bets"
            value={formatInt(paper?.total_bets ?? 0)}
          />
          <MetricCard
            label="Wins / losses"
            value={`${formatInt(paper?.total_wins ?? 0)} / ${formatInt(paper?.total_losses ?? 0)}`}
            hint={
              paperWinRate !== null
                ? `All-time win rate ${formatPercent(paperWinRate)}`
                : undefined
            }
          />
          <MetricCard
            label="Best win"
            value={
              paper?.best_win != null
                ? formatUsd(Number(paper.best_win))
                : "—"
            }
            variant="profit"
          />
          <MetricCard
            label="Worst loss"
            value={
              paper?.worst_loss != null
                ? formatUsd(Number(paper.worst_loss))
                : "—"
            }
            variant="loss"
          />
        </div>
      </section>

      <section className="mb-10" aria-label="Performance KPIs">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Performance (loaded sample)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Net P&L (resolved)"
            value={formatUsd(analytics.netPnl)}
            variant={analytics.netPnl >= 0 ? "profit" : "loss"}
            hint={`${formatInt(analytics.resolvedCount)} resolved`}
          />
          <MetricCard
            label="Profit factor"
            value={formatProfitFactor(
              analytics.profitFactor,
              analytics.grossProfit,
              analytics.grossLossAbs,
            )}
            variant="accent"
          />
          <MetricCard
            label="Win rate"
            value={
              analytics.winRate === null
                ? "—"
                : formatPercent(analytics.winRate)
            }
          />
          <MetricCard
            label="Expectancy / trade"
            value={
              analytics.expectancy === null
                ? "—"
                : formatUsd(analytics.expectancy)
            }
          />
          <MetricCard
            label="Open exposure"
            value={formatUsd(analytics.openNotional)}
            subValue={`${formatInt(analytics.openCount)} open`}
            variant="warn"
          />
          <MetricCard
            label="Rows / limit"
            value={formatInt(metrics.totalTrades)}
            hint={`Cap ${formatInt(env.fetchLimit())} · TRADES_FETCH_LIMIT`}
          />
          <MetricCard
            label="Last 24h / 7d"
            value={`${formatInt(metrics.tradesLast24h)} / ${formatInt(metrics.tradesLast7d)}`}
          />
          <MetricCard
            label="Avg confidence"
            value={
              analytics.avgConfidence === null
                ? "—"
                : formatPercent(analytics.avgConfidence)
            }
          />
        </div>
      </section>

      <section className="mb-10" aria-label="Charts preview">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Charts preview
        </h2>
        <OverviewMiniCharts data={analytics} />
      </section>

      <section aria-label="Recent trades">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Recent trades
        </h2>
        <TradesTable
          trades={trades.slice(0, 12)}
          columnKeys={[...previewColumns]}
        />
        <p className="mt-3 text-sm text-[var(--muted)]">
          Filters, full columns, and CSV export on{" "}
          <Link
            href="/trades"
            className="text-emerald-400 underline-offset-2 hover:underline"
          >
            Trades
          </Link>
          .
        </p>
      </section>
    </main>
  );
};

export default OverviewPage;
