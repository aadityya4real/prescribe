import { Activity, HeartPulse, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { Role, RoleSelector } from '../components/auth/RoleSelector'
import { PreScribeMark } from '../components/ui/PreScribeMark'

export function LoginPage() {
  const [role, setRole] = useState<Role>('patient')
  return <main className={`app-shell ${role}-mode`}>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <section className="welcome-panel">
      <PreScribeMark />
      <div className="welcome-copy"><span className="eyebrow">INTELLIGENT CARE, MADE PERSONAL</span><h2>Healthcare that<br /><em>understands</em> you.</h2><p>PreScribe brings clarity, connection, and intelligence to every step of your health journey.</p></div>
      <div className="trust-row"><span><HeartPulse size={18} />Human-centered</span><span><LockKeyhole size={17} />Private by design</span><span><Activity size={17} />Always connected</span></div>
    </section>
    <section className="auth-panel"><div className="mobile-brand"><PreScribeMark /></div><div className="auth-content"><header className="auth-heading"><p>Your secure space for better health</p><RoleSelector role={role} onChange={setRole} /></header><LoginForm role={role} /></div><footer>© 2026 PreScribe Health <span>•</span> Built around you</footer></section>
  </main>
}
