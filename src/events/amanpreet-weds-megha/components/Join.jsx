import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function remaining(target) {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

const rise = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
}

export default function Join({ event }) {
  const target = new Date(event.dateISO).getTime()
  const [time, setTime] = useState(() => remaining(target))

  const isWedding = event.variant === 'wedding'
  const [venueIndex, setVenueIndex] = useState(0)

  const activeVenue = isWedding
    ? event.venues[venueIndex]
    : event.venue

  useEffect(() => {
    const id = window.setInterval(() => setTime(remaining(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  const units = [
    ['Days', time.days], ['Hours', time.hours], ['Minutes', time.minutes], ['Seconds', time.seconds],
  ]

  return (
    <>
      <section className="join" aria-label={`${event.label} date`}>
        <motion.p className="invite-kicker" {...rise}>
          Together with our families, <span className="invite-break">we invite you...</span>
        </motion.p> <motion.h2 className="invite-date" {...rise}>{event.joinDateLabel}</motion.h2>
        <div
          className="timer"
          role="timer"
          aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes, and ${time.seconds} seconds until the ${event.countdownLabel}`}
        >
          {units.map(([label, value], index) => (
            <div className="timer-piece" key={label}>
              {index > 0 && <span className="colon">:</span>}
              <div className="unit"><strong>{value}</strong><span>{label}</span></div>
            </div>
          ))}
        </div>
      </section>


      <section className="venue" aria-label="Venue">
        {isWedding ? (
          <>
            {/* Wedding route: two-slide venue slider */}
            <div
              key={activeVenue.id}
              className="wedding-venue-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${venueIndex + 1} of ${event.venues.length}: ${activeVenue.label}`}
              aria-live="polite"
            >
              <p className="wedding-venue-label">
                {activeVenue.label}
              </p>

              <div className="venue-frame">
                <img
                  src={activeVenue.photo_2}
                  alt={activeVenue.photoAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <h2>{activeVenue.name}</h2>

              <a
                className="venue-address"
                href={activeVenue.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {activeVenue.address}
              </a>
            </div>

            {/* Slider navigation */}
            <div
              className="wedding-venue-controls"
              role="group"
              aria-label="Venue navigation"
            >
              <button
                type="button"
                aria-label="Previous venue"
                onClick={() =>
                  setVenueIndex(
                    (index) =>
                      (index - 1 + event.venues.length) %
                      event.venues.length
                  )
                }
              >
                ‹
              </button>

              <span>
                {venueIndex + 1} / {event.venues.length}
              </span>

              <button
                type="button"
                aria-label="Next venue"
                onClick={() =>
                  setVenueIndex(
                    (index) => (index + 1) % event.venues.length
                  )
                }
              >
                ›
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Reception route: existing venue UI unchanged */}
            <motion.div className="venue-frame" {...rise}>
              <img
                src={event.venue.photo_2}
                alt={event.venue.photoAlt}
                loading="lazy"
                decoding="async"
              />
            </motion.div>

            <h2>{event.venue.name}</h2>

            <a
              className="venue-address"
              href={event.venue.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {event.venue.address}
            </a>
          </>
        )}
      </section>

    </>
  )
}
