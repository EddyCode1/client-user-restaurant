import { useState, useMemo } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState([]);

  const addItem = (item, type) => {
    const itemId = item._id || item.id;
    setCart((prev) => {
      const exists = prev.find((i) => i.id === itemId);
      if (exists) {
        return prev.map((i) => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: itemId, 
        name: item.name || item.Menu_Plate || item.Menu_Drink, 
        price: Number(item.price || item.Menu_Price || 0), 
        quantity: 1, 
        type 
      }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) => prev
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.quantity), 0), [cart]);

  return { cart, addItem, updateQuantity, removeItem, subtotal };
};