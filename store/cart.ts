import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState, ProductSize } from '@/types'

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product_id === newItem.product_id && item.size === newItem.size
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product_id === newItem.product_id && item.size === newItem.size
                  ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, 10) }
                  : item
              ),
            }
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (product_id: string, size: ProductSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product_id === product_id && item.size === size)
          ),
        }))
      },

      updateQuantity: (product_id: string, size: ProductSize, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(product_id, size)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === product_id && item.size === size
              ? { ...item, quantity: Math.min(quantity, 10) }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'palomo-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
