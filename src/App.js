import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import AdminUpload from './components/AdminUpload';
import AdminManage from './components/AdminManage';
import ChatWindow from './components/ChatWindow';
import ProtectedRoute from './components/ProtectedRoute';
import AdminQuickActions from './components/AdminQuickActions';

function AppRoutes() {
  const { currentUser } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin/upload"
        element={
          <ProtectedRoute
            isAuthenticated={!!currentUser}
            fallback={<Navigate to="/login" />}
          >
            <AdminUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage"
        element={
          <ProtectedRoute
            isAuthenticated={!!currentUser}
            fallback={<Navigate to="/login" />}
          >
            <AdminManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/quick-actions"
        element={
          <ProtectedRoute
            isAuthenticated={!!currentUser}
            fallback={<Navigate to="/login" />}
          >
            <AdminQuickActions />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/upload" replace />} />
      <Route
        path="/"
        element={
          <ProtectedRoute
            isAuthenticated={!!currentUser}
            fallback={<Navigate to="/login" />}
          >
            <ChatWindow />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;