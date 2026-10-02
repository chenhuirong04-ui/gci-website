create table if not exists public.gci_radar_runs (
  id uuid primary key default gen_random_uuid(),
  run_date date not null unique,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'running'
    check (status in ('running', 'success', 'failed', 'partial')),
  sources_checked integer not null default 0 check (sources_checked >= 0),
  candidates_found integer not null default 0 check (candidates_found >= 0),
  qualified_count integer not null default 0 check (qualified_count >= 0),
  rejected_count integer not null default 0 check (rejected_count >= 0),
  duplicate_count integer not null default 0 check (duplicate_count >= 0),
  telegram_count integer not null default 0 check (telegram_count >= 0),
  ai_calls integer not null default 0 check (ai_calls >= 0),
  ai_input_tokens integer not null default 0 check (ai_input_tokens >= 0),
  ai_output_tokens integer not null default 0 check (ai_output_tokens >= 0),
  error_summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.gci_business_radar (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.gci_radar_runs(id) on delete restrict,
  radar_date date not null,
  region text not null,
  country text not null,
  city text,
  sector text not null,
  title text not null,
  what_happened text not null,
  key_companies jsonb not null default '[]'::jsonb
    check (jsonb_typeof(key_companies) = 'array'),
  why_it_matters text not null,
  gci_role text not null,
  next_action text not null,
  target_organisation text not null,
  source_name text not null,
  source_url text not null check (source_url ~ '^https://'),
  opportunity_score smallint not null check (opportunity_score between 0 and 100),
  risk_level text not null check (risk_level in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  milestone_type text not null,
  event_key text not null,
  fingerprint text not null unique,
  status text not null
    check (status in ('qualified', 'rejected', 'duplicate')),
  rejection_reason text,
  telegram_delivery_status text not null default 'not_applicable'
    check (telegram_delivery_status in ('not_applicable', 'pending', 'sending', 'delivered', 'failed')),
  telegram_message_id bigint,
  telegram_published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (telegram_delivery_status = 'delivered' and telegram_message_id is not null and telegram_published_at is not null)
    or telegram_delivery_status <> 'delivered'
  )
);

create index if not exists gci_business_radar_recent_idx
  on public.gci_business_radar (radar_date desc, status, opportunity_score desc);

create index if not exists gci_business_radar_event_idx
  on public.gci_business_radar (event_key, milestone_type, radar_date desc);

create index if not exists gci_business_radar_delivery_idx
  on public.gci_business_radar (telegram_delivery_status, radar_date)
  where status = 'qualified';

create or replace function public.set_gci_business_radar_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_gci_business_radar_updated_at() from public;

drop trigger if exists set_gci_business_radar_updated_at on public.gci_business_radar;
create trigger set_gci_business_radar_updated_at
before update on public.gci_business_radar
for each row execute function public.set_gci_business_radar_updated_at();

alter table public.gci_radar_runs enable row level security;
alter table public.gci_business_radar enable row level security;

revoke all on table public.gci_radar_runs from anon, authenticated;
revoke all on table public.gci_business_radar from anon, authenticated;
revoke all on table public.gci_radar_runs from service_role;
revoke all on table public.gci_business_radar from service_role;
grant select, insert, update on table public.gci_radar_runs to service_role;
grant select, insert, update on table public.gci_business_radar to service_role;

comment on table public.gci_business_radar is
  'Internal-only GCI Global Business Radar. Never expose to anon/authenticated clients or public website surfaces.';

comment on table public.gci_radar_runs is
  'Internal audit record for GCI Global Business Radar automation runs.';
