// Product.js — Product model (schema) for MongoDB
const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      default: 0, // Price is in Indian Rupees (₹)
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x300?text=No+Image",
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0, // 0 means "Out of Stock"
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the Product model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
