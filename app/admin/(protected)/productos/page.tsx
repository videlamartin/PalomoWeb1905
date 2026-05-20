import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'
import { ProductosClient } from './productos-client'

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*, product_sizes(*)')
      .order('created_at', { ascending: false })
    return (data as Product[]) ?? []
  } catch {
    return []
  }
}

export default async function AdminProductosPage() {
  const products = await getProducts()
  return <ProductosClient initialProducts={products} />
}
