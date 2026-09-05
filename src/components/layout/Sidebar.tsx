import { Bot, CalendarDays, ClipboardList, LayoutDashboard, Pill, Stethoscope, UsersRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { Role } from '../auth/RoleSelector'
import { PreScribeMark } from '../ui/PreScribeMark'

const patientItems = [
  { label: 'Overview', to: '/patient/dashboard', icon: LayoutDashboard },
  { label: 'Timeline', to: '/patient/timeline', icon: ClipboardList },
  { label: 'Care team', to: '/patient/care-team', icon: UsersRound },
  { label: 'Appointments', to: '/patient/appointments', icon: CalendarDays },
  { label: 'Treatments', to: '/patient/treatments', icon: Pill },
  { label: 'AI Assessment', to: '/patient/ai-assessment', icon: Bot },
]
const doctorItems = [
  { label: 'Overview', to: '/doctor/dashboard', icon: LayoutDashboard },
  { label: 'Patients', to: '/doctor/patients', icon: UsersRound },
  { label: 'Schedule', to: '/doctor/schedule', icon: CalendarDays },
]

export function Sidebar({ role }: { role: Role }) {
  const items = role === 'patient' ? patientItems : doctorItems
  return <aside className="portal-sidebar"><PreScribeMark /><div className="portal-identity"><span className="identity-icon">{role === 'doctor' ? <Stethoscope size={16} /> : <ClipboardList size={16} />}</span><span><small>{role} portal</small><b>{role === 'doctor' ? 'Clinical workspace' : 'My health space'}</b></span></div><nav aria-label={`${role} navigation`}>{items.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'portal-nav-link active' : 'portal-nav-link'}><Icon size={18} />{label}</NavLink>)}</nav></aside>
}
