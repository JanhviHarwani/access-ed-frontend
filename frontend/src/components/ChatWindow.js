import React, { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import ReactMarkdown from "react-markdown";
import { Book, Calendar, Loader, Users } from "lucide-react";

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
    title: "Teaching Strategies",
    description: "Discover effective teaching methods",
    message: "How can I as a teacher help students who are visually impaired learn better?",
  },
  {
    icon: Users,
    title: "Classroom Adaptation",
    description: "Tips for creating inclusive classrooms",
    message: "How can I adapt my classroom for visually impaired students?",
  },
];

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    if (message.toLowerCase() === "help") {
      setShowQuickActions(true);
      setMessages([
        ...messages,
        { role: "user", content: "help" },
        { role: "assistant", content: "Here are the available categories you can explore:" }
      ]);
      return;
    }

    setShowQuickActions(false);
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
              <ReactMarkdown>{message.content}</ReactMarkdown>
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
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
}