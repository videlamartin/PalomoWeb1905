'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { CategoryBadge } from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const primaryImage = product.images[0] ?? `https://picsum.photos/seed/palomo${product.id}/800/1000`
  const secondaryImage = product.images[1] ?? product.images[0] ?? primaryImage

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        href={`/producto/${product.id}`}
        className="card-product flex flex-col group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Ver ${product.name}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-black-700">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ${hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <Image
            src={secondaryImage}
            alt={`${product.name} - vista alternativa`}
            fill
            className={`object-cover transition-all duration-700 absolute inset-0 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-red text-[10px]">Destacado</span>
            </div>
          )}

          {/* Quick view overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black-900/90 to-transparent py-4 px-4 flex items-end"
          >
            <span className="font-condensed text-xs text-white uppercase tracking-widest">
              Ver producto →
            </span>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col gap-1.5">
          <CategoryBadge category={product.category} />
          <h3 className="font-condensed text-sm text-white uppercase tracking-wide leading-tight group-hover:text-red-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="font-display text-xl text-white">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
