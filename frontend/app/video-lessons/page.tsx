"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Loader2, Sparkles, ChevronLeft, BookOpen, Zap, RefreshCw,
  Video, ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/authStore";
import { aiApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Slide {
  slide_number: number;
  type: string;
  heading: string;
  content: string;
  german_examples: string[];
  english_translations: string[];
  narrator_text: string;
}

interface VideoLesson {
  title: string;
  level: string;
  topic: string;
  slides: Slide[];
  provider: string;
  total_duration_seconds: number;
}

const SUGGESTED_TOPICS: Record<string, string[]> = {
  A1: ["Greetings & Introductions", "German Numbers", "Family Members", "Food & Drink", "German Articles der die das", "Days of the Week"],
  A2: ["Modal Verbs", "Perfect Tense", "Dative Case", "Separable Verbs", "Adjective Endings", "Travel Vocabulary"],
  B1: ["Passive Voice", "Konjunktiv II", "Relative Clauses", "Genitive Case", "Expressing Opinions", "German Job Market"],
};

const SLIDE_COLORS: Record<string, string> = {
  title: "from-brand-600 to-purple-700",
  vocabulary: "from-emerald-500 to-teal-600",
  grammar: "from-blue-500 to-indigo-600",
  example: "from-orange-500 to-rose-600",
  summary: "from-purple-600 to-pink-600",
};

const SLIDE_ICONS: Record<string, string> = {
  title: "🎬",
  vocabulary: "📚",
  grammar: "⚡",
  example: "💬",
  summary: "🏆",
};

export default function VideoLessonsPage() {
  const { user } = useAuthStore();
  const [level, setLevel] = useState(user?.target_level || "A1");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [lesson, setLesson] = useState<VideoLesson | null>(null);
  const [generating, setGenerating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [narrating, setNarrating] = useState(false);
  const [error, setError] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const SLIDE_DURATION = 8000;

  const speak = useCallback((text: string) => {
    if (muted || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.onstart = () => setNarrating(true);
    utterance.onend = () => setNarrating(false);
    utterance.onerror = () => setNarrating(false);
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [muted]);

  const stopSpeak = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setNarrating(false);
  }, []);

  useEffect(() => {
    if (!lesson) return;
    if (playing) {
      speak(lesson.slides[currentSlide].narrator_text);
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev >= lesson.slides.length - 1) {
            setPlaying(false);
            stopSpeak();
            return prev;
          }
          const next = prev + 1;
          speak(lesson.slides[next].narrator_text);
          return next;
        });
      }, SLIDE_DURATION);
    } else {
      stopSpeak();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, lesson, currentSlide, speak, stopSpeak]);

  useEffect(() => {
    return () => stopSpeak();
  }, [stopSpeak]);

  async function generate() {
    const finalTopic = customTopic.trim() || topic;
    if (!finalTopic) { setError("Please select or enter a topic."); return; }
    setError("");
    setGenerating(true);
    setLesson(null);
    setCurrentSlide(0);
    setPlaying(false);
    stopSpeak();
    try {
      const res = await aiApi.generateVideoLesson({ topic: finalTopic, level });
      setLesson(res.data);
    } catch {
      setError("Failed to generate lesson. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function goToSlide(idx: number) {
    if (!lesson) return;
    stopSpeak();
    setCurrentSlide(idx);
    if (playing) speak(lesson.slides[idx].narrator_text);
  }

  const slide = lesson?.slides[currentSlide];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Video Lessons</h1>
                <p className="text-gray-500 mt-0.5">AI-generated animated lessons powered by Gemini</p>
              </div>
            </div>

            {/* Generator Panel */}
            {!lesson && !generating && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Generate a New Lesson</h2>

                {/* Level picker */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Level</label>
                  <div className="flex gap-2">
                    {["A1", "A2", "B1"].map((l) => (
                      <button key={l} onClick={() => { setLevel(l); setTopic(""); }} className={cn("px-5 py-2 rounded-xl font-semibold text-sm border transition-all", level === l ? "bg-brand-500 text-white border-transparent shadow" : "bg-white text-gray-600 border-gray-200 hover:border-brand-300")}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggested topics */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Choose a Topic</label>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TOPICS[level].map((t) => (
                      <button key={t} onClick={() => { setTopic(t); setCustomTopic(""); }} className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all", topic === t && !customTopic ? "bg-brand-100 text-brand-700 border-brand-300" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-200 hover:bg-brand-50")}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom topic */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Or Type Your Own Topic</label>
                  <input
                    value={customTopic}
                    onChange={(e) => { setCustomTopic(e.target.value); setTopic(""); }}
                    placeholder="e.g. German colours and shapes..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 text-gray-900"
                  />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button onClick={generate} className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Generate Video Lesson with Gemini
                </button>
              </motion.div>
            )}

            {/* Generating state */}
            {generating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Gemini is creating your lesson…</h2>
                <p className="text-gray-500">Building slides, examples, and narration script</p>
              </motion.div>
            )}

            {/* Video Player */}
            {lesson && !generating && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>

                {/* Lesson info bar */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-semibold text-xs">{lesson.level}</span>
                      <span>{lesson.slides.length} slides</span>
                      <span>~{Math.round(lesson.total_duration_seconds / 60)} min</span>
                    </div>
                  </div>
                  <button onClick={() => { setLesson(null); setPlaying(false); stopSpeak(); }} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                    <RefreshCw className="w-4 h-4" /> New Lesson
                  </button>
                </div>

                {/* Main slide display */}
                <div className="rounded-3xl overflow-hidden shadow-xl mb-4" style={{ aspectRatio: "16/9", minHeight: 360 }}>
                  <AnimatePresence mode="wait">
                    {slide && (
                      <motion.div key={currentSlide} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4 }} className={cn("w-full h-full bg-gradient-to-br flex flex-col justify-center p-10 text-white relative", SLIDE_COLORS[slide.type] || "from-brand-600 to-purple-700")} style={{ minHeight: 360 }}>

                        {/* Slide number + type */}
                        <div className="absolute top-6 right-8 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                          {SLIDE_ICONS[slide.type]} Slide {slide.slide_number}/{lesson.slides.length}
                        </div>

                        {/* Narrating indicator */}
                        {narrating && (
                          <div className="absolute top-6 left-8 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            <Volume2 className="w-4 h-4 animate-pulse" /> Narrating…
                          </div>
                        )}

                        <h2 className="text-3xl lg:text-4xl font-black mb-4 leading-tight">{slide.heading}</h2>
                        <p className="text-white/85 text-lg mb-6 max-w-2xl leading-relaxed">{slide.content}</p>

                        {slide.german_examples.length > 0 && (
                          <div className="space-y-2">
                            {slide.german_examples.slice(0, 4).map((ex, i) => (
                              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-1">
                                <span className="font-bold text-white">{ex}</span>
                                {slide.english_translations[i] && (
                                  <span className="text-white/70 text-sm sm:ml-3">— {slide.english_translations[i]}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Decorative circles */}
                        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full pointer-events-none" />
                        <div className="absolute -right-8 -bottom-24 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>Slide {currentSlide + 1} of {lesson.slides.length}</span>
                      <span>{Math.round(((currentSlide + 1) / lesson.slides.length) * 100)}% complete</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full" animate={{ width: `${((currentSlide + 1) / lesson.slides.length) * 100}%` }} transition={{ duration: 0.3 }} />
                    </div>
                  </div>

                  {/* Playback buttons */}
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => goToSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0} className="p-3 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-30">
                      <SkipBack className="w-5 h-5 text-gray-700" />
                    </button>
                    <button onClick={() => setPlaying(!playing)} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
                      {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                    <button onClick={() => goToSlide(Math.min(lesson.slides.length - 1, currentSlide + 1))} disabled={currentSlide === lesson.slides.length - 1} className="p-3 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-30">
                      <SkipForward className="w-5 h-5 text-gray-700" />
                    </button>
                    <button onClick={() => { setMuted(!muted); if (!muted) stopSpeak(); }} className={cn("p-3 rounded-xl transition-colors", muted ? "bg-red-50 text-red-500" : "hover:bg-gray-100 text-gray-700")}>
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Slide thumbnails */}
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                    {lesson.slides.map((s, i) => (
                      <button key={i} onClick={() => goToSlide(i)} className={cn("flex-shrink-0 w-10 h-10 rounded-xl text-sm font-bold transition-all", i === currentSlide ? "bg-rose-500 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                        {SLIDE_ICONS[s.type]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Narrator script (read-along) */}
                <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Narrator Script</p>
                  <p className="text-gray-700 leading-relaxed italic">"{slide?.narrator_text}"</p>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
