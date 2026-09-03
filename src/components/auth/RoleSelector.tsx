import { Stethoscope, UserRound } from 'lucide-react'

export type Role = 'patient' | 'doctor'

export function RoleSelector({ role, onChange }: { role: Role; onChange: (role: Role) => void }) {
  return <div className="role-selector" role="tablist" aria-label="Choose your portal">
    <button className={role === 'patient' ? 'role selected' : 'role'} onClick={() => onChange('patient')} role="tab" aria-selected={role === 'patient'}>
      <span className="role-icon"><UserRound size={18} /></span><span><b>Patient</b><small>Your care space</small></span>
    </button>
    <button className={role === 'doctor' ? 'role selected doctor-role' : 'role doctor-role'} onClick={() => onChange('doctor')} role="tab" aria-selected={role === 'doctor'}>
      <span className="role-icon"><Stethoscope size={18} /></span><span><b>Doctor</b><small>Clinical workspace</small></span>
    </button>
  </div>
}
