import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/ProductGrid'
import type { Product } from '@/types'
import { ProductDetailClient } from './product-detail-client'

interface ProductPageProps {
  params: { id: string }
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, product_sizes(*)')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data as Product
  } catch {
    return null
  }
}

async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*, product_sizes(*)')
      .eq('category', category)
      .neq('id', excludeId)
      .limit(4)

    return (data as Product[]) ?? []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id)
  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} — Indumentaria oficial de Independiente. Pago al recibir.`,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  const related = await getRelatedProducts(product.category, product.id)

  return (
    <div className="min-h-screen bg-black-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailClient product={product} />

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="font-display text-3xl text-white uppercase tracking-wider">
                También te puede interesar
              </h2>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <ProductGrid products={related} columns={4} />
          </section>
        )}
      </div>
    </div>
  )
}
