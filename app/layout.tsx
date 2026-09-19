import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export const metadata: Metadata = {
  title: 'Sambite – AI Kulinariya Şefi',
  description:
    'Soyuducunuzdakıları möhtəşəm ziyafətə çevirin. Sambite, əlinizdə olan istənilən ərzaqlardan qurman reseptləri yaratmaq üçün süni intellekt istifadə edir.',
  keywords: 'Süni intellekt resepti, soyuducu qalıqları, kulinariya AI, resept yaradıcısı, Sambite',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Sambite – AI Kulinariya Şefi',
    description: 'Soyuducunuzda qalanları şedevrə çevirin.',
    type: 'website',
    siteName: 'Sambite',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sambite – AI Kulinariya Şefi',
    description: 'Soyuducunuzda qalanları şedevrə çevirin.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
