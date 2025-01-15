// src/components/ChatInput.js
import React, { useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { Send } from "lucide-react";

export default function ChatInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        placeholder="Type your message..."
        className="flex-1 p-4 rounded-lg bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 transition-all duration-300"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="px-6 py-4 bg-amber-700 hover:bg-amber-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-amber-700/20 group"
      >
        <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}

