import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

const COUNTER_KEY = 'frazny-is-a-dev-visits'
const BASE_URL = 'https://countapi.mileshilliard.com/api/v1'
const SESSION_KEY = 'frazny-visit-counted-v1'

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    const loadCount = async (increment = false) => {
      try {
        const endpoint = increment ? 'hit' : 'get'
        const response = await fetch(`${BASE_URL}/${endpoint}/${COUNTER_KEY}`, {
          cache: 'no-store',
        })
        if (!response.ok) throw new Error('Sayaç servisine ulaşılamadı')
        const data = await response.json()
        const value = parseInt(data.value, 10)
        if (active && !isNaN(value)) setCount(value)
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
