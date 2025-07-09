import React, { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import ReactMarkdown from "react-markdown";
import { Book, Calendar, Loader, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { enhanceResponseWithSources } from "../utils/enhanceResponseWithSources";
import { sendChatMessage, fetchQuickActions } from '../utils/api';
import { useNavigate } from 'react-router-dom';

// Custom link renderer component
const CustomLink = ({ href, children }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:text-blue-800"
    >
      {children}
    </a>
  );
};

const QuickActionButton = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    style={{backgroundColor: 'rgb(180 83 9 / 8%)'}}
    className="w-full p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-amber-700/50 transition-all duration-300 hover:shadow-lg group text-left"
  >
    <div className="flex items-center space-x-4">
      <Icon className="w-6 h-6 text-amber-700 group-hover:scale-110 transition-transform" />
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </button>
);

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [authError, setAuthError] = useState(false);
  const messagesEndRef = useRef(null);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  // Move these up so they are defined before use
  const [quickActions, setQuickActions] = useState([]);
  const [quickActionsLoading, setQuickActionsLoading] = useState(true);
  const [quickActionsError, setQuickActionsError] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function loadQuickActions() {
      setQuickActionsLoading(true);
      setQuickActionsError('');
      try {
        const actions = await fetchQuickActions();
        setQuickActions(actions);
      } catch (err) {
        setQuickActionsError('Failed to load quick actions.');
      }
      setQuickActionsLoading(false);
    }
    loadQuickActions();
  }, []);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    if (message.toLowerCase() === "help" || message.toLowerCase() === "menu") {
      setShowQuickActions(true);
      setMessages([
        ...messages,
        { role: "user", content: message },
        { role: "assistant", content: "Here are the available categories you can explore:" }
      ]);
      return;
    }

    setShowQuickActions(false);
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const data = await sendChatMessage({ message, history: messages, jwt: token });
      // Enhance response with source URLs if provided and not a general chat message
      const enhancedContent = enhanceResponseWithSources(
        data.response, 
        data.source_urls, 
        data.source_titles,
        data.is_general_chat // Use the flag from backend
      );
      setMessages([...newMessages, { role: "assistant", content: enhancedContent }]);
    } catch (error) {
      console.error("Error:", error);
      if (error.message === "Authentication failed") {
        setAuthError(true);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Your session has expired. Please log in again.",
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "I apologize, but I encountered an error. Please try again.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle authentication errors
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        logout();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [authError, logout]);

  // Helper to map icon string to component
  function getIconComponent(iconName) {
    switch (iconName) {
      case 'Book': return Book;
      case 'Calendar': return Calendar;
      case 'Users': return Users;
      case 'Loader': return Loader;
      default: return Book;
    }
  }

  // Move QuickActions here so it can access state
  const QuickActions = ({ onActionClick }) => (
    <div className="space-y-6 animate-fade-in">
      <p className="text-gray-700 text-sm px-1">
        Select a category to learn more about making education accessible for visually impaired students:
      </p>
      {quickActionsLoading ? (
        <div>Loading...</div>
      ) : quickActionsError ? (
        <div className="text-red-600">{quickActionsError}</div>
      ) : (
        <div className="grid gap-5">
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={action.id || index}
              icon={getIconComponent(action.icon)}
              title={action.title}
              description={action.description}
              onClick={() => onActionClick(action.message)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f5f1] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-amber-700 flex items-center">
            <span className="mr-2">&#128172;</span> Access-Ed-Assistant
          </h1>
          <div className="flex items-center space-x-4">
            {currentUser?.is_admin && (
              <button
                onClick={() => navigate('/admin/upload')}
                className="flex items-center space-x-2 text-white bg-amber-700 hover:bg-amber-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                <span>Admin Portal</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-amber-700 hover:text-white border border-amber-700 hover:bg-amber-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <span>Sign Out</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
            </button>
          </div>
        </div>
        {/* Chat Content */}
        <div className="flex flex-col h-[calc(100vh-11rem)]">
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-6 py-4 shadow-md ${
                    message.role === "user"
                      ? "bg-amber-700 text-white"
                      : "bg-white text-black border border-gray-200"
                  } transition-all duration-300 hover:scale-[1.01]`}
                >
                  <ReactMarkdown
                    components={{
                      a: CustomLink
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {(messages.length === 0 || showQuickActions) && (
              <QuickActions onActionClick={handleSendMessage} />
            )}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white rounded-lg px-6 py-4 shadow-md border border-gray-200">
                  <div className="flex space-x-2">
                    <Loader className="w-5 h-5 animate-spin text-amber-700" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-6 bg-white border-t border-gray-200">
            <ChatInput onSendMessage={handleSendMessage} disabled={loading || authError} />
          </div>
        </div>
      </div>
    </div>
  );
}