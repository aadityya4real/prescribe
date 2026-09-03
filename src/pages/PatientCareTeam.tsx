import { BadgeCheck, ChevronDown, ChevronUp, CircleCheck, KeyRound, LockKeyhole, Search, Send, UserRoundPlus, UsersRound } from 'lucide-react'
import { ChangeEvent, useMemo, useState } from 'react'
import { connectedDoctors, discoverableDoctors, pendingRequests } from '../features/patient-care-team/careTeamData'
import type { ConnectionRequest, DoctorProfile } from '../features/patient-care-team/types'

export function PatientCareTeam() {
  const [doctorId, setDoctorId] = useState('')
  const [requests, setRequests] = useState<ConnectionRequest[]>(pendingRequests)
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null)
  const [sentDoctorId, setSentDoctorId] = useState<string | null>(null)
  const normalizedId = doctorId.trim().toUpperCase()
  const discoveredDoctor = useMemo(() => discoverableDoctors.find((doctor) => doctor.preScribeId === normalizedId), [normalizedId])
  const hasAlreadyRequested = discoveredDoctor ? requests.some((request) => request.id === discoveredDoctor.id) : false
  const looksLikeId = normalizedId.length > 0 && /^PS-D-[A-Z0-9]{5}$/.test(normalizedId)

  const updateDoctorId = (event: ChangeEvent<HTMLInputElement>) => { setDoctorId(event.target.value); setSentDoctorId(null) }
  const sendRequest = () => {
    if (!discoveredDoctor || hasAlreadyRequested) return
    setRequests((current) => [{ ...discoveredDoctor, status: 'Pending', sentLabel: 'Sent just now' }, ...current])
    setSentDoctorId(discoveredDoctor.id)
  }

  return <div className="care-team-page">
    <header className="care-team-header"><div><p className="dashboard-date">Your authorized care network</p><h2>Care team</h2><p>Manage the healthcare professionals connected to your PreScribe profile.</p></div><div className="team-count"><UsersRound size={18} /><span><b>{connectedDoctors.length}</b> active connections</span></div></header>

    <div className="care-team-layout">
      <section className="care-team-section connected-team" aria-labelledby="connected-team-heading"><div className="section-heading"><div><p className="section-kicker">Approved connections</p><h3 id="connected-team-heading">Connected care team</h3></div></div><div className="doctor-list">{connectedDoctors.map((doctor) => <DoctorCard doctor={doctor} expanded={expandedDoctorId === doctor.id} onToggle={() => setExpandedDoctorId(expandedDoctorId === doctor.id ? null : doctor.id)} key={doctor.id} />)}</div></section>

      <aside className="care-team-side"><section className="add-doctor-panel" aria-labelledby="add-doctor-heading"><div className="add-doctor-icon"><UserRoundPlus size={21} /></div><p className="section-kicker">New connection</p><h3 id="add-doctor-heading">Add a doctor</h3><p>Enter a Doctor PreScribe ID to request an approved connection.</p><label className="doctor-id-field" htmlFor="doctor-prescribe-id"><KeyRound size={17} /><input id="doctor-prescribe-id" value={doctorId} onChange={updateDoctorId} placeholder="PS-D-7K91M" autoCapitalize="characters" /></label>{looksLikeId && !discoveredDoctor && <p className="lookup-message">No doctor was found for this demo ID.</p>}{discoveredDoctor && <div className="doctor-preview"><div><span className="preview-avatar">MI</span><div><b>{discoveredDoctor.name}</b><small>{discoveredDoctor.specialization}</small></div></div><p>{discoveredDoctor.organization} <span>·</span> {discoveredDoctor.preScribeId}</p><button className={hasAlreadyRequested ? 'request-button requested' : 'request-button'} type="button" onClick={sendRequest} disabled={hasAlreadyRequested}><Send size={16} />{hasAlreadyRequested ? 'Request sent' : 'Send connection request'}</button>{sentDoctorId === discoveredDoctor.id && <p className="request-confirmation"><CircleCheck size={14} />Request added to your pending connections.</p>}</div>}</section>

        <section className="pending-panel" aria-labelledby="pending-heading"><div className="section-heading"><div><p className="section-kicker">Awaiting approval</p><h3 id="pending-heading">Pending requests</h3></div><span className="pending-count">{requests.length}</span></div><div className="pending-list">{requests.map((request) => <article className="pending-request" key={request.id}><span className="pending-avatar">{request.name.replace('Dr. ', '').split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><h4>{request.name}</h4><p>{request.specialization}</p><small>{request.sentLabel}</small></div><span className="pending-status">Pending</span></article>)}</div></section></aside>
    </div>

    <section className="authorization-note"><span><LockKeyhole size={20} /></span><div><h3>Connection and authorization</h3><p>Healthcare professionals only access the information you authorize through an approved connection. You can review or change access as your care needs evolve.</p></div></section>
  </div>
}

function DoctorCard({ doctor, expanded, onToggle }: { doctor: DoctorProfile; expanded: boolean; onToggle: () => void }) {
  return <article className={expanded ? 'doctor-card expanded' : 'doctor-card'}><button type="button" className="doctor-card-main" onClick={onToggle} aria-expanded={expanded}><span className="doctor-initials">{doctor.name.replace('Dr. ', '').split(/[ ,]/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2)}</span><span className="doctor-card-copy"><span className="doctor-name-row"><b>{doctor.name}</b><BadgeCheck size={16} /></span><small>{doctor.specialization} <span>·</span> {doctor.organization}</small><em>{doctor.preScribeId}</em></span><span className="connection-state"><CircleCheck size={14} />Connected</span>{expanded ? <ChevronUp className="doctor-chevron" size={17} /> : <ChevronDown className="doctor-chevron" size={17} />}</button>{expanded && <div className="doctor-card-details"><dl><div><dt>Professional details</dt><dd>{doctor.specialization}</dd></div><div><dt>Connected</dt><dd>{doctor.connectedOn}</dd></div><div><dt>Authorized access</dt><dd>{doctor.accessScope}</dd></div></dl></div>}</article>
}
