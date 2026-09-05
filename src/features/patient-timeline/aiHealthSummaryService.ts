import { supabase } from '../../lib/supabase'

export type AiHealthSummaryEvent = { date: string | null; title: string; summary: string }
export type AiHealthSummary = { hasRecords: boolean; overview: string | null; keyEvents: AiHealthSummaryEvent[]; patterns: string[]; followUpTopics: string[]; limitations: string[]; generatedAt: string | null }

export async function generateAiHealthSummary(): Promise<AiHealthSummary> {
  if (!supabase) throw new Error('Supabase is not configured yet.')
  const { data, error } = await supabase.functions.invoke('ai-health-summary')
  if (error) { const detail = error.context instanceof Response ? await error.context.json().catch(() => null) as { error?: string } | null : null; throw new Error(detail?.error || error.message || 'PreScribe AI is unavailable.') }
  if (!data || typeof data.hasRecords !== 'boolean' || !Array.isArray(data.keyEvents) || !Array.isArray(data.patterns) || !Array.isArray(data.followUpTopics) || !Array.isArray(data.limitations)) throw new Error('PreScribe AI returned an invalid health summary.')
  return data as AiHealthSummary
}
