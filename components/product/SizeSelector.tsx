'use client'

import type { ProductSizeStock, ProductSize } from '@/types'
import { SIZE_ORDER } from '@/types'
import { getStockLabel } from '@/lib/utils'

interface SizeSelectorProps {
  sizes: ProductSizeStock[]
  selectedSize: ProductSize | null
  onSelect: (size: ProductSize) => void
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  const sizeMap = new Map(sizes.map((s) => [s.size, s.stock]))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="label-field">Talle</span>
        {selectedSize && (
          <span className="font-condensed text-xs text-red-primary uppercase tracking-widest">
            {selectedSize} seleccionado
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {SIZE_ORDER.filter((size) => sizeMap.has(size)).map((size) => {
          const stock = sizeMap.get(size) ?? 0
          const outOfStock = stock === 0
          const stockInfo = getStockLabelUtil(stock)
          const isSelected = selectedSize === size

          return (
            <button
              key={size}
              onClick={() => !outOfStock && onSelect(size)}
              disabled={outOfStock}
              className={`relative px-4 py-2.5 font-condensed text-sm uppercase tracking-widest border transition-all duration-200 ${
                outOfStock
                  ? 'border-white/5 text-gray-border cursor-not-allowed line-through'
                  : isSelected
                  ? 'border-red-primary bg-red-primary text-white'
                  : 'border-white/20 text-white hover:border-white/60'
              }`}
              aria-label={`Talle ${size}${outOfStock ? ' - sin stock' : stock < 4 ? ` - últimos ${stock}` : ''}`}
              aria-pressed={isSelected}
            >
              {size}
              {stockInfo && !outOfStock && (
                <span
                  className={`absolute -top-1.5 -right-1.5 text-[9px] px-1 font-bold uppercase ${stockInfo.color} bg-black-800 border border-current`}
                >
                  {stock}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selectedSize && (() => {
        const stock = sizeMap.get(selectedSize) ?? 0
        const stockInfo = getStockLabelUtil(stock)
        if (stockInfo && stock > 0) {
          return (
            <p className={`mt-2 font-condensed text-xs uppercase tracking-wider ${stockInfo.color}`}>
              ⚠ {stockInfo.label} disponibles
            </p>
          )
        }
        return null
      })()}
    </div>
  )
}
