import { Navigate, Outlet } from 'react-router-dom'
import type { Role } from '../auth/RoleSelector'
import { useAuth } from '../../features/auth/AuthContext'
import { AppShell } from './AppShell'

export function PortalRoute({ role }: { role: Role }) {
  const { user, profile, profileError, role: authenticatedRole, loading, refreshProfile } = useAuth()
  if (loading) return <main className="auth-loading"><span /><p>Loading your secure workspace…</p></main>
  if (!user) return <Navigate to="/" replace />
  if (profileError) return <main className="auth-loading"><p>We could not load your PreScribe profile. Your session is still active.</p><button className="logout-button" type="button" onClick={() => void refreshProfile()}>Try again</button></main>
  if (authenticatedRole && authenticatedRole !== role) return <Navigate to={`/${authenticatedRole}/dashboard`} replace />
  if (!profile || !authenticatedRole) return <main className="auth-loading"><p>Preparing your PreScribe profile…</p></main>
  return <AppShell role={role}><Outlet /></AppShell>
}
