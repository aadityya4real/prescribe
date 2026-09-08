import { supabase } from '../../lib/supabase'
import type { AppNotification } from './types'

function client() { if (!supabase) throw new Error('Supabase is not configured yet.'); return supabase }
const fields = 'id, type, title, message, link, is_read, created_at'

export async function fetchNotifications(): Promise<AppNotification[]> { const { data, error } = await client().from('notifications').select(fields).order('created_at', { ascending: false }).limit(50); if (error) throw new Error(`Unable to load notifications: ${error.message}`); return (data ?? []) as AppNotification[] }
export async function fetchUnreadNotificationCount(): Promise<number> { const { count, error } = await client().from('notifications').select('id', { count: 'exact', head: true }).eq('is_read', false); if (error) throw new Error(`Unable to load notification count: ${error.message}`); return count ?? 0 }
export async function markNotificationRead(id: string) { const { error } = await client().from('notifications').update({ is_read: true }).eq('id', id); if (error) throw new Error(`Unable to update notification: ${error.message}`) }
export async function markAllNotificationsRead() { const { error } = await client().from('notifications').update({ is_read: true }).eq('is_read', false); if (error) throw new Error(`Unable to update notifications: ${error.message}`) }
