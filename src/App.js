import React from 'react';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import { MessageCircle, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const WaveBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <svg className="absolute w-full h-64 transform translate-y-[-50%] opacity-5" viewBox="0 0 1440 320">
      <path 
        fill="currentColor" 
        className="text-amber-700 animate-wave-slow"
        d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,144C672,139,768,85,864,69.3C960,53,1056,75,1152,96C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      >
        <animate
          attributeName="d"
          dur="10s"
          repeatCount="indefinite"
          values="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,144C672,139,768,85,864,69.3C960,53,1056,75,1152,96C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                 M0,64L48,74.7C96,85,192,107,288,122.7C384,139,480,149,576,144C672,139,768,117,864,101.3C960,85,1056,75,1152,80C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </path>
    </svg>
  </div>
);

function AppContent() {
  const { user, login, logout, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-gray-800">
      <div className="container mx-auto px-4 py-8 h-screen">
        <ProtectedRoute 
          isAuthenticated={!!user}
          fallback={<Login onLogin={(username) => login(username)} />}
        >
          <div className="bg-white backdrop-blur-xl rounded-xl shadow-lg overflow-hidden h-[95vh] border border-gray-200 relative">
            <WaveBackground />
            <div className="bg-white p-6 border-b border-gray-200 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-8 h-8 text-amber-700" />
                  <div>
                    <h1 className="text-2xl font-bold mb-1 text-gray-800 animate-fade-in">
                      Access-Ed-Assistant
                    </h1>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-amber-700" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
            <ChatWindow />
          </div>
        </ProtectedRoute>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}