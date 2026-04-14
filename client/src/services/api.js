// api.js — Central place for all API calls using Axios
import axios from "axios";

// Base URL for the backend API
const API_BASE_URL = "http://localhost:5000/api";

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor — attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  // Get user info from localStorage
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ---- User API calls ----

// Register a new user
export const registerUser = (name, email, password) =>
  api.post("/users/register", { name, email, password });

// Login a user
export const loginUser = (email, password) =>
  api.post("/users/login", { email, password });

// ---- Product API calls ----

// Get all products (public)
export const getProducts = () => api.get("/products");

// Get a single product by ID (public)
export const getProductById = (id) => api.get(`/products/${id}`);

// Add a new product (admin only)
export const addProduct = (productData) =>
  api.post("/products", productData);

// Delete a product by ID (admin only)
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export default api;
