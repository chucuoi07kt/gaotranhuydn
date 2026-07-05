'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/lib/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, weight: string) => void;
  updateQuantity: (
    productId: string,
    weight: string,
    quantity: number
  ) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      addItem: (item) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.productId === item.productId && i.weight === item.weight
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.weight === item.weight
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
        set({ isOpen: true });
      },
      removeItem: (productId, weight) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.weight === weight)
          ),
        }),
      updateQuantity: (productId, weight, quantity) =>
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId && i.weight === weight
                ? { ...i, quantity: Math.max(1, quantity) }
                : i
            )
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'gth-cart',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return window.localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
