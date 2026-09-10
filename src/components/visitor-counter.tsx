import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

const COUNTER_URL = 'https://api.counterapi.dev/v1/frazny-links/visits'
const SESSION_KEY = 'frazny-visit-counted-v1'

type CounterResponse = { count?: number; value?: number }

function readCount(data: CounterResponse) {
  return typeof data.count === 'number' ? data.count : typeof data.value === 'number' ? data.value : null
}

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    const loadCount = async (increment = false) => {
      try {
        const response = await fetch(`${COUNTER_URL}${increment ? '/up' : ''}`, { cache: 'no-store' })
        if (!response.ok) throw new Error('Sayaç servisine ulaşılamadı')
        const nextCount = readCount((await response.json()) as CounterResponse)
        if (active && nextCount !== null) setCount(nextCount)
      } catch {
        // Sayaç servisi geçici olarak kapalıysa site çalışmaya devam eder.
      }
    }

    const shouldIncrement = !sessionStorage.getItem(SESSION_KEY)
    if (shouldIncrement) sessionStorage.setItem(SESSION_KEY, '1')
    void loadCount(shouldIncrement)

    const interval = window.setInterval(() => void loadCount(false), 30_000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  return (
    <span className="visitor-counter" title="Toplam ziyaret sayısı" aria-live="polite">
      <Eye size={14} aria-hidden="true" />
      {count === null ? 'Ziyaretçi —' : `${count.toLocaleString('tr-TR')} ziyaret`}
      <i aria-hidden="true" />
    </span>
  )
}
