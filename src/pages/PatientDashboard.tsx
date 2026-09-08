import { ArrowRight, Bot, CalendarDays, ClipboardList, MessageCircle, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

const quickActions = [
  { label: 'View health timeline', detail: 'Review your record', to: '/patient/timeline', icon: ClipboardList },
  { label: 'Find a doctor', detail: 'Explore your care options', to: '/patient/care-team', icon: Search },
  { label: 'Book appointment', detail: 'Plan your next visit', to: '/patient/appointments', icon: CalendarDays },
  { label: 'AI health assessment', detail: 'Organize what you are experiencing', to: '/patient/ai-assessment', icon: Bot },
]

const emptySnapshot = [
  { label: 'Active treatments', detail: 'No active treatments yet' },
  { label: 'Upcoming appointments', detail: 'No appointments scheduled' },
  { label: 'Health records', detail: 'No records added yet' },
  { label: 'Care team members', detail: 'No doctors connected' },
]

function getTimeBasedGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function PatientDashboard() {
  const { profile } = useAuth()
  const firstName = profile?.full_name.trim().split(/\s+/)[0] || 'there'
  const greeting = getTimeBasedGreeting()

  return <div className="patient-dashboard">
    <header className="dashboard-header"><div><p className="dashboard-date">Your health overview</p><h2>{greeting}, {firstName}</h2><p>Your care information will appear here as it becomes available.</p></div></header>
    <section className="dashboard-section" aria-labelledby="snapshot-heading"><div className="section-heading"><div><p className="section-kicker">At a glance</p><h3 id="snapshot-heading">Health snapshot</h3></div><span className="updated-status">No care data yet</span></div><div className="snapshot-grid">{emptySnapshot.map((item) => <article className="snapshot-item" key={item.label}><strong>0</strong><span>{item.label}</span><small>{item.detail}</small></article>)}</div></section>
    <div className="dashboard-columns">
      <section className="dashboard-section appointment-section" aria-labelledby="appointment-heading"><div className="section-heading"><div><p className="section-kicker">Next in your care</p><h3 id="appointment-heading">Upcoming appointment</h3></div></div><div className="dashboard-empty-state"><CalendarDays size={22} /><div><h4>No upcoming appointments</h4><p>When you schedule care, your next appointment will appear here.</p><Link className="text-action" to="/patient/appointments">Manage appointments <ArrowRight size={16} /></Link></div></div></section>
      <section className="dashboard-section treatments-section" aria-labelledby="treatments-heading"><div className="section-heading"><div><p className="section-kicker">Ongoing care</p><h3 id="treatments-heading">Active treatments</h3></div><Link className="section-link" to="/patient/treatments">View all</Link></div><div className="dashboard-empty-state"><ClipboardList size={22} /><div><h4>No active treatments</h4><p>Treatment plans shared by your care team will be listed here.</p><Link className="text-action" to="/patient/treatments">View treatments <ArrowRight size={16} /></Link></div></div></section>
    </div>
    <section className="ai-assistant" aria-labelledby="assistant-heading"><div className="ai-symbol"><MessageCircle size={22} /></div><div className="ai-copy"><p className="section-kicker">Your care companion</p><h3 id="assistant-heading">PreScribe AI</h3><p>Ask questions about your health records, treatments, or upcoming care.</p></div><div className="assistant-input"><span>Ask about your health history...</span><button type="button" aria-label="Start a conversation with PreScribe AI"><ArrowRight size={17} /></button></div></section>
    <section className="dashboard-section quick-actions-section" aria-labelledby="quick-actions-heading"><div className="section-heading"><div><p className="section-kicker">Useful next steps</p><h3 id="quick-actions-heading">Quick actions</h3></div></div><div className="quick-actions">{quickActions.map(({ label, detail, to, icon: Icon }) => to ? <Link className="quick-action" to={to} key={label}><Icon size={19} /><span><b>{label}</b><small>{detail}</small></span><ArrowRight className="quick-action-arrow" size={16} /></Link> : <button className="quick-action unavailable" type="button" key={label} aria-label={`${label} — ${detail}`}><Icon size={19} /><span><b>{label}</b><small>{detail}</small></span><ArrowRight className="quick-action-arrow" size={16} /></button>)}</div></section>
  </div>
}
