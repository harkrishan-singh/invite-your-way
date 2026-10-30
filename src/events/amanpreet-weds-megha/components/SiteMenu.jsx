export default function SiteMenu({ links, onClose, onGo }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" className="overlay-close" onClick={onClose}>Close</button>
      <nav className="menu-nav" aria-label="Jump to section">
        {links.map((link) => (
          <button key={link.id} type="button" onClick={() => onGo(link.id)}>{link.label}</button>
        ))}
      </nav>
    </div>
  )
}
