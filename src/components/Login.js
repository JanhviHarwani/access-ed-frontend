// src/components/Login.js
import React, { useState } from "react";
import { Book, Lock, User } from "lucide-react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create form data for the token endpoint
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      // Call backend authentication endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }
      
      // Store token in user data
      const userData = {
        username,
        token: data.access_token
      };
      
      // Login with the userData
      onLogin(userData);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f1] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-amber-700/10 p-4 rounded-full mb-4">
                <Book className="w-12 h-12 text-amber-700" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Access-Ed-Assistant</h1>
              <p className="text-gray-600 mt-2 text-center">
                Sign in to access the educational accessibility assistant
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700"
                    placeholder="accessibility_educator"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-700 hover:bg-amber-600 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:ring-offset-2 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-700/20"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Educational Accessibility Tool for Faculty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}