import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
const emptySummary = { hasRecords: false, overview: null, keyEvents: [], patterns: [], followUpTopics: [], limitations: ['There are currently no health records available to summarize.'], generatedAt: null }
const schema = { type: 'object', additionalProperties: false, required: ['hasRecords', 'overview', 'keyEvents', 'patterns', 'followUpTopics', 'limitations', 'generatedAt'], properties: { hasRecords: { type: 'boolean' }, overview: { type: ['string', 'null'] }, keyEvents: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['date', 'title', 'summary'], properties: { date: { type: ['string', 'null'] }, title: { type: 'string' }, summary: { type: 'string' } } } }, patterns: { type: 'array', items: { type: 'string' } }, followUpTopics: { type: 'array', items: { type: 'string' } }, limitations: { type: 'array', items: { type: 'string' } }, generatedAt: { type: ['string', 'null'] } } }
const instructions = `You are PreScribe AI, an informational health-record organization assistant. Summarize ONLY the supplied health records for clinical review. Do not invent diagnoses, symptoms, treatments, medications, dates, providers, facilities, or events. Do not claim certainty where the records are incomplete. Do not provide emergency triage, prescribe medication, or replace professional medical advice. If you mention a pattern, it must be directly supported by the supplied records. Frame follow-up topics as questions or topics to discuss with a healthcare professional, never as recommendations or diagnoses. Clearly state relevant information gaps in limitations. The summary is informational and organizational only.`

type RecordForSummary = { record_type: string; title: string; event_date: string; description: string | null; provider_name: string | null; facility_name: string | null }

function isStringOrNull(value: unknown) { return value === null || typeof value === 'string' }
function isSummary(value: unknown): value is Record<string, unknown> { if (!value || typeof value !== 'object') return false; const summary = value as Record<string, unknown>; return typeof summary.hasRecords === 'boolean' && isStringOrNull(summary.overview) && Array.isArray(summary.keyEvents) && summary.keyEvents.every((event) => event && typeof event === 'object' && isStringOrNull((event as Record<string, unknown>).date) && typeof (event as Record<string, unknown>).title === 'string' && typeof (event as Record<string, unknown>).summary === 'string') && Array.isArray(summary.patterns) && summary.patterns.every((item) => typeof item === 'string') && Array.isArray(summary.followUpTopics) && summary.followUpTopics.every((item) => typeof item === 'string') && Array.isArray(summary.limitations) && summary.limitations.every((item) => typeof item === 'string') && isStringOrNull(summary.generatedAt) }

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const authorization = request.headers.get('Authorization')
    if (!authorization) return Response.json({ error: 'Authentication is required.' }, { status: 401, headers: corsHeaders })
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } })
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return Response.json({ error: 'Authentication is required.' }, { status: 401, headers: corsHeaders })
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (profileError) { console.error('Unable to verify patient role', profileError); return Response.json({ error: 'Unable to verify your portal access.' }, { status: 500, headers: corsHeaders }) }
    if (profile?.role !== 'patient') return Response.json({ error: 'Only patient accounts can generate a health summary.' }, { status: 403, headers: corsHeaders })
    const { data: records, error: recordsError } = await supabase.from('health_records').select('record_type, title, event_date, description, provider_name, facility_name').eq('patient_id', user.id).order('event_date', { ascending: true })
    if (recordsError) { console.error('Unable to load health records for AI summary', recordsError); return Response.json({ error: 'Unable to load your health records for a summary.' }, { status: 500, headers: corsHeaders }) }
    const healthRecords = (records ?? []) as RecordForSummary[]
    if (!healthRecords.length) return Response.json(emptySummary, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) return Response.json({ error: 'PreScribe AI is not configured. Add GEMINI_API_KEY to the Edge Function secrets.' }, { status: 503, headers: corsHeaders })
    const configuredModel = Deno.env.get('GEMINI_MODEL')?.trim() || 'gemini-3.6-flash'
    const model = configuredModel.replace(/^models\//, '')
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    const geminiRequest = { systemInstruction: { parts: [{ text: instructions }] }, contents: [{ role: 'user', parts: [{ text: `Create a concise structured health timeline summary using only these chronological records: ${JSON.stringify(healthRecords)}` }] }], generationConfig: { responseFormat: { text: { mimeType: 'APPLICATION_JSON', schema } } } }
    const geminiResponse = await fetch(endpoint, { method: 'POST', headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify(geminiRequest) })
    if (!geminiResponse.ok) { const providerBody = await geminiResponse.text(); console.error('Gemini health-summary provider error', { status: geminiResponse.status, statusText: geminiResponse.statusText, body: providerBody }); return Response.json({ error: 'The AI provider could not complete this summary.' }, { status: 502, headers: corsHeaders }) }
    const result = await geminiResponse.json(); const text = result?.candidates?.[0]?.content?.parts?.find((part: { text?: unknown }) => typeof part.text === 'string')?.text
    if (typeof text !== 'string') { console.error('Gemini health-summary response missing structured text'); return Response.json({ error: 'The AI provider returned an invalid summary.' }, { status: 502, headers: corsHeaders }) }
    let parsed: unknown; try { parsed = JSON.parse(text) } catch { console.error('Gemini health-summary returned invalid JSON'); return Response.json({ error: 'The AI provider returned an invalid summary.' }, { status: 502, headers: corsHeaders }) }
    if (!isSummary(parsed)) { console.error('Gemini health-summary response failed validation'); return Response.json({ error: 'The AI provider returned an invalid summary.' }, { status: 502, headers: corsHeaders }) }
    return Response.json({ ...parsed, hasRecords: true, generatedAt: new Date().toISOString() }, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) { console.error('Unable to process AI health summary', error); return Response.json({ error: 'Unable to process AI Health Summary.' }, { status: 500, headers: corsHeaders }) }
})
