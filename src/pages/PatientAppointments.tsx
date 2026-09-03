import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, ChevronUp, CircleCheck, Clock3, FileCheck2, Stethoscope, Video } from 'lucide-react'
import { useState } from 'react'
import { appointmentDoctors, availableSlots, careNeeds, initialUpcomingAppointments, pastAppointments } from '../features/patient-appointments/appointmentData'
import type { Appointment, AppointmentDoctor, AppointmentType, CareNeed } from '../features/patient-appointments/types'

export function PatientAppointments() {
  const [upcoming, setUpcoming] = useState(initialUpcomingAppointments)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [preparingId, setPreparingId] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [careNeed, setCareNeed] = useState<CareNeed | null>(null)
  const [doctor, setDoctor] = useState<AppointmentDoctor | null>(null)
  const [appointmentType, setAppointmentType] = useState<AppointmentType | null>(null)
  const [slot, setSlot] = useState<{ date: string; time: string } | null>(null)
  const [bookingConfirmation, setBookingConfirmation] = useState(false)

  const beginBooking = () => { setBookingOpen(true); setBookingConfirmation(false); setBookingStep(1) }
  const completeBooking = () => {
    if (!doctor || !appointmentType || !slot || !careNeed) return
    const newAppointment: Appointment = { id: `appointment-${Date.now()}`, doctor, date: slot.date, time: slot.time, type: appointmentType, status: 'Confirmed', reason: careNeed, isUpcoming: true, preparation: { basicProfile: true, healthRecords: true, preConsultationStatus: 'Not started', caseSummaryStatus: 'Not generated' } }
    setUpcoming((current) => [...current, newAppointment])
    setBookingConfirmation(true)
  }

  return <div className="appointments-page">
    <header className="appointments-header"><div><p className="dashboard-date">Plan and prepare for care</p><h2>Appointments</h2><p>Manage your upcoming and past healthcare appointments.</p></div><button className="book-appointment-button" type="button" onClick={beginBooking}><CalendarDays size={18} />Book appointment</button></header>

    {bookingOpen && <section className="booking-panel" aria-labelledby="booking-heading">{bookingConfirmation ? <BookingConfirmation appointment={upcoming[upcoming.length - 1]} onDone={() => setBookingOpen(false)} /> : <><div className="booking-heading"><div><p className="section-kicker">New appointment</p><h3 id="booking-heading">Book an appointment</h3></div><span>Step {bookingStep} of 4</span></div><div className="booking-progress"><span style={{ width: `${bookingStep * 25}%` }} /></div>{bookingStep === 1 && <ChoiceStep title="Choose care need" options={careNeeds} selected={careNeed} onSelect={setCareNeed} />}{bookingStep === 2 && <DoctorStep selected={doctor} onSelect={setDoctor} />}{bookingStep === 3 && <ChoiceStep title="Choose appointment type" options={['Video consultation', 'In-person consultation'] as AppointmentType[]} selected={appointmentType} onSelect={setAppointmentType} />}{bookingStep === 4 && <SlotStep selected={slot} onSelect={setSlot} />}<div className="booking-actions"><button type="button" className="booking-back" onClick={() => bookingStep === 1 ? setBookingOpen(false) : setBookingStep(bookingStep - 1)}><ArrowLeft size={16} />{bookingStep === 1 ? 'Cancel' : 'Back'}</button>{bookingStep < 4 ? <button className="booking-next" type="button" onClick={() => setBookingStep(bookingStep + 1)} disabled={(bookingStep === 1 && !careNeed) || (bookingStep === 2 && !doctor) || (bookingStep === 3 && !appointmentType)}>Continue <ArrowRight size={16} /></button> : <button className="booking-next" type="button" disabled={!slot} onClick={completeBooking}>Confirm appointment <Check size={16} /></button>}</div></>}</section>}

    <section className="appointments-section" aria-labelledby="upcoming-heading"><div className="section-heading"><div><p className="section-kicker">Your scheduled care</p><h3 id="upcoming-heading">Upcoming appointments</h3></div><span className="appointment-total">{upcoming.length}</span></div><div className="appointment-list">{upcoming.map((appointment, index) => <AppointmentCard key={appointment.id} appointment={appointment} expanded={expandedId === appointment.id} onToggle={() => setExpandedId(expandedId === appointment.id ? null : appointment.id)} onPrepare={index === 0 ? () => setPreparingId(preparingId === appointment.id ? null : appointment.id) : undefined} preparing={preparingId === appointment.id} />)}</div></section>

    <section className="appointments-section past-appointments" aria-labelledby="past-heading"><div className="section-heading"><div><p className="section-kicker">Care history</p><h3 id="past-heading">Past appointments</h3></div></div><div className="past-appointment-list">{pastAppointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} expanded={expandedId === appointment.id} onToggle={() => setExpandedId(expandedId === appointment.id ? null : appointment.id)} />)}</div></section>
  </div>
}

