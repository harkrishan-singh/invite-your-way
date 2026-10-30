import './pages.css'

export default function NotFound() {
  return (
    <main className="inviteyourway-home">
      <div className="inviteyourway-home-content">
        <p className="inviteyourway-eyebrow">404 · PAGE NOT FOUND</p>
        <h1>Invitation not found</h1>
        <p>Please check the link you received.</p>
        <a className="inviteyourway-home-link" href="/">Return to InviteYourWay</a>
      </div>
    </main>
  )
}
