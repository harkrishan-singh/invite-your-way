import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'



// Prevent the browser from restoring an old scroll position
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

// Reset page position instantly
const resetScrollPosition = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant',
  })
}

// Reset on initial load
resetScrollPosition()

// Reset when the page is restored or shown again
window.addEventListener('pageshow', resetScrollPosition)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
