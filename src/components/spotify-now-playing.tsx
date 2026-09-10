import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArrowUpRight, AudioLines, Music2 } from 'lucide-react'

const DISCORD_USER_ID = '780466364636332062'
const LANYARD_URL = 'https://api.lanyard.rest/v1/users/' + DISCORD_USER_ID

type SpotifyActivity = {
  timestamps: { start: number; end: number }
  album: string
  album_art_url: string
  artist: string
  song: string
  track_id: string
}

type LanyardResponse = {
  success: boolean
  data?: { spotify: SpotifyActivity | null }
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function SpotifyNowPlaying() {
  const [spotify, setSpotify] = useState<SpotifyActivity | null>(null)
  const [now, setNow] = useState(Date.now())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true

    const loadActivity = async () => {
      try {
        const response = await fetch(LANYARD_URL, { cache: 'no-store' })
        if (!response.ok) throw new Error('Lanyard bağlantısı başarısız')
        const result = (await response.json()) as LanyardResponse
        if (active) setSpotify(result.success ? result.data?.spotify ?? null : null)
      } catch {
        if (active) setSpotify(null)
      } finally {
        if (active) setLoaded(true)
      }
    }

    void loadActivity()
    const refreshTimer = window.setInterval(loadActivity, 10_000)
    const progressTimer = window.setInterval(() => setNow(Date.now()), 1_000)

    return () => {
      active = false
      window.clearInterval(refreshTimer)
      window.clearInterval(progressTimer)
    }
  }, [])

  const progress = useMemo(() => {
    if (!spotify) return 0
    const duration = spotify.timestamps.end - spotify.timestamps.start
    return Math.min(100, Math.max(0, ((now - spotify.timestamps.start) / duration) * 100))
  }, [spotify, now])

  if (!spotify) {
    return (
      <div className="spotify-card spotify-idle" aria-live="polite">
        <span className="spotify-icon"><Music2 size={22} /></span>
        <div>
          <span className="spotify-label">SPOTIFY</span>
          <p>{loaded ? 'Şu anda müzik dinlemiyor' : 'Spotify durumu yükleniyor…'}</p>
        </div>
      </div>
    )
  }

  const elapsed = now - spotify.timestamps.start
  const duration = spotify.timestamps.end - spotify.timestamps.start

  return (
    <div className="spotify-card" aria-live="polite">
      <img className="spotify-cover" src={spotify.album_art_url} alt={`${spotify.album} albüm kapağı`} />
      <div className="spotify-details">
        <span className="spotify-label"><AudioLines size={13} /> ŞİMDİ DİNLİYOR</span>
        <strong>{spotify.song}</strong>
        <p>{spotify.artist}</p>
        <div className="spotify-progress" aria-label="Şarkı ilerleme durumu">
          <span style={{ '--spotify-progress': `${progress}%` } as CSSProperties} />
        </div>
        <div className="spotify-times"><span>{formatTime(elapsed)}</span><span>{formatTime(duration)}</span></div>
      </div>
      <a className="spotify-open" href={'https://open.spotify.com/track/' + spotify.track_id} target="_blank" rel="noreferrer" aria-label="Şarkıyı Spotify'da aç">
        <ArrowUpRight size={18} />
      </a>
    </div>
  )
}
