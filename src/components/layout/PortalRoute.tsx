import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import type { Role } from '../auth/RoleSelector'
import { useAuth } from '../../features/auth/AuthContext'
import { AppShell } from './AppShell'

export function PortalRoute({ role }: { role: Role }) {
  const { user, profile, profileError, role: authenticatedRole, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const handleSignOut = async () => { await signOut(); navigate('/', { replace: true }) }
  if (loading) return <main className="auth-loading"><span /><p>Loading your secure workspace…</p></main>
  if (!user) return <Navigate to="/" replace />
  if (profileError) return <main className="auth-loading"><p>We could not load your PreScribe profile. Please sign out and try again.</p><button className="logout-button" type="button" onClick={handleSignOut}>Sign out</button></main>
  if (authenticatedRole && authenticatedRole !== role) return <Navigate to={`/${authenticatedRole}/dashboard`} replace />
  if (!profile || !authenticatedRole) return <Navigate to="/" replace />
  return <AppShell role={role}><Outlet /></AppShell>
}
