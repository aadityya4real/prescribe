export type HealthRecordType = 'consultation' | 'diagnosis' | 'treatment' | 'medication' | 'test' | 'procedure' | 'vaccination' | 'allergy' | 'other'
export type HealthRecordMetadata = Record<string, unknown>

export type HealthRecord = {
  id: string; patient_id: string; record_type: HealthRecordType; title: string; description: string | null; event_date: string; provider_name: string | null; facility_name: string | null; diagnosis: string | null; metadata: HealthRecordMetadata; created_at: string; updated_at: string
}

export type CreateHealthRecordInput = Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>
export type UpdateHealthRecordInput = Partial<Pick<HealthRecord, 'record_type' | 'title' | 'description' | 'event_date' | 'provider_name' | 'facility_name' | 'diagnosis' | 'metadata'>>
