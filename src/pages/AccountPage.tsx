import { CalendarDays, Camera, CheckCircle2, KeyRound, LockKeyhole, Pencil, ShieldCheck, UserRound } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { supabase } from '../lib/supabase'
import { ProfileAvatar } from '../components/ui/ProfileAvatar'

type AccountPageMode = 'profile' | 'settings' | 'privacy'

function formatDate(value: string) { return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(value)) }

function AccountDetails() {
  const { profile } = useAuth()
  if (!profile) return null
  return <dl className="account-details"><div><dt>Full name</dt><dd>{profile.full_name}</dd></div><div><dt>Email</dt><dd>{profile.email}</dd></div><div><dt>PreScribe ID</dt><dd>{profile.prescribe_id ?? 'Being prepared'}</dd></div><div><dt>Role</dt><dd className="role-value">{profile.role}</dd></div></dl>
}

function EditProfileForm() {
  const { profile, updateProfileName } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  useEffect(() => setFullName(profile?.full_name ?? ''), [profile?.full_name])

  const submit = async (event: FormEvent) => { event.preventDefault(); setMessage(null); setError(null); setSaving(true); const result = await updateProfileName(fullName); setSaving(false); if (result.error) { setError(result.error); return }; setMessage('Your profile has been updated.'); setEditing(false) }
  if (!profile) return null
  return <section className="account-panel" aria-labelledby="profile-information"><div className="account-panel-heading"><div><p className="section-kicker">Profile information</p><h3 id="profile-information">Your personal details</h3></div>{!editing && <button className="account-secondary-button" type="button" onClick={() => setEditing(true)}><Pencil size={15} />Edit profile</button>}</div>{editing ? <form className="account-form" onSubmit={submit}><label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required /></label><p className="account-field-note">Your PreScribe ID and role are assigned to your account and cannot be changed.</p>{error && <p className="form-message error" role="alert">{error}</p>}{message && <p className="form-message success" role="status">{message}</p>}<div className="account-form-actions"><button className="account-secondary-button" type="button" onClick={() => { setFullName(profile.full_name); setEditing(false); setError(null) }}>Cancel</button><button className="account-primary-button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div></form> : <AccountDetails />}</section>
}

function ProfilePhotoUploader() {
  const { profile, user, updateProfileAvatar } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const upload = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; event.target.value = ''; setMessage(null); setError(null); if (!file || !profile || !user || !supabase) return; const extension = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : null; if (!extension) { setError('Choose a JPG, PNG, or WebP image.'); return }; if (file.size > 5 * 1024 * 1024) { setError('Choose an image smaller than 5 MB.'); return }; setUploading(true); const path = `${user.id}/avatar-${crypto.randomUUID()}.${extension}`; const { error: uploadError } = await supabase.storage.from('profile-avatars').upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type }); if (uploadError) { setUploading(false); setError('We could not upload your photo. Please try again.'); return }; const previousPath = profile.avatar_path; const result = await updateProfileAvatar(path); if (result.error) { await supabase.storage.from('profile-avatars').remove([path]); setUploading(false); setError(result.error); return }; if (previousPath) await supabase.storage.from('profile-avatars').remove([previousPath]); setUploading(false); setMessage('Your profile photo has been updated.') }
  return <div className="profile-photo-control"><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void upload(event)} tabIndex={-1} aria-hidden="true" /><button className="account-secondary-button" type="button" onClick={() => inputRef.current?.click()} disabled={uploading}><Camera size={15} />{uploading ? 'Uploading…' : 'Upload photo'}</button><span>JPG, PNG, or WebP · up to 5 MB</span>{error && <p className="form-message error" role="alert">{error}</p>}{message && <p className="form-message success" role="status">{message}</p>}</div>
}

