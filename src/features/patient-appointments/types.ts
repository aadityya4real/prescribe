export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Rescheduled' | 'Completed' | 'Cancelled'
export type AppointmentType = 'Video consultation' | 'In-person consultation' | 'Follow-up'
export type CareNeed = 'General consultation' | 'Follow-up care' | 'Specialist consultation'
export type PreparationStatus = 'Ready' | 'Pending' | 'Not started'
export type CaseSummaryStatus = 'Not generated' | 'Available'

export type AppointmentDoctor = { id: string; name: string; specialization: string; organization: string }
export type AppointmentSlot = { date: string; label: string; time: string }

export type AppointmentRecord = {
  id: string; patient_id: string; doctor_id: string | null; doctor_name: string | null; doctor_specialization: string | null; appointment_at: string; appointment_type: AppointmentType; care_need: CareNeed; status: AppointmentStatus; notes: string | null; preparation_status: PreparationStatus; pre_consultation_status: PreparationStatus; case_summary_status: CaseSummaryStatus; created_at: string; updated_at: string
}

export type CreateAppointmentInput = Omit<AppointmentRecord, 'id' | 'created_at' | 'updated_at'>
export type UpdateAppointmentInput = Partial<Pick<AppointmentRecord, 'appointment_at' | 'appointment_type' | 'care_need' | 'status' | 'notes' | 'preparation_status' | 'pre_consultation_status' | 'case_summary_status'>>
