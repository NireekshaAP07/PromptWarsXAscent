"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface AICopilotProps {
  contractText?: string;
}

export default function AICopilot({ contractText }: AICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: contractText 
        ? "Hi! I am your LexGuard AI Assistant. I have read the contract active on your dashboard. Ask me anything about it—such as clauses you find confusing, hidden traps, or how to negotiate better terms!"
        : "Hello! I am your LexGuard AI Assistant. How can I help you clarify legal doubts or analyze contracts today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle preset prompt click
  const handlePresetClick = (promptText: string) => {
    if (isLoading) return;
    sendMessage(promptText);
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: Message = {
      sender: "user",
      text: trimmed,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: trimmed,
          contractText: contractText || null,
          history: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      
      const botMsg: Message = {
        sender: "bot",
        text: data.reply || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("AI Assistant Chat error:", error);
      const errorMsg: Message = {
        sender: "bot",
        text: "I'm having trouble connecting to the legal engine right now. Please ensure your Gemini API key is configured or try again shortly.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(query);
  };

  const presets = contractText
    ? [
        "Explain liability risk",
        "Is there a non-compete?",
        "Draft counter-proposal email"
      ]
    : [
        "What is a non-compete clause?",
        "Explain uncapped indemnity risk",
        "Tips for legal contract negotiations"
      ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans print:hidden">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-[14px] shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
          id="ai-assistant-toggle"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span>AI Legal Assistant</span>
        </button>
      )}

      {/* Sleek Glassmorphic Chat Box */}
      {isOpen && (
        <div 
          className="w-[380px] sm:w-[420px] h-[550px] rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
          style={{ boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)" }}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-slate-800 dark:text-slate-100 text-sm leading-none">
                    LexGuard Assistant
                  </h4>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  Legal Analysis Engine Active
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Banner */}
          {contractText && (
            <div className="px-6 py-2 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100/30 dark:border-blue-950/30 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium truncate">
                Context loaded: Active Contract is active for queries.
              </p>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4.5 py-3 text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-500/5"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200/20 dark:border-slate-800/20"
                  }`}
                >
                  <p className="whitespace-pre-line font-normal">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl rounded-tl-none border border-slate-200/20 dark:border-slate-800/20 px-4.5 py-3.5 flex items-center gap-1.5 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-2 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-2">
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePresetClick(p)}
                disabled={isLoading}
                className="text-[11px] font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 transition-all duration-200 flex items-center gap-1 shrink-0"
              >
                <span>{p}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={handleSubmit}
            className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2.5"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={contractText ? "Ask about this contract..." : "Ask a legal question..."}
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-4 py-2.5 text-[13px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.03] active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:shadow-none transition-all duration-200 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
