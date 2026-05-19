import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { getWhatsAppUrl } from '@/lib/utils'
import { HeroSection } from './hero-section'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title: 'El Palomo 1950 | Indumentaria Oficial Independiente',
  description: 'Tienda oficial de ropa de Club Atlético Independiente. Camisetas, buzos, pantalones y accesorios Puma y Kanji. Pago al recibir. Envíos a todo Argentina.',
}

const CATEGORIES = [
  {
    href: '/catalogo?categoria=camisetas',
    label: 'Camisetas',
    desc: 'Puma oficial',
    image: 'https://picsum.photos/seed/cat-camisetas/600/700',
  },
  {
    href: '/catalogo?categoria=buzos',
    label: 'Buzos',
    desc: 'Kanji & Puma',
    image: 'https://picsum.photos/seed/cat-buzos/600/700',
  },
  {
    href: '/catalogo?categoria=pantalones',
    label: 'Pantalones',
    desc: 'Training & Buzo',
    image: 'https://picsum.photos/seed/cat-pantalones/600/700',
  },
  {
    href: '/catalogo?categoria=accesorios',
    label: 'Accesorios',
    desc: 'Gorras, bufandas & más',
    image: 'https://picsum.photos/seed/cat-accesorios/600/700',
  },
]

const TRUST_ITEMS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Pago al recibir',
    desc: 'Abonás cuando llega el producto a tu domicilio. Sin riesgos.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Envíos a todo el país',
    desc: 'Despachamos a cualquier provincia de Argentina. Seguimiento incluido.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Fotos y videos propios',
    desc: 'Todo el contenido es nuestro — sin catálogos genéricos.',
  },
]

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, product_sizes(*)')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) return []
    return (data as Product[]) ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <HeroSection />

      {/* CATEGORIES */}
      <section className="py-20 bg-black-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="section-title">Categorías</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="relative overflow-hidden aspect-[3/4] group block bg-black-700 border border-white/5 hover:border-red-primary/50 transition-all duration-300"
                aria-label={`Ver ${cat.label}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black-900/90 via-black-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-2xl text-white uppercase tracking-wider group-hover:text-red-primary transition-colors">
                    {cat.label}
                  </h3>
                  <p className="font-condensed text-xs text-gray-accent mt-0.5 uppercase tracking-wider">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-black-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <h2 className="section-title">Destacados</h2>
              <div className="hidden sm:block h-px w-24 bg-red-primary/50" />
            </div>
            <Link href="/catalogo" className="btn-secondary text-xs px-6 py-2 hidden sm:flex">
              Ver todo
            </Link>
          </div>

          {featured.length > 0 ? (
            <ProductGrid products={featured} columns={4} />
          ) : (
            <div className="space-y-6">
              <ProductGridSkeleton count={8} />
              <p className="text-center font-condensed text-xs text-gray-muted uppercase tracking-wider">
                Conectando con Supabase...
              </p>
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link href="/catalogo" className="btn-secondary">Ver todo el catálogo</Link>
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="py-16 bg-black-900 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {TRUST_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 border border-white/5 hover:border-red-primary/30 transition-colors"
              >
                <div className="text-red-primary flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-display text-xl text-white uppercase tracking-wider mb-1">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-gray-accent leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="py-20 bg-black-800/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title mb-4">¿Tenés dudas?</h2>
          <p className="font-body text-gray-accent mb-8 leading-relaxed max-w-md mx-auto">
            Escribinos por WhatsApp y te respondemos al toque. Consultá disponibilidad,
            talles o cualquier duda sobre los productos.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp px-12 py-4 text-sm"
            aria-label="Contactar por WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Escribinos al WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
