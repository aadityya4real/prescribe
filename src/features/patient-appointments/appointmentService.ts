import { supabase } from '../../lib/supabase'
import type { AppointmentRecord, CreateAppointmentInput, UpdateAppointmentInput } from './types'

const fields = 'id, patient_id, doctor_id, doctor_name, doctor_specialization, appointment_at, appointment_type, care_need, status, notes, preparation_status, pre_consultation_status, case_summary_status, created_at, updated_at'
function client() { if (!supabase) throw new Error('Supabase is not configured yet.'); return supabase }
export async function fetchAppointments(patientId: string): Promise<AppointmentRecord[]> { const { data, error } = await client().from('appointments').select(fields).eq('patient_id', patientId).order('appointment_at', { ascending: true }); if (error) throw new Error(`Unable to load appointments: ${error.message}`); return (data ?? []) as AppointmentRecord[] }
export async function createAppointment(input: CreateAppointmentInput): Promise<AppointmentRecord> { const { data, error } = await client().from('appointments').insert(input).select(fields).single(); if (error) throw new Error(`Unable to create appointment: ${error.message}`); return data as AppointmentRecord }
export async function updateAppointment(id: string, changes: UpdateAppointmentInput): Promise<AppointmentRecord> { const { data, error } = await client().from('appointments').update(changes).eq('id', id).select(fields).single(); if (error) throw new Error(`Unable to update appointment: ${error.message}`); return data as AppointmentRecord }
export async function cancelAppointment(id: string): Promise<AppointmentRecord> { return updateAppointment(id, { status: 'Cancelled' }) }
