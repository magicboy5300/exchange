-- Create the favorites table
create table favorites (
  id text primary key,
  "fromCurrency" text not null,
  "toCurrency" text not null,
  "fromAmount" numeric not null,
  "toAmount" numeric not null,
  rate numeric not null,
  timestamp bigint not null,
  "isFavorite" boolean default true
);

-- Enable Row Level Security (RLS) if you want to restrict access
-- alter table favorites enable row level security;
-- create policy "Public access" on favorites for all using (true);
