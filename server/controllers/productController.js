// productController.js — Handles product CRUD operations
const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Fetch all products, newest first
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({ message: "Server error fetching product" });
  }
};

// @desc    Add a new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const addProduct = async (req, res) => {
  try {
    const { name, price, description, image, countInStock } = req.body;

    // Create a new product
    const product = await Product.create({
      name,
      price,
      description,
      image: image || undefined, // Use default if not provided
      countInStock: countInStock || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Add product error:", error.message);
    res.status(500).json({ message: "Server error adding product" });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({ message: "Server error deleting product" });
  }
};

module.exports = { getProducts, getProductById, addProduct, deleteProduct };
