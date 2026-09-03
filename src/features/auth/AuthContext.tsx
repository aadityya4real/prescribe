import type { Session, User } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Role } from '../../components/auth/RoleSelector'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'

export type Profile = { id: string; email: string; role: Role; full_name: string; prescribe_id: string | null; created_at: string }
type AuthResult = { error?: string; requiresEmailConfirmation?: boolean; role?: Role }
type SignUpInput = { fullName: string; email: string; password: string; role: Role }
type AuthContextValue = { user: User | null; session: Session | null; profile: Profile | null; role: Role | null; loading: boolean; isConfigured: boolean; signIn: (email: string, password: string) => Promise<AuthResult>; signUp: (input: SignUpInput) => Promise<AuthResult>; signOut: () => Promise<AuthResult>; refreshProfile: () => Promise<void> }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function userMetadataRole(user: User | null): Role | null {
  const value = user?.user_metadata.role
  return value === 'patient' || value === 'doctor' ? value : null
}

function profileFromRecord(record: unknown): Profile | null {
  if (!record || typeof record !== 'object') return null
  const candidate = record as Record<string, unknown>
  if (typeof candidate.id !== 'string' || typeof candidate.email !== 'string' || (candidate.role !== 'patient' && candidate.role !== 'doctor') || typeof candidate.full_name !== 'string' || typeof candidate.created_at !== 'string') return null
  return { id: candidate.id, email: candidate.email, role: candidate.role, full_name: candidate.full_name, prescribe_id: typeof candidate.prescribe_id === 'string' ? candidate.prescribe_id : null, created_at: candidate.created_at }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) { setProfile(null); return }
    const { data } = await supabase.from('profiles').select('id, email, role, full_name, prescribe_id, created_at').eq('id', user.id).maybeSingle()
    setProfile(profileFromRecord(data))
  }, [user])

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    const client = supabase
    let active = true
    const initialize = async () => {
      const { data } = await client.auth.getSession()
      if (!active) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) await refreshProfile()
      if (active) setLoading(false)
    }
    void initialize()
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setProfile(null)
      setLoading(false)
    })
    return () => { active = false; listener.subscription.unsubscribe() }
  }, [refreshProfile])

  useEffect(() => { if (user) void refreshProfile() }, [user, refreshProfile])

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Supabase is not configured yet. Add the required environment variables to continue.' }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    setSession(data.session); setUser(data.user)
    const { data: profileData } = await supabase.from('profiles').select('id, email, role, full_name, prescribe_id, created_at').eq('id', data.user.id).maybeSingle()
    const signedInProfile = profileFromRecord(profileData)
    setProfile(signedInProfile)
    const signedInRole = signedInProfile?.role ?? userMetadataRole(data.user)
    if (!signedInRole) return { error: 'Your account does not have a portal role assigned. Contact your administrator.' }
    return { role: signedInRole }
  }

  const signUp = async ({ fullName, email, password, role }: SignUpInput): Promise<AuthResult> => {
    if (!supabase) return { error: 'Supabase is not configured yet. Add the required environment variables to continue.' }
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role } } })
    if (error || !data.user) return { error: error?.message ?? 'Unable to create your account.' }
    const { error: profileError } = await supabase.from('profiles').upsert({ id: data.user.id, email, role, full_name: fullName }, { onConflict: 'id' })
    if (profileError) return { error: 'Your account was created, but the profile could not be prepared. Check the profiles table and its RLS policies.' }
    return { requiresEmailConfirmation: !data.session }
  }

  const signOut = async (): Promise<AuthResult> => {
    if (!supabase) return {}
    const { error } = await supabase.auth.signOut()
    if (error) return { error: error.message }
    setUser(null); setSession(null); setProfile(null)
    return {}
  }

  const value = useMemo<AuthContextValue>(() => ({ user, session, profile, role: profile?.role ?? userMetadataRole(user), loading, isConfigured: isSupabaseConfigured, signIn, signUp, signOut, refreshProfile }), [user, session, profile, loading, refreshProfile])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
