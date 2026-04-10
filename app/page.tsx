import Link from "next/link";

import ConnectPrompt from "@/components/ConnectPrompt";
import MetricCard from "@/components/MetricCard";
import TradesTable from "@/components/TradesTable";
import { missingCredentialsError } from "@/lib/data/types";
import {
  fetchPaperBalance,
  fetchTradesForDashboard,
} from "@/lib/data/queries";
import { env } from "@/lib/env";
import { formatInt, formatPercent, formatUsd } from "@/lib/format";
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
      <header className="mb-8 border-b border-[var(--border)] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Data from the same Supabase project as{" "}
          <span className="font-mono text-zinc-400">Ven704/polymarket-bot</span>
          : paper balance, trade load ({formatInt(trades.length)} rows), and
          quick metrics. Open sections in the nav for full tables.
        </p>
      </header>

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

      <section
        className="mb-10"
        aria-label="Paper trading balance"
      >
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
          />
          <MetricCard
            label="Worst loss"
            value={
              paper?.worst_loss != null
                ? formatUsd(Number(paper.worst_loss))
                : "—"
            }
          />
        </div>
      </section>

      <section className="mb-10" aria-label="Trade metrics snapshot">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Trades snapshot
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label="Rows loaded"
            value={formatInt(metrics.totalTrades)}
            hint={`Limit ${formatInt(env.fetchLimit())} (TRADES_FETCH_LIMIT)`}
          />
          <MetricCard
            label="Open positions"
            value={formatInt(metrics.openTrades)}
          />
          <MetricCard
            label="Last 24h / 7d"
            value={`${formatInt(metrics.tradesLast24h)} / ${formatInt(metrics.tradesLast7d)}`}
          />
          <MetricCard
            label="Notional (loaded rows)"
            value={
              metrics.sumNotional === null
                ? "—"
                : formatUsd(metrics.sumNotional)
            }
            hint="Sum of bet_size in loaded sample"
          />
          <MetricCard
            label="Win rate (resolved in sample)"
            value={
              metrics.winRate === null ? "—" : formatPercent(metrics.winRate)
            }
          />
          <MetricCard
            label="P&L sum (resolved in sample)"
            value={
              metrics.sumPnl === null ? "—" : formatUsd(metrics.sumPnl)
            }
            hint="Uses profit_loss on closed trades in this sample"
          />
        </div>
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
          Full history and columns (incl. market_id, odds, reasoning) on{" "}
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
