import type { CareScheduleItem, Medication, Treatment } from './types'

export const currentMedications: Medication[] = [
  { id: 'vitamin-d3', name: 'Vitamin D3', dosage: '60,000 IU', frequency: 'Once weekly', timing: 'Sunday morning', purpose: 'Supplement support', prescribingProvider: 'Dr. Ananya Sharma', startDate: '20 August 2026', status: 'Active', notes: 'Listed as part of your current treatment plan. Review changes with your prescribing healthcare professional.' },
  { id: 'omega-3', name: 'Omega-3 supplement', dosage: '1,000 mg', frequency: 'Once daily', timing: 'With lunch', purpose: 'Nutritional support', prescribingProvider: 'Dr. Ananya Sharma', startDate: '4 July 2026', status: 'Paused', notes: 'Currently paused in your available treatment record. Confirm any restart with your healthcare professional.' },
]

export const activeTreatments: Treatment[] = [
  { id: 'physiotherapy-plan', name: 'Physiotherapy plan', context: 'Mobility and recovery support', schedule: '3 sessions this week', provider: 'Riya Nair, PT', dateRange: 'Started 30 October 2025', status: 'Active', notes: 'Your record includes a structured movement and recovery plan with scheduled physiotherapy sessions.' },
  { id: 'follow-up-monitoring', name: 'Follow-up monitoring', context: 'General care follow-up', schedule: 'Next review: 5 September 2026', provider: 'Dr. Ananya Sharma', dateRange: 'Started 20 August 2026', status: 'Active', notes: 'Continue to bring relevant questions and recent changes to your scheduled follow-up appointment.' },
]

export const pastTreatments: Treatment[] = [
  { id: 'mobility-assessment', name: 'Initial mobility assessment', context: 'Physiotherapy assessment', schedule: 'One consultation', provider: 'Riya Nair, PT', dateRange: '28 October 2025', status: 'Completed', notes: 'The initial assessment informed the active physiotherapy plan now shown in your profile.' },
  { id: 'wellness-review', name: 'Annual wellness review', context: 'Preventive care review', schedule: 'Annual appointment', provider: 'Dr. Ananya Sharma', dateRange: '14 June 2026', status: 'Completed', notes: 'A wellness visit summary is available in your health timeline.' },
]

export const todaysCareItems: CareScheduleItem[] = [
  { id: 'mobility-routine', title: 'Follow-up exercise', detail: 'Physiotherapy routine', timeLabel: 'Morning' },
  { id: 'record-review', title: 'Prepare for your appointment', detail: 'Review questions for your consultation', timeLabel: 'Today' },
]
