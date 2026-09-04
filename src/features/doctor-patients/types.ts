export type DoctorConnectionStatus = 'pending' | 'approved' | 'rejected' | 'revoked'
export type PatientPreview = { id: string; full_name: string; prescribe_id: string }
export type DoctorPatientConnection = { id: string; patient_id: string; doctor_id: string; status: DoctorConnectionStatus; requested_by: string; request_message: string | null; requested_at: string; responded_at: string | null; created_at: string; updated_at: string; patient: PatientPreview }
