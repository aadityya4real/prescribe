import { LogOut, LockKeyhole, Settings, UserRound, Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Role } from '../auth/RoleSelector'
import { useAuth } from '../../features/auth/AuthContext'
import { PreScribeMark } from '../ui/PreScribeMark'
import { ProfileAvatar } from '../ui/ProfileAvatar'
import { useNavigate } from 'react-router-dom'

export function Topbar({ role }: { role: Role }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const name = profile?.full_name ?? ''
  const portalName = role === 'patient' ? 'Patient Portal' : 'Doctor Portal'
  const activeRole = profile?.role ?? role
  const profilePath = `/${activeRole}/profile`

  useEffect(() => { const closeOnOutsideInteraction = (event: MouseEvent) => { if (!accountMenuRef.current?.contains(event.target as Node)) setIsAccountMenuOpen(false) }; const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsAccountMenuOpen(false) }; document.addEventListener('mousedown', closeOnOutsideInteraction); document.addEventListener('keydown', closeOnEscape); return () => { document.removeEventListener('mousedown', closeOnOutsideInteraction); document.removeEventListener('keydown', closeOnEscape) } }, [])
  const goTo = (path: string) => { setIsAccountMenuOpen(false); navigate(path) }
  const handleSignOut = async () => { setIsAccountMenuOpen(false); const result = await signOut(); if (!result.error) navigate('/', { replace: true }) }

  return <header className="portal-topbar"><div className="portal-brand-block"><PreScribeMark /><p>{portalName}</p></div><div className="topbar-actions"><button className="notification-button" type="button" aria-label="Notifications"><Bell size={19} /><span /></button><div className="account-menu-wrap" ref={accountMenuRef}><button className="profile-button" type="button" aria-label={name ? `Open profile for ${name}` : 'Open profile'} aria-haspopup="menu" aria-expanded={isAccountMenuOpen} aria-controls="account-menu" onClick={() => setIsAccountMenuOpen((open) => !open)}><ProfileAvatar profile={profile} className="profile-avatar" /></button>{isAccountMenuOpen && <div className="account-menu" id="account-menu" role="menu" aria-label="Account menu"><div className="account-menu-summary"><ProfileAvatar profile={profile} className="account-menu-avatar" /><div><strong>{name || 'PreScribe member'}</strong><span>{profile?.email}</span><small>{profile?.prescribe_id ?? 'PreScribe ID pending'} · {activeRole}</small></div></div><div className="account-menu-actions"><button type="button" role="menuitem" onClick={() => goTo(profilePath)}><UserRound size={16} />My Profile</button><button type="button" role="menuitem" onClick={() => goTo(`/${activeRole}/settings`)}><Settings size={16} />Account Settings</button><button type="button" role="menuitem" onClick={() => goTo(`/${activeRole}/privacy-security`)}><LockKeyhole size={16} />Privacy &amp; Security</button></div><button className="account-menu-signout" type="button" role="menuitem" onClick={() => void handleSignOut()}><LogOut size={16} />Sign out</button></div>}</div></div></header>
}
