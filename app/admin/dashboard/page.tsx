import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/types'
import type { Order, DashboardStats } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard Admin' }

async function getDashboardData(): Promise<{ stats: DashboardStats; recentOrders: Order[] }> {
  try {
    const supabase = createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [ordersToday, pendingOrders, lowStockProducts, recentOrders] = await Promise.all([
      supabase
        .from('orders')
        .select('total')
        .gte('created_at', today.toISOString()),
      supabase
        .from('orders')
        .select('id', { count: 'exact' })
        .eq('status', 'pendiente'),
      supabase
        .from('product_sizes')
        .select('id', { count: 'exact' })
        .lt('stock', 3),
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
    ])

    const orders = ordersToday.data ?? []
    const revenueToday = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)

    return {
      stats: {
        orders_today: orders.length,
        revenue_today: revenueToday,
        low_stock_count: lowStockProducts.count ?? 0,
        pending_orders: pendingOrders.count ?? 0,
      },
      recentOrders: (recentOrders.data as Order[]) ?? [],
    }
  } catch {
    return {
      stats: { orders_today: 0, revenue_today: 0, low_stock_count: 0, pending_orders: 0 },
      recentOrders: [],
    }
  }
}

export default async function AdminDashboard() {
  const { stats, recentOrders } = await getDashboardData()

  const METRICS = [
    {
      label: 'Órdenes hoy',
      value: stats.orders_today,
      icon: '📦',
      color: 'text-blue-400',
    },
    {
      label: 'Facturado hoy',
      value: formatPrice(stats.revenue_today),
      icon: '💰',
      color: 'text-green-400',
    },
    {
      label: 'Órdenes pendientes',
      value: stats.pending_orders,
      icon: '⏳',
      color: 'text-yellow-400',
    },
    {
      label: 'Talles con stock bajo',
      value: stats.low_stock_count,
      icon: '⚠️',
      color: 'text-red-400',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white uppercase tracking-wider">Dashboard</h1>
        <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider mt-1">
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {METRICS.map((metric) => (
          <div key={metric.label} className="admin-card">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl" aria-hidden="true">{metric.icon}</span>
            </div>
            <p className={`font-display text-3xl ${metric.color}`}>{metric.value}</p>
            <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-condensed text-sm text-red-primary uppercase tracking-[0.3em]">
            Últimas órdenes
          </h2>
          <a href="/admin/ordenes" className="font-condensed text-xs text-gray-muted hover:text-white uppercase tracking-wider transition-colors">
            Ver todas →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Últimas órdenes">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Cliente', 'Total', 'Estado', 'Fecha'].map((h) => (
                  <th key={h} className="pb-3 text-left font-condensed text-xs text-gray-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center font-condensed text-xs text-gray-muted uppercase">
                    Sin órdenes aún
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
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
                    <td className="py-3">
                      <span className="font-condensed text-xs text-gray-muted">
                        {new Date(order.created_at).toLocaleDateString('es-AR')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
