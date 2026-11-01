import { useCallback, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { getInvitation } from './data/wedding.js'
import SiteHeader from './components/SiteHeader.jsx'
import SiteMenu from './components/SiteMenu.jsx'
import Envelope from './components/Envelope.jsx'
import InvitationHero from './components/InvitationHero.jsx'
import Letter from './components/Letter.jsx'
import Weekend from './components/Weekend.jsx'
import Place from './components/Place.jsx'
import { LiveProvider } from './components/Reveal.jsx'
import StoryHero from './components/StoryHero.jsx'
import StoryIntro from './components/StoryIntro.jsx'
import Story from './components/Story.jsx'
import Join from './components/Join.jsx'
import ClosingNote from './components/ClosingNote.jsx'
import Finale from './components/Finale.jsx'
import WeddingFooter from './components/WeddingFooter.jsx'
import './styles/invitation.css'
import './styles/story.css'
import './styles/unified.css'

function prefersLessMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** The parent app selects the page; both pages retain the same component tree. */
export default function AmanpreetMeghaSite({ page = 'wedding' }) {
  const [event] = useState(() => getInvitation(page))
  const [stage, setStage] = useState('sealed')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDay, setOpenDay] = useState('') // Every day card starts collapsed.
  const villaRef = useRef(null)
  const isOpen = stage === 'open'

  useEffect(() => {
    document.title = `Amanpreet weds Megha | ${event.label}`
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content', `Join Amanpreet and Megha for their ${event.label.toLowerCase()} in ${event.venue.location}.`,
    )
  }, [event])

  useEffect(() => {
    if (stage !== 'opening') return undefined
    const id = window.setTimeout(() => setStage('open'), prefersLessMotion() ? 0 : 780)
    return () => window.clearTimeout(id)
  }, [stage])

  useEffect(() => {
    const locked = !isOpen || menuOpen
    const previous = document.body.style.overflow
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => { document.body.style.overflow = previous }
  }, [isOpen, menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (keyboardEvent) => { if (keyboardEvent.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    if (!isOpen) return undefined
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const y = Math.max(0, window.scrollY)
        setScrolled((current) => current === (y > 40) ? current : y > 40)
        if (villaRef.current && !prefersLessMotion()) {
          villaRef.current.style.transform = `translate3d(0, ${Math.min(y * 0.07, 32)}px, 0)`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [isOpen])

  const navigateTo = useCallback((id) => {
    setMenuOpen(false)
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: prefersLessMotion() ? 'auto' : 'smooth', block: 'start',
      })
    })
  }, [])

  const openEnvelope = () => {
    if (stage !== 'sealed') return
    setStage(prefersLessMotion() ? 'open' : 'opening')
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="wedding-site" data-version={event.variant}>
        <SiteHeader
          scrolled={scrolled}
          locked={!isOpen}
          onMenu={() => setMenuOpen(true)}
          onTop={() => navigateTo('top')}
          onRsvp={() => navigateTo('rsvp')}
        />
        <main>
          <div className="classic-invite" id="top">
            <LiveProvider live={stage !== 'sealed'}>
              <div className={`site${stage !== 'sealed' ? ' is-live' : ''}`}>
                <div className="invitation" inert={!isOpen}>
                  <InvitationHero event={event} villaRef={villaRef} showHint={isOpen && !scrolled} />
                  <Letter message={event.letter} />
                  <Weekend event={event} openDay={openDay} onToggle={(id) => setOpenDay((current) => current === id ? '' : id)} />
                  <Place
                    venues={event.variant === 'wedding' ? event.venues : [event.venue]}
                  />
                </div>
              </div>
            </LiveProvider>
            {stage !== 'open' && <Envelope opening={stage === 'opening'} onOpen={openEnvelope} />}
            {menuOpen && <SiteMenu links={event.menuLinks} onClose={() => setMenuOpen(false)} onGo={navigateTo} />}
          </div>

          {isOpen && (
            <div className="story-invite" id="second-invitation">
              <StoryHero />
              <StoryIntro />
              <Story />
              <Join event={event} />
              <ClosingNote />
              <Finale />
            </div>
          )}
        </main>
        <WeddingFooter event={event} />
      </div>
    </MotionConfig>
  )
}
