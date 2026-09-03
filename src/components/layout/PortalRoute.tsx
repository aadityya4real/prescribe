import { Outlet } from 'react-router-dom'
import type { Role } from '../auth/RoleSelector'
import { AppShell } from './AppShell'

export function PortalRoute({ role }: { role: Role }) {
  // Authentication will be enforced here when session handling is introduced.
  return <AppShell role={role}><Outlet /></AppShell>
}
