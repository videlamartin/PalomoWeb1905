import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/ProductGrid'
import type { Product, ProductCategory, ProductSize } from '@/types'
import { CATEGORY_LABELS } from '@/types'

interface CatalogoPageProps {
  searchParams: {
    categoria?: string
    talle?: string
    pagina?: string
  }
}

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Explorá toda la indumentaria oficial de Independiente. Camisetas, buzos, pantalones y accesorios Puma y Kanji.',
}

const PAGE_SIZE = 12

const CATEGORIES: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Todo' },
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'buzos', label: 'Buzos' },
  { value: 'pantalones', label: 'Pantalones' },
  { value: 'accesorios', label: 'Accesorios' },
]

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

async function getProducts(
  category?: string,
  size?: string,
  page: number = 1
): Promise<{ products: Product[]; total: number }> {
  try {
    const supabase = createClient()
    let selectQuery = '*, product_sizes(*)'
    if (size) {
      selectQuery = '*, product_sizes!inner(*)'
    }

    let query = supabase
      .from('products')
      .select(selectQuery, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (size) {
      query = query.eq('product_sizes.size', size).gt('product_sizes.stock', 0)
    }

    const { data, count, error } = await query
    if (error) return { products: [], total: 0 }
    return { products: (data as unknown as Product[]) ?? [], total: count ?? 0 }
  } catch {
    return { products: [], total: 0 }
  }
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const category = searchParams.categoria
  const size = searchParams.talle
  const page = parseInt(searchParams.pagina ?? '1', 10)

  const { products, total } = await getProducts(category, size, page)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const buildUrl = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams()
    const merged = { categoria: category, talle: size, pagina: undefined, ...params }
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== 'all') sp.set(k, v)
    })
    const s = sp.toString()
    return `/catalogo${s ? `?${s}` : ''}`
  }

  return (
    <div className="min-h-screen bg-black-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-red-primary" />
            <span className="font-condensed text-xs text-red-primary tracking-[0.4em] uppercase">
              Colección Completa
            </span>
          </div>
          <h1 className="font-display text-hero-sm text-white uppercase">Catálogo</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            {/* Category filter */}
            <div className="mb-8">
              <h2 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-4">
                Categoría
              </h2>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = cat.value === 'all' ? !category || category === 'all' : category === cat.value
                  return (
                    <Link
                      key={cat.value}
                      href={buildUrl({ categoria: cat.value })}
                      className={`font-condensed text-sm uppercase tracking-wider px-3 py-2 border transition-colors ${
                        isActive
                          ? 'border-red-primary text-red-primary bg-red-primary/10'
                          : 'border-white/10 text-gray-accent hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Size filter */}
            <div>
              <h2 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-4">
                Talle
              </h2>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {[
                  { value: undefined, label: 'Todos' },
                  ...SIZES.map((s) => ({ value: s, label: s })),
                ].map((opt) => {
                  const isActive = opt.value ? size === opt.value : !size
                  return (
                    <Link
                      key={opt.label}
                      href={buildUrl({ talle: opt.value, pagina: '1' })}
                      className={`font-condensed text-sm uppercase tracking-wider px-3 py-2 border transition-colors ${
                        isActive
                          ? 'border-red-primary text-red-primary bg-red-primary/10'
                          : 'border-white/10 text-gray-accent hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Results info */}
            <div className="flex items-center justify-between mb-6">
              <p className="font-condensed text-sm text-gray-muted uppercase tracking-wider">
                {total} {total === 1 ? 'producto' : 'productos'}
                {category && category !== 'all' && ` en ${CATEGORY_LABELS[category as ProductCategory]}`}
              </p>
            </div>

            {products.length > 0 ? (
              <>
                <ProductGrid products={products} columns={3} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    {page > 1 && (
                      <Link
                        href={buildUrl({ pagina: String(page - 1) })}
                        className="btn-secondary px-4 py-2 text-xs"
                      >
                        ← Anterior
                      </Link>
                    )}
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Link
                        key={i}
                        href={buildUrl({ pagina: String(i + 1) })}
                        className={`w-8 h-8 flex items-center justify-center font-condensed text-xs border transition-colors ${
                          page === i + 1
                            ? 'border-red-primary bg-red-primary text-white'
                            : 'border-white/10 text-gray-accent hover:border-white/30'
                        }`}
                      >
                        {i + 1}
                      </Link>
                    ))}
                    {page < totalPages && (
                      <Link
                        href={buildUrl({ pagina: String(page + 1) })}
                        className="btn-secondary px-4 py-2 text-xs"
                      >
                        Siguiente →
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="font-condensed text-gray-muted uppercase tracking-wider mb-6">
                  No hay productos disponibles
                </p>
                <Link href="/catalogo" className="btn-secondary px-8 py-3 text-xs">
                  Ver todo el catálogo
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
