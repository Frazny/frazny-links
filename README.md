# Frazny Links

Spline 3D sahnesi, link-in-bio bağlantıları ve iletişim alanı içeren React + TypeScript sitesi.

## Yapı

- React + Vite + TypeScript
- Tailwind CSS
- shadcn uyumlu `components.json`
- UI bileşenleri: `src/components/ui`
- Global stiller: `src/index.css`
- GitHub Pages otomatik yayın workflow'u

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

Üretim kontrolü:

```bash
npm run build
npm run preview
```

## GitHub Pages ile yayınlama

1. Bu klasörün içeriğini yeni veya mevcut GitHub repona gönder.
2. Repo ayarlarında **Settings → Pages → Source** alanını **GitHub Actions** olarak seç.
3. `main` branch'ine push yaptığında `.github/workflows/deploy.yml` siteyi otomatik yayınlar.

Vite `base: './'` kullandığı için proje hem kullanıcı/organizasyon sayfasında hem de repo alt yolunda çalışır.

## shadcn hakkında

Bu repo shadcn klasör ve alias yapısına hazırdır. Varsayılan bileşen dizini `src/components/ui`, stil dosyası `src/index.css` olarak `components.json` içinde tanımlıdır. `@/components/ui` importlarının güvenilir çalışması ve shadcn CLI'ın bileşenleri tek bir standart konuma eklemesi için bu klasör korunmalıdır.

Yeni bir projede aynı altyapıyı kurmak için:

```bash
npm create vite@latest my-site -- --template react-ts
cd my-site
npm install
npx shadcn@latest init
npm install @splinetool/runtime @splinetool/react-spline framer-motion lucide-react
```

## İçerik düzenleme

Bağlantılar `src/App.tsx` dosyasındaki `links` dizisindedir. E-posta CTA bağlantısı da aynı dosyadadır.

> Not: Discord bağlantısı kullanıcı tarafından verilen haliyle korunmuştur. Discord profil bağlantısı çalışmazsa geçerli bir davet veya profil URL'si ile değiştirin.
