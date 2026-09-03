import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

export function App() {
  const path = window.location.pathname
  if (path === '/signup/patient') return <SignupPage role="patient" />
  if (path === '/signup/doctor') return <SignupPage role="doctor" />
  return <LoginPage />
}
