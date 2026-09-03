import type { ReactNode } from 'react'
import type { Role } from '../auth/RoleSelector'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

type AppShellProps = { children: ReactNode; role: Role }

export function AppShell({ children, role }: AppShellProps) {
  return <main className="portal-shell"><Sidebar role={role} /><section className="portal-workspace"><Topbar role={role} /><div className="portal-content">{children}</div></section></main>
}
