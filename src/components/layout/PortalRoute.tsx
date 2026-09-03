import { Navigate, Outlet } from 'react-router-dom'
import type { Role } from '../auth/RoleSelector'
import { useAuth } from '../../features/auth/AuthContext'
import { AppShell } from './AppShell'

export function PortalRoute({ role }: { role: Role }) {
  const { user, role: authenticatedRole, loading } = useAuth()
  if (loading) return <main className="auth-loading"><span /><p>Loading your secure workspace…</p></main>
  if (!user) return <Navigate to="/" replace />
  if (authenticatedRole && authenticatedRole !== role) return <Navigate to={`/${authenticatedRole}/dashboard`} replace />
  if (!authenticatedRole) return <Navigate to="/" replace />
  return <AppShell role={role}><Outlet /></AppShell>
}
