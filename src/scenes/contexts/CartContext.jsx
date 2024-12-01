import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = Cookies.get('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Update cookie whenever cart changes
  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cart), { expires: 1 }); // Expires in 1 day
  }, [cart]);

  const addToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, increment) => {
    setCart(prevCart => prevCart.map((item, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, item.quantity + increment);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    Cookies.remove('cart');
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;