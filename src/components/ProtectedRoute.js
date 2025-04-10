// src/components/ProtectedRoute.js
export default function ProtectedRoute({ isAuthenticated, children, fallback }) {
  if (!isAuthenticated) {
    return fallback;
  }
  
  return children;
}