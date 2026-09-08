import { Bell, LockKeyhole, LogOut, Settings, UserRound } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Role } from '../auth/RoleSelector'
import { useAuth } from '../../features/auth/AuthContext'
import { fetchUnreadNotificationCount } from '../../features/notifications/notificationService'
import { PreScribeMark } from '../ui/PreScribeMark'
import { ProfileAvatar } from '../ui/ProfileAvatar'
import { NotificationDropdown } from './NotificationDropdown'

export function Topbar({ role }: { role: Role }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const actionMenusRef = useRef<HTMLDivElement>(null)
  const name = profile?.full_name ?? ''
  const portalName = role === 'patient' ? 'Patient Portal' : 'Doctor Portal'
  const activeRole = profile?.role ?? role
  const profilePath = `/${activeRole}/profile`
  const refreshUnreadCount = useCallback(async () => { try { setUnreadCount(await fetchUnreadNotificationCount()) } catch { setUnreadCount(0) } }, [])

  useEffect(() => { if (profile) void refreshUnreadCount(); else setUnreadCount(0) }, [profile?.id, refreshUnreadCount])
  useEffect(() => { const closeOnOutsideInteraction = (event: MouseEvent) => { if (!actionMenusRef.current?.contains(event.target as Node)) { setIsAccountMenuOpen(false); setIsNotificationMenuOpen(false) } }; const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setIsAccountMenuOpen(false); setIsNotificationMenuOpen(false) } }; document.addEventListener('mousedown', closeOnOutsideInteraction); document.addEventListener('keydown', closeOnEscape); return () => { document.removeEventListener('mousedown', closeOnOutsideInteraction); document.removeEventListener('keydown', closeOnEscape) } }, [])
  const goTo = (path: string) => { setIsAccountMenuOpen(false); navigate(path) }
  const handleSignOut = async () => { setIsAccountMenuOpen(false); const result = await signOut(); if (!result.error) navigate('/', { replace: true }) }
  const toggleNotifications = () => { setIsNotificationMenuOpen((open) => !open); setIsAccountMenuOpen(false); void refreshUnreadCount() }
  const toggleAccountMenu = () => { setIsAccountMenuOpen((open) => !open); setIsNotificationMenuOpen(false) }

  return <header className="portal-topbar"><div className="portal-brand-block"><PreScribeMark /><p>{portalName}</p></div><div className="topbar-actions" ref={actionMenusRef}><div className="notification-menu-wrap"><button className="notification-button" type="button" aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'} aria-haspopup="dialog" aria-expanded={isNotificationMenuOpen} aria-controls="notification-menu" onClick={toggleNotifications}><Bell size={19} />{unreadCount > 0 && <span>{unreadCount > 99 ? '99+' : unreadCount}</span>}</button><NotificationDropdown open={isNotificationMenuOpen} onClose={() => setIsNotificationMenuOpen(false)} onUnreadCountChange={setUnreadCount} /></div><div className="account-menu-wrap"><button className="profile-button" type="button" aria-label={name ? `Open profile for ${name}` : 'Open profile'} aria-haspopup="menu" aria-expanded={isAccountMenuOpen} aria-controls="account-menu" onClick={toggleAccountMenu}><ProfileAvatar profile={profile} className="profile-avatar" /></button>{isAccountMenuOpen && <div className="account-menu" id="account-menu" role="menu" aria-label="Account menu"><div className="account-menu-summary"><ProfileAvatar profile={profile} className="account-menu-avatar" /><div><strong>{name || 'PreScribe member'}</strong><span>{profile?.email}</span><small>{profile?.prescribe_id ?? 'PreScribe ID pending'} · {activeRole}</small></div></div><div className="account-menu-actions"><button type="button" role="menuitem" onClick={() => goTo(profilePath)}><UserRound size={16} />My Profile</button><button type="button" role="menuitem" onClick={() => goTo(`/${activeRole}/settings`)}><Settings size={16} />Account Settings</button><button type="button" role="menuitem" onClick={() => goTo(`/${activeRole}/privacy-security`)}><LockKeyhole size={16} />Privacy &amp; Security</button></div><button className="account-menu-signout" type="button" role="menuitem" onClick={() => void handleSignOut()}><LogOut size={16} />Sign out</button></div>}</div></div></header>
}