function AppointmentCard({ appointment, expanded, onToggle, onPrepare, preparing }: { appointment: Appointment; expanded: boolean; onToggle: () => void; onPrepare?: () => void; preparing?: boolean }) {
  const dateParts = appointment.date.replace(',', '').split(' ')
  const dayIndex = dateParts.findIndex((part) => /^\d{1,2}$/.test(part))
  const day = dayIndex >= 0 ? dateParts[dayIndex] : '—'
  const month = dayIndex >= 0 ? dateParts[dayIndex + 1] : 'Visit'
  return <article className={`managed-appointment ${appointment.isUpcoming ? 'upcoming-appointment' : 'past-appointment'} ${expanded ? 'expanded' : ''}`}><button className="managed-appointment-main" type="button" onClick={onToggle} aria-expanded={expanded}><div className="appointment-date-block"><strong>{day}</strong><span>{month}</span></div><div className="managed-appointment-copy"><div className="managed-title-row"><h4>{appointment.doctor.name}</h4><span className={`appointment-status ${appointment.status.toLowerCase()}`}>{appointment.status}</span></div><p>{appointment.doctor.specialization} <span>·</span> {appointment.doctor.organization}</p><div className="appointment-info-line"><span><Clock3 size={14} />{appointment.time}</span><span><Video size={14} />{appointment.type}</span></div></div>{expanded ? <ChevronUp className="managed-chevron" size={18} /> : <ChevronDown className="managed-chevron" size={18} />}</button>{expanded && <div className="managed-appointment-details"><dl><div><dt>Reason for visit</dt><dd>{appointment.reason}</dd></div><div><dt>Appointment status</dt><dd>{appointment.status}</dd></div>{appointment.followUp && <div><dt>Follow-up</dt><dd>{appointment.followUp}</dd></div>}{appointment.relatedTreatment && <div><dt>Related treatment</dt><dd>{appointment.relatedTreatment}</dd></div>}</dl>{onPrepare && <button className="prepare-button" type="button" onClick={onPrepare}><FileCheck2 size={16} />Prepare for appointment {preparing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>}</div>}{preparing && <PreparationPanel appointment={appointment} />}</article>
}

function PreparationPanel({ appointment }: { appointment: Appointment }) { return <section className="preparation-panel"><div><p className="section-kicker">Appointment preparation</p><h4>Prepare before your consultation</h4><p>Complete your health information before your consultation so your doctor can review the relevant details.</p></div><ul><li className={appointment.preparation.basicProfile ? 'done' : ''}><Check size={15} />Basic profile available</li><li className={appointment.preparation.healthRecords ? 'done' : ''}><Check size={15} />Recent health records available</li><li><span />Pre-consultation information pending</li></ul><button type="button" className="start-preconsultation"><Stethoscope size={16} />Start pre-consultation</button></section> }

function ChoiceStep<T extends string>({ title, options, selected, onSelect }: { title: string; options: readonly T[]; selected: T | null; onSelect: (option: T) => void }) { return <div className="booking-choice-step"><h4>{title}</h4><div>{options.map((option) => <button className={selected === option ? 'booking-choice selected' : 'booking-choice'} type="button" onClick={() => onSelect(option)} key={option}><span>{option}</span>{selected === option && <Check size={17} />}</button>)}</div></div> }

function DoctorStep({ selected, onSelect }: { selected: AppointmentDoctor | null; onSelect: (doctor: AppointmentDoctor) => void }) { return <div className="booking-choice-step"><h4>Choose doctor</h4><div>{appointmentDoctors.map((doctor) => <button className={selected?.id === doctor.id ? 'booking-choice doctor-choice selected' : 'booking-choice doctor-choice'} type="button" onClick={() => onSelect(doctor)} key={doctor.id}><span><b>{doctor.name}</b><small>{doctor.specialization} · {doctor.organization}</small></span>{selected?.id === doctor.id && <Check size={17} />}</button>)}</div></div> }

function SlotStep({ selected, onSelect }: { selected: { date: string; time: string } | null; onSelect: (slot: { date: string; time: string }) => void }) { return <div className="booking-choice-step"><h4>Choose a date and time</h4><div className="slot-options">{availableSlots.flatMap(({ date, times }) => times.map((time) => { const value = { date, time }; const active = selected?.date === date && selected.time === time; return <button className={active ? 'booking-choice slot-choice selected' : 'booking-choice slot-choice'} type="button" onClick={() => onSelect(value)} key={`${date}-${time}`}><span><b>{date}</b><small>{time}</small></span>{active && <Check size={17} />}</button> }))}</div></div> }

function BookingConfirmation({ appointment, onDone }: { appointment: Appointment; onDone: () => void }) { return <div className="booking-confirmation"><span><CircleCheck size={27} /></span><p className="section-kicker">Appointment confirmed</p><h3>Your appointment is scheduled.</h3><p>{appointment.doctor.name} · {appointment.date} at {appointment.time}</p><button type="button" className="booking-next" onClick={onDone}>Done</button></div> }
