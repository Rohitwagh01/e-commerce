// CartPage.jsx — Shopping cart view with working checkout
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./CartPage.css";

// Format price in Indian Rupees
const formatINR = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, getCartTotal, cartCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Checkout state: 'cart' | 'confirm' | 'success'
  const [checkoutState, setCheckoutState] = useState("cart");
  const [orderNumber] = useState(
    () => "OD" + Math.floor(100000 + Math.random() * 900000)
  );

  // ---- Handle checkout click ----
  const handleCheckout = () => {
    // Must be logged in to checkout
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setCheckoutState("confirm"); // Show confirmation screen
  };

  // ---- Place the order ----
  const handlePlaceOrder = () => {
    setCheckoutState("success"); // Show success screen
    clearCart();                 // Empty the cart
  };

  // ---- Order Success Screen ----
  if (checkoutState === "success") {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="order-success fade-in">
            <div className="success-icon">🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you, <strong>{user?.name}</strong>! Your order has been confirmed.</p>
            <div className="order-number">Order ID: <span>{orderNumber}</span></div>
            <p className="success-note">
              You will receive a confirmation on <strong>{user?.email}</strong> shortly.
            </p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---- Order Confirmation Screen ----
  if (checkoutState === "confirm") {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: "var(--spacing-xl)" }}>
            Confirm Your Order
          </h1>

          <div className="confirm-layout fade-in">
            {/* Items summary */}
            <div className="confirm-items">
              <h3>Items in your order</h3>
              {cartItems.map((item) => (
                <div key={item._id} className="confirm-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=IMG"; }}
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-qty">Qty: {item.qty}</div>
                    <div className="cart-item-price">{formatINR(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm summary box */}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span className="label">Items ({cartCount})</span>
                <span>{formatINR(getCartTotal())}</span>
              </div>
              <div className="summary-row">
                <span className="label">Delivery</span>
                <span style={{ color: "var(--success)" }}>FREE</span>
              </div>
              <div className="summary-row total">
                <span className="label">Total</span>
                <span className="price">{formatINR(getCartTotal())}</span>
              </div>

              <div className="divider" />

              {/* Delivery info */}
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--spacing-md)" }}>
                📦 Delivering to: <strong style={{ color: "var(--text-primary)" }}>{user?.email}</strong>
              </div>

              {/* Place order */}
              <button
                id="place-order-btn"
                className="btn btn-primary checkout-btn"
                onClick={handlePlaceOrder}
              >
                ✅ Place Order
              </button>

              {/* Go back */}
              <button
                className="btn btn-secondary btn-full clear-cart-btn"
                onClick={() => setCheckoutState("cart")}
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Empty cart state ----
  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-cart fade-in">
            <span className="empty-cart-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart and they'll show up here.</p>
            <Link to="/" className="btn btn-primary">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---- Main Cart View ----
  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: "var(--spacing-xl)" }}>
          Shopping Cart
        </h1>

        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items fade-in">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=IMG";
                  }}
                />
                <div className="cart-item-info">
                  <Link to={`/product/${item._id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <div className="cart-item-price">
                    {formatINR(item.price * item.qty)}
                  </div>
                  <div className="cart-item-qty">
                    {formatINR(item.price)} × {item.qty}
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item._id)}
                  title="Remove from cart"
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span className="label">Items ({cartCount})</span>
              <span>{formatINR(getCartTotal())}</span>
            </div>
            <div className="summary-row">
              <span className="label">Delivery</span>
              <span style={{ color: "var(--success)" }}>FREE</span>
            </div>
            <div className="summary-row total">
              <span className="label">Total</span>
              <span className="price">{formatINR(getCartTotal())}</span>
            </div>

            {/* Checkout button — now functional */}
            <button
              id="checkout-btn"
              className="btn btn-primary checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout →
            </button>

            {!isAuthenticated && (
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.5rem" }}>
                You need to <Link to="/login" style={{ color: "var(--accent)" }}>login</Link> to checkout
              </p>
            )}

            <button
              className="btn btn-secondary btn-full clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
