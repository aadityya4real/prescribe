export type ConnectionStatus = 'Connected' | 'Pending'

export type DoctorProfile = {
  id: string
  name: string
  specialization: string
  organization: string
  preScribeId: string
  connectedOn?: string
  accessScope: string
}

export type ConnectionRequest = DoctorProfile & {
  status: 'Pending'
  sentLabel: string
}
