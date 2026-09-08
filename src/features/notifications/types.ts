export type NotificationType = 'connection_request' | 'connection_approved' | 'connection_rejected'

export type AppNotification = {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  is_read: boolean
  created_at: string
}
