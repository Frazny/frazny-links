import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CursorGlow() {
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const glowX = useSpring(pointerX, { stiffness: 125, damping: 24, mass: 0.5 })
  const glowY = useSpring(pointerY, { stiffness: 125, damping: 24, mass: 0.5 })
  const ringX = useSpring(pointerX, { stiffness: 520, damping: 34, mass: 0.25 })
  const ringY = useSpring(pointerY, { stiffness: 520, damping: 34, mass: 0.25 })
  const [visible, setVisible] = useState(false)
  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('custom-cursor-enabled')
    const move = (event: PointerEvent) => {
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
      setVisible(true)
      setInteractive(Boolean((event.target as Element | null)?.closest('a, button, input')))
    }
    const hide = () => setVisible(false)
    const show = () => setVisible(true)
    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', hide)
    document.documentElement.addEventListener('pointerenter', show)
    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled')
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.documentElement.removeEventListener('pointerenter', show)
    }
  }, [pointerX, pointerY])

  return (
    <div className={`cursor-layer ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <motion.div className="cursor-aura" style={{ left: glowX, top: glowY }} />
      <motion.div className={`cursor-anchor ${interactive ? 'is-interactive' : ''}`} style={{ left: ringX, top: ringY }}>
        <span className="cursor-ring" /><span className="cursor-dot" />
      </motion.div>
    </div>
  )
}
