import React, { createContext, useState, useContext, useEffect } from 'react';
import { Book, CartItem, Order } from '../types';
import { orders } from '../data/mockData';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (paymentMethod: 'Cash on Delivery' | 'bKash' | 'Card', shippingAddress: string) => void;
  orders: Order[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const { currentUser } = useAuth();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('arcadiaReadsCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('arcadiaReadsCart', JSON.stringify(cart));
  }, [cart]);

  // Update orders when user changes
  useEffect(() => {
    if (currentUser) {
      const filteredOrders = orders.filter(order => order.userId === currentUser.id);
      setUserOrders(filteredOrders);
    } else {
      setUserOrders([]);
    }
  }, [currentUser]);

  const addToCart = (book: Book, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.book.id === book.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.book.id === book.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { book, quantity }];
      }
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart(prevCart => prevCart.filter(item => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = (paymentMethod: 'Cash on Delivery' | 'bKash' | 'Card', shippingAddress: string) => {
    if (!currentUser || cart.length === 0) return;

    const totalAmount = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      userId: currentUser.id,
      items: [...cart],
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };

    // Add order to mock data
    orders.push(newOrder);
    
    // Update user orders
    setUserOrders(prev => [...prev, newOrder]);
    
    // Clear cart after checkout
    clearCart();
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      checkout,
      orders: userOrders
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};