'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartProduct = Omit<CartItem, 'quantity'>;

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('modstudio_cart');
      return saved ? JSON.parse(saved) as CartItem[] : [];
    } catch {
      return [];
    }
  });

  // Save to local storage on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('modstudio_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { _id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
