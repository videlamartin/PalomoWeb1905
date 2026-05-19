import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
}

const COLUMN_CLASSES = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  return (
    <div className={`grid ${COLUMN_CLASSES[columns]} gap-4 md:gap-6`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
