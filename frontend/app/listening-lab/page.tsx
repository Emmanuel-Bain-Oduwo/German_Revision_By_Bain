"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Headphones, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { GermakemiWidget } from "@/components/germakemi/widget";
import { useAuthStore } from "@/store/authStore";
import { aiApi, contentApi } from "@/lib/api";
import { cn, getLevelColor } from "@/lib/utils";
import { toast } from "sonner";

export default function ListeningLabPage() {
  const { user } = useAuthStore();
  const [selectedLevel, setSelectedLevel] = useState(user?.target_level || "A1");
  const [generating, setGenerating] = useState(false);
  const [generatedPodcast, setGeneratedPodcast] = useState<{
    title: string; description: string; script: Array<{ speaker: string; text: string; translation: string }>;
    vocabulary_highlighted: Array<{ word: string; translation: string }>;
    comprehension_questions: Array<{ question: string; options: string[]; answer: string }>;
  } | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const generatePodcast = async () => {
    setGenerating(true);
    const topics = ["daily life", "travel", "shopping", "health", "work", "weather"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    try {
      const response = await aiApi.generatePodcast({ topic, level: selectedLevel, duration_minutes: 5 });
      setGeneratedPodcast(response.data.podcast);
      setSelectedAnswers({});
      setShowResults(false);
      toast.success("Listening exercise generated!");
    } catch { toast.error("Failed to generate podcast"); } finally { setGenerating(false); }
  };

  const handleAnswer = (qIdx: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: answer }));
  };

  const checkAnswers = () => setShowResults(true);

  const correctCount = showResults && generatedPodcast?.comprehension_questions
    ? generatedPodcast.comprehension_questions.filter((q, i) => selectedAnswers[i] === q.answer).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-500">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Listening Lab 🎧</h1>
                <p className="text-gray-500 text-sm mt-0.5">Germakemi-generated German dialogues and exercises for Hören practice</p>
              </div>
            </div>

            {/* Level Selector */}
            <div className="flex gap-2 mb-8">
              {["A1", "A2", "B1"].map((l) => (
                <button key={l} onClick={() => setSelectedLevel(l)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all", selectedLevel === l ? "bg-brand-500 text-white border-transparent" : "bg-white text-gray-600 border-gray-200")}>
                  {l}
                </button>
              ))}
            </div>

            {!generatedPodcast ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Headphones className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Generate Listening Exercise</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Germakemi will create a realistic German dialogue at {selectedLevel} level complete with transcript and comprehension questions.
                </p>
                <button onClick={generatePodcast} disabled={generating} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-brand-600 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-lg transition-all shadow-md disabled:opacity-70 mx-auto">
                  <Sparkles className="w-5 h-5" />
                  {generating ? "Germakemi is creating..." : `Ask Germakemi to Create ${selectedLevel} Exercise`}
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Podcast Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-brand-600 to-purple-700 rounded-3xl p-8 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={cn("text-xs px-2.5 py-1 rounded-full bg-white/20 font-semibold mb-3 inline-block", getLevelColor(selectedLevel))}>{selectedLevel}</span>
                      <h2 className="text-2xl font-bold">{generatedPodcast.title || "AI Generated Dialogue"}</h2>
                      <p className="text-white/70 mt-1">{generatedPodcast.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />5 min</span>
                    <span>•</span>
                    <span>{generatedPodcast.script?.length || 0} exchanges</span>
                  </div>
                </motion.div>

                {/* Script */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Dialogue Script</h3>
                  <div className="space-y-4">
                    {generatedPodcast.script?.map((line, idx) => (
                      <div key={idx} className={cn("flex gap-3", idx % 2 === 0 ? "" : "flex-row-reverse")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm", idx % 2 === 0 ? "bg-brand-500" : "bg-purple-500")}>
                          {line.speaker?.[0] || "?"}
                        </div>
                        <div className={cn("max-w-[70%] rounded-2xl px-4 py-3", idx % 2 === 0 ? "bg-gray-50 border border-gray-200" : "bg-purple-50 border border-purple-200")}>
                          <p className="text-xs font-semibold text-gray-500 mb-1">{line.speaker}</p>
                          <p className="text-sm text-gray-900 font-medium">{line.text}</p>
                          <p className="text-xs text-gray-400 italic mt-1">{line.translation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Vocabulary */}
                {generatedPodcast.vocabulary_highlighted?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Key Vocabulary</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {generatedPodcast.vocabulary_highlighted.map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="font-medium text-gray-900 text-sm">{v.word}</span>
                          <span className="text-xs text-gray-500">{v.translation}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Comprehension Questions */}
                {generatedPodcast.comprehension_questions?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Comprehension Questions</h3>
                      {showResults && (
                        <div className={cn("text-sm font-bold px-3 py-1 rounded-full", correctCount === generatedPodcast.comprehension_questions.length ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                          {correctCount}/{generatedPodcast.comprehension_questions.length} correct
                        </div>
                      )}
                    </div>
                    <div className="space-y-6">
                      {generatedPodcast.comprehension_questions.map((q, qIdx) => (
                        <div key={qIdx}>
                          <p className="font-medium text-gray-900 mb-3">{qIdx + 1}. {q.question}</p>
                          <div className="grid gap-2">
                            {q.options?.map((option, oIdx) => {
                              const isSelected = selectedAnswers[qIdx] === option;
                              const isCorrect = showResults && option === q.answer;
                              const isWrong = showResults && isSelected && option !== q.answer;
                              return (
                                <button key={oIdx} onClick={() => !showResults && handleAnswer(qIdx, option)} disabled={showResults} className={cn("text-left p-3 rounded-xl border text-sm transition-all", isCorrect ? "border-green-500 bg-green-50 text-green-800" : isWrong ? "border-red-500 bg-red-50 text-red-800" : isSelected ? "border-brand-500 bg-brand-50 text-brand-800" : "border-gray-200 hover:border-gray-300 bg-white")}>
                                  {option}
                                  {isCorrect && <CheckCircle2 className="inline w-4 h-4 ml-2 text-green-500" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    {!showResults && Object.keys(selectedAnswers).length === generatedPodcast.comprehension_questions.length && (
                      <button onClick={checkAnswers} className="mt-6 w-full py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors">
                        Check Answers
                      </button>
                    )}
                  </motion.div>
                )}

                <button onClick={() => setGeneratedPodcast(null)} className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                  Ask Germakemi for a New Exercise
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
      <GermakemiWidget
        pageContext="German listening comprehension"
        suggestedQuestions={[
          "What topics appear in the Goethe Hören exam?",
          "How can I improve my German listening skills?",
          "Explain what I need to know for the A2 Hören section",
        ]}
      />
    </div>
  );
}
