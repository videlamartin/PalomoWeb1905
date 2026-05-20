'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, getCustomerWhatsAppUrl } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/types'
import type { Order, OrderStatus, OrderItem } from '@/types'

async function fetchOrders(status?: OrderStatus): Promise<Order[]> {
  const supabase = createClient()
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data } = await query
  return (data as Order[]) ?? []
}

async function fetchOrderDetail(id: string): Promise<Order | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()
  return data as Order
}

export default function AdminOrdenesPage() {
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState<OrderStatus | undefined>()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin', 'orders', filterStatus],
    queryFn: () => fetchOrders(filterStatus),
  })

  const { data: orderDetail } = useQuery({
    queryKey: ['admin', 'order', selectedOrderId],
    queryFn: () => fetchOrderDetail(selectedOrderId!),
    enabled: !!selectedOrderId,
  })

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const supabase = createClient()
      const { error } = await supabase.from('orders').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', selectedOrderId] })
    },
  })

  const statuses: (OrderStatus | undefined)[] = [
    undefined, 'pendiente', 'preparando', 'enviado', 'entregado', 'cancelado',
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl lg:text-4xl text-white uppercase tracking-wider">Órdenes</h1>
        <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider mt-1">
          {orders.length} {filterStatus ? `${filterStatus}s` : 'órdenes en total'}
        </p>
      </div>

      {/* Status filters — scrolleable en mobile */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
        {statuses.map((s) => (
          <button
            key={s ?? 'all'}
            onClick={() => setFilterStatus(s)}
            className={`font-condensed text-xs uppercase tracking-wider px-4 py-2 border transition-colors flex-shrink-0 ${
              filterStatus === s
                ? 'border-red-primary text-red-primary bg-red-primary/10'
                : 'border-white/10 text-gray-muted hover:border-white/30 hover:text-white'
            }`}
          >
            {s ? ORDER_STATUS_LABELS[s] : 'Todas'}
          </button>
        ))}
      </div>

      {/* ── MOBILE: Cards ── */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="admin-card space-y-3">
              <div className="h-4 shimmer-bg w-2/3" />
              <div className="h-4 shimmer-bg w-1/2" />
              <div className="h-4 shimmer-bg w-1/3" />
            </div>
          ))
        ) : orders.length === 0 ? (
          <div className="admin-card py-10 text-center font-condensed text-xs text-gray-muted uppercase">
            Sin órdenes
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="admin-card space-y-3">
              {/* Header: ID + fecha */}
              <div className="flex items-center justify-between">
                <span className="font-condensed text-xs text-gray-muted">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span className="font-condensed text-xs text-gray-muted">
                  {new Date(order.created_at).toLocaleDateString('es-AR')}
                </span>
              </div>
              {/* Cliente + total */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-condensed text-sm text-white">{order.customer_name}</p>
                  <p className="font-condensed text-xs text-gray-muted">{order.customer_phone}</p>
                </div>
                <span className="font-display text-lg text-white flex-shrink-0">{formatPrice(order.total)}</span>
              </div>
              {/* Estado + acciones */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className={`badge border ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrderId(order.id)}
                    className="font-condensed text-xs text-gray-accent hover:text-white uppercase tracking-wider px-3 py-1.5 border border-white/10 hover:border-white/30 transition-colors"
                  >
                    Ver
                  </button>
                  <a
                    href={getCustomerWhatsAppUrl(order.customer_phone, order.id.slice(0, 8).toUpperCase())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-condensed text-xs text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/10 uppercase tracking-wider px-3 py-1.5 transition-colors"
                  >
                    WA
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP: Table ── */}
      <div className="hidden lg:block admin-card overflow-x-auto">
        <table className="w-full" aria-label="Lista de órdenes">
          <thead>
            <tr className="border-b border-white/5">
              {['ID', 'Cliente', 'Total', 'Estado', 'Fecha', 'Acciones'].map((h) => (
                <th key={h} className="pb-3 text-left font-condensed text-xs text-gray-muted uppercase tracking-wider pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="py-4 pr-4">
                      <div className="h-4 shimmer-bg w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center font-condensed text-xs text-gray-muted uppercase">
                  Sin órdenes
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="admin-table-row">
                  <td className="py-3 pr-4">
                    <span className="font-condensed text-xs text-gray-accent">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-condensed text-sm text-white">{order.customer_name}</p>
                    <p className="font-condensed text-xs text-gray-muted">{order.customer_phone}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-display text-base text-white">{formatPrice(order.total)}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`badge border ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-condensed text-xs text-gray-muted">
                      {new Date(order.created_at).toLocaleDateString('es-AR')}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="font-condensed text-xs text-gray-accent hover:text-white uppercase tracking-wider px-3 py-1.5 border border-white/10 hover:border-white/30 transition-colors"
                      >
                        Ver
                      </button>
                      <a
                        href={getCustomerWhatsAppUrl(order.customer_phone, order.id.slice(0, 8).toUpperCase())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-condensed text-xs text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/10 uppercase tracking-wider px-3 py-1.5 transition-colors"
                      >
                        WA
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order detail modal */}
      {selectedOrderId && orderDetail && (
        <OrderDetailModal
          order={orderDetail}
          onClose={() => setSelectedOrderId(null)}
          onStatusChange={(status) => statusMutation.mutate({ id: orderDetail.id, status })}
          isUpdating={statusMutation.isPending}
        />
      )}
    </div>
  )
}

interface OrderDetailModalProps {
  order: Order
  onClose: () => void
  onStatusChange: (status: OrderStatus) => void
  isUpdating: boolean
}

function OrderDetailModal({ order, onClose, onStatusChange, isUpdating }: OrderDetailModalProps) {
  const STATUSES: OrderStatus[] = ['pendiente', 'preparando', 'enviado', 'entregado', 'cancelado']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-black-800 border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="font-display text-2xl text-white uppercase tracking-wider">
              Orden #{order.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider mt-0.5">
              {new Date(order.created_at).toLocaleString('es-AR')}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-muted hover:text-white transition-colors" aria-label="Cerrar">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer */}
          <div>
            <h3 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-3">Cliente</h3>
            <div className="space-y-1.5">
              <p className="font-condensed text-sm text-white">{order.customer_name}</p>
              <p className="font-condensed text-xs text-gray-muted">{order.customer_email}</p>
              <p className="font-condensed text-xs text-gray-muted">{order.customer_phone}</p>
              <p className="font-condensed text-xs text-gray-muted">
                {order.shipping_address}, {order.shipping_city}, {order.shipping_province}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-3">Productos</h3>
            <div className="space-y-2">
              {order.order_items?.map((item: OrderItem) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <span className="font-condensed text-sm text-white">{item.product_name}</span>
                    <span className="font-condensed text-xs text-gray-muted ml-2">T. {item.size} × {item.quantity}</span>
                  </div>
                  <span className="font-display text-base text-white">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t border-white/10 mt-3">
              <span className="font-condensed text-sm text-gray-accent uppercase">Total</span>
              <span className="font-display text-xl text-white">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Status change */}
          <div>
            <h3 className="font-condensed text-xs text-red-primary uppercase tracking-[0.3em] mb-3">
              Cambiar estado
            </h3>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  disabled={isUpdating || order.status === s}
                  className={`badge border text-[11px] py-1 px-3 transition-all ${
                    order.status === s
                      ? ORDER_STATUS_COLORS[s]
                      : 'border-white/10 text-gray-muted hover:border-white/30 hover:text-white'
                  } disabled:cursor-not-allowed`}
                >
                  {ORDER_STATUS_LABELS[s]}
                  {order.status === s && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-white/5">
            <a
              href={getCustomerWhatsAppUrl(order.customer_phone, order.id.slice(0, 8).toUpperCase())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex-1 py-3 text-xs"
            >
              Abrir WhatsApp
            </a>
            <button onClick={onClose} className="btn-secondary px-6 py-3 text-xs">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
