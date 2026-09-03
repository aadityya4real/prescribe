import type { Appointment, AppointmentDoctor, CareNeed } from './types'

export const appointmentDoctors: AppointmentDoctor[] = [
  { id: 'ananya-sharma', name: 'Dr. Ananya Sharma', specialization: 'General Medicine', organization: 'City Care Hospital' },
  { id: 'rohan-mehta', name: 'Dr. Rohan Mehta', specialization: 'Cardiology', organization: 'Heartline Medical Centre' },
  { id: 'meera-iyer', name: 'Dr. Meera Iyer', specialization: 'Endocrinology', organization: 'City Care Hospital' },
]

export const careNeeds: CareNeed[] = ['General consultation', 'Follow-up care', 'Specialist consultation']

export const initialUpcomingAppointments: Appointment[] = [
  { id: 'appointment-sept-5', doctor: appointmentDoctors[0], date: 'Friday, 5 September 2026', time: '10:30 AM', type: 'Video consultation', status: 'Confirmed', reason: 'General follow-up and treatment plan review.', isUpcoming: true, preparation: { basicProfile: true, healthRecords: true, preConsultationStatus: 'Pending', caseSummaryStatus: 'Not generated' } },
  { id: 'appointment-sept-16', doctor: appointmentDoctors[2], date: 'Wednesday, 16 September 2026', time: '2:00 PM', type: 'In-person consultation', status: 'Pending', reason: 'Specialist consultation regarding ongoing treatment support.', isUpcoming: true, preparation: { basicProfile: true, healthRecords: true, preConsultationStatus: 'Not started', caseSummaryStatus: 'Not generated' } },
]

export const pastAppointments: Appointment[] = [
  { id: 'appointment-aug-12', doctor: appointmentDoctors[1], date: '12 August 2026', time: '11:00 AM', type: 'Follow-up', status: 'Completed', reason: 'Follow-up consultation to review cardiovascular care needs.', isUpcoming: false, preparation: { basicProfile: true, healthRecords: true, preConsultationStatus: 'Ready', caseSummaryStatus: 'Available' }, followUp: 'Continue routine monitoring and discuss changes at the next visit.', relatedTreatment: 'Vitamin D3 supplement plan' },
  { id: 'appointment-oct-28', doctor: { id: 'riya-nair', name: 'Riya Nair, PT', specialization: 'Physiotherapy', organization: 'Mobility Care Clinic' }, date: '28 October 2025', time: '4:15 PM', type: 'In-person consultation', status: 'Completed', reason: 'Initial physiotherapy assessment for mobility and recovery goals.', isUpcoming: false, preparation: { basicProfile: true, healthRecords: true, preConsultationStatus: 'Ready', caseSummaryStatus: 'Available' }, followUp: 'Continue the recommended home movement plan.', relatedTreatment: 'Physiotherapy plan' },
]

export const availableSlots = [
  { date: 'Monday, 22 September 2026', times: ['9:30 AM', '11:15 AM'] },
  { date: 'Tuesday, 23 September 2026', times: ['10:00 AM', '3:30 PM'] },
]
