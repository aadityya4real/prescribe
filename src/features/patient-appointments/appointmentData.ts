import type { AppointmentDoctor, AppointmentSlot, CareNeed } from './types'

// Temporary discovery catalog. These are selectable references only, not appointments owned by a patient.
export const appointmentDoctors: AppointmentDoctor[] = [
  { id: 'ananya-sharma', name: 'Dr. Ananya Sharma', specialization: 'General Medicine', organization: 'City Care Hospital' },
  { id: 'rohan-mehta', name: 'Dr. Rohan Mehta', specialization: 'Cardiology', organization: 'Heartline Medical Centre' },
  { id: 'meera-iyer', name: 'Dr. Meera Iyer', specialization: 'Endocrinology', organization: 'City Care Hospital' },
]
export const careNeeds: CareNeed[] = ['General consultation', 'Follow-up care', 'Specialist consultation']
export const availableSlots: AppointmentSlot[] = [
  { date: '2026-09-22', label: 'Monday, 22 September 2026', time: '9:30 AM' },
  { date: '2026-09-22', label: 'Monday, 22 September 2026', time: '11:15 AM' },
  { date: '2026-09-23', label: 'Tuesday, 23 September 2026', time: '10:00 AM' },
  { date: '2026-09-23', label: 'Tuesday, 23 September 2026', time: '3:30 PM' },
]
