export type ConnectionStatus = 'pending' | 'approved' | 'rejected' | 'revoked'
export type DoctorPreview = { id: string; full_name: string; prescribe_id: string }
export type DoctorPatientConnection = { id: string; patient_id: string; doctor_id: string; status: ConnectionStatus; requested_by: string; request_message: string | null; requested_at: string; responded_at: string | null; created_at: string; updated_at: string; doctor: DoctorPreview | null }
export type CreateConnectionInput = { patient_id: string; doctor_id: string; requested_by: string; request_message?: string | null }
