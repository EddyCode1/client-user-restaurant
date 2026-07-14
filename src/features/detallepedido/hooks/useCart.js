import { useMemo } from 'react';
import useCartStore from '../store/useCartStore';

export const useCart = () => {
  const cart = useCartStore((state) => state.cart);
  const restaurantId = useCartStore((state) => state.restaurantId);
  const restaurantName = useCartStore((state) => state.restaurantName);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = useMemo(
    () => cart.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [cart]
  );

  return {
    cart,
    restaurantId,
    restaurantName,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
  };
};
