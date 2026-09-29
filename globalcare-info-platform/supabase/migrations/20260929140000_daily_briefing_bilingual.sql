alter table public.gci_daily_briefing
  add column if not exists title_en text,
  add column if not exists summary_en text,
  add column if not exists why_it_matters_en text,
  add column if not exists gci_opportunity_en text;
