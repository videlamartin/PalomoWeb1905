import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/types'
import type { Order, DashboardStats } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard Admin' }

async function getDashboardData(): Promise<{ stats: DashboardStats; recentOrders: Order[]; lowStockItems: any[] }> {
  try {
    const supabase = createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [ordersToday, pendingOrders, lowStockProducts, recentOrders] = await Promise.all([
      supabase
        .from('orders')
        .select('total')
        .gte('created_at', today.toISOString())
        .neq('status', 'cancelado'),
      supabase
        .from('orders')
        .select('id', { count: 'exact' })
        .eq('status', 'pendiente'),
      supabase
        .from('product_sizes')
        .select('id, size, stock, product_id, products(name)')
        .lt('stock', 3)
        .order('stock', { ascending: true }),
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
    ])

    const orders = ordersToday.data ?? []
    const revenueToday = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)

    const lowStockItems = lowStockProducts.data ?? []

    return {
      stats: {
        orders_today: orders.length,
        revenue_today: revenueToday,
        low_stock_count: lowStockItems.length,
        pending_orders: pendingOrders.count ?? 0,
      },
      recentOrders: (recentOrders.data as Order[]) ?? [],
      lowStockItems,
    }
  } catch {
    return {
      stats: { orders_today: 0, revenue_today: 0, low_stock_count: 0, pending_orders: 0 },
      recentOrders: [],
      lowStockItems: [],
    }
  }
}

export default async function AdminDashboard() {
  const { stats, recentOrders, lowStockItems } = await getDashboardData()

  const METRICS = [
    {
      label: 'Órdenes hoy',
      value: stats.orders_today,
      icon: '📦',
      color: 'text-blue-400',
      href: '/admin/ordenes',
    },
    {
      label: 'Facturado hoy',
      value: formatPrice(stats.revenue_today),
      icon: '💰',
      color: 'text-green-400',
      href: '/admin/ordenes',
    },
    {
      label: 'Órdenes pendientes',
      value: stats.pending_orders,
      icon: '⏳',
      color: 'text-yellow-400',
      href: '/admin/ordenes?filter=pendiente',
    },
    {
      label: 'Talles con stock bajo',
      value: stats.low_stock_count,
      icon: '⚠️',
      color: 'text-red-400',
      href: '/admin/productos',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl lg:text-4xl text-white uppercase tracking-wider">Dashboard</h1>
        <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider mt-1">
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {METRICS.map((metric) => (
          <Link href={metric.href} key={metric.label} className="admin-card block hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl" aria-hidden="true">{metric.icon}</span>
            </div>
            <p className={`font-display text-3xl ${metric.color}`}>{metric.value}</p>
            <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider mt-1">{metric.label}</p>
          </Link>
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

        {/* Mobile: cards */}
        <div className="lg:hidden space-y-3">
          {recentOrders.length === 0 ? (
            <p className="py-6 text-center font-condensed text-xs text-gray-muted uppercase">Sin órdenes aún</p>
          ) : (
            recentOrders.map((order) => (
              <Link href={`/admin/ordenes?view=${order.id}`} key={order.id} className="border border-white/5 p-3 space-y-2 block hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-condensed text-xs text-gray-accent">#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className="font-condensed text-xs text-gray-muted">
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-condensed text-sm text-white">{order.customer_name}</span>
                  <span className="font-display text-base text-white">{formatPrice(order.total)}</span>
                </div>
                <span className={`badge border ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden lg:block overflow-x-auto">
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
                  <tr key={order.id} className="admin-table-row group">
                    <td className="py-0 pr-4">
                      <Link href={`/admin/ordenes?view=${order.id}`} className="block py-3">
                        <span className="font-condensed text-xs text-gray-accent">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </Link>
                    </td>
                    <td className="py-0 pr-4">
                      <Link href={`/admin/ordenes?view=${order.id}`} className="block py-3">
                        <p className="font-condensed text-sm text-white">{order.customer_name}</p>
                        <p className="font-condensed text-xs text-gray-muted">{order.customer_phone}</p>
                      </Link>
                    </td>
                    <td className="py-0 pr-4">
                      <Link href={`/admin/ordenes?view=${order.id}`} className="block py-3">
                        <span className="font-display text-base text-white">{formatPrice(order.total)}</span>
                      </Link>
                    </td>
                    <td className="py-0 pr-4">
                      <Link href={`/admin/ordenes?view=${order.id}`} className="block py-3">
                        <span className={`badge border ${ORDER_STATUS_COLORS[order.status]}`}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </Link>
                    </td>
                    <td className="py-0">
                      <Link href={`/admin/ordenes?view=${order.id}`} className="block py-3">
                        <span className="font-condensed text-xs text-gray-muted">
                          {new Date(order.created_at).toLocaleDateString('es-AR')}
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Warning Section */}
      {lowStockItems.length > 0 && (
        <div className="admin-card mt-6 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl" aria-hidden="true">⚠️</span>
            <h2 className="font-condensed text-sm text-red-primary uppercase tracking-[0.3em]">
              Alertas de Stock Bajo
            </h2>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-red-500/10 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-condensed text-sm text-white uppercase tracking-wide">
                    {item.products?.name || 'Producto Desconocido'}
                  </p>
                  <p className="font-condensed text-xs text-red-400 mt-0.5">Talle: {item.size}</p>
                </div>
                <Link 
                  href={`/admin/productos?edit=${item.product_id}`}
                  className="font-display text-2xl text-red-primary bg-red-500/10 px-4 py-1 rounded hover:bg-red-500/20 transition-colors cursor-pointer"
                  title="Editar stock del producto"
                >
                  {item.stock}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
