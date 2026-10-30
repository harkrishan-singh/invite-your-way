import { wedding } from '../data/wedding.js'
import WaxSeal from './WaxSeal.jsx'
import { useRef } from 'react'

export default function Envelope({ opening, onOpen }) {
  const touchStartY = useRef(null)
  return (

    <div
      className={`envelope${opening ? ' is-opening' : ''}`}
      onClick={opening ? undefined : onOpen}

      // Mouse wheel or trackpad scroll
      onWheel={(e) => {
        if (!opening && e.deltaY > 15) {
          onOpen()
        }
      }}

      // Record where the finger touches the screen
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0]?.clientY ?? null
      }}

      // Open when the user swipes upward
      onTouchEnd={(e) => {
        const startY = touchStartY.current
        touchStartY.current = null

        const endY = e.changedTouches[0]?.clientY

        if (
          !opening &&
          startY !== null &&
          endY !== undefined &&
          startY - endY > 45
        ) {
          onOpen()
        }
      }}

      onTouchCancel={() => {
        touchStartY.current = null
      }}
    >

      <div className="flap flap-bottom" />
      <div className="flap flap-left" />
      <div className="flap flap-right" />
      <div className="flap flap-top" />
      <svg className="creases" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="0" x2="100" y2="100" />
        <line x1="100" y1="0" x2="0" y2="100" />
      </svg>
      <div className="seal-wrap">
        <button
          type="button"
          className={`seal${opening ? ' is-breaking' : ''}`}
          onClick={(event) => {
            event.stopPropagation()
            onOpen()
          }}
          disabled={opening}
          aria-label="Open the invitation"
        >
          <WaxSeal className="seal-shape" />
          <span className="seal-letters">{wedding.monogram}</span>
        </button>
      </div>
      <p className="hint">Tap or scroll to open</p>
    </div>
  )
}
