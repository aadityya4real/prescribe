import { Navigate, Route, Routes } from 'react-router-dom'
import { PortalRoute } from './components/layout/PortalRoute'
import { LoginPage } from './pages/LoginPage'
import { PatientDashboard } from './pages/PatientDashboard'
import { PatientCareTeam } from './pages/PatientCareTeam'
import { PatientTimeline } from './pages/PatientTimeline'
import { PortalPlaceholder } from './pages/PortalPlaceholder'
import { SignupPage } from './pages/SignupPage'

export function App() {
  return <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/signup/patient" element={<SignupPage role="patient" />} />
    <Route path="/signup/doctor" element={<SignupPage role="doctor" />} />

    <Route path="/patient" element={<PortalRoute role="patient" />}>
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="timeline" element={<PatientTimeline />} />
      <Route path="care-team" element={<PatientCareTeam />} />
      <Route path="appointments" element={<PortalPlaceholder title="Appointments" />} />
      <Route path="treatments" element={<PortalPlaceholder title="Treatments" />} />
    </Route>

    <Route path="/doctor" element={<PortalRoute role="doctor" />}>
      <Route path="dashboard" element={<PortalPlaceholder title="Clinical overview" />} />
      <Route path="patients" element={<PortalPlaceholder title="Patients" />} />
      <Route path="schedule" element={<PortalPlaceholder title="Schedule" />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
