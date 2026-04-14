// ProductCard.jsx — Displays a single product in the grid
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

// Helper: Format price in Indian Rupees
const formatINR = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.countInStock === 0;

  return (
    <div className={`product-card card ${isOutOfStock ? "out-of-stock" : ""}`}>
      {/* Product image with out-of-stock overlay */}
      <Link to={`/product/${product._id}`} className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Product info */}
      <div className="product-info">
        <Link to={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>

        <div className="product-footer">
          <span className="price">{formatINR(product.price)}</span>

          {/* Stock badge */}
          {isOutOfStock ? (
            <span className="badge badge-out-of-stock">Out of Stock</span>
          ) : (
            <span className="badge badge-in-stock">{product.countInStock} left</span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          className="btn btn-primary btn-full"
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Unavailable" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
