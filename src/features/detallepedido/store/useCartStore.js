import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: [],
  restaurantId: null,
  restaurantName: null,

  addItem: (item, type, restaurantContext = null) => {
    const itemId = item._id || item.id;
    if (!itemId) return;

    set((state) => {
      const exists = state.cart.find((i) => i.id === itemId);
      const nextCart = exists
        ? state.cart.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [
            ...state.cart,
            {
              id: itemId,
              name: item.name || item.Menu_Plate || item.Menu_Drink,
              price: Number(item.price || item.Menu_Price || 0),
              quantity: 1,
              type,
            },
          ];

      const nextRestaurant = restaurantContext?.id
        ? {
            restaurantId: String(restaurantContext.id),
            restaurantName: restaurantContext.name || state.restaurantName || '',
          }
        : {};

      return { cart: nextCart, ...nextRestaurant };
    });
  },

  updateQuantity: (id, amount) => {
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0),
    }));
  },

  removeItem: (id) => {
    set((state) => ({ cart: state.cart.filter((i) => i.id !== id) }));
  },

  clearCart: () => set({ cart: [], restaurantId: null, restaurantName: null }),
}));

export default useCartStore;
