"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TradeAnalyticsSnapshot } from "@/types/analytics";
import { formatUsd } from "@/lib/format";

import ChartCard from "./ChartCard";
import {
  CHART_AXIS,
  CHART_GRID,
  CHART_MUTED,
  CHART_NEGATIVE,
  CHART_POSITIVE,
  CHART_PRIMARY,
  CHART_SECONDARY,
  tooltipContentStyle,
} from "./chartTheme";

type FullAnalyticsBoardProps = {
  data: TradeAnalyticsSnapshot;
};

const usdTick = (v: number) => {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
};

const FullAnalyticsBoard = ({ data }: FullAnalyticsBoardProps) => {
  const assetChart = data.byAsset.slice(0, 8).map((a) => ({
    name: a.name,
    pnl: Number(a.pnl.toFixed(2)),
  }));
  const stratChart = data.byStrategy.slice(0, 10).map((s) => ({
    name: s.name.length > 18 ? `${s.name.slice(0, 16)}…` : s.name,
    pnl: Number(s.pnl.toFixed(2)),
    winRate:
      s.wins + s.losses > 0
        ? Math.round((100 * s.wins) / (s.wins + s.losses))
        : 0,
  }));
  const intervalChart = data.byInterval.map((i) => ({
    label: `${i.interval}m`,
    pnl: Number(i.pnl.toFixed(2)),
    trades: i.trades,
  }));
  const pieData = data.directionSplit.map((d) => ({
    name: d.direction,
    value: d.count,
    pnl: d.pnl,
  }));
  const pieColors = [CHART_PRIMARY, CHART_SECONDARY, CHART_MUTED];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Cumulative P&L (resolved)"
          description="Daily buckets by resolved/created time (UTC); running sum."
          tall
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.dailyPnl}>
              <defs>
                <linearGradient id="pnlFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis
                dataKey="day"
                tick={{ fill: CHART_AXIS, fontSize: 11 }}
                tickMargin={8}
              />
              <YAxis
                tick={{ fill: CHART_AXIS, fontSize: 11 }}
                tickFormatter={usdTick}
              />
              <Tooltip
                contentStyle={tooltipContentStyle}
                labelStyle={{ color: "#e4e4e7" }}
                formatter={(value: number | string, name: string) => {
                  const n = typeof value === "number" ? value : Number(value);
                  if (name === "cumulative") return [formatUsd(n), "Cumulative"];
                  if (name === "pnl") return [formatUsd(n), "Day P&L"];
                  return [value, name];
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke={CHART_PRIMARY}
                strokeWidth={2}
                fill="url(#pnlFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="P&L by hour (UTC)"
          description="When resolved trades hit — find your edge by session."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byHourUtc}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis
                dataKey="hour"
                tick={{ fill: CHART_AXIS, fontSize: 10 }}
                tickFormatter={(h) => `${h}h`}
              />
              <YAxis
                tick={{ fill: CHART_AXIS, fontSize: 11 }}
                tickFormatter={usdTick}
              />
              <Tooltip
                contentStyle={tooltipContentStyle}
                formatter={(v: number | string) => [
                  formatUsd(typeof v === "number" ? v : Number(v)),
                  "P&L",
                ]}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {data.byHourUtc.map((e, i) => (
                  <Cell
                    key={`h-${i}`}
                    fill={e.pnl >= 0 ? CHART_POSITIVE : CHART_NEGATIVE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="P&L by asset" description="Top 8 by absolute P&L.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetChart} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis
                type="number"
                tick={{ fill: CHART_AXIS, fontSize: 11 }}
                tickFormatter={usdTick}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={44}
                tick={{ fill: CHART_AXIS, fontSize: 11 }}
              />
              <Tooltip
                contentStyle={tooltipContentStyle}
                formatter={(v: number | string) => [
                  formatUsd(typeof v === "number" ? v : Number(v)),
                  "P&L",
                ]}
              />
              <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                {assetChart.map((e, i) => (
                  <Cell
                    key={`a-${i}`}
                    fill={e.pnl >= 0 ? CHART_POSITIVE : CHART_NEGATIVE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="P&L by strategy"
          description="Top 10 by |P&L|. Tooltip shows win rate."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stratChart} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis
                type="number"
                tick={{ fill: CHART_AXIS, fontSize: 11 }}
                tickFormatter={usdTick}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: CHART_AXIS, fontSize: 10 }}
              />
              <Tooltip
                contentStyle={tooltipContentStyle}
                formatter={(v: number | string, _k, item) => {
                  const p = item?.payload as { winRate?: number };
                  const pnl = typeof v === "number" ? v : Number(v);
                  return [`${formatUsd(pnl)} · ${p.winRate ?? 0}% WR`, "P&L"];
                }}
              />
              <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                {stratChart.map((e, i) => (
                  <Cell
                    key={`s-${i}`}
                    fill={e.pnl >= 0 ? CHART_POSITIVE : CHART_NEGATIVE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="P&L by candle interval" description="Bot interval_mins.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={intervalChart}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis dataKey="label" tick={{ fill: CHART_AXIS, fontSize: 11 }} />
              <YAxis
                tick={{ fill: CHART_AXIS, fontSize: 11 }}
                tickFormatter={usdTick}
              />
              <Tooltip contentStyle={tooltipContentStyle} />
              <Bar dataKey="pnl" fill={CHART_SECONDARY} radius={[4, 4, 0, 0]}>
                {intervalChart.map((e, i) => (
                  <Cell
                    key={`i-${i}`}
                    fill={e.pnl >= 0 ? CHART_POSITIVE : CHART_NEGATIVE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="P&L by weekday (UTC)"
          description="Distribution of resolved P&L."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byDow}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis dataKey="label" tick={{ fill: CHART_AXIS, fontSize: 11 }} />
              <YAxis
                tick={{ fill: CHART_AXIS, fontSize: 11 }}
                tickFormatter={usdTick}
              />
              <Tooltip contentStyle={tooltipContentStyle} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {data.byDow.map((e, i) => (
                  <Cell
                    key={`d-${i}`}
                    fill={e.pnl >= 0 ? CHART_POSITIVE : CHART_NEGATIVE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Direction mix"
          description="Trade count by UP/DOWN; hover for P&L."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={96}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={`p-${i}`}
                    fill={pieColors[i % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipContentStyle}
                formatter={(_v, _n, item) => {
                  const p = (item?.payload as { pnl?: number })?.pnl;
                  return [p !== undefined ? formatUsd(p) : "", "P&L"];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default FullAnalyticsBoard;
