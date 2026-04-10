"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  CHART_NEGATIVE,
  CHART_POSITIVE,
  CHART_PRIMARY,
  tooltipContentStyle,
} from "./chartTheme";

type OverviewMiniChartsProps = {
  data: TradeAnalyticsSnapshot;
};

const OverviewMiniCharts = ({ data }: OverviewMiniChartsProps) => {
  const assetMini = data.byAsset.slice(0, 6).map((a) => ({
    name: a.name,
    pnl: Number(a.pnl.toFixed(2)),
  }));

  const usdTick = (v: number) =>
    Math.abs(v) >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Cumulative P&L" description="Daily (UTC), resolved trades.">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.dailyPnl}>
            <defs>
              <linearGradient id="miniPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
            <XAxis
              dataKey="day"
              tick={{ fill: CHART_AXIS, fontSize: 10 }}
              tickMargin={6}
            />
            <YAxis
              tick={{ fill: CHART_AXIS, fontSize: 10 }}
              tickFormatter={usdTick}
              width={48}
            />
            <Tooltip
              contentStyle={tooltipContentStyle}
              formatter={(v: number | string) => [
                formatUsd(typeof v === "number" ? v : Number(v)),
                "",
              ]}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke={CHART_PRIMARY}
              strokeWidth={2}
              fill="url(#miniPnl)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="P&L by asset" description="Top markets in this sample.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={assetMini} margin={{ left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
            <XAxis dataKey="name" tick={{ fill: CHART_AXIS, fontSize: 11 }} />
            <YAxis
              tick={{ fill: CHART_AXIS, fontSize: 10 }}
              tickFormatter={usdTick}
              width={44}
            />
            <Tooltip
              contentStyle={tooltipContentStyle}
              formatter={(v: number | string) => [
                formatUsd(typeof v === "number" ? v : Number(v)),
                "P&L",
              ]}
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {assetMini.map((e, i) => (
                <Cell
                  key={`om-${i}`}
                  fill={e.pnl >= 0 ? CHART_POSITIVE : CHART_NEGATIVE}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default OverviewMiniCharts;
