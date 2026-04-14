// productRoutes.js — Routes for product operations
const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// GET /api/products — Get all products (public)
router.get("/", getProducts);

// GET /api/products/:id — Get a single product (public)
router.get("/:id", getProductById);

// POST /api/products — Add a new product (admin only)
router.post("/", protect, admin, addProduct);

// DELETE /api/products/:id — Delete a product (admin only)
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
