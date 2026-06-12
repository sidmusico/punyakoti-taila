import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string          // productId + variantSize combo
  productId: string
  slug: string
  name: string
  variantSize: string
  sku: string
  price: number
  mrp?: number
  image?: string
  quantity: number
  isSubscription: boolean
}

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // actions
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number; id?: string }) => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // derived helpers
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (incoming) => {
        // Subscription and one-time purchases of the same variant are
        // different line items (different price + fulfilment) — never merge.
        const id = `${incoming.productId}-${incoming.variantSize}${incoming.isSubscription ? '-sub' : ''}`
        set((state) => {
          const existing = state.items.find((i) => i.id === id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id
                  ? { ...i, quantity: i.quantity + (incoming.quantity ?? 1) }
                  : i,
              ),
              isOpen: true,
            }
          }
          return {
            items: [...state.items, { ...incoming, id, quantity: incoming.quantity ?? 1 }],
            isOpen: true,
          }
        })
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'pt-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
