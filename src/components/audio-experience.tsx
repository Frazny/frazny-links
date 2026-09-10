import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

export function AudioExperience() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [entered, setEntered] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [introMuted, setIntroMuted] = useState(true)

  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [entered])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100
  }, [volume])

  const toggleIntroSound = async () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIntroMuted(video.muted)
    if (video.paused) await video.play().catch(() => undefined)
  }

  const enterSite = async () => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 1
      try { await audio.play() } catch { setPlaying(false) }
    }
    setEntered(true)
    window.setTimeout(() => setShowIntro(false), 650)
  }

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try { await audio.play() } catch { setPlaying(false) }
    } else audio.pause()
  }

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  return (
    <>
      <audio ref={audioRef} src="./lockdown-theme.mp3" loop preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} />

      {showIntro && (
        <div className={`entry-screen ${entered ? 'is-leaving' : ''}`}>
          <video ref={videoRef} className="entry-video" src="./intro-video.mp4" autoPlay muted={introMuted} loop playsInline preload="auto" />
          <div className="entry-shade" />
          <button className="entry-sound" type="button" onClick={toggleIntroSound}>
            {introMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {introMuted ? 'Video sesini aç' : 'Video sesini kapat'}
          </button>
          <div className="entry-content">
            <img src="./profile.webp" alt="Frazny" />
            <p>WELCOME TO MY WORLD</p>
            <button type="button" onClick={enterSite}>Siteye Gir</button>
            <span>Ses açık başlayacak</span>
          </div>
        </div>
      )}

      {entered && (
        <div className={`audio-controller ${playing ? 'is-playing' : ''}`} aria-label="Arka plan müziği kontrolleri">
          <div className="audio-equalizer" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="audio-meta">
            <strong>Lockdown Theme</strong>
            <span>{playing ? 'Şimdi çalıyor' : 'Duraklatıldı'} · {formatTime(currentTime)}</span>
            <div className="audio-progress"><i style={{ '--audio-progress': `${progress}%` } as CSSProperties} /></div>
          </div>
          <button className="audio-play" type="button" onClick={togglePlayback} aria-label={playing ? 'Müziği durdur' : 'Müziği oynat'}>
            {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <div className="audio-volume">
            <Volume2 size={15} aria-hidden="true" />
            <input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Müzik ses seviyesi" />
            <span>{volume}%</span>
          </div>
        </div>
      )}
    </>
  )
}
