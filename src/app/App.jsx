import { eventRegistry } from '../events/registry.js'
import Home from './Home.jsx'
import NotFound from './NotFound.jsx'

/** The main InviteYourWay site routes /event-slug/page to the right event. */
export default function App() {
  const segments = window.location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) return <Home />
  if (segments.length !== 2) return <NotFound />

  const [slug, page] = segments
  const event = Object.hasOwn(eventRegistry, slug) ? eventRegistry[slug] : null

  if (!event || !event.pages.includes(page)) return <NotFound />

  const EventSite = event.Component
  return <EventSite key={`${slug}/${page}`} page={page} />
}
