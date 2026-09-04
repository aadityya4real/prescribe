import { Bell, LogOut } from 'lucide-react'
import type { Role } from '../auth/RoleSelector'
import { useAuth } from '../../features/auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export function Topbar({ role }: { role: Role }) {
  const { profile, signOut } = useAuth(); const navigate = useNavigate()
  const name = profile?.full_name ?? ''
  const greetingName = name.split(' ')[0] || 'there'
  const initials = name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2) || 'PS'
  const logout = async () => { await signOut(); navigate('/', { replace: true }) }
  return <header className="portal-topbar"><div><p className="eyebrow">{role} portal</p><h1>Good morning, {greetingName}.</h1></div><div className="topbar-actions"><button className="notification-button" type="button" aria-label="Notifications"><Bell size={19} /><span /></button><button className="profile-button" type="button" aria-label="Open profile"><span className="profile-avatar">{initials}</span><span>{name}</span></button><button className="logout-button" type="button" onClick={logout}><LogOut size={16} />Sign out</button></div></header>
}
