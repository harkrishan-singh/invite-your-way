import { createContext, useContext, useEffect, useRef, useState } from 'react'

const LiveContext = createContext(false)

export function LiveProvider({ live, children }) {
  return <LiveContext.Provider value={live}>{children}</LiveContext.Provider>
}

export function Reveal({ children, className = '', delay = 0 }) {
  const active = useContext(LiveContext)
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!active) return undefined
    const node = ref.current
    if (!node) return undefined

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Do not hide content if observation or animation is unavailable.
      setShown(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -3% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [active])

  return (
    <div
      ref={ref}
      className={`reveal${shown ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
