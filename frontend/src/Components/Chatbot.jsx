// src/Components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // only visible to students
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! What are you looking for?",
      options: ["Post Internship", "Browse Internships", "Track My Applications"],
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Show chatbot only if student is logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const jwt = localStorage.getItem("jwt");
    setIsVisible(jwt && user.role === "student");
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const botMsg = (text) => {
    setMessages((prev) => [...prev, { from: "bot", text }]);
    setInput("");
  };

  const handleOptionSelect = (option) => {
    setMessages((prev) => [...prev, { from: "user", text: option }]);

    if (option === "Track My Applications") {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "🔍 Checking your internship applications..." },
      ]);

      // Simulated application data (Frontend Only)
      const simulatedApplications = [
        { title: "Frontend Developer at TechNova", status: "🟡 In Review" },
        { title: "Backend Intern at DevSync", status: "🔴 Rejected" },
        { title: "Data Analyst at InsightCorp", status: "🟢 Shortlisted" },
      ];

      setTimeout(() => {
        simulatedApplications.forEach((app) => {
          botMsg(`📌 *${app.title}*\nStatus: ${app.status}`);
        });
        botMsg("💡 Tip: Apply early and customize your application for better results!");
      }, 1000);
    }

    if (option === "Browse Internships") {
      setTimeout(() => navigate("/p/internships"), 500);
    }

    if (option === "Post Internship") {
      setTimeout(() => navigate("/p/recruiterauth"), 500);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot Button */}
      {!isOpen && (
        <div className="relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-110"
            aria-label="Open chatbot"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Click me for help!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border rounded-lg shadow-xl flex flex-col w-80 sm:w-96 max-h-96">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 font-bold text-sm rounded-t-lg flex justify-between items-center">
            <span>CareerNest Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chatbot"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-3 h-64 overflow-y-auto text-sm space-y-2 flex-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[90%] ${msg.from === "user" ? "bg-blue-100 text-right ml-auto" : "bg-gray-100 text-left"
                  }`}
              >
                {msg.text}
                {msg.options && (
                  <div className="mt-2 space-y-1">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left text-blue-600 border border-blue-500 px-2 py-1 rounded text-xs hover:bg-blue-50 transition-colors"
                        onClick={() => handleOptionSelect(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="flex border-t">
            <input
              type="text"
              className="flex-grow px-3 py-2 text-sm border-r focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="bg-blue-600 text-white px-4 text-sm hover:bg-blue-700 transition-colors"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
