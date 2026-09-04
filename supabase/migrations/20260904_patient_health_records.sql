-- Patient-owned longitudinal health records. Safe to run more than once.
create extension if not exists pgcrypto;
create table if not exists public.health_records (
  id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.profiles(id) on delete cascade, record_type text not null check (record_type in ('consultation', 'diagnosis', 'treatment', 'medication', 'test', 'procedure', 'vaccination', 'allergy', 'other')), title text not null check (char_length(trim(title)) > 0), description text, event_date date not null, provider_name text, facility_name text, diagnosis text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists health_records_patient_event_date_idx on public.health_records (patient_id, event_date desc);
create or replace function public.set_health_records_updated_at() returns trigger language plpgsql security invoker set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists health_records_set_updated_at on public.health_records;
create trigger health_records_set_updated_at before update on public.health_records for each row execute function public.set_health_records_updated_at();
alter table public.health_records enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'health_records' and policyname = 'Patients can read their own health records') then create policy "Patients can read their own health records" on public.health_records for select to authenticated using (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')); end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'health_records' and policyname = 'Patients can create their own health records') then create policy "Patients can create their own health records" on public.health_records for insert to authenticated with check (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')); end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'health_records' and policyname = 'Patients can update their own health records') then create policy "Patients can update their own health records" on public.health_records for update to authenticated using (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')) with check (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')); end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'health_records' and policyname = 'Patients can delete their own health records') then create policy "Patients can delete their own health records" on public.health_records for delete to authenticated using (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')); end if;
end $$;
