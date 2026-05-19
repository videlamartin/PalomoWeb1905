import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, getOrderWhatsAppUrl } from '@/lib/utils'
import type { Order } from '@/types'
import type { Metadata } from 'next'

interface ConfirmationPageProps {
  params: { orderId: string }
}

export const metadata: Metadata = {
  title: 'Pedido confirmado',
}

async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (error || !data) return null
    return data as Order
  } catch {
    return null
  }
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const order = await getOrder(params.orderId)
  if (!order) notFound()

  const whatsappUrl = getOrderWhatsAppUrl(params.orderId.slice(0, 8).toUpperCase(), order.customer_name)
  const shortId = params.orderId.slice(0, 8).toUpperCase()

  return (
    <div className="min-h-screen bg-black-900 pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success icon */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="w-8 h-px bg-red-primary" />
            <span className="font-condensed text-xs text-red-primary tracking-[0.4em] uppercase">
              ¡Pedido recibido!
            </span>
            <div className="w-8 h-px bg-red-primary" />
          </div>

          <h1 className="font-display text-4xl md:text-6xl text-white uppercase mb-2">
            ¡Listo, {order.customer_name.split(' ')[0]}!
          </h1>

          <div className="mt-4 inline-block px-6 py-3 bg-black-700 border border-white/10">
            <span className="font-condensed text-xs text-gray-muted uppercase tracking-widest block">
              Número de pedido
            </span>
            <span className="font-display text-3xl text-red-primary tracking-widest">
              #{shortId}
            </span>
          </div>
        </div>

        {/* Order details */}
        <div className="admin-card mb-6">
          <h2 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-5">
            Tu pedido
          </h2>

          <div className="space-y-3 mb-5">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="font-condensed text-sm text-white uppercase tracking-wide">{item.product_name}</p>
                  <p className="font-condensed text-xs text-gray-muted uppercase">Talle {item.size} × {item.quantity}</p>
                </div>
                <p className="font-display text-lg text-white">{formatPrice(item.unit_price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 flex justify-between">
            <span className="font-condensed text-sm uppercase tracking-wider text-gray-accent">Total</span>
            <span className="font-display text-2xl text-white">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Delivery info */}
        <div className="admin-card mb-6">
          <h2 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-4">
            Datos de entrega
          </h2>
          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="font-condensed text-xs text-gray-muted uppercase tracking-wider w-24">Dirección</span>
              <span className="font-condensed text-xs text-white">{order.shipping_address}</span>
            </div>
            <div className="flex gap-3">
              <span className="font-condensed text-xs text-gray-muted uppercase tracking-wider w-24">Ciudad</span>
              <span className="font-condensed text-xs text-white">{order.shipping_city}, {order.shipping_province}</span>
            </div>
            <div className="flex gap-3">
              <span className="font-condensed text-xs text-gray-muted uppercase tracking-wider w-24">Teléfono</span>
              <span className="font-condensed text-xs text-white">{order.customer_phone}</span>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="p-6 bg-black-700 border border-white/5 mb-8">
          <h2 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-4">
            ¿Qué sigue?
          </h2>
          <p className="font-body text-sm text-gray-accent leading-relaxed">
            Nos comunicaremos con vos por WhatsApp al número{' '}
            <strong className="text-white">{order.customer_phone}</strong> para coordinar la entrega.
            El pago se realiza en efectivo cuando recibís el producto.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex-1 py-4 text-sm"
            aria-label="Contactar por WhatsApp para coordinar entrega"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Hablar por WhatsApp ahora
          </a>
          <Link href="/catalogo" className="btn-secondary flex-1 py-4 text-sm">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
