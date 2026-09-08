import { useEffect, useState } from 'react'
import type { Profile } from '../../features/auth/AuthContext'
import { supabase } from '../../lib/supabase'

function initialsFor(name: string) { return name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'PS' }

export function ProfileAvatar({ profile, className }: { profile: Profile | null; className: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const name = profile?.full_name ?? ''

  useEffect(() => { let active = true; setImageUrl(null); if (!profile?.avatar_path || !supabase) return () => { active = false }; void supabase.storage.from('profile-avatars').createSignedUrl(profile.avatar_path, 60 * 60).then(({ data, error }) => { if (active && !error) setImageUrl(data?.signedUrl ?? null) }); return () => { active = false } }, [profile?.avatar_path])

  if (imageUrl) return <img className={className} src={imageUrl} alt={name ? `${name}'s profile` : 'Profile'} />
  return <span className={className} aria-hidden="true">{initialsFor(name)}</span>
}
