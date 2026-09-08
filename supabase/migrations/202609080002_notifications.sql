-- Persisted, owner-scoped notifications for connection workflow events.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('connection_request', 'connection_approved', 'connection_rejected')),
  title text not null check (char_length(trim(title)) > 0),
  message text not null check (char_length(trim(message)) > 0),
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_unread_created_idx on public.notifications (user_id, is_read, created_at desc);

alter table public.notifications enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'notifications' and policyname = 'Users can read their own notifications') then
    create policy "Users can read their own notifications" on public.notifications for select to authenticated using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'notifications' and policyname = 'Users can update their own notifications') then
    create policy "Users can update their own notifications" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end;
$$;

create or replace function public.create_connection_notifications()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  patient_name text;
  doctor_name text;
begin
  if tg_op = 'INSERT' and new.status = 'pending' then
    select full_name into patient_name from public.profiles where id = new.patient_id;
    insert into public.notifications (user_id, type, title, message, link)
    values (new.doctor_id, 'connection_request', 'New connection request', coalesce(patient_name, 'A patient') || ' sent you a connection request.', '/doctor/patients');
  elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status = 'approved' then
    select full_name into doctor_name from public.profiles where id = new.doctor_id;
    insert into public.notifications (user_id, type, title, message, link)
    values (new.patient_id, 'connection_approved', 'Connection request approved', coalesce(doctor_name, 'Your doctor') || ' approved your connection request.', '/patient/care-team');
  elsif tg_op = 'UPDATE' and old.status = 'pending' and new.status = 'rejected' then
    select full_name into doctor_name from public.profiles where id = new.doctor_id;
    insert into public.notifications (user_id, type, title, message, link)
    values (new.patient_id, 'connection_rejected', 'Connection request update', coalesce(doctor_name, 'Your doctor') || ' was unable to approve your connection request.', '/patient/care-team');
  end if;
  return new;
end;
$$;

drop trigger if exists doctor_patient_connections_notifications on public.doctor_patient_connections;
create trigger doctor_patient_connections_notifications
after insert or update of status on public.doctor_patient_connections
for each row execute function public.create_connection_notifications();
