export type CaseData = { chiefComplaint: string | null; symptoms: string[]; duration: string | null; onset: string | null; severity: string | null; location: string | null; associatedSymptoms: string[]; relevantMedicalHistory: string | null; currentMedications: string | null; allergies: string | null; additionalNotes: string | null }
export type CaseMessage = { role: 'assistant' | 'user'; content: string }
export type ConversationStatus = 'collecting' | 'ready_for_summary' | 'emergency_warning'
export type CaseTakingResponse = { assistantMessage: string; assistantReply: string; extractedData: CaseData; conversationStatus: ConversationStatus; emergencyWarning: string | null; caseSummary: string | null }
export const emptyCaseData: CaseData = { chiefComplaint: null, symptoms: [], duration: null, onset: null, severity: null, location: null, associatedSymptoms: [], relevantMedicalHistory: null, currentMedications: null, allergies: null, additionalNotes: null }
