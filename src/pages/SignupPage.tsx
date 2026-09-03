import { ArrowLeft, Stethoscope, UserRound } from 'lucide-react'
import type { Role } from '../components/auth/RoleSelector'
import { PreScribeMark } from '../components/ui/PreScribeMark'

export function SignupPage({ role }: { role: Role }) {
  const isDoctor = role === 'doctor'
  return <main className={`signup-page ${role}-mode`}><div className="signup-card"><PreScribeMark /><a className="back-link" href="/"><ArrowLeft size={16} /> Back to sign in</a><div className="signup-icon">{isDoctor ? <Stethoscope size={26} /> : <UserRound size={26} />}</div><p className="portal-label">{isDoctor ? 'Doctor portal' : 'Patient portal'}</p><h1>Create your account</h1><p>{isDoctor ? 'Set up your secure clinical workspace.' : 'Start a more connected health journey.'}</p><button className="primary-button" type="button">Coming soon</button></div></main>
}
