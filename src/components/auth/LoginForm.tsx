import { Apple, ArrowRight, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { FormEvent, useState } from 'react'
import type { Role } from './RoleSelector'

const copy = { patient: { label: 'Patient portal', title: 'Welcome back', description: 'Continue your health journey with confidence.' }, doctor: { label: 'Doctor portal', title: 'Welcome back', description: 'Access your secure clinical workspace.' } }

export function LoginForm({ role }: { role: Role }) {
  const [visible, setVisible] = useState(false)
  const content = copy[role]
  const submit = (event: FormEvent) => { event.preventDefault() }
  return <section className="auth-card" aria-live="polite">
    <div className="portal-label"><span className="live-dot" />{content.label}</div>
    <h1>{content.title}</h1><p className="intro">{content.description}</p>
    <form onSubmit={submit}>
      <label>Email or mobile number<span className="field"><Mail size={17} /><input type="text" placeholder="you@example.com" autoComplete="username" /></span></label>
      <label>Password<span className="field"><KeyRound size={17} /><input type={visible ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" /><button type="button" className="icon-button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
      <div className="form-options"><label className="checkbox"><input type="checkbox" /> <span>Remember me</span></label><a href="#forgot">Forgot password?</a></div>
      <button className="primary-button" type="submit">Sign in <ArrowRight size={18} /></button>
    </form>
    <div className="divider"><span>or continue with</span></div>
    <div className="socials"><button type="button" className="social-button"><span className="google">G</span>Google</button><button type="button" className="social-button"><Apple size={18} />Apple</button></div>
    <p className="signup-copy">New to PreScribe? <a href={`/signup/${role}`}>Create {role === 'patient' ? 'patient' : 'doctor'} account</a></p>
    <p className="privacy-note"><ShieldCheck size={15} /> Your information is protected and private.</p>
  </section>
}
