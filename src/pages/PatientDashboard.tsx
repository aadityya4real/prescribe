import { ArrowRight, CalendarDays, ClipboardList, Clock3, FileUp, MessageCircle, Search, Stethoscope, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import { patientDashboardData } from '../features/patient-dashboard/dashboardData'

const quickActions = [
  { label: 'View health timeline', detail: 'Review your record', to: '/patient/timeline', icon: ClipboardList },
  { label: 'Find a doctor', detail: 'Explore your care options', to: '/patient/care-team', icon: Search },
  { label: 'Book appointment', detail: 'Plan your next visit', to: '/patient/appointments', icon: CalendarDays },
  { label: 'Upload health record', detail: 'Available soon', icon: FileUp },
]

export function PatientDashboard() {
  const { profile, snapshot, upcomingAppointment, treatments } = patientDashboardData

  return <div className="patient-dashboard">
    <header className="dashboard-header">
      <div><p className="dashboard-date">{profile.dateLabel}</p><h2>Good morning, {profile.firstName}</h2><p>Here is your health overview for today.</p></div>
    </header>

    <section className="dashboard-section" aria-labelledby="snapshot-heading">
      <div className="section-heading"><div><p className="section-kicker">At a glance</p><h3 id="snapshot-heading">Health snapshot</h3></div><span className="updated-status">Information up to date</span></div>
      <div className="snapshot-grid">{snapshot.map((item) => <article className="snapshot-item" key={item.label}><strong>{item.value}</strong><span>{item.label}</span><small>{item.detail}</small></article>)}</div>
    </section>

    <div className="dashboard-columns">
      <section className="dashboard-section appointment-section" aria-labelledby="appointment-heading">
        <div className="section-heading"><div><p className="section-kicker">Next in your care</p><h3 id="appointment-heading">Upcoming appointment</h3></div><span className="appointment-date">Tomorrow</span></div>
        <article className="appointment-card"><div className="appointment-doctor"><span className="doctor-avatar">AS</span><div><h4>{upcomingAppointment.doctor}</h4><p>{upcomingAppointment.specialty}</p></div></div><dl className="appointment-details"><div><dt><CalendarDays size={15} />Date</dt><dd>{upcomingAppointment.date}</dd></div><div><dt><Clock3 size={15} />Time</dt><dd>{upcomingAppointment.time}</dd></div><div><dt><Video size={15} />Type</dt><dd>{upcomingAppointment.type}</dd></div></dl><Link className="text-action" to="/patient/appointments">View appointment <ArrowRight size={16} /></Link></article>
      </section>

      <section className="dashboard-section treatments-section" aria-labelledby="treatments-heading">
        <div className="section-heading"><div><p className="section-kicker">Ongoing care</p><h3 id="treatments-heading">Active treatments</h3></div><Link className="section-link" to="/patient/treatments">View all</Link></div>
        <div className="treatment-list">{treatments.map((treatment) => <article className="treatment-item" key={treatment.name}><span className="treatment-icon"><Stethoscope size={17} /></span><div className="treatment-copy"><h4>{treatment.name}</h4><p>{treatment.purpose} <span>·</span> {treatment.frequency}</p></div><span className="treatment-status">{treatment.status}</span></article>)}</div>
      </section>
    </div>

    <section className="ai-assistant" aria-labelledby="assistant-heading"><div className="ai-symbol"><MessageCircle size={22} /></div><div className="ai-copy"><p className="section-kicker">Your care companion</p><h3 id="assistant-heading">PreScribe AI</h3><p>Ask questions about your health records, treatments, or upcoming care.</p></div><div className="assistant-input"><span>Ask about your health history...</span><button type="button" aria-label="Start a conversation with PreScribe AI"><ArrowRight size={17} /></button></div></section>

    <section className="dashboard-section quick-actions-section" aria-labelledby="quick-actions-heading"><div className="section-heading"><div><p className="section-kicker">Useful next steps</p><h3 id="quick-actions-heading">Quick actions</h3></div></div><div className="quick-actions">{quickActions.map(({ label, detail, to, icon: Icon }) => to ? <Link className="quick-action" to={to} key={label}><Icon size={19} /><span><b>{label}</b><small>{detail}</small></span><ArrowRight className="quick-action-arrow" size={16} /></Link> : <button className="quick-action unavailable" type="button" key={label} aria-label={`${label} — ${detail}`}><Icon size={19} /><span><b>{label}</b><small>{detail}</small></span><ArrowRight className="quick-action-arrow" size={16} /></button>)}</div></section>
  </div>
}
