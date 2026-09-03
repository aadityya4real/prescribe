import { Bell } from 'lucide-react'
import type { Role } from '../auth/RoleSelector'

export function Topbar({ role }: { role: Role }) {
  const name = role === 'doctor' ? 'Dr. Ananya Sharma' : 'Aarav Mehta'
  const greetingName = role === 'doctor' ? 'Ananya' : 'Aarav'
  return <header className="portal-topbar"><div><p className="eyebrow">{role} portal</p><h1>Good morning, {greetingName}.</h1></div><div className="topbar-actions"><button className="notification-button" type="button" aria-label="Notifications"><Bell size={19} /><span /></button><button className="profile-button" type="button" aria-label="Open profile"><span className="profile-avatar">{role === 'doctor' ? 'AS' : 'AM'}</span><span>{name}</span></button></div></header>
}
