import { Chevron } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'

function DayCard({ day, open, onToggle }) {
  return (
    <article className={`day${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="day-toggle"
        aria-expanded={open}
        aria-controls={`panel-${day.id}`}
        onClick={onToggle}
      >
        <span className="day-title">{day.title}</span>
        {day.note ? <span className="day-note">{day.note}</span> : null}
        <Chevron />
      </button>
      <div className="day-body" id={`panel-${day.id}`} role="region" aria-hidden={!open}>
        <div className="day-body-inner">
          <ul>
            {day.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </article>
  )
}

export default function Weekend({ event, openDay, onToggle }) {
  return (
    <section className="sheet section" id="weekend">
      <Reveal><p className="kicker">{event.scheduleTitle}</p></Reveal>
      <div className="days">
        {event.schedule.map((day, index) => (
          <Reveal key={day.id} delay={index * 35}>
            <DayCard day={day} open={openDay === day.id} onToggle={() => onToggle(day.id)} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
