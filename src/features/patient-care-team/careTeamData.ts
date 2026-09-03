import type { ConnectionRequest, DoctorProfile } from './types'

export const connectedDoctors: DoctorProfile[] = [
  { id: 'ananya-sharma', name: 'Dr. Ananya Sharma', specialization: 'General Medicine', organization: 'City Care Hospital', preScribeId: 'PS-D-7K91M', connectedOn: 'Connected 18 June 2026', accessScope: 'Health records, active treatments, and upcoming appointments' },
  { id: 'riya-nair', name: 'Riya Nair, PT', specialization: 'Physiotherapy', organization: 'Mobility Care Clinic', preScribeId: 'PS-D-3R28N', connectedOn: 'Connected 2 November 2025', accessScope: 'Relevant treatment plans and physiotherapy records' },
  { id: 'neil-kapoor', name: 'Dr. Neil Kapoor', specialization: 'Dermatology', organization: 'Riverside Specialist Centre', preScribeId: 'PS-D-6J45L', connectedOn: 'Connected 10 March 2025', accessScope: 'Selected health records and consultation history' },
]

export const pendingRequests: ConnectionRequest[] = [
  { id: 'rohan-mehta', name: 'Dr. Rohan Mehta', specialization: 'Cardiology', organization: 'Heartline Medical Centre', preScribeId: 'PS-D-9M54Q', accessScope: 'Access will be selected after approval', status: 'Pending', sentLabel: 'Sent 2 days ago' },
]

export const discoverableDoctors: DoctorProfile[] = [
  { id: 'meera-iyer', name: 'Dr. Meera Iyer', specialization: 'Endocrinology', organization: 'City Care Hospital', preScribeId: 'PS-D-4H62K', accessScope: 'Access will be selected after approval' },
]
