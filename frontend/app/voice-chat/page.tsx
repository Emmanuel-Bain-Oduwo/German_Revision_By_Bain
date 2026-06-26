"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Volume2, VolumeX, Loader2, Zap,
  MessageSquare, ChevronLeft, Trash2, Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/authStore";
import { aiApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CONVERSATION_STARTERS = [
  "Hallo! Wie geht es dir?",
  "Kannst du mir bei der deutschen Grammatik helfen?",
  "Was ist der Unterschied zwischen 'sein' und 'haben'?",
  "Lass uns über Familie sprechen.",
  "Wie sagt man 'I am learning German' auf Deutsch?",
];

export default function VoiceChatPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hallo! Ich bin Greta, deine KI-Sprachlehrerin. 👋 Press the microphone and speak to me in German or English — I'll respond by voice! We can practise conversation, grammar, vocabulary, or anything you'd like. Auf geht's!",
      timestamp: new Date(),
    },
  ]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [xpTotal, setXpTotal] = useState(0);
  const [error, setError] = useState("");
  const [browserSupport, setBrowserSupport] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const level = user?.target_level || "A1";

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setBrowserSupport(false); return; }
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "de-DE";
    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
      if (final) handleSend(final);
    };
    rec.onerror = () => { setListening(false); setError("Microphone error. Please try again."); };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const speak = useCallback((text: string) => {
    if (muted || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [muted]);

  const stopSpeak = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  async function handleSend(text: string) {
    if (!text.trim() || thinking) return;
    setError("");
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setTranscript("");
    setThinking(true);
    stopSpeak();

    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const res = await aiApi.voiceChat({ transcript: text, level, conversation_history: history });
      const reply = res.data.reply_text;
      const assistantMsg: Message = { role: "assistant", content: reply, timestamp: new Date() };
      setMessages((prev) => [...prev, assistantMsg]);
      setXpTotal((prev) => prev + (res.data.xp_earned || 5));
      speak(reply);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setThinking(false);
    }
  }

  function toggleListen() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setError("");
      stopSpeak();
      try {
        recognitionRef.current.lang = "de-DE";
        recognitionRef.current.start();
        setListening(true);
        setTranscript("");
      } catch {
        setError("Could not start microphone. Check browser permissions.");
      }
    }
  }

  function clearConversation() {
    stopSpeak();
    setMessages([{
      role: "assistant",
      content: "Neue Unterhaltung! Let's start fresh. Press the mic and speak to me. 😊",
      timestamp: new Date(),
    }]);
    setXpTotal(0);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
          <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 min-h-0">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Voice Chat with Greta</h1>
                  <p className="text-sm text-gray-500">AI German tutor — speak freely, get spoken replies</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {xpTotal > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-xl text-yellow-700 text-sm font-bold">
                    <Zap className="w-4 h-4" /> +{xpTotal} XP
                  </div>
                )}
                <button onClick={() => { setMuted(!muted); if (!muted) stopSpeak(); }} title={muted ? "Unmute" : "Mute"} className={cn("p-2.5 rounded-xl border transition-colors", muted ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50")}>
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button onClick={clearConversation} title="Clear conversation" className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Browser support warning */}
            {!browserSupport && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4 flex items-start gap-3 flex-shrink-0">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">Your browser doesn't support speech recognition. Use Google Chrome or Microsoft Edge for the full voice experience. You can still type below.</p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-0">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    {/* Avatar */}
                    <div className={cn("w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm", msg.role === "assistant" ? "bg-gradient-to-br from-violet-500 to-purple-700" : "bg-gradient-to-br from-brand-400 to-brand-600")}>
                      {msg.role === "assistant" ? "G" : user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className={cn("max-w-[80%] rounded-2xl px-5 py-3 shadow-sm", msg.role === "assistant" ? "bg-white border border-gray-100 text-gray-800 rounded-tl-sm" : "bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-sm")}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={cn("text-xs mt-1.5", msg.role === "assistant" ? "text-gray-400" : "text-white/60")}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Thinking indicator */}
              {thinking && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">G</div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Live transcript */}
            {transcript && (
              <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5 mb-3 text-sm text-violet-800 italic flex-shrink-0">
                🎤 "{transcript}"
              </div>
            )}

            {/* Error */}
            {error && <p className="text-red-500 text-sm mb-3 flex-shrink-0">{error}</p>}

            {/* Conversation starters */}
            {messages.length === 1 && !listening && (
              <div className="mb-4 flex-shrink-0">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Try saying…</p>
                <div className="flex flex-wrap gap-2">
                  {CONVERSATION_STARTERS.map((s) => (
                    <button key={s} onClick={() => handleSend(s)} className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-gray-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main mic button + text input */}
            <div className="flex-shrink-0 flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-3">
              {/* Mic button */}
              <button
                onClick={toggleListen}
                disabled={thinking}
                className={cn(
                  "relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm font-bold",
                  listening
                    ? "bg-red-500 text-white shadow-red-200 shadow-lg scale-105"
                    : thinking
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-br from-violet-500 to-purple-700 text-white hover:shadow-lg hover:scale-105"
                )}
              >
                {listening ? <MicOff className="w-6 h-6" /> : thinking ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
                {listening && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
                )}
                {speaking && !listening && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                )}
              </button>

              {/* Text input fallback */}
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder={listening ? "Listening…" : "Or type your message…"}
                  disabled={listening || thinking}
                  onKeyDown={(e) => { if (e.key === "Enter" && e.currentTarget.value.trim()) { handleSend(e.currentTarget.value.trim()); e.currentTarget.value = ""; } }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Status hint */}
            <p className="text-center text-xs text-gray-400 mt-2 flex-shrink-0">
              {listening ? "🔴 Listening… speak now" : speaking ? "🔊 Greta is speaking…" : "Press the mic button or type to chat"}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
