import { Reveal } from './Reveal.jsx'

export default function Place({ venues }) {
  return (
    <section className="sheet section" id="place">
      <Reveal><p className="kicker">The venue</p></Reveal>
      <div className="venue-list">
        {venues.map((venue) => (
          <Reveal key={venue.id}>
            <section className="venue-block" aria-label={venue.label}>
              <p className="venue-type">{venue.label}</p>
              <h2 className="place-title">{venue.name}</h2>
              <figure className="place-photo">
                <img src={venue.photo} alt={venue.photoAlt} loading="lazy" decoding="async" />
              </figure>
              <p className="prose" style={{ whiteSpace: 'pre-line' }}>{venue.description}</p>
            </section>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
