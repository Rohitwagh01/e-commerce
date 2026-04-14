// HomePage.jsx — Main landing page showing all products
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";
import "./HomePage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products when the page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products. Is the server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const inStockCount = products.filter((p) => p.countInStock > 0).length;

  return (
    <div>
      {/* ---- Hero Section ---- */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">✨ Premium Quality Products</div>
          <h1 className="hero-title">
            Shop the Best Products<br />
            <span className="highlight">Made for India</span>
          </h1>
          <p className="hero-subtitle">
            Discover amazing deals on electronics, accessories, and more — all priced in ₹ Indian Rupees.
          </p>
          <div className="hero-actions">
            <a href="#products" className="btn btn-primary">
              🛒 Shop Now
            </a>
            <Link to="/register" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Stats Bar ---- */}
      {!loading && products.length > 0 && (
        <div className="container">
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{products.length}+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{inStockCount}</span>
              <span className="stat-label">In Stock</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">₹</span>
              <span className="stat-label">Indian Rupees</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">🔒</span>
              <span className="stat-label">Secure Login</span>
            </div>
          </div>
        </div>
      )}

      {/* ---- Products Section ---- */}
      <section className="products-section" id="products">
        <div className="container">
          <div className="products-header">
            <h2 className="section-title">All Products</h2>
            {!loading && (
              <span className="products-count">
                {products.length} product{products.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="spinner-wrapper">
              <div className="spinner" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {/* Products grid */}
          {!loading && !error && products.length > 0 && (
            <div className="products-grid fade-in">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No products yet</h3>
              <p>Admin can add products from the dashboard.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
