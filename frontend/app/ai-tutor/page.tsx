"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, MicOff, Volume2, Sparkles,
  RefreshCw, Loader2, Zap, GraduationCap, ChevronLeft,
  BookOpen, Target, Pen, Star
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { aiApi } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string; timestamp: string };

const STARTER_PROMPTS = [
  { text: "Explain the difference between 'haben' and 'sein' in Perfekt tense", icon: "📚", tag: "Grammar" },
  { text: "What are the most important A1 words for the Goethe exam?", icon: "📝", tag: "Exam Prep" },
  { text: "Help me practice ordering food in German", icon: "🍽️", tag: "Speaking" },
  { text: "Correct my German: 'Ich bin gegangen in die Schule heute'", icon: "✏️", tag: "Correction" },
  { text: "Teach me how to use der, die, das articles", icon: "🔤", tag: "Grammar" },
  { text: "Create a practice dialogue for meeting someone new in German", icon: "💬", tag: "Conversation" },
];

const CAPABILITY_CARDS = [
  { icon: BookOpen, label: "Grammar Help", desc: "Explain any German grammar rule clearly with examples", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { icon: Target, label: "Exam Coaching", desc: "Goethe A1/A2/B1 exam strategies and practice questions", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { icon: Pen, label: "Writing Feedback", desc: "Submit your writing and get detailed corrections", color: "bg-purple-50 text-purple-600 border-purple-200" },
  { icon: Star, label: "Vocabulary Drills", desc: "Learn words in context with example sentences", color: "bg-amber-50 text-amber-600 border-amber-200" },
];

export default function GermakemiPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hallo! 👋 Ich bin **Germakemi**, deine persönliche Deutschlehrerin!\n\nI'm your dedicated German learning guide, specialized in Goethe Institute exam preparation — A1, A2, and B1 levels. I'll help you with:\n\n- 📖 **Grammar** — clear explanations with examples\n- 🎯 **Exam prep** — strategies and practice for all 4 sections\n- ✍️ **Writing feedback** — paste your text, I'll correct it\n- 💬 **Conversation practice** — chat with me in German!\n\n*Was möchtest du heute lernen?* (What would you like to learn today?)`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      if (data.session_id && !sessionId) setSessionId(data.session_id);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, timestamp: new Date().toISOString() },
      ]);
      setTotalXP((prev) => prev + (data.xp_earned || 10));
    } catch {
      toast.error("Connection issue. Please try again.");
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

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Frischer Start! 🌟 *New conversation started.* Was möchtest du lernen?",
      timestamp: new Date().toISOString(),
    }]);
    setSessionId(null);
  };

  const speakText = async (text: string) => {
    try {
      const clean = text.replace(/[*_#`]/g, "");
      const response = await aiApi.textToSpeech({ text: clean, language: "de-DE" });
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="hidden lg:block"><Sidebar /></div>

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-brand-600 flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-gray-900">Germakemi</h1>
                    <span className="hidden sm:inline text-xs text-gray-400">— Your German Guide</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-500">Always online · {user?.target_level} level</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {totalXP > 0 && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-xs font-bold text-yellow-700">+{totalXP} XP</span>
                  </div>
                )}
                <button
                  onClick={() => setShowCapabilities(!showCapabilities)}
                  className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" /> What can I do?
                </button>
                <button
                  onClick={clearChat}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  title="New conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Capabilities Panel */}
            <AnimatePresence>
              {showCapabilities && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 pb-2">
                    {CAPABILITY_CARDS.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div key={card.label} className={cn("border rounded-xl p-3", card.color)}>
                          <Icon className="w-4 h-4 mb-1" />
                          <p className="text-xs font-bold">{card.label}</p>
                          <p className="text-[10px] opacity-80 mt-0.5 leading-tight">{card.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {/* Starter Prompts */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.text}
                      onClick={() => sendMessage(prompt.text)}
                      className="flex items-start gap-3 p-4 bg-white border border-gray-200 hover:border-brand-300 hover:bg-brand-50 rounded-2xl text-left transition-all group shadow-sm"
                    >
                      <span className="text-2xl flex-shrink-0">{prompt.icon}</span>
                      <div>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          {prompt.tag}
                        </span>
                        <p className="text-sm text-gray-700 group-hover:text-brand-700 font-medium mt-1 leading-snug">
                          {prompt.text}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Messages */}
              <AnimatePresence initial={false}>
                {messages.map((message, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-sm",
                        message.role === "assistant"
                          ? "bg-gradient-to-br from-purple-600 to-brand-600"
                          : "bg-gradient-to-br from-brand-400 to-brand-600"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Sparkles className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>

                    {/* Bubble */}
                    <div className="max-w-[78%]">
                      {message.role === "assistant" && (
                        <p className="text-[10px] text-gray-400 mb-1 ml-1 font-semibold">GERMAKEMI</p>
                      )}
                      <div
                        className={cn(
                          "rounded-3xl px-5 py-4 shadow-sm",
                          message.role === "assistant"
                            ? "bg-white border border-gray-100 rounded-tl-sm"
                            : "bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-sm"
                        )}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none text-gray-800 [&_strong]:text-purple-700 [&_em]:text-brand-600 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_ul]:mt-1 [&_li]:mt-0.5">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div
                        className={cn(
                          "flex items-center gap-2 mt-1 px-1",
                          message.role === "user" ? "justify-end" : ""
                        )}
                      >
                        {message.role === "assistant" && (
                          <button
                            onClick={() => speakText(message.content)}
                            className="p-1 text-gray-300 hover:text-brand-500 transition-colors rounded"
                            title="Listen"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                        <p className="text-[10px] text-gray-300">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading */}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-brand-600 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-3xl rounded-tl-sm px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">Germakemi is composing a response...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-100 p-4 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-3 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-sm">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Germakemi in English or German… (Enter to send, Shift+Enter for new line)"
                  className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-900 placeholder-gray-400 max-h-32 min-h-[24px] leading-relaxed"
                  rows={1}
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setIsRecording(!isRecording);
                      if (!isRecording) toast.info("Voice input coming soon! Use text for now.");
                    }}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isRecording
                        ? "bg-red-500 text-white animate-pulse"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Germakemi is specialized in Goethe Institute A1 · A2 · B1 exam preparation
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
