import { Reveal } from "./Reveal.jsx";

function DayCard({ day }) {
  return (
    <article className="day is-open">
      <div className="day-toggle">
        <span className="day-title">{day.title}</span>
        {day.note && <span className="day-note">{day.note}</span>}
      </div>

      <div className="day-body">
        <div className="day-body-inner">
          <ul className="day-events">
            {day.items.map((item, index) => (
              <li key={`${day.id}-${index}`}>
                <span className="day-event-title">{item.title}</span>
                <span className="day-event-time">{item.time}</span>
              </li>
            ))}
          </ul>

          <div className="day-venue">
            <span className="day-venue-label">Location</span>
            <span className="day-venue-name">{day.location}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Weekend({ event }) {
  return (
    <section className="sheet section" id="weekend">
      <Reveal>
        <p className="kicker">{event.scheduleTitle}</p>
      </Reveal>
      <div className="days">
        {event.schedule.map((day, index) => (
          <Reveal key={day.id} delay={index * 35}>
            <DayCard day={day} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
