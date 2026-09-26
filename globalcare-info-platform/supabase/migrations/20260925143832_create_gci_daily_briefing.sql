create table if not exists public.gci_daily_briefing (
  id uuid primary key default gen_random_uuid(),
  briefing_date date not null,
  title text not null,
  normalized_title text generated always as (
    lower(trim(regexp_replace(title, '\s+', ' ', 'g')))
  ) stored,
  country text,
  sector text,
  category text,
  summary text,
  why_it_matters text,
  gci_opportunity text,
  stage text,
  source_name text,
  source_url text,
  image_url text,
  sort_order integer,
  is_featured boolean not null default false,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (briefing_date, normalized_title),
  check (status <> 'published' or published_at is not null)
);

create index if not exists gci_daily_briefing_public_feed_idx
  on public.gci_daily_briefing (briefing_date desc, sort_order asc, created_at asc)
  where status = 'published';

create or replace function public.set_gci_daily_briefing_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_gci_daily_briefing_updated_at on public.gci_daily_briefing;
create trigger set_gci_daily_briefing_updated_at
before update on public.gci_daily_briefing
for each row execute function public.set_gci_daily_briefing_updated_at();

alter table public.gci_daily_briefing enable row level security;

revoke all on table public.gci_daily_briefing from anon, authenticated;
grant select on table public.gci_daily_briefing to anon, authenticated;

create policy "Published daily briefings are public"
on public.gci_daily_briefing
for select
to anon, authenticated
using (status = 'published');
