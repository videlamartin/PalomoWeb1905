'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { checkoutSchema, type CheckoutSchema } from '@/lib/validations'
import { formatPrice } from '@/lib/utils'
import { PROVINCES } from '@/types'

export const metadata = {
  title: 'Checkout',
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const total = getTotal()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutSchema) => {
    if (items.length === 0) return
    setIsLoading(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            size: item.size,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'Error al procesar el pedido')
      }

      clearCart()
      router.push(`/confirmacion/${json.orderId}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-condensed text-gray-muted uppercase tracking-wider mb-6">
            Tu carrito está vacío
          </p>
          <a href="/catalogo" className="btn-primary px-8 py-3">Ver catálogo</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black-900 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-red-primary" />
            <span className="font-condensed text-xs text-red-primary tracking-[0.4em] uppercase">
              Finalizar compra
            </span>
          </div>
          <h1 className="font-display text-hero-sm text-white uppercase">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* FORM — left */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">
            {/* Personal */}
            <div className="space-y-4">
              <h2 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em]">
                Datos personales
              </h2>

              <div>
                <label className="label-field" htmlFor="customer_name">Nombre completo *</label>
                <input
                  id="customer_name"
                  type="text"
                  autoComplete="name"
                  {...register('customer_name')}
                  className={`input-field ${errors.customer_name ? 'input-error' : ''}`}
                  placeholder="Juan García"
                />
                {errors.customer_name && (
                  <p className="mt-1 font-condensed text-xs text-red-400">{errors.customer_name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field" htmlFor="customer_email">Email *</label>
                  <input
                    id="customer_email"
                    type="email"
                    autoComplete="email"
                    {...register('customer_email')}
                    className={`input-field ${errors.customer_email ? 'input-error' : ''}`}
                    placeholder="juan@email.com"
                  />
                  {errors.customer_email && (
                    <p className="mt-1 font-condensed text-xs text-red-400">{errors.customer_email.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-field" htmlFor="customer_phone">Teléfono / WhatsApp *</label>
                  <input
                    id="customer_phone"
                    type="tel"
                    autoComplete="tel"
                    {...register('customer_phone')}
                    className={`input-field ${errors.customer_phone ? 'input-error' : ''}`}
                    placeholder="+54 9 11 1234-5678"
                  />
                  {errors.customer_phone && (
                    <p className="mt-1 font-condensed text-xs text-red-400">{errors.customer_phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="space-y-4 pt-4">
              <h2 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em]">
                Dirección de envío
              </h2>

              <div>
                <label className="label-field" htmlFor="shipping_address">Dirección *</label>
                <input
                  id="shipping_address"
                  type="text"
                  autoComplete="street-address"
                  {...register('shipping_address')}
                  className={`input-field ${errors.shipping_address ? 'input-error' : ''}`}
                  placeholder="Av. Independencia 1234, Piso 3, Depto B"
                />
                {errors.shipping_address && (
                  <p className="mt-1 font-condensed text-xs text-red-400">{errors.shipping_address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field" htmlFor="shipping_city">Ciudad *</label>
                  <input
                    id="shipping_city"
                    type="text"
                    autoComplete="address-level2"
                    {...register('shipping_city')}
                    className={`input-field ${errors.shipping_city ? 'input-error' : ''}`}
                    placeholder="Buenos Aires"
                  />
                  {errors.shipping_city && (
                    <p className="mt-1 font-condensed text-xs text-red-400">{errors.shipping_city.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-field" htmlFor="shipping_province">Provincia *</label>
                  <select
                    id="shipping_province"
                    {...register('shipping_province')}
                    className={`input-field ${errors.shipping_province ? 'input-error' : ''}`}
                  >
                    <option value="">Seleccioná una provincia</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.shipping_province && (
                    <p className="mt-1 font-condensed text-xs text-red-400">{errors.shipping_province.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-2">
              <label className="label-field" htmlFor="notes">Notas adicionales (opcional)</label>
              <textarea
                id="notes"
                rows={3}
                {...register('notes')}
                className="input-field resize-none"
                placeholder="Horario preferido de entrega, referencias para el domicilio, etc."
              />
            </div>

            {/* Payment method */}
            <div className="pt-4">
              <h2 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-4">
                Método de pago
              </h2>
              <div className="flex items-center gap-4 p-4 border border-red-primary/40 bg-red-primary/5">
                <div className="w-5 h-5 rounded-full border-2 border-red-primary flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-primary" />
                </div>
                <div>
                  <p className="font-condensed text-sm text-white uppercase tracking-wider">Pago al recibir</p>
                  <p className="font-body text-xs text-gray-muted mt-0.5">
                    Abonás en efectivo cuando el producto llegue a tu domicilio. Sin tarjetas, sin adelantos.
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {submitError && (
              <div className="p-4 border border-red-500/30 bg-red-500/10">
                <p className="font-condensed text-sm text-red-400">{submitError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              id="checkout-submit-btn"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando pedido...
                </span>
              ) : (
                `Confirmar pedido · ${formatPrice(total)}`
              )}
            </button>
          </form>

          {/* ORDER SUMMARY — right */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h2 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-6">
                Resumen del pedido
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.size}`} className="flex gap-3">
                    <div className="relative w-14 h-16 flex-shrink-0 bg-black-700 overflow-hidden">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-condensed text-xs text-white uppercase tracking-wide leading-tight truncate">
                        {item.product_name}
                      </p>
                      <p className="font-condensed text-xs text-gray-muted uppercase mt-0.5">
                        {item.size} × {item.quantity}
                      </p>
                      <p className="font-display text-base text-white mt-1">
                        {formatPrice(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-condensed text-xs text-gray-muted uppercase tracking-wider">Subtotal</span>
                  <span className="font-condensed text-sm text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-condensed text-xs text-gray-muted uppercase tracking-wider">Envío</span>
                  <span className="font-condensed text-xs text-gray-accent uppercase">A coordinar</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10">
                  <span className="font-condensed text-sm text-white uppercase tracking-wider">Total</span>
                  <span className="font-display text-2xl text-white">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-black-700 border border-white/5">
                <p className="font-condensed text-xs text-gray-accent uppercase tracking-wider leading-relaxed">
                  💡 Nos comunicaremos por WhatsApp para coordinar la entrega y el pago.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
