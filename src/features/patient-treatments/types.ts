export type TreatmentStatus = 'Active' | 'Paused' | 'Completed'

export type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  timing: string
  purpose: string
  prescribingProvider?: string
  startDate: string
  status: TreatmentStatus
  notes: string
}

export type Treatment = {
  id: string
  name: string
  context: string
  schedule: string
  provider?: string
  dateRange: string
  status: TreatmentStatus
  notes: string
}

export type CareScheduleItem = {
  id: string
  title: string
  detail: string
  timeLabel: string
}
