export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Rescheduled' | 'Completed'
export type AppointmentType = 'Video consultation' | 'In-person consultation' | 'Follow-up'
export type CareNeed = 'General consultation' | 'Follow-up care' | 'Specialist consultation'
export type PreConsultationStatus = 'Ready' | 'Pending' | 'Not started'

export type AppointmentDoctor = {
  id: string
  name: string
  specialization: string
  organization: string
}

export type Appointment = {
  id: string
  doctor: AppointmentDoctor
  date: string
  time: string
  type: AppointmentType
  status: AppointmentStatus
  reason: string
  isUpcoming: boolean
  preparation: {
    basicProfile: boolean
    healthRecords: boolean
    preConsultationStatus: PreConsultationStatus
    caseSummaryStatus: 'Not generated' | 'Available'
  }
  followUp?: string
  relatedTreatment?: string
}
