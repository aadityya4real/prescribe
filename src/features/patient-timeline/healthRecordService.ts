import { supabase } from '../../lib/supabase'
import type { CreateHealthRecordInput, HealthRecord, UpdateHealthRecordInput } from './types'

const fields = 'id, patient_id, record_type, title, description, event_date, provider_name, facility_name, diagnosis, metadata, created_at, updated_at'
function client() { if (!supabase) throw new Error('Supabase is not configured yet.'); return supabase }
export async function fetchHealthRecords(patientId: string): Promise<HealthRecord[]> { const { data, error } = await client().from('health_records').select(fields).eq('patient_id', patientId).order('event_date', { ascending: false }); if (error) throw new Error(`Unable to load health records: ${error.message}`); return (data ?? []) as HealthRecord[] }
export async function createHealthRecord(input: CreateHealthRecordInput): Promise<HealthRecord> { const { data, error } = await client().from('health_records').insert(input).select(fields).single(); if (error) throw new Error(`Unable to create health record: ${error.message}`); return data as HealthRecord }
export async function updateHealthRecord(id: string, changes: UpdateHealthRecordInput): Promise<HealthRecord> { const { data, error } = await client().from('health_records').update(changes).eq('id', id).select(fields).single(); if (error) throw new Error(`Unable to update health record: ${error.message}`); return data as HealthRecord }
export async function deleteHealthRecord(id: string): Promise<void> { const { error } = await client().from('health_records').delete().eq('id', id); if (error) throw new Error(`Unable to delete health record: ${error.message}`) }
