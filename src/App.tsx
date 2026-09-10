import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { IconType } from 'react-icons'
import { SiDiscord, SiGithub, SiGmail, SiInstagram, SiSpotify, SiSteam } from 'react-icons/si'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { Card } from '@/components/ui/card'
import { CursorGlow } from '@/components/ui/cursor-glow'
import { VisitorCounter } from '@/components/visitor-counter'
import { SpotifyNowPlaying } from '@/components/spotify-now-playing'
import { AudioExperience } from '@/components/audio-experience'

const links: { name: string; handle: string; href: string; icon: IconType; accent: string }[] = [
  { name: 'Spotify', handle: 'Ne dinlediğime göz at', href: 'https://open.spotify.com/user/8x5yr03fshgcl5rtsm2z0fwpk', icon: SiSpotify, accent: '#1ED760' },
  { name: 'Steam', handle: 'Frazny', href: 'https://steamcommunity.com/id/Frazny/', icon: SiSteam, accent: '#66c0f4' },
  { name: 'Discord', handle: '@frazny', href: 'https://discord.com/channels/@frazny', icon: SiDiscord, accent: '#5865F2' },
  { name: 'Instagram', handle: '@bilal_qnk', href: 'https://www.instagram.com/bilal_qnk/', icon: SiInstagram, accent: '#E4405F' },
  { name: 'GitHub', handle: '@Frazny', href: 'https://github.com/Frazny', icon: SiGithub, accent: '#f4f4f5' },
]

function LinkCard({ item }: { item: (typeof links)[number] }) {
  const Icon = item.icon
  return (
    <a className="link-card group" href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.name} bağlantısını aç`}>
      <span className="icon-box" style={{ '--accent': item.accent } as CSSProperties}><Icon size={21} /></span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-zinc-100">{item.name}</span>
        <span className="block truncate text-sm text-zinc-500">{item.handle}</span>
      </span>
      <ArrowUpRight className="arrow" size={19} />
    </a>
  )
}

export default function App() {
  return (
    <main className="site-shell">
      <AudioExperience />
      <CursorGlow />
      <div className="noise" aria-hidden="true" />
      <nav className="nav-wrap" aria-label="Ana navigasyon">
        <a href="#top" className="brand" aria-label="Sayfanın başına dön"><img src="./profile.webp" alt="Frazny profil resmi" /></a>
        <a href="#links" className="nav-link">Bağlantılar</a>
        <a href="#contact" className="nav-link">İletişim</a>
      </nav>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <Card className="hero-card">
          <Spotlight size={420} />
          <div className="hero-copy">
            <p className="eyebrow"><span /> AVAILABLE ONLINE</p>
            <h1 id="hero-title">Hey, ben <strong>Frazny.</strong></h1>
            <p className="intro">Dijital dünyadaki köşem. Oynadıklarım, dinlediklerim ve ürettiklerim — hepsi tek yerde.</p>
            <a href="#links" className="primary-button">Bağlantıları keşfet <ArrowUpRight size={18} /></a>
          </div>
          <div className="spline-wrap" aria-label="Etkileşimli 3D obje">
            <div className="spline-glow" />
            <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="h-full w-full" />
          </div>
        </Card>
      </section>

      <section className="now-playing-section" aria-label="Şu anda Spotify'da çalan müzik">
        <SpotifyNowPlaying />
      </section>

      <section id="links" className="content-section" aria-labelledby="links-title">
        <div className="section-heading">
          <p className="eyebrow"><span /> FIND ME ONLINE</p>
          <h2 id="links-title">Bağlantılar</h2>
          <p>Takip etmek, birlikte oynamak veya neler dinlediğimi görmek için.</p>
        </div>
        <div className="links-grid">{links.map((item) => <LinkCard key={item.name} item={item} />)}</div>
      </section>

      <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
        <Card className="contact-card">
          <div>
            <p className="eyebrow"><span /> SAY HELLO</p>
            <h2 id="contact-title">Bir fikrin mi var?</h2>
            <p>Projeler, iş birlikleri veya sadece merhaba demek için e-posta gönderebilirsin.</p>
          </div>
          <a className="mail-button" href="https://mail.google.com/mail/u/0/?fs=1&to=fraznybusiness@gmail.com&tf=cm" target="_blank" rel="noreferrer">
            <SiGmail size={19} /> E-posta gönder <ArrowUpRight size={18} />
          </a>
        </Card>
      </section>

      <footer><span>© {new Date().getFullYear()} Frazny</span><VisitorCounter /></footer>
    </main>
  )
}
