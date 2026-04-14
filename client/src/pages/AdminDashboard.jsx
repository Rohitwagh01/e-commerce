// AdminDashboard.jsx — Admin panel to manage products
import { useState, useEffect } from "react";
import { getProducts, addProduct, deleteProduct } from "../services/api";
import "./AdminDashboard.css";

// Format price in Indian Rupees
const formatINR = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  // For inline delete confirmation (replaces window.confirm which can be blocked)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");

  // Form state for adding a new product
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    countInStock: "",
  });

  // Fetch all products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data);
    } catch (err) {
      showMessage("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show a notification message briefly
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit the add product form
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await addProduct({
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image || undefined,
        countInStock: Number(form.countInStock),
      });
      showMessage("✅ Product added successfully!");
      setForm({ name: "", price: "", description: "", image: "", countInStock: "" });
      fetchProducts();
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to add product", "error");
    } finally {
      setAddLoading(false);
    }
  };

  // Step 1 — Ask for inline confirmation before deleting
  const handleDeleteClick = (id, name) => {
    setConfirmDeleteId(id);
    setConfirmDeleteName(name);
  };

  // Step 2 — Actually delete after user confirms in the UI
  const handleDeleteConfirm = async () => {
    const id = confirmDeleteId;
    const name = confirmDeleteName;
    setConfirmDeleteId(null);
    setDeleteLoading(id);
    try {
      await deleteProduct(id);
      // Remove from local state without re-fetching
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showMessage(`🗑️ "${name}" deleted successfully`);
    } catch (err) {
      console.error("Delete error:", err);
      showMessage(
        err.response?.data?.message || "Failed to delete product. Make sure you are logged in as admin.",
        "error"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // Cancel the delete
  const handleDeleteCancel = () => {
    setConfirmDeleteId(null);
    setConfirmDeleteName("");
  };

  // Computed stats
  const totalProducts = products.length;
  const inStock = products.filter((p) => p.countInStock > 0).length;
  const outOfStock = products.filter((p) => p.countInStock === 0).length;

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <h1>⚙️ Admin Dashboard</h1>
          <span className="badge badge-admin">Admin Only</span>
        </div>

        {/* Notification message */}
        {message && (
          <div className={`alert ${messageType === "error" ? "alert-error" : "alert-success"}`}>
            {message}
          </div>
        )}

        {/* ---- Inline Delete Confirmation Banner ---- */}
        {confirmDeleteId && (
          <div className="delete-confirm-banner">
            <span>
              🗑️ Delete <strong>"{confirmDeleteName}"</strong>? This cannot be undone.
            </span>
            <div className="delete-confirm-actions">
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-value">{totalProducts}</span>
            <span className="admin-stat-label">Total Products</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value" style={{ color: "var(--success)" }}>{inStock}</span>
            <span className="admin-stat-label">In Stock</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value" style={{ color: "var(--danger)" }}>{outOfStock}</span>
            <span className="admin-stat-label">Out of Stock</span>
          </div>
        </div>

        {/* Main Layout */}
        <div className="admin-layout">
          {/* ---- Left: Product List ---- */}
          <div className="admin-products-section">
            <h2>All Products ({totalProducts})</h2>

            {loading ? (
              <div className="spinner-wrapper"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="alert alert-error">No products yet. Add your first one →</div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="product-admin-card">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-admin-img"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/64x64?text=IMG";
                    }}
                  />
                  <div className="product-admin-info">
                    <div className="product-admin-name">{product.name}</div>
                    <div className="product-admin-meta">
                      <span className="product-admin-price">{formatINR(product.price)}</span>
                      {product.countInStock === 0 ? (
                        <span className="badge badge-out-of-stock">Out of Stock</span>
                      ) : (
                        <span className="product-admin-stock">Stock: {product.countInStock}</span>
                      )}
                    </div>
                  </div>

                  {/* Inline delete button — no window.confirm */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(product._id, product.name)}
                    disabled={deleteLoading === product._id || confirmDeleteId === product._id}
                  >
                    {deleteLoading === product._id ? "Deleting..." : "🗑️ Delete"}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ---- Right: Add Product Form ---- */}
          <div className="add-product-form">
            <h3>➕ Add New Product</h3>

            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label htmlFor="prod-name">Product Name *</label>
                <input
                  id="prod-name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Wireless Headphones"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prod-price">Price (₹) *</label>
                  <input
                    id="prod-price"
                    name="price"
                    type="number"
                    className="form-control"
                    placeholder="e.g. 2499"
                    min="0"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prod-stock">Count in Stock *</label>
                  <input
                    id="prod-stock"
                    name="countInStock"
                    type="number"
                    className="form-control"
                    placeholder="e.g. 10"
                    min="0"
                    value={form.countInStock}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prod-desc">Description *</label>
                <textarea
                  id="prod-desc"
                  name="description"
                  className="form-control"
                  placeholder="Describe the product..."
                  rows="3"
                  value={form.description}
                  onChange={handleFormChange}
                  style={{ resize: "vertical" }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prod-image">Image URL (optional)</label>
                <input
                  id="prod-image"
                  name="image"
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={form.image}
                  onChange={handleFormChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={addLoading}
              >
                {addLoading ? "Adding..." : "➕ Add Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
