'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LowStockItem {
  id: string
  size: string
  stock: number
  product_id: string
  products: { name: string } | null
}

interface LowStockAlertsProps {
  items: LowStockItem[]
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visibleItems = items.filter((item) => !dismissed.has(item.id))

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id))
  }

  if (items.length === 0) return null

  return (
    <div id="low-stock" className="admin-card mt-6 border-red-500/30 bg-red-500/5 scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">⚠️</span>
          <h2 className="font-condensed text-sm text-red-primary uppercase tracking-[0.3em]">
            Alertas de Stock Bajo
          </h2>
        </div>
        {dismissed.size > 0 && (
          <button
            onClick={() => setDismissed(new Set())}
            className="font-condensed text-[10px] text-gray-muted hover:text-white uppercase tracking-wider transition-colors"
          >
            Mostrar ocultos ({dismissed.size})
          </button>
        )}
      </div>
      <div className="space-y-3">
        {visibleItems.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-red-500/20 bg-red-500/5">
            <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider">
              Todas las alertas de stock han sido ocultadas
            </p>
            <button
              onClick={() => setDismissed(new Set())}
              className="mt-3 font-condensed text-xs text-red-primary hover:text-white uppercase tracking-[0.2em] transition-colors underline"
            >
              Mostrar todas las alertas ({dismissed.size})
            </button>
          </div>
        ) : (
          visibleItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-red-500/10 pb-3 last:border-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <p className="font-condensed text-sm text-white uppercase tracking-wide truncate">
                  {item.products?.name || 'Producto Desconocido'}
                </p>
                <p className="font-condensed text-xs text-red-400 mt-0.5">Talle: {item.size}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href={`/admin/productos?edit=${item.product_id}`}
                  className="font-display text-2xl text-red-primary bg-red-500/10 px-4 py-1 rounded hover:bg-red-500/20 transition-colors cursor-pointer"
                  title="Editar stock del producto"
                >
                  {item.stock}
                </Link>
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="p-1.5 text-gray-muted hover:text-white transition-colors rounded hover:bg-white/5"
                  title="Ocultar alerta"
                  aria-label={`Ocultar alerta de ${item.products?.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.5 6.5m3.378 3.378l4.242 4.242M6.5 6.5L3 3m3.5 3.5l11 11M17.5 17.5L21 21" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
