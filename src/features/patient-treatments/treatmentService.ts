import { supabase } from '../../lib/supabase'
import type { CreateTreatmentInput, Treatment, UpdateTreatmentInput } from './types'
const fields = 'id, patient_id, health_record_id, title, description, treatment_type, status, start_date, end_date, provider_name, facility_name, created_at, updated_at'
function client() { if (!supabase) throw new Error('Supabase is not configured yet.'); return supabase }
export async function fetchTreatments(patientId: string): Promise<Treatment[]> { const { data, error } = await client().from('treatments').select(fields).eq('patient_id', patientId).order('start_date', { ascending: false }); if (error) throw new Error(`Unable to load treatments: ${error.message}`); return (data ?? []) as Treatment[] }
export async function createTreatment(input: CreateTreatmentInput): Promise<Treatment> { const { data, error } = await client().from('treatments').insert(input).select(fields).single(); if (error) throw new Error(`Unable to create treatment: ${error.message}`); return data as Treatment }
export async function updateTreatment(id: string, changes: UpdateTreatmentInput): Promise<Treatment> { const { data, error } = await client().from('treatments').update(changes).eq('id', id).select(fields).single(); if (error) throw new Error(`Unable to update treatment: ${error.message}`); return data as Treatment }
export async function deleteTreatment(id: string): Promise<void> { const { error } = await client().from('treatments').delete().eq('id', id); if (error) throw new Error(`Unable to delete treatment: ${error.message}`) }
