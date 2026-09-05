import type { Session, User } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Role } from '../../components/auth/RoleSelector'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'

export type Profile = { id: string; email: string; role: Role; full_name: string; prescribe_id: string | null; created_at: string }
type AuthResult = { error?: string; requiresEmailConfirmation?: boolean; role?: Role }
type SignUpInput = { fullName: string; email: string; password: string; role: Role }
type AuthContextValue = { user: User | null; session: Session | null; profile: Profile | null; profileError: string | null; role: Role | null; loading: boolean; isConfigured: boolean; signIn: (email: string, password: string) => Promise<AuthResult>; signUp: (input: SignUpInput) => Promise<AuthResult>; signOut: () => Promise<AuthResult>; refreshProfile: () => Promise<void> }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function metadataRole(user: User): Role | null { const role = user.user_metadata.role; return role === 'patient' || role === 'doctor' ? role : null }
function generatePreScribeId(role: Role) { const bytes = crypto.getRandomValues(new Uint8Array(4)); const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase(); return `${role === 'patient' ? 'PAT' : 'DOC'}-${suffix}` }
function profileFromRecord(record: unknown): Profile | null { if (!record || typeof record !== 'object') return null; const value = record as Record<string, unknown>; if (typeof value.id !== 'string' || typeof value.email !== 'string' || (value.role !== 'patient' && value.role !== 'doctor') || typeof value.full_name !== 'string' || typeof value.created_at !== 'string') return null; return { id: value.id, email: value.email, role: value.role, full_name: value.full_name, prescribe_id: typeof value.prescribe_id === 'string' ? value.prescribe_id : null, created_at: value.created_at } }
function profileInput(user: User) { const role = metadataRole(user); const fullName = typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name.trim() : ''; const prescribeId = typeof user.user_metadata.prescribe_id === 'string' ? user.user_metadata.prescribe_id : undefined; if (!role || !fullName || !user.email) return { error: 'Your account is missing the profile information required to open a portal.' } as const; return { value: { id: user.id, email: user.email, role, full_name: fullName, prescribe_id: prescribeId ?? generatePreScribeId(role) } } as const }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [session, setSession] = useState<Session | null>(null); const [profile, setProfile] = useState<Profile | null>(null); const [profileError, setProfileError] = useState<string | null>(null); const [loading, setLoading] = useState(true)
  const activeUserId = useRef<string | null>(null)
  const profileRef = useRef<Profile | null>(null)
  const profileLoadUserId = useRef<string | null>(null)
  const provisionProfile = useCallback(async (authenticatedUser: User): Promise<Profile> => {
    if (!supabase) throw new Error('Supabase is not configured yet.')
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session || sessionData.session.user.id !== authenticatedUser.id) throw new Error('Your account was created, but profile setup will continue after you sign in with an active session.')
    const input = profileInput(authenticatedUser); if ('error' in input) throw new Error(input.error)
    const { data, error } = await supabase.from('profiles').upsert(input.value, { onConflict: 'id' }).select('id, email, role, full_name, prescribe_id, created_at').single()
    if (error) throw new Error(`Your account is ready, but we could not complete the profile: ${error.message}`)
    const provisionedProfile = profileFromRecord(data); if (!provisionedProfile) throw new Error('Your account is ready, but the profile response was incomplete.')
    return provisionedProfile
  }, [])
  const loadProfile = useCallback(async (authenticatedUser: User): Promise<Profile | null> => {
    if (!supabase) return null
    const { data, error } = await supabase.from('profiles').select('id, email, role, full_name, prescribe_id, created_at').eq('id', authenticatedUser.id).maybeSingle()
    if (error) throw new Error(`Unable to load your profile: ${error.message}`)
    return profileFromRecord(data) ?? provisionProfile(authenticatedUser)
  }, [provisionProfile])
  const syncSession = useCallback(async (nextSession: Session | null) => {
    const nextUser = nextSession?.user ?? null
    const isSameUser = Boolean(nextUser && activeUserId.current === nextUser.id)
    setSession(nextSession); setUser(nextUser)
    if (!nextUser) { activeUserId.current = null; profileRef.current = null; profileLoadUserId.current = null; setProfile(null); setProfileError(null); setLoading(false); return }
    if (isSameUser && (profileRef.current || profileLoadUserId.current === nextUser.id)) return
    activeUserId.current = nextUser.id; profileRef.current = null; profileLoadUserId.current = nextUser.id; setProfile(null); setProfileError(null); setLoading(true)
    try { const nextProfile = await loadProfile(nextUser); if (activeUserId.current === nextUser.id) { profileRef.current = nextProfile; setProfile(nextProfile); setProfileError(null) } } catch (error) { if (activeUserId.current === nextUser.id) setProfileError(error instanceof Error ? error.message : 'Unable to load your profile.') } finally { if (profileLoadUserId.current === nextUser.id) profileLoadUserId.current = null; if (activeUserId.current === nextUser.id) setLoading(false) }
  }, [loadProfile])
  useEffect(() => { if (!supabase) { setLoading(false); return }; const client = supabase; let active = true; void client.auth.getSession().then(({ data }) => { if (active) void syncSession(data.session) }).catch((error: unknown) => { if (active) { setProfileError(error instanceof Error ? error.message : 'Unable to restore your session.'); setLoading(false) } }); const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => { if (!active) return; if (_event === 'TOKEN_REFRESHED' && nextSession?.user.id === activeUserId.current) { setSession(nextSession); setUser(nextSession.user); return }; void syncSession(nextSession) }); return () => { active = false; listener.subscription.unsubscribe() } }, [syncSession])
  const refreshProfile = useCallback(async () => { if (!user) { setProfile(null); setProfileError(null); return }; setLoading(true); try { const nextProfile = await loadProfile(user); if (activeUserId.current === user.id) { profileRef.current = nextProfile; setProfile(nextProfile); setProfileError(null) } } catch (error) { if (activeUserId.current === user.id) setProfileError(error instanceof Error ? error.message : 'Unable to load your profile.') } finally { if (activeUserId.current === user.id) setLoading(false) } }, [user, loadProfile])
  const signIn = async (email: string, password: string): Promise<AuthResult> => { if (!supabase) return { error: 'Supabase is not configured yet. Add the required environment variables to continue.' }; const { data, error } = await supabase.auth.signInWithPassword({ email, password }); if (error || !data.user || !data.session) return { error: error?.message ?? 'Unable to sign in.' }; try { const loadedProfile = await loadProfile(data.user); setSession(data.session); setUser(data.user); setProfile(loadedProfile); return loadedProfile ? { role: loadedProfile.role } : { error: 'Your account does not have a portal role assigned.' } } catch (profileError) { return { error: profileError instanceof Error ? profileError.message : 'Unable to prepare your profile.' } } }
  const signUp = async ({ fullName, email, password, role }: SignUpInput): Promise<AuthResult> => { if (!supabase) return { error: 'Supabase is not configured yet. Add the required environment variables to continue.' }; const prescribeId = generatePreScribeId(role); const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role, prescribe_id: prescribeId } } }); if (error || !data.user) return { error: error?.message ?? 'Unable to create your account.' }; if (!data.session) return { requiresEmailConfirmation: true }; try { const provisionedProfile = await provisionProfile(data.user); setSession(data.session); setUser(data.user); setProfile(provisionedProfile); return { role: provisionedProfile.role } } catch (profileError) { return { error: profileError instanceof Error ? profileError.message : 'Your account was created, but the profile could not be completed.' } } }
  const signOut = async (): Promise<AuthResult> => { if (!supabase) return {}; const { error } = await supabase.auth.signOut(); if (error) return { error: error.message }; activeUserId.current = null; profileRef.current = null; profileLoadUserId.current = null; setUser(null); setSession(null); setProfile(null); setProfileError(null); setLoading(false); return {} }
  const value = useMemo<AuthContextValue>(() => ({ user, session, profile, profileError, role: profile?.role ?? null, loading, isConfigured: isSupabaseConfigured, signIn, signUp, signOut, refreshProfile }), [user, session, profile, profileError, loading, refreshProfile])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context }
