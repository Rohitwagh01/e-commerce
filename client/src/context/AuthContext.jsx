// AuthContext.jsx — Manages user authentication state across the app
import { createContext, useContext, useState } from "react";
import { loginUser as apiLogin, registerUser as apiRegister } from "../services/api";

// Create the Auth context
const AuthContext = createContext();

// AuthProvider wraps the app and provides auth state to all children
export const AuthProvider = ({ children }) => {
  // Load user from localStorage on first render (so login persists on refresh)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  // Login function — calls the API and stores user in state + localStorage
  const login = async (email, password) => {
    const { data } = await apiLogin(email, password);
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  };

  // Register function — calls the API and auto-logs in
  const register = async (name, email, password) => {
    const { data } = await apiRegister(name, email, password);
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  };

  // Logout function — clears user from state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  // Computed values
  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this in components instead of useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);
