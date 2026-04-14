// seed.js — Populate the database with sample data
// Run with: npm run seed
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Product = require("./models/Product");

dotenv.config();

// Sample products (prices in INR ₹)
const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 2499,
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    countInStock: 15,
  },
  {
    name: "Smart Fitness Watch",
    price: 3999,
    description:
      "Track your health and fitness with this feature-packed smartwatch. Includes heart rate monitor, step counter, sleep tracking, and water resistance.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    countInStock: 8,
  },
  {
    name: "Portable Power Bank 20000mAh",
    price: 1299,
    description:
      "Never run out of battery! This slim power bank charges your phone up to 5 times. Features dual USB ports and fast charging support.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    countInStock: 25,
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 4599,
    description:
      "RGB backlit mechanical keyboard with Cherry MX switches. Designed for gamers who demand speed, precision, and style.",
    image: "https://images.unsplash.com/photo-1541140532154-b024d1b23860?w=400&h=400&fit=crop",
    countInStock: 0, // Out of stock!
  },
  {
    name: "Laptop Backpack",
    price: 1899,
    description:
      "Water-resistant laptop backpack with USB charging port. Fits up to 15.6-inch laptops. Multiple compartments for organized storage.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    countInStock: 30,
  },
  {
    name: "Wireless Mouse",
    price: 799,
    description:
      "Ergonomic wireless mouse with adjustable DPI settings. Silent clicks and long battery life make it perfect for work and travel.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    countInStock: 50,
  },
  {
    name: "USB-C Hub Adapter",
    price: 2199,
    description:
      "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging. Essential accessory for modern laptops.",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop",
    countInStock: 12,
  },
  {
    name: "Noise Cancelling Earbuds",
    price: 5999,
    description:
      "True wireless earbuds with hybrid active noise cancellation. Premium sound quality with 8-hour battery life and wireless charging case.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    countInStock: 0, // Out of stock!
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create admin user (password: admin123)
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      isAdmin: true,
    });
    console.log(`👤 Admin created: admin@example.com / admin123`);

    // Create regular user (password: user123)
    const regularUser = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "user123",
      isAdmin: false,
    });
    console.log(`👤 User created: john@example.com / user123`);

    // Create sample products
    await Product.insertMany(sampleProducts);
    console.log(`📦 ${sampleProducts.length} sample products added`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin Login:  admin@example.com / admin123");
    console.log("User Login:   john@example.com / user123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
