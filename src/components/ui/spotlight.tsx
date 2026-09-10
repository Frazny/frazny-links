import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useSpring, useTransform, type SpringOptions } from 'framer-motion'
import { cn } from '@/lib/utils'

type SpotlightProps = {
  className?: string
  size?: number
  springOptions?: SpringOptions
}

export function Spotlight({ className, size = 260, springOptions = { bounce: 0 } }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null)
  const mouseX = useSpring(0, springOptions)
  const mouseY = useSpring(0, springOptions)
  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`)

  useEffect(() => {
    const parent = containerRef.current?.parentElement
    if (parent) {
      parent.style.position = 'relative'
      parent.style.overflow = 'hidden'
      setParentElement(parent)
    }
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!parentElement) return
    const { left, top } = parentElement.getBoundingClientRect()
    mouseX.set(event.clientX - left)
    mouseY.set(event.clientY - top)
  }, [mouseX, mouseY, parentElement])

  const handleEnter = useCallback(() => setIsHovered(true), [])
  const handleLeave = useCallback(() => setIsHovered(false), [])

  useEffect(() => {
    if (!parentElement) return
    parentElement.addEventListener('mousemove', handleMouseMove)
    parentElement.addEventListener('mouseenter', handleEnter)
    parentElement.addEventListener('mouseleave', handleLeave)
    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove)
      parentElement.removeEventListener('mouseenter', handleEnter)
      parentElement.removeEventListener('mouseleave', handleLeave)
    }
  }, [parentElement, handleMouseMove, handleEnter, handleLeave])

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,.18),rgba(114,90,255,.08)_42%,transparent_72%)] blur-xl transition-opacity duration-300',
        isHovered ? 'opacity-100' : 'opacity-0', className,
      )}
      style={{ width: size, height: size, left: spotlightLeft, top: spotlightTop }}
    />
  )
}
