import CoupleTitle from './CoupleTitle.jsx'

export default function InvitationHero({ event, villaRef, showHint }) {
  return (
    <section className="hero" aria-label={`${event.label} invitation`}>
      <div className="villa-parallax" ref={villaRef}>
        <div className="villa-wrap">
          <img
            className="hero-portrait"
            src={`${import.meta.env.BASE_URL}events/amanpreet-weds-megha/photos/Hero1.jpeg`}
            alt="Portrait of the couple"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
      <div className="hero-copy">
        <CoupleTitle as="h1" className="names" />
        <br />
        <p className="hero-event-label">{event.heroLabel}</p>
        <p className="date"><span>{event.dateLine} {event.year}</span></p>
        <p className="hero-location">
          {event.variant === 'wedding'
            ? `${event.venues.map(venue => venue.name).join(' & ')}, ${event.venue.location}`
            : `${event.venue.name}, ${event.venue.location}`}
        </p> </div>
      {showHint && <p className="scroll-hint">Scroll to discover</p>}
    </section>
  )
}
