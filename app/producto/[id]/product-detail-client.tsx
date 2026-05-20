'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { ProductGallery } from '@/components/product/ProductGallery'
import { SizeSelector } from '@/components/product/SizeSelector'
import { CategoryBadge } from '@/components/ui/Badge'
import { formatPrice, getProductWhatsAppUrl } from '@/lib/utils'
import type { Product, ProductSize } from '@/types'

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const sizes = product.product_sizes ?? []
  const isOneSize = sizes.length === 1 && sizes[0].size === 'U'

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(() => {
    return isOneSize ? 'U' : null
  })
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addItem, openCart } = useCartStore()
  const primaryImage = product.images[0] ?? `https://picsum.photos/seed/palomo${product.id}/800/1000`

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Seleccioná un talle')
      return
    }

    const sizeData = sizes.find((s) => s.size === selectedSize)
    if (!sizeData || sizeData.stock === 0) {
      setError('Sin stock para el talle seleccionado')
      return
    }

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_image: primaryImage,
      size: selectedSize,
      quantity: 1,
      unit_price: product.price,
    })

    setAdded(true)
    setError(null)
    openCart()

    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
      {/* Gallery */}
      <div>
        <ProductGallery
          images={
            product.images.length > 0
              ? product.images
              : [
                  `https://picsum.photos/seed/palomo${product.id}/800/1000`,
                  `https://picsum.photos/seed/palomo${product.id}b/800/1000`,
                ]
          }
          productName={product.name}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 font-condensed text-xs text-gray-muted uppercase tracking-wider">
            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/catalogo?categoria=${product.category}`} className="hover:text-white transition-colors">{product.category}</Link></li>
          </ol>
        </nav>

        {/* Category badge */}
        <CategoryBadge category={product.category} />

        {/* Name */}
        <h1 className="font-display text-4xl md:text-5xl text-white uppercase tracking-wider leading-none">
          {product.name}
        </h1>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl text-white">{formatPrice(product.price)}</span>
          <span className="font-condensed text-xs text-gray-muted uppercase tracking-widest">ARS</span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="font-body text-sm text-gray-accent leading-relaxed border-l-2 border-red-primary/30 pl-4">
            {product.description}
          </p>
        )}

        {/* Size selector */}
        {!isOneSize && sizes.length > 0 && (
          <SizeSelector
            sizes={sizes}
            selectedSize={selectedSize}
            onSelect={(size) => {
              setSelectedSize(size)
              setError(null)
            }}
          />
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-condensed text-xs text-red-400 uppercase tracking-wider"
              role="alert"
            >
              ⚠ {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Add to cart */}
        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          className={`btn-primary w-full py-4 text-sm transition-all ${
            added ? 'bg-green-600 hover:bg-green-600' : ''
          }`}
          id={`add-to-cart-${product.id}`}
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Agregado al carrito
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                Agregar al carrito
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* WhatsApp button */}
        <a
          href={getProductWhatsAppUrl(product.name, selectedSize ?? undefined)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full py-4 text-sm"
          aria-label={`Consultar por WhatsApp sobre ${product.name}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Consultar por WhatsApp
        </a>

        {/* Trust mini */}
        <div className="grid grid-cols-2 gap-3 mt-2 pt-6 border-t border-white/5">
          {[
            { icon: '💳', text: 'Pago al recibir' },
            { icon: '📦', text: 'Envíos a todo el país' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">{item.icon}</span>
              <span className="font-condensed text-xs text-gray-muted uppercase tracking-wider">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
