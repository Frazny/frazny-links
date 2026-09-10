import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COUNTER_KEY = 'frazny-is-a-dev-visits'
const BASE_URL = 'https://countapi.mileshilliard.com/api/v1'
const SESSION_KEY = 'frazny-visit-counted-v1'

function useAnimatedCount(target: number | null, duration = 1200) {
  const [display, setDisplay] = useState<number>(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (target === null) return
    const start = display
    const diff = target - start
    if (diff === 0) return
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setDisplay(Math.round(start + diff * ease))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target])

  return display
}

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const animated = useAnimatedCount(count)

  useEffect(() => {
    let active = true

    const loadCount = async (increment = false) => {
      try {
        const endpoint = increment ? 'hit' : 'get'
        const res = await fetch(`${BASE_URL}/${endpoint}/${COUNTER_KEY}`, { cache: 'no-store' })
        if (!res.ok) throw new Error()
        const data = await res.json()
        const value = parseInt(data.value, 10)
        if (active && !isNaN(value)) {
          setCount(value)
          setReady(true)
        }
      } catch {
        // sessiz hata
      }
    }

    const shouldIncrement = !sessionStorage.getItem(SESSION_KEY)
    if (shouldIncrement) sessionStorage.setItem(SESSION_KEY, '1')
    void loadCount(shouldIncrement)

    const interval = window.setInterval(() => void loadCount(false), 30_000)
    return () => { active = false; window.clearInterval(interval) }
  }, [])

  return (
    <motion.div
      className="visitor-counter-elite"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      title="Toplam ziyaret sayısı"
      aria-live="polite"
    >
      {/* Canlı nabız noktası */}
      <span className="vc-pulse-wrap" aria-hidden="true">
        <span className="vc-pulse-ring" />
        <span className="vc-pulse-dot" />
      </span>

      {/* Sayı */}
      <span className="vc-count">
        <AnimatePresence mode="wait">
          {ready ? (
            <motion.span
              key="count"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {animated.toLocaleString('tr-TR')}
            </motion.span>
          ) : (
            <motion.span
              key="dash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              —
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <span className="vc-label">ziyaret</span>
    </motion.div>
  )
}
