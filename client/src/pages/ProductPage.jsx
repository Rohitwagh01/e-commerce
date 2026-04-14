// ProductPage.jsx — Single product detail view
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContext";
import "./ProductPage.css";

// Format price in Indian Rupees
const formatINR = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const ProductPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch the product when the page loads
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    // Reset the "Added!" message after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const isOutOfStock = product?.countInStock === 0;

  if (loading) return (
    <div className="spinner-wrapper" style={{ minHeight: "60vh" }}>
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div className="container page-wrapper">
      <div className="alert alert-error">{error}</div>
      <button className="btn btn-secondary" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );

  return (
    <div className="product-page">
      <div className="container">
        {/* Back button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="product-detail">
          {/* Left: Product image */}
          <div className="product-detail-image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />
            {isOutOfStock && (
              <div className="out-of-stock-overlay">
                <span>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Right: Product info */}
          <div className="product-detail-info fade-in">
            <h1 className="product-detail-name">{product.name}</h1>
            <div className="product-detail-price">{formatINR(product.price)}</div>

            <p className="product-detail-description">{product.description}</p>

            {/* Meta info box */}
            <div className="product-detail-meta">
              <div className="meta-row">
                <span className="meta-label">Availability</span>
                {isOutOfStock ? (
                  <span className="badge badge-out-of-stock">Out of Stock</span>
                ) : (
                  <span className="badge badge-in-stock">In Stock</span>
                )}
              </div>
              {!isOutOfStock && (
                <div className="meta-row">
                  <span className="meta-label">Units Left</span>
                  <span className="meta-value">{product.countInStock}</span>
                </div>
              )}
            </div>

            {/* Add to cart button */}
            {addedToCart ? (
              <div className="alert alert-success">✅ Added to cart!</div>
            ) : (
              <button
                className="btn btn-primary btn-add-cart"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Currently Unavailable" : "🛒 Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
