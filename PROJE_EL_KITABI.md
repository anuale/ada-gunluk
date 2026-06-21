# Ada'nın Günlüğü — Proje El Kitabı

## Özet

Bebek gelişim takip uygulaması. 0-3 yaş arası çocuklar için günlük beslenme/uyku/bez/EC takibi, gelişim kilometre taşları, büyüme grafikleri, aşı takvimi, AI asistan, notlar ve rapor modülleri.

## Domain & Erişim

- **URL**: `https://ada.alnuai.com`
- **Cloudflare**: Full SSL modu + proxy AÇIK (turuncu bulut)
- **Coolify**: Domain alanına `https://ada.alnuai.com` yazılı
- **AUTH_URL**: docker-compose.yaml'da hardcode: `https://ada.alnuai.com`

## Önemli Kurallar

- `src/generated/prisma/` — auto-generated, asla el sürme
- Prisma import: `import { PrismaClient } from "@/generated/prisma/client"` (barrel index yok)
- Prisma adapter: `new PrismaPg(process.env["DATABASE_URL"]!)` → `lib/prisma.ts`
- Server auth: `import { auth } from "@/auth/config"` → `const session = await auth()`
- Client auth: `import { useSession } from "next-auth/react"` — Providers root layout'ta
- Renkler: globals.css'te CSS değişkenleri: `bg-primary`, `text-on-surface`, `bg-surface-container-low`
- Font: h1-h6 Playfair Display, body Inter. `font-sans`/`font-serif` override
- "@fontsource/inter" ve "@fontsource/playfair-display" paketleri — next/font/google DEĞİL
- `useSearchParams`: Next.js 16'da Suspense wrapper ZORUNLU
- `"use client"` directive client component'lere ekle
- Deployment: Docker image ARM64 olarak build edilmeli, GHCR'a push'lanmalı

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| Styling | TailwindCSS v4 (CSS-based @theme) |
| ORM | Prisma v7 + PostgreSQL |
| Auth | NextAuth v5 (Credentials + JWT) |
| AI | DeepSeek v4 Pro |
| DB adapter | @prisma/adapter-pg |
| UI icons | lucide-react |
| Charts | recharts |
| Toast | react-hot-toast |
| Offline | Dexie.js (IndexedDB) |
| Fonts | @fontsource/inter + @fontsource/playfair-display |

## Deployment Workflow

1. `npx next build` — kodu test et
2. `git add . && git commit && git push` — kodu pushla
3. `docker build --platform linux/arm64 -t ghcr.io/anuale/ada-gunluk:latest .` — ARM64 imaj build
4. `docker tag ghcr.io/anuale/ada-gunluk:latest ghcr.io/anuale/ada-gunluk:$(git rev-parse --short HEAD)` — SHA tag
5. `docker push ghcr.io/anuale/ada-gunluk:$(git rev-parse --short HEAD) && docker push ghcr.io/anuale/ada-gunluk:latest` — push
6. `sed -i '' "s|image: ghcr.io/anuale/ada-gunluk:.*|image: ghcr.io/anuale/ada-gunluk:$(git rev-parse --short HEAD)|" docker-compose.yaml` — SHA pin
7. `git add docker-compose.yaml && git commit -m "Pin image to SHA" && git push` — compose güncelle
8. Coolify otomatik redeploy (pull_policy: always)

**Önemli:** Sadece kod push'lamak yeterli DEĞİL. Docker image'ı mutlaka build edip push'lamalısın. Yoksa Coolify eski image'ı kullanır, değişiklikler görünmez.

## Docker / Coolify Yapılandırması

- **docker-compose.yaml**: `coolify` external network + `pull_policy: always` + expose:3000
- **Dockerfile**: Multi-stage (builder + runner), Alpine Linux, standalone output
- **start.sh**: `npx prisma migrate deploy && node server.js`
- Host port bağlaması YOK (port çakışmasını önlemek için). Coolify Traefik proxy'si direkt Docker network üzerinden routelar
- DB iç network üzerinden `ada-db:5432` adresinde

