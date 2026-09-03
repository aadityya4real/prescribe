import { ArrowRight, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Role } from './RoleSelector'
import { useAuth } from '../../features/auth/AuthContext'

const copy = { patient: { label: 'Patient portal', title: 'Welcome back', description: 'Continue your health journey with confidence.' }, doctor: { label: 'Doctor portal', title: 'Welcome back', description: 'Access your secure clinical workspace.' } }

export function LoginForm({ role }: { role: Role }) {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const content = copy[role]
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(null)
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email address.'); return }
    if (!password) { setError('Enter your password.'); return }
    setSubmitting(true)
    const result = await signIn(email, password)
    setSubmitting(false)
    if (result.error) { setError(result.error); return }
    navigate(`/${result.role}/dashboard`)
  }
  return <section className="auth-card" aria-live="polite">
    <div className="portal-label"><span className="live-dot" />{content.label}</div>
    <h1>{content.title}</h1><p className="intro">{content.description}</p>
    <form onSubmit={submit}>
      <label>Email<span className="field"><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></span></label>
      <label>Password<span className="field"><KeyRound size={17} /><input type={visible ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" /><button type="button" className="icon-button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
      <div className="form-options"><label className="checkbox"><input type="checkbox" /> <span>Remember me</span></label><a href="#forgot">Forgot password?</a></div>
      {error && <p className="form-message error" role="alert">{error}</p>}
      {!isConfigured && <p className="form-message">Authentication is awaiting secure Supabase configuration.</p>}
      <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={18} /></button>
    </form>
    <p className="signup-copy">New to PreScribe? <Link to={`/signup/${role}`}>Create {role === 'patient' ? 'patient' : 'doctor'} account</Link></p>
    <p className="privacy-note"><ShieldCheck size={15} /> Your information is protected and private.</p>
  </section>
}
