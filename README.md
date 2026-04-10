# Polymarket bot dashboard

Next.js dashboard for **[Ven704/polymarket-bot](https://github.com/Ven704/polymarket-bot)**. It reads the same Supabase project: `paper_balance`, `trades`, `review_reports`, `patterns`, `signal_performance`, `strategy_versions`, and `tracked_wallets`.

Deploy on **[Vercel](https://vercel.com)** with server-only credentials.

## Features

- **Overview** — paper balance, aggregate trade stats (from the loaded sample), recent trades
- **Trades** — `public.trades` with schema-aligned columns (`profit_loss`, `bet_size`, `status`, …); omits heavy jsonb (`signals`, `mirofish_consensus`) from the grid
- **Reviews** — `review_reports` (scalar columns; large jsonb fields not selected)
- **Patterns**, **Signals**, **Strategy**, **Wallets** — matching tables with filterable tables

All data fetching runs **on the server** using `SUPABASE_SERVICE_ROLE_KEY` (never exposed as `NEXT_PUBLIC_*`).

## Setup

```bash
npm install
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key (server only) |
| `SUPABASE_TRADES_TABLE` | No | Default `trades` |
| `SUPABASE_TRADES_ORDER_COLUMN` | No | Default `created_at` |
| `TRADES_FETCH_LIMIT` | No | Default `500`, max `5000` |
| `SUPABASE_LIST_LIMIT` | No | Default `200`, max `1000` for non-trade lists |

## Vercel

1. Import **Ven704/dashboard** (or fork).
2. Add the env vars above in Project → Settings → Environment Variables.
3. Deploy. Framework preset: **Next.js**.

## Schema notes

The bot writes trades with `status` in `open` → `won` / `lost` and updates `profit_loss`, `resolved_at`, `loss_reason`. Metrics on Overview use **`bet_size`**, **`profit_loss`**, and **`status`** for win rate in the loaded sample.

To change which columns appear on the Trades page, edit `lib/trades/displayColumns.ts`. For other pages, edit `lib/tableColumns.ts`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
