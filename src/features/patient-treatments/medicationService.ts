import { supabase } from '../../lib/supabase'
import type { CreateMedicationInput, Medication, UpdateMedicationInput } from './types'
const fields = 'id, patient_id, treatment_id, name, dosage, frequency, route, start_date, end_date, status, instructions, created_at, updated_at'
function client() { if (!supabase) throw new Error('Supabase is not configured yet.'); return supabase }
export async function fetchMedications(patientId: string): Promise<Medication[]> { const { data, error } = await client().from('medications').select(fields).eq('patient_id', patientId).order('start_date', { ascending: false }); if (error) throw new Error(`Unable to load medications: ${error.message}`); return (data ?? []) as Medication[] }
export async function createMedication(input: CreateMedicationInput): Promise<Medication> { const { data, error } = await client().from('medications').insert(input).select(fields).single(); if (error) throw new Error(`Unable to create medication: ${error.message}`); return data as Medication }
export async function updateMedication(id: string, changes: UpdateMedicationInput): Promise<Medication> { const { data, error } = await client().from('medications').update(changes).eq('id', id).select(fields).single(); if (error) throw new Error(`Unable to update medication: ${error.message}`); return data as Medication }
export async function deleteMedication(id: string): Promise<void> { const { error } = await client().from('medications').delete().eq('id', id); if (error) throw new Error(`Unable to delete medication: ${error.message}`) }
