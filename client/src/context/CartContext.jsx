// CartContext.jsx — Manages shopping cart state across the app
import { createContext, useContext, useState } from "react";

// Create the Cart context
const CartContext = createContext();

// CartProvider wraps the app and provides cart state to all children
export const CartProvider = ({ children }) => {
  // Load cart from localStorage on first render
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Helper — save cart to state and localStorage
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  // Add a product to cart
  const addToCart = (product) => {
    // Don't add if out of stock
    if (product.countInStock === 0) return;

    // Check if the product is already in cart
    const existingItem = cartItems.find((item) => item._id === product._id);

    if (existingItem) {
      // Increase quantity (but not beyond stock)
      const updated = cartItems.map((item) =>
        item._id === product._id
          ? {
              ...item,
              qty: Math.min(item.qty + 1, product.countInStock),
            }
          : item
      );
      saveCart(updated);
    } else {
      // Add new item with qty 1
      saveCart([...cartItems, { ...product, qty: 1 }]);
    }
  };

  // Remove a product from cart
  const removeFromCart = (productId) => {
    const updated = cartItems.filter((item) => item._id !== productId);
    saveCart(updated);
  };

  // Clear the entire cart
  const clearCart = () => saveCart([]);

  // Calculate total price in INR
  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  // Total number of items in cart (for badge)
  const cartCount = cartItems.reduce((count, item) => count + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook — use this in components instead of useContext(CartContext)
export const useCart = () => useContext(CartContext);
