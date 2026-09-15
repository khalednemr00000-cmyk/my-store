import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItemType } from "@/types";

interface CartState {
  items: CartItemType[];
  isOpen: boolean;
  addItem: (item: Omit<CartItemType, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  getSubtotal: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const id = `${item.productId}-${item.variantId || "default"}`;
        const existing = get().items.find((i) => i.id === id);

        if (existing) {
          const newQty = Math.min(existing.quantity + item.quantity, item.maxStock);
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: newQty } : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...get().items, { ...item, id }],
            isOpen: true,
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((i) => {
            if (i.id === id) {
              return { ...i, quantity: Math.min(quantity, i.maxStock) };
            }
            return i;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: (open) => {
        set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen }));
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "souq_elite_cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
