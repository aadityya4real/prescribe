import { Bell, CheckCheck, CircleCheck, Clock3, MessageSquareWarning, UserRoundPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../../features/notifications/notificationService'
import type { AppNotification } from '../../features/notifications/types'

function relativeTime(value: string) { const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000)); if (seconds < 60) return 'Just now'; const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`; const days = Math.floor(hours / 24); return days === 1 ? 'Yesterday' : `${days} days ago` }
function NotificationIcon({ type }: { type: AppNotification['type'] }) { return type === 'connection_request' ? <UserRoundPlus size={17} /> : type === 'connection_approved' ? <CircleCheck size={17} /> : <MessageSquareWarning size={17} /> }

type NotificationDropdownProps = { open: boolean; onClose: () => void; onUnreadCountChange: (count: number) => void }

export function NotificationDropdown({ open, onClose, onUnreadCountChange }: NotificationDropdownProps) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const unreadCount = notifications.filter((notification) => !notification.is_read).length
  const loadNotifications = async () => { setLoading(true); setError(null); try { const items = await fetchNotifications(); setNotifications(items); onUnreadCountChange(items.filter((notification) => !notification.is_read).length) } catch { setError('We could not load your notifications. Please try again.') } finally { setLoading(false) } }
  useEffect(() => { if (open) void loadNotifications() }, [open])
  const markRead = async (notification: AppNotification) => { if (!notification.is_read) { try { await markNotificationRead(notification.id); setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, is_read: true } : item)); onUnreadCountChange(Math.max(0, unreadCount - 1)) } catch { setError('We could not update this notification. Please try again.') } } if (notification.link) { onClose(); navigate(notification.link) } }
  const markAllRead = async () => { if (!unreadCount) return; try { await markAllNotificationsRead(); setNotifications((items) => items.map((item) => ({ ...item, is_read: true }))); onUnreadCountChange(0) } catch { setError('We could not mark notifications as read. Please try again.') } }

  if (!open) return null
  return <section className="notification-menu" id="notification-menu" role="dialog" aria-label="Notifications"><header><div><p className="section-kicker">Updates</p><h2>Notifications</h2></div>{unreadCount > 0 && <button type="button" onClick={() => void markAllRead()}><CheckCheck size={15} />Mark all read</button>}</header>{loading ? <div className="notification-state"><Clock3 size={20} /><p>Loading notifications…</p></div> : error ? <div className="notification-state error"><p>{error}</p><button type="button" onClick={() => void loadNotifications()}>Try again</button></div> : notifications.length ? <div className="notification-list">{notifications.map((notification) => <button className={`notification-item ${notification.is_read ? '' : 'unread'}`} type="button" key={notification.id} onClick={() => void markRead(notification)}><span className={`notification-item-icon ${notification.type}`}><NotificationIcon type={notification.type} /></span><span className="notification-item-copy"><strong>{notification.title}</strong><span>{notification.message}</span><small>{relativeTime(notification.created_at)}</small></span>{!notification.is_read && <i aria-label="Unread" />}</button>)}</div> : <div className="notification-state"><Bell size={22} /><div><h3>No notifications yet</h3><p>You are all caught up.</p></div></div>}</section>
}
