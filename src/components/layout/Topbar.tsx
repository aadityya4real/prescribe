import { Bell } from 'lucide-react'
import type { Role } from '../auth/RoleSelector'
import { useAuth } from '../../features/auth/AuthContext'
import { PreScribeMark } from '../ui/PreScribeMark'

export function Topbar({ role }: { role: Role }) {
  const { profile } = useAuth()
  const name = profile?.full_name ?? ''
  const initials = name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2) || 'PS'
  const portalName = role === 'patient' ? 'Patient Portal' : 'Doctor Portal'

  return <header className="portal-topbar"><div className="portal-brand-block"><PreScribeMark /><p>{portalName}</p></div><div className="topbar-actions"><button className="notification-button" type="button" aria-label="Notifications"><Bell size={19} /><span /></button><button className="profile-button" type="button" aria-label={name ? `Open profile for ${name}` : 'Open profile'}><span className="profile-avatar">{initials}</span></button></div></header>
}
