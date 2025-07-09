import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function TopNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const isUpload = location.pathname.startsWith('/admin/upload');
    const isManage = location.pathname.startsWith('/admin/manage');
    const isQuickActions = location.pathname.startsWith('/admin/quick-actions');
    return (
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            className={`text-lg font-bold focus:outline-none ${isUpload ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-700'}`}
            onClick={() => navigate('/admin/upload')}
          >
            Upload
          </button>
          <button
            className={`text-lg font-bold focus:outline-none ${isManage ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-700'}`}
            onClick={() => navigate('/admin/manage')}
          >
            Manage
          </button>
          <button
            className={`text-lg font-bold focus:outline-none ${isQuickActions ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-700'}`}
            onClick={() => navigate('/admin/quick-actions')}
          >
            Quick Actions
          </button>
        </div>
        <div className="flex items-center space-x-4">
        <button
          className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
          onClick={() => navigate('/')}
        >
          Back to Chat
        </button>
        <button
              onClick={logout}
              className="flex items-center space-x-2 text-amber-700 hover:text-white border border-amber-700 hover:bg-amber-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <span>Sign Out</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
            </button>
            </div>
      </div>
    );
  }

export default TopNav