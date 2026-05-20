'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import type { ProductSize } from '@/types'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore()
  const total = getTotal()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-black-800 border-l border-white/5 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div>
                <h2 className="font-display text-2xl text-white uppercase tracking-wider">Tu Carrito</h2>
                <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider mt-0.5">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-gray-accent hover:text-white transition-colors"
                aria-label="Cerrar carrito"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <svg className="w-16 h-16 text-gray-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="font-condensed text-gray-muted uppercase tracking-wider text-sm">
                    El carrito está vacío
                  </p>
                  <div className="flex flex-col gap-3 w-full max-w-[200px] mx-auto mt-6">
                    <Link
                      href="/catalogo"
                      onClick={closeCart}
                      className="btn-secondary w-full py-2 text-xs text-center"
                    >
                      Ver catálogo
                    </Link>
                    <Link
                      href="/seguimiento"
                      onClick={closeCart}
                      className="btn-secondary w-full py-2 text-xs text-center"
                    >
                      Mis pedidos
                    </Link>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.product_id}-${item.size}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 pb-4 border-b border-white/5"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-24 flex-shrink-0 bg-black-700 overflow-hidden">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-condensed text-sm text-white uppercase tracking-wide leading-tight truncate">
                          {item.product_name}
                        </p>
                        <p className="font-condensed text-xs text-gray-muted uppercase tracking-widest mt-1">
                          {item.size === 'U' ? 'Talle Único' : `Talle: ${item.size}`}
                        </p>
                        <p className="font-display text-lg text-red-primary mt-1">
                          {formatPrice(item.unit_price * item.quantity)}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.size as ProductSize, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-white/20 text-white hover:border-red-primary hover:text-red-primary transition-colors text-sm"
                            aria-label="Reducir cantidad"
                          >
                            −
                          </button>
                          <span className="font-condensed text-sm w-6 text-center">{item.quantity}</span>
                          <button
                             onClick={() => updateQuantity(item.product_id, item.size as ProductSize, item.quantity + 1)}
                             disabled={item.stock !== undefined && item.quantity >= item.stock}
                             className="w-6 h-6 flex items-center justify-center border border-white/20 text-white hover:border-red-primary hover:text-red-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white disabled:hover:border-white/20 transition-colors text-sm"
                             aria-label="Aumentar cantidad"
                             title={item.stock !== undefined && item.quantity >= item.stock ? "Límite de stock alcanzado" : undefined}
                           >
                             +
                           </button>
                          <button
                            onClick={() => removeItem(item.product_id, item.size as ProductSize)}
                            className="ml-auto text-gray-muted hover:text-red-primary transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-condensed text-sm text-gray-accent uppercase tracking-wider">Total</span>
                  <span className="font-display text-3xl text-white">{formatPrice(total)}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full py-4 text-sm"
                  id="cart-checkout-btn"
                >
                  Ir al checkout
                </Link>

                <button
                  onClick={closeCart}
                  className="btn-secondary w-full py-3 text-xs"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
