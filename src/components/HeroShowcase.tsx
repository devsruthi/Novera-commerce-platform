import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { HERO_SLIDES } from '../data/heroSlides'

const INTERVAL_MS = 3600

export function HeroShowcase() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)

  const goTo = useEffectEvent((next: number) => {
    const len = HERO_SLIDES.length
    setIndex(((next % len) + len) % len)
  })

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      goTo(index + 1)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [index, paused])

  return (
    <div
      className={`hero-stage ${paused ? 'is-paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0]?.clientX ?? null
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) < 40) return
        goTo(index + (dx < 0 ? 1 : -1))
      }}
    >
      <div className="hero-stage-media" aria-live="polite">
        {HERO_SLIDES.map((slide, i) => {
          const isActive = i === index
          return (
            <div
              key={slide.id}
              className={`hero-slide ${isActive ? 'is-active' : ''}`}
              aria-hidden={!isActive}
            >
              <img
                className="hero-slide-media"
                src={slide.src}
                alt={slide.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          )
        })}
      </div>

      <div className="hero-stage-shade" aria-hidden />

      <div className="hero-stage-controls">
        <div className="hero-progress" role="tablist" aria-label="Hero slides">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`hero-progress-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1}: ${slide.caption}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