function PasswordForm() {
  const { profile } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(null); setMessage(null); if (newPassword.length < 8) { setError('Use a new password with at least 8 characters.'); return }; if (newPassword !== confirmation) { setError('Your new password and confirmation do not match.'); return }; if (!supabase || !profile) { setError('Secure password changes are unavailable right now. Please try again later.'); return }; setSaving(true); const { error: verificationError } = await supabase.auth.signInWithPassword({ email: profile.email, password: currentPassword }); if (verificationError) { setSaving(false); setError('Your current password could not be verified.'); return }; const { error: updateError } = await supabase.auth.updateUser({ password: newPassword }); setSaving(false); if (updateError) { setError('We could not update your password. Please try again.'); return }; setCurrentPassword(''); setNewPassword(''); setConfirmation(''); setMessage('Your password has been changed successfully.') }
  return <section className="account-panel" aria-labelledby="password-account"><div className="account-panel-heading"><div><p className="section-kicker">Password &amp; account</p><h3 id="password-account">Change password</h3></div><KeyRound size={20} /></div><p className="account-panel-description">For your security, verify your current password before choosing a new one.</p><form className="account-form password-form" onSubmit={submit}><label>Current password<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required /></label><label>New password<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={8} required /></label><label>Confirm new password<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" minLength={8} required /></label><p className="account-field-note">Use at least 8 characters. Passwords are never stored in your profile.</p>{error && <p className="form-message error" role="alert">{error}</p>}{message && <p className="form-message success" role="status">{message}</p>}<div className="account-form-actions"><button className="account-primary-button" type="submit" disabled={saving}>{saving ? 'Updating…' : 'Change password'}</button></div></form></section>
}

export function AccountPage({ mode }: { mode: AccountPageMode }) {
  const { profile } = useAuth()
  if (!profile) return null
  const basePath = `/${profile.role}`
  const isProfile = mode === 'profile'
  const isSettings = mode === 'settings'
  const title = isProfile ? 'My profile' : isSettings ? 'Account settings' : 'Privacy & security'
  const description = isProfile ? 'Review and manage the personal details attached to your PreScribe account.' : isSettings ? 'Manage your account information and sign-in security.' : 'Understand how your account and health information are protected in PreScribe.'

  return <div className="account-page"><header className="account-page-header"><div><p className="dashboard-date">Account</p><h2>{title}</h2><p>{description}</p></div></header>{isProfile && <><section className="account-hero"><ProfileAvatar profile={profile} className="account-hero-avatar" /><div><h3>{profile.full_name}</h3><p>{profile.email}</p><span>{profile.role} · {profile.prescribe_id ?? 'PreScribe ID pending'}</span><ProfilePhotoUploader /></div></section><EditProfileForm /><section className="account-panel account-created"><CalendarDays size={19} /><div><p className="section-kicker">Account created</p><strong>{formatDate(profile.created_at)}</strong></div></section></>}{isSettings && <><section className="account-panel"><div className="account-panel-heading"><div><p className="section-kicker">Account information</p><h3>Your PreScribe account</h3></div><UserRound size={20} /></div><AccountDetails /></section><section className="account-panel"><div className="account-panel-heading"><div><p className="section-kicker">Account preferences</p><h3>Notifications</h3></div></div><p className="account-panel-description">No account-level notification preferences are configured in PreScribe yet. Existing notification behavior remains unchanged.</p></section><PasswordForm /><section className="account-panel account-link-panel"><ShieldCheck size={20} /><div><h3>Privacy &amp; security</h3><p>Review how your account and health information are protected.</p></div><Link className="account-secondary-button" to={`${basePath}/privacy-security`}>Review privacy</Link></section></>}{mode === 'privacy' && <><section className="account-panel privacy-panel"><div className="account-panel-heading"><div><p className="section-kicker">Security</p><h3>Keep your account protected</h3></div><LockKeyhole size={20} /></div><p className="account-panel-description">Use a unique password and keep your sign-in details private. You can change your password whenever you need to.</p><Link className="account-secondary-button" to={`${basePath}/settings`}>Change password</Link></section><section className="account-panel privacy-panel"><div className="account-panel-heading"><div><p className="section-kicker">Privacy</p><h3>Your health information</h3></div><ShieldCheck size={20} /></div><ul className="privacy-list"><li><CheckCircle2 size={16} />Your profile and health information are available only to your authenticated account, subject to the app’s existing access controls.</li><li><CheckCircle2 size={16} />Health records are protected by the access rules configured for PreScribe.</li><li><CheckCircle2 size={16} />AI features help organize information for clinical review and are not a replacement for professional medical care.</li></ul></section><section className="account-panel privacy-panel"><div><p className="section-kicker">Account</p><h3>Account deletion</h3><p className="account-panel-description">Account deletion requires a secure, verified backend workflow to protect your health information. It is not available from this portal.</p></div></section></>}</div>
}
