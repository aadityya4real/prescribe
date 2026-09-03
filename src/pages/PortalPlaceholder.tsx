import { Construction } from 'lucide-react'

export function PortalPlaceholder({ title }: { title: string }) {
  return <section className="future-page"><div className="future-icon"><Construction size={25} /></div><p className="portal-label">PreScribe workspace</p><h2>{title}</h2><p>This area is being prepared for the next phase of PreScribe.</p></section>
}
