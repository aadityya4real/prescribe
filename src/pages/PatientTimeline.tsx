import { Activity, Bot, ChevronDown, ChevronUp, ClipboardPlus, FileText, FlaskConical, Stethoscope } from 'lucide-react'
import { useMemo, useState } from 'react'
import { patientTimelineEvents, timelineFilters } from '../features/patient-timeline/timelineData'
import type { TimelineEvent, TimelineEventType } from '../features/patient-timeline/types'

const eventVisuals: Record<TimelineEventType, { icon: typeof Stethoscope; className: string }> = {
  Consultation: { icon: Stethoscope, className: 'consultation' },
  Treatment: { icon: Activity, className: 'treatment' },
  'Diagnostic Test': { icon: FlaskConical, className: 'diagnostic' },
  'Health Record': { icon: FileText, className: 'record' },
}

export function PatientTimeline() {
  const [filter, setFilter] = useState<'All Events' | TimelineEventType>('All Events')
  const [summaryOpen, setSummaryOpen] = useState(true)
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)
  const filteredEvents = useMemo(() => filter === 'All Events' ? patientTimelineEvents : patientTimelineEvents.filter((event) => event.type === filter), [filter])
  const eventsByYear = useMemo(() => filteredEvents.reduce<Record<number, TimelineEvent[]>>((groups, event) => ({ ...groups, [event.year]: [...(groups[event.year] ?? []), event] }), {}), [filteredEvents])

  return <div className="timeline-page">
    <header className="timeline-header"><div><p className="dashboard-date">Your care journey</p><h2>Health timeline</h2><p>A structured view of your health history and care journey.</p></div><button className="ai-summary-button" type="button" onClick={() => setSummaryOpen(!summaryOpen)} aria-expanded={summaryOpen} aria-controls="ai-health-summary"><Bot size={18} />AI Summary {summaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button></header>

    <section className={summaryOpen ? 'health-summary expanded' : 'health-summary'} id="ai-health-summary" aria-label="PreScribe AI Health Summary"><div className="summary-heading"><span className="summary-icon"><Bot size={19} /></span><div><p className="section-kicker">PreScribe AI</p><h3>Health Summary</h3></div></div>{summaryOpen && <div className="summary-content"><p>Your available records show continuity of care across general medicine and physiotherapy. You have an active Vitamin D3 plan and physiotherapy sessions, with a follow-up consultation scheduled for 5 September.</p><small>Generated from your available health records. Review clinical decisions with your healthcare professional.</small></div>}</section>

    <section className="timeline-controls" aria-label="Timeline filters"><p className="section-kicker">Filter timeline</p><div className="timeline-filter-list">{timelineFilters.map((item) => <button type="button" key={item} className={filter === item ? 'timeline-filter active' : 'timeline-filter'} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div></section>

    <section className="timeline-list" aria-live="polite">{Object.entries(eventsByYear).sort(([first], [second]) => Number(second) - Number(first)).map(([year, events]) => <div className="timeline-year" key={year}><h3>{year}</h3><div className="timeline-events">{events.map((event) => <TimelineEventCard event={event} expanded={expandedEventId === event.id} onToggle={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)} key={event.id} />)}</div></div>)}{filteredEvents.length === 0 && <div className="empty-timeline"><ClipboardPlus size={22} /><p>No events match this filter.</p></div>}</section>
  </div>
}

function TimelineEventCard({ event, expanded, onToggle }: { event: TimelineEvent; expanded: boolean; onToggle: () => void }) {
  const visual = eventVisuals[event.type]
  const Icon = visual.icon
  return <article className={`timeline-event ${expanded ? 'expanded' : ''}`}><div className={`event-marker ${visual.className}`}><Icon size={17} /></div><button className="timeline-event-main" type="button" onClick={onToggle} aria-expanded={expanded}><div className="event-meta"><span>{event.type}</span><time>{event.date}</time></div><div className="event-title-row"><div><h4>{event.title}</h4>{event.provider && <p>{event.provider}</p>}</div>{event.status && <span className="event-status">{event.status}</span>}</div><p className="event-description">{event.description}</p><span className="event-detail-toggle">{expanded ? 'Hide details' : 'View details'} {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span></button>{expanded && <div className="event-details"><dl><div><dt>Date</dt><dd>{event.date}</dd></div>{event.provider && <div><dt>Provider</dt><dd>{event.provider}</dd></div>}{event.details.relatedCare && <div><dt>Related care</dt><dd>{event.details.relatedCare}</dd></div>}</dl><p><b>Notes</b>{event.details.notes}</p></div>}</article>
}
