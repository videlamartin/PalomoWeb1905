'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { trackOrder } from '../acciones-publicas'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/types'
import type { Order } from '@/types'

export default function SeguimientoPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setOrder(null)

    try {
      const result = await trackOrder(orderId, email)
      setOrder(result)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Ocurrió un error inesperado.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-black-900">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl lg:text-5xl text-white uppercase tracking-wider mb-4">
            Mis Pedidos
          </h1>
          <p className="font-condensed text-gray-muted uppercase tracking-widest text-sm max-w-sm mx-auto">
            Ingresá el número de tu orden y el email con el que realizaste la compra para conocer su estado.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="orderId" className="block font-condensed text-xs text-gray-accent uppercase tracking-widest mb-2">
                Número de Orden
              </label>
              <input
                id="orderId"
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Ej: #A1B2C3D4"
                className="w-full bg-black-800/50 border border-white/10 text-white font-condensed px-4 py-3 focus:outline-none focus:border-red-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-condensed text-xs text-gray-accent uppercase tracking-widest mb-2">
                Email de Compra
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-black-800/50 border border-white/10 text-white font-condensed px-4 py-3 focus:outline-none focus:border-red-primary transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 font-condensed text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-condensed text-sm uppercase tracking-[0.2em] py-4 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Buscando...' : 'Buscar Pedido'}
            </button>
          </form>
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 border border-white/10 bg-black-800 p-6 lg:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
              <div>
                <h2 className="font-display text-2xl text-white uppercase tracking-wider">
                  Orden #{order.id.slice(0, 8).toUpperCase()}
                </h2>
                <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider mt-1">
                  Fecha: {new Date(order.created_at).toLocaleDateString('es-AR')}
                </p>
              </div>
              <div className={`px-4 py-2 border text-center font-condensed uppercase tracking-widest text-xs ${ORDER_STATUS_COLORS[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-condensed text-sm text-gray-accent uppercase tracking-widest border-b border-white/5 pb-2">
                Artículos
              </h3>
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-condensed text-white text-lg">{item.product_name}</p>
                    <p className="font-condensed text-gray-muted text-xs uppercase tracking-wider">
                      Talle {item.size} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-display text-xl text-white">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-end border-t border-white/10 pt-6">
              <p className="font-condensed text-gray-accent uppercase tracking-widest text-sm">
                Total Pagado
              </p>
              <p className="font-display text-3xl text-white">
                {formatPrice(order.total)}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
