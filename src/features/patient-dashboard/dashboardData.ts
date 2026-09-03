export type SnapshotMetric = {
  label: string
  value: number
  detail: string
}

export type Treatment = {
  name: string
  purpose: string
  frequency: string
  status: 'Active'
}

export const patientDashboardData = {
  profile: {
    ...patientProfile,
    dateLabel: 'Thursday, 4 September',
  },
  snapshot: [
    { label: 'Active treatments', value: 2, detail: 'On track' },
    { label: 'Upcoming appointment', value: 1, detail: 'This week' },
    { label: 'Health records', value: 8, detail: 'Up to date' },
    { label: 'Care team members', value: 3, detail: 'Connected' },
  ] satisfies SnapshotMetric[],
  upcomingAppointment: {
    doctor: 'Dr. Ananya Sharma',
    specialty: 'General medicine',
    date: 'Friday, 5 September',
    time: '10:30 AM',
    type: 'Video consultation',
  },
  treatments: [
    { name: 'Vitamin D3', purpose: 'Supplement support', frequency: 'Once daily', status: 'Active' },
    { name: 'Physiotherapy plan', purpose: 'Mobility and recovery', frequency: '3 sessions this week', status: 'Active' },
  ] satisfies Treatment[],
} as const
import { patientProfile } from '../patient-profile/profileData'