## Veritabanı Şeması (Ana Tablolar)

Family, User, Session, Account, Child, DailyLog, DailyReflection, Milestone,
GrowthMeasurement, Vaccination, DoctorVisit, Note, AIAnalysis, Report, KnowledgeItem

- **Milestone**: `ageMonth` Float (haftalık değerleri destekler)
- **DailyLog**: type alanı: feeding, sleep, diaper, ec, development, teeth

## Dosya Yapısı

```
src/app/(app)/
├── layout.tsx                    # Auth korumalı layout (Sidebar + TopBar + BottomNav)
├── dashboard/page.tsx            # Ana sayfa (100+ dönen öneri, AI chat, haftalık gelişim)
├── timeline/page.tsx             # Günlük (tarih başlıklı, detaylı log, edit/sil, FAB)
├── development/page.tsx          # Gelişim (7 tab: milestone, büyüme, aşı, diş, doktor, gözlem, atak)
├── assistant/page.tsx            # AI sohbet
├── notes/page.tsx                # Notlar (CRUD, etiket, arama, favori)
├── reports/page.tsx              # Raporlar (günlük/haftalık/aylık/yıllık TXT)
├── settings/page.tsx             # Ayarlar (aile/çocuk düzenle, kullanıcı yönetimi)
├── children/page.tsx             # Çocuk listesi
└── children/new/page.tsx         # Yeni çocuk (otomatik milestone + aşı seed)

src/components/
├── providers.tsx                 # SessionProvider
├── pwa-register.tsx              # Service worker
├── layout/
│   ├── navigation.tsx            # Sidebar + BottomNav
│   └── topbar.tsx                # TopBar (hamburger menü + user dropdown)
└── tracking/
    ├── log-form.tsx              # Beslenme/Uyku/Bez/EC form (multi-entry breast, kronometre + manuel)
    ├── timer.tsx                 # Kronometre (formatDuration, formatTimeAgo)
    └── reflection.tsx            # Gün sonu

src/lib/
├── prisma.ts                     # PrismaClient singleton (PrismaPg adapter ile)
├── ai/client.ts                  # DeepSeek API + BOOK_KNOWLEDGE prompt
├── db/offline.ts                 # Dexie.js offline
└── data/
    ├── milestones.ts             # 136 milestone (haftalık/aylık, 0-36 ay)
    ├── vaccines.ts               # T.C. aşı takvimi (18 aşı)
    └── leaps.ts                  # Wonder Weeks 10 atak haftası
```

## Bilinen Sorunlar / Önemli Notlar

1. **Deploy sonrası eski kod**: Sadece git push yetmez, Docker image MUTLAKA rebuild edilmeli
2. **Mobile modal X butonu**: Modal yüksekliği `max-h-[450px]` olarak sabitlendi. Düzenleme modunda içerik uzunsa scroll yap
3. **Kronometre beslenmede**: Zaten var. "Anne Sütü" seçince gri kutuda görünüyor
4. **Beslenme multi-entry**: Sol/Sağ meme seç → kronometre VEYA manuel saat gir → "+ Ekle" → listeye eklenir → Kaydet
5. **Log sıralaması**: startedAt desc (en yeni en üstte)
6. **Milestone label formatı**: `fmtAgeMonth()` fonksiyonu ile "1. Ay / 2. Hafta" formatında
7. **Coolify domain**: `https://ada.alnuai.com` yazılı olmalı, sadece `ada.alnuai.com` çalışmıyor
8. **AUTH_URL silinemez**: docker-compose'ta hardcoded, Coolify env'deki değeri görmezden gelinir

## Admin Kullanıcısı

`alnuale@gmail.com` — sadece bu kullanıcı Ayarlar'dan kullanıcı ekleyip çıkarabilir

## GitHub

- Repo: https://github.com/anuale/ada-gunluk
- GHCR Image: ghcr.io/anuale/ada-gunluk
- GitHub Actions: KALDIRILDI (AMD64 build yapıp ARM64 image'ın üstüne yazıyordu)
