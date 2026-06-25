"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, Mic, MicOff, Volume2, Sparkles,
  RefreshCw, BookOpen, MessageSquare, Loader2, Zap,
  GraduationCap, Brain
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { aiApi } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string; timestamp: string };

const STARTER_PROMPTS = [
  { text: "Explain the difference between 'haben' and 'sein' in Perfekt tense", icon: "📚" },
  { text: "Help me practice ordering food in German", icon: "🍽️" },
  { text: "What are the most important words for the Goethe A1 exam?", icon: "📝" },
  { text: "Correct my German: 'Ich bin gegangen in die Schule heute'", icon: "✏️" },
  { text: "Teach me how to use der, die, das articles", icon: "🔤" },
  { text: "Create a practice dialogue for a job interview in German", icon: "💼" },
];

export default function AITutorPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hallo! 👋 Ich bin **Greta**, deine KI-Deutschlehrerin!\n\nI'm your personal AI German tutor, specialized in Goethe Institute exam preparation. Whether you need grammar help, vocabulary practice, writing feedback, or just want to have a conversation in German — I'm here for you 24/7.\n\nWas möchtest du heute lernen? (What would you like to learn today?)`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await aiApi.tutorChat({
        messages: [...messages, userMessage].map((m) => ({ role: m.role, content: m.content })),
        level: user?.target_level || "A1",
        session_id: sessionId,
        session_type: "tutor",
      });

      const data = response.data;
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setTotalXP((prev) => prev + (data.xp_earned || 10));
    } catch {
      toast.error("Failed to get response. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice recording coming soon! Use text for now.");
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared! Frischer Start! 🌟 Was möchtest du lernen?",
      timestamp: new Date().toISOString(),
    }]);
    setSessionId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-brand-500 flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">AI Tutor — Greta</h1>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-500">Online · Ready to help</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full">
                  <Zap className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700">+{totalXP} XP earned</span>
                </div>
                <span className={cn(
                  "text-xs px-2.5 py-1 rounded-full font-semibold border",
                  user?.target_level === "A1" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  user?.target_level === "A2" ? "bg-blue-50 text-blue-700 border-blue-200" :
                  "bg-purple-50 text-purple-700 border-purple-200"
                )}>
                  {user?.target_level} Level
                </span>
                <button onClick={clearChat} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Clear chat">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Starter Prompts */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto"
              >
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => sendMessage(prompt.text)}
                    className="flex items-start gap-3 p-4 bg-white border border-gray-200 hover:border-brand-300 hover:bg-brand-50 rounded-2xl text-left transition-all group shadow-sm"
                  >
                    <span className="text-xl">{prompt.icon}</span>
                    <span className="text-sm text-gray-700 group-hover:text-brand-700 font-medium">{prompt.text}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Message List */}
            <div className="max-w-3xl mx-auto space-y-4">
              <AnimatePresence>
                {messages.map((message, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm",
                      message.role === "assistant"
                        ? "bg-gradient-to-br from-purple-500 to-brand-500"
                        : "bg-gradient-to-br from-brand-400 to-brand-600"
                    )}>
                      {message.role === "assistant"
                        ? <Bot className="w-5 h-5 text-white" />
                        : <User className="w-5 h-5 text-white" />}
                    </div>

                    {/* Bubble */}
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-5 py-4 shadow-sm",
                      message.role === "assistant"
                        ? "bg-white border border-gray-100"
                        : "bg-gradient-to-br from-brand-500 to-brand-600 text-white"
                    )}>
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none text-gray-800">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p className={cn(
                        "text-[10px] mt-2",
                        message.role === "assistant" ? "text-gray-400" : "text-white/60"
                      )}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-brand-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">Greta is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-100 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-3 focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Greta anything in English or German... (Enter to send)"
                  className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-900 placeholder-gray-400 max-h-32 min-h-[24px]"
                  rows={1}
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleVoiceToggle}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isRecording
                        ? "bg-red-500 text-white animate-pulse"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                    )}
                    title="Voice input"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Powered by OpenAI GPT-4o · DeepSeek · Gemini · Personalized for {user?.target_level} level
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
