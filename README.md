# 🛒 ShopIndia — MERN Stack eCommerce

A complete, beginner-friendly eCommerce web app built with **MongoDB, Express.js, React.js, and Node.js**.

---

## ✨ Features

- 🔐 JWT Authentication (Login / Register)
- 📦 Product listing with ₹ Indian Rupee pricing
- 🚫 "Out of Stock" labels and disabled buttons
- 🛒 Add to Cart with live counter
- 👨‍💼 Admin Dashboard — Add & Delete products
- 📱 Fully responsive design (mobile-friendly)
- 🌙 Premium dark theme UI

---

## 🗂️ Project Structure

```
.
├── server/                  # Node.js + Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Business logic
│   ├── middleware/          # JWT auth middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── seed.js              # Sample data seeder
│   └── server.js            # Entry point
│
└── client/                  # React + Vite frontend
    └── src/
        ├── components/      # Navbar, ProductCard, etc.
        ├── context/         # AuthContext, CartContext
        ├── pages/           # All page components
        └── services/api.js  # Axios API calls
```

---

## ⚙️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally  
  **OR** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud account

---

### Step 1 — Clone / Open the Project

```bash
cd c:\Users\naray\.antigravity
```

---

### Step 2 — Configure Environment Variables

Copy the example `.env` file and edit it:

```bash
# The .env file is already pre-filled for local MongoDB
# Edit server/.env if you want to use MongoDB Atlas
```

`server/.env`:
```
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=mern_ecommerce_secret_key_2024
PORT=5000
```

> **For MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`

---

### Step 3 — Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

---

### Step 4 — Seed the Database (Optional but Recommended)

This will add 8 sample products + an admin and a regular user:

```bash
cd server
npm run seed
```

After seeding:
| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@example.com | admin123 |
| User  | john@example.com  | user123  |

---

### Step 5 — Run the App

Open **two separate terminals**:

**Terminal 1 — Start the backend server:**
```bash
cd server
npm run dev
```
> Server runs at: http://localhost:5000

**Terminal 2 — Start the frontend:**
```bash
cd client
npm run dev
```
> App runs at: http://localhost:5173

---

## 🌐 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/users/register` | Public | Register new user |
| POST | `/api/users/login` | Public | Login user |
| GET | `/api/products` | Public | Get all products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Add new product |
| DELETE | `/api/products/:id` | Admin | Delete product |

---

## 👑 How to Make a User an Admin

**Option 1: Use the seed script** (creates `admin@example.com` automatically)

**Option 2: MongoDB Compass**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Navigate to `ecommerce > users`
4. Find your user and set `isAdmin: true`

**Option 3: MongoDB Shell**
```js
use ecommerce
db.users.updateOne({ email: "you@example.com" }, { $set: { isAdmin: true } })
```

---

## 🔑 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | Secret key for JWT signing | (set your own secret) |
| `PORT` | Backend server port | `5000` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Vanilla CSS (custom design system) |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (JSON Web Tokens), bcryptjs |

---

## 📸 Pages

| Page | Route | Access |
|------|-------|--------|
| Home (Product List) | `/` | Public |
| Product Detail | `/product/:id` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Shopping Cart | `/cart` | Public |
| Admin Dashboard | `/admin` | Admin only |

---

*Built with ❤️ for final year students learning MERN stack development.*
