import React, { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import ReactMarkdown from "react-markdown";
import { Book, Calendar, Loader, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { enhanceResponseWithSources } from "../utils/enhanceResponseWithSources";

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

const QuickActions = ({ onActionClick }) => (
  <div className="space-y-6 animate-fade-in">
    <p className="text-gray-700 text-sm px-1">
      Select a category to learn more about making education accessible for visually impaired students:
    </p>
    <div className="grid gap-5">
      {quickActions.map((action, index) => (
        <QuickActionButton
          key={index}
          icon={action.icon}
          title={action.title}
          description={action.description}
          onClick={() => onActionClick(action.message)}
        />
      ))}
    </div>
  </div>
);

const quickActions = [
  {
    icon: Book,
    title: "Accessibility Tools",
    description: "Learn about assistive technologies and tools",
    message: "What accessibility tools are available for visually impaired students?",
  },
  {
    icon: Calendar,
    title: "Computer Science Accessibility",
    description: "Learn more about Accessibility in Computer Science Field",
    message: "How do I choose accessible tools or software for a computer science class?",
  },
  {
    icon: Users,
    title: "Course Materials Adaptation ",
    description: "Tips for Modifying class documents like syllabi, presentations, regarding computing",
    message: "How do I go about making my slides accessible in an introduction to programming class in Python?",
  },
];

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [authError, setAuthError] = useState(false);
  const messagesEndRef = useRef(null);
  const { logout } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          history: messages,
        }),
      });

      if (response.status === 401) {
        setAuthError(true);
        throw new Error("Authentication failed");
      }

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
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

  return (
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
  );
}