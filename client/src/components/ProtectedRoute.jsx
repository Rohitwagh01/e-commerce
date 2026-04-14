// ProtectedRoute.jsx — Redirect unauthorized users away from protected pages
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// adminOnly = true means only admins can access
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Not logged in → go to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route but user is not admin → go home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // All checks passed → render the protected page
  return children;
};

export default ProtectedRoute;
