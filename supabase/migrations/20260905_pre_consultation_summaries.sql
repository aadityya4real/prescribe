-- Patient-private persisted AI pre-consultation summaries. Safe to run more than once.
create extension if not exists pgcrypto;
create table if not exists public.pre_consultation_summaries (
  id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.profiles(id) on delete cascade, appointment_id uuid not null references public.appointments(id) on delete cascade, patient_concerns text, summary jsonb not null, source_data_updated_at timestamptz not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (patient_id, appointment_id)
);
create index if not exists pre_consultation_summaries_patient_appointment_idx on public.pre_consultation_summaries (patient_id, appointment_id);
create or replace function public.set_pre_consultation_summaries_updated_at() returns trigger language plpgsql security invoker set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists pre_consultation_summaries_set_updated_at on public.pre_consultation_summaries;
create trigger pre_consultation_summaries_set_updated_at before update on public.pre_consultation_summaries for each row execute function public.set_pre_consultation_summaries_updated_at();
alter table public.pre_consultation_summaries enable row level security;
drop policy if exists "Patients manage own pre-consultation summaries" on public.pre_consultation_summaries;
create policy "Patients manage own pre-consultation summaries" on public.pre_consultation_summaries for all to authenticated using (
  patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient') and exists (select 1 from public.appointments where id = appointment_id and patient_id = auth.uid())
) with check (
  patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient') and exists (select 1 from public.appointments where id = appointment_id and patient_id = auth.uid())
);
