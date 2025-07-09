// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function login(username, password) {
    return fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Invalid credentials');
        }
        const data = await res.json();
        localStorage.setItem('jwt_token', data.access_token);
        localStorage.setItem('is_admin', data.is_admin ? 'true' : 'false');
        setCurrentUser({ username, is_admin: data.is_admin });
        return data;
      });
  }

  function logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('is_admin');
    setCurrentUser(null);
  }

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const isAdmin = localStorage.getItem('is_admin');
    if (token) {
      setCurrentUser({ is_admin: isAdmin === 'true' });
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    jwt: localStorage.getItem('jwt_token'),
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}