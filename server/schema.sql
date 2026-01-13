
-- Existing favorites table
create table if not exists favorites (
  id bigint primary key generated always as identity,
  "fromCurrency" text not null,
  "toCurrency" text not null,
  "fromAmount" numeric not null,
  "toAmount" numeric not null,
  rate numeric not null,
  timestamp bigint not null,
  "isFavorite" boolean default true
);

-- New exchange_rates table for caching
create table if not exists exchange_rates (
  id bigint primary key generated always as identity,
  base_currency text not null default 'USD',
  rates jsonb not null,
  updated_at timestamptz default now()
);

-- Policies (Optional, if RLS is enabled)
alter table exchange_rates enable row level security;
create policy "Allow public read" on exchange_rates for select using (true);
create policy "Allow service insert" on exchange_rates for insert with check (true);
create policy "Allow service update" on exchange_rates for update using (true);
