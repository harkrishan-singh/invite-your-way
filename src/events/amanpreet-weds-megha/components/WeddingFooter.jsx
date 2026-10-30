import CoupleTitle from './CoupleTitle.jsx'
import WaxSeal from './WaxSeal.jsx'

export default function WeddingFooter({ event }) {
  return (
    <footer className="wedding-footer">
      <WaxSeal className="footer-seal" />
      <CoupleTitle as="p" className="footer-names" />
      <p className="footer-meta">{event.footerLabel} · {event.footerDate} · {event.footerLocation}</p>
    </footer>
  )
}
