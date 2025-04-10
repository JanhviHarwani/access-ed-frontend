// src/components/ProtectedRoute.js
import React from "react";

export default function ProtectedRoute({ isAuthenticated, children, fallback }) {
  if (!isAuthenticated) {
    return fallback;
  }
  
  return children;
}