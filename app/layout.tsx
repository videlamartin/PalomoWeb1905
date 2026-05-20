import type { Metadata } from 'next'
import { Bebas_Neue, Barlow_Condensed, Barlow } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Analytics } from '@vercel/analytics/next'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'El Palomo 1950 | Indumentaria Oficial Independiente',
    template: '%s | El Palomo 1950',
  },
  description:
    'Tienda oficial de indumentaria del Club Atlético Independiente. Camisetas, buzos, pantalones y accesorios Puma y Kanji. Pago al recibir. Envíos a todo el país.',
  keywords: [
    'Independiente',
    'Club Atlético Independiente',
    'camiseta Independiente',
    'indumentaria Independiente',
    'Puma Independiente',
    'Kanji Independiente',
    'El Palomo 1950',
    'ropa oficial Independiente',
  ],
  authors: [{ name: 'El Palomo 1950' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'El Palomo 1950',
    title: 'El Palomo 1950 | Indumentaria Oficial Independiente',
    description: 'La mejor ropa del Rojo. Pago al recibir. Envíos a todo el país.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${barlowCondensed.variable} ${barlow.variable}`}
    >
      <body className="bg-black-900 text-white min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
