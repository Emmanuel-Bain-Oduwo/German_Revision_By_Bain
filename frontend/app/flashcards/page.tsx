"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, Zap, Target, Trophy, CheckCircle2, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { GermakemiWidget } from "@/components/germakemi/widget";
import { useAuthStore } from "@/store/authStore";
import { flashcardApi } from "@/lib/api";
import type { Flashcard } from "@/types";
import { cn, getLevelColor } from "@/lib/utils";
import { toast } from "sonner";
import { FLASHCARDS_FALLBACK } from "@/lib/fallback-data";

const QUALITY_BUTTONS = [
  { quality: 1, label: "Again", desc: "Didn't remember", color: "bg-red-500 hover:bg-red-600", textColor: "text-red-700", bg: "bg-red-50" },
  { quality: 3, label: "Hard", desc: "Remembered with effort", color: "bg-orange-500 hover:bg-orange-600", textColor: "text-orange-700", bg: "bg-orange-50" },
  { quality: 4, label: "Good", desc: "Remembered correctly", color: "bg-blue-500 hover:bg-blue-600", textColor: "text-blue-700", bg: "bg-blue-50" },
  { quality: 5, label: "Easy", desc: "Perfect recall", color: "bg-green-500 hover:bg-green-600", textColor: "text-green-700", bg: "bg-green-50" },
];

export default function FlashcardsPage() {
  const { user, updateUser } = useAuthStore();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, xpEarned: 0 });
  const [selectedLevel, setSelectedLevel] = useState(user?.target_level || "A1");
  const [sessionComplete, setSessionComplete] = useState(false);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await flashcardApi.getStudySession(selectedLevel, 20);
      const data = response.data.cards || [];
      setCards(data.length ? data : FLASHCARDS_FALLBACK.filter((c) => !c.level || c.level === selectedLevel));
      setCurrentIdx(0);
      setIsFlipped(false);
      setSessionComplete(false);
    } catch {
      setCards(FLASHCARDS_FALLBACK.filter((c) => !c.level || c.level === selectedLevel));
      setCurrentIdx(0);
      setIsFlipped(false);
      setSessionComplete(false);
    } finally {
      setLoading(false);
    }
  }, [selectedLevel]);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const currentCard = cards[currentIdx];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleQuality = async (quality: number) => {
    if (!currentCard) return;
    try {
      const response = await flashcardApi.review(currentCard.id, quality);
      const xp = response.data.xp_earned || 0;
      setSessionStats((prev) => ({
        correct: prev.correct + (quality >= 3 ? 1 : 0),
        incorrect: prev.incorrect + (quality < 3 ? 1 : 0),
        xpEarned: prev.xpEarned + xp,
      }));
      if (xp > 0) {
        updateUser({ xp_points: (user?.xp_points || 0) + xp });
      }
    } catch {}

    setIsFlipped(false);
    setTimeout(() => {
      if (currentIdx + 1 >= cards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    }, 150);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <div className="hidden lg:block"><Sidebar /></div>
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading your flashcards...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-500">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
                  <p className="text-gray-500 text-sm mt-0.5">Spaced repetition · SM-2 algorithm for maximum retention</p>
                </div>
              </div>
              <div className="flex gap-2">
                {["A1", "A2", "B1"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all",
                      selectedLevel === level
                        ? "bg-brand-500 text-white border-transparent"
                        : "bg-white text-gray-600 border-gray-200"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-gray-900">{currentIdx}/{cards.length}</div>
                <div className="text-xs text-gray-500 mt-1">Cards Reviewed</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-100 text-center">
                <div className="text-2xl font-bold text-green-600">{sessionStats.correct}</div>
                <div className="text-xs text-green-600 mt-1">Correct</div>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-4 shadow-sm border border-yellow-100 text-center">
                <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                  <Zap className="w-5 h-5" />{sessionStats.xpEarned}
                </div>
                <div className="text-xs text-yellow-600 mt-1">XP Earned</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentIdx / (cards.length || 1)) * 100}%` }}
                className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Session Complete */}
            <AnimatePresence>
              {sessionComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 text-center"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h2>
                  <p className="text-gray-500 mb-6">
                    Great work! You reviewed {cards.length} cards and earned{" "}
                    <span className="text-yellow-500 font-bold">{sessionStats.xpEarned} XP</span>!
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-green-50 rounded-2xl p-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-600">{sessionStats.correct}</div>
                      <div className="text-sm text-green-600">Remembered</div>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-4">
                      <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-red-500">{sessionStats.incorrect}</div>
                      <div className="text-sm text-red-500">To review</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={fetchCards}
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-500 text-white py-3 rounded-xl font-semibold hover:bg-brand-600 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> New Session
                    </button>
                    <Link
                      href="/ai-tutor"
                      className="flex items-center justify-center gap-2 border border-purple-300 text-purple-700 px-4 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" /> Ask Germakemi
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flashcard */}
            {!sessionComplete && currentCard && (
              <>
                <div className="flashcard cursor-pointer mb-6" onClick={handleFlip}>
                  <motion.div
                    className="flashcard-inner relative"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Front */}
                    <div className="flashcard-front bg-white rounded-3xl shadow-xl border border-gray-100 p-10 min-h-[280px] flex flex-col items-center justify-center text-center">
                      {currentCard.level && (
                        <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold mb-4", getLevelColor(currentCard.level))}>
                          {currentCard.level} · {currentCard.card_type}
                        </span>
                      )}
                      <p className="text-4xl font-bold text-gray-900 mb-4">{currentCard.front_text}</p>
                      {currentCard.hint && (
                        <p className="text-sm text-gray-400 italic">Hint: {currentCard.hint}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-6 flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> Click to reveal
                      </p>
                    </div>

                    {/* Back */}
                    <div
                      className="flashcard-back absolute inset-0 bg-gradient-to-br from-brand-500 to-purple-600 rounded-3xl shadow-xl p-10 min-h-[280px] flex flex-col items-center justify-center text-center text-white"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      <p className="text-4xl font-bold mb-3">{currentCard.back_text}</p>
                      <p className="text-white/70 text-sm">Click to see question</p>
                    </div>
                  </motion.div>
                </div>

                {/* Quality Buttons */}
                <AnimatePresence>
                  {isFlipped && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="grid grid-cols-4 gap-3"
                    >
                      {QUALITY_BUTTONS.map((btn) => (
                        <button
                          key={btn.quality}
                          onClick={() => handleQuality(btn.quality)}
                          className={cn("py-3 rounded-2xl text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5", btn.color)}
                        >
                          <div>{btn.label}</div>
                          <div className="text-xs font-normal opacity-80 mt-0.5">{btn.desc}</div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isFlipped && (
                  <div className="text-center">
                    <button
                      onClick={handleFlip}
                      className="px-8 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-md"
                    >
                      Show Answer
                    </button>
                  </div>
                )}
              </>
            )}

            {!sessionComplete && !currentCard && !loading && (
              <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h2>
                <p className="text-gray-500 mb-6">No cards due for review. Come back tomorrow!</p>
                <div className="flex gap-3 max-w-xs mx-auto">
                  <button onClick={fetchCards} className="flex-1 px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors">
                    Load New Cards
                  </button>
                  <Link href="/ai-tutor" className="flex items-center gap-2 px-4 py-3 border border-purple-300 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <GermakemiWidget
        pageContext="flashcard study session"
        suggestedQuestions={[
          "I'm struggling with this card, can you explain it?",
          "What's the best way to remember German vocabulary?",
          "Give me a memory trick for German articles",
        ]}
      />
    </div>
  );
}
