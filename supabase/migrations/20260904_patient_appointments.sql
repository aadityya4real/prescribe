-- Patient-owned appointment records. Safe to run more than once.
create extension if not exists pgcrypto;
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.profiles(id) on delete cascade, doctor_id uuid, doctor_name text, doctor_specialization text, appointment_at timestamptz not null,
  appointment_type text not null check (appointment_type in ('Video consultation', 'In-person consultation', 'Follow-up')), care_need text not null check (care_need in ('General consultation', 'Follow-up care', 'Specialist consultation')), status text not null default 'Confirmed' check (status in ('Confirmed', 'Pending', 'Rescheduled', 'Completed', 'Cancelled')), notes text,
  preparation_status text not null default 'Not started' check (preparation_status in ('Ready', 'Pending', 'Not started')), pre_consultation_status text not null default 'Not started' check (pre_consultation_status in ('Ready', 'Pending', 'Not started')), case_summary_status text not null default 'Not generated' check (case_summary_status in ('Not generated', 'Available')), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists appointments_patient_appointment_at_idx on public.appointments (patient_id, appointment_at);
create or replace function public.set_appointments_updated_at() returns trigger language plpgsql security invoker set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at before update on public.appointments for each row execute function public.set_appointments_updated_at();
alter table public.appointments enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'appointments' and policyname = 'Patients can read their own appointments') then create policy "Patients can read their own appointments" on public.appointments for select to authenticated using (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')); end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'appointments' and policyname = 'Patients can create their own appointments') then create policy "Patients can create their own appointments" on public.appointments for insert to authenticated with check (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')); end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'appointments' and policyname = 'Patients can update their own appointments') then create policy "Patients can update their own appointments" on public.appointments for update to authenticated using (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')) with check (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')); end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'appointments' and policyname = 'Patients can delete their own appointments') then create policy "Patients can delete their own appointments" on public.appointments for delete to authenticated using (patient_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'patient')); end if;
end $$;
