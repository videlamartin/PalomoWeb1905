'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { trackOrder } from '../acciones-publicas'
import { formatPrice, getWhatsAppUrl } from '@/lib/utils'
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
      if ('error' in result) {
        setError(result.error)
      } else {
        setOrder(result.data)
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al buscar la orden.')
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
                className="w-full bg-black-800 border border-white/10 text-white font-condensed px-4 py-3 focus:outline-none focus:border-red-primary transition-colors focus:bg-black-800 autofill:bg-black-800"
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
                className="w-full bg-black-800 border border-white/10 text-white font-condensed px-4 py-3 focus:outline-none focus:border-red-primary transition-colors focus:bg-black-800 autofill:bg-black-800"
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
              className="w-full bg-red-primary text-white font-condensed text-sm uppercase tracking-[0.2em] py-4 hover:bg-red-600 transition-colors disabled:opacity-50"
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
                      {item.size === 'U' ? 'Talle Único' : `Talle ${item.size}`} x {item.quantity}
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

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider text-center mb-4">
                ¿Tenés alguna duda sobre tu pedido?
              </p>
              <a
                href={getWhatsAppUrl(`Hola! Tengo una consulta sobre mi pedido #${order.id.slice(0, 8).toUpperCase()}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full py-4 text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
