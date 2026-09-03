export type TimelineEventType = 'Consultation' | 'Treatment' | 'Diagnostic Test' | 'Health Record'

export type TimelineEvent = {
  id: string
  year: number
  date: string
  type: TimelineEventType
  title: string
  provider?: string
  description: string
  status?: string
  details: {
    relatedCare?: string
    notes: string
  }
}
