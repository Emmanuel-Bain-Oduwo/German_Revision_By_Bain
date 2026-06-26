"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Zap, ArrowLeft, CheckCircle2, Volume2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { GermakemiWidget } from "@/components/germakemi/widget";
import { contentApi, aiApi } from "@/lib/api";
import type { Story } from "@/types";
import { cn, getLevelColor } from "@/lib/utils";
import { toast } from "sonner";

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const response = await contentApi.getStory(Number(id));
        setStory(response.data);
      } catch { setStory(null); } finally { setLoading(false); }
    };
    if (id) fetchStory();
  }, [id]);

  const handleAnswer = (qIdx: number, answer: string) => {
    if (!showResults) setSelectedAnswers((p) => ({ ...p, [qIdx]: answer }));
  };

  const checkAnswers = () => setShowResults(true);

  const handleComplete = async () => {
    try {
      await contentApi.completeStory(Number(id));
      setCompleted(true);
      toast.success(`+${story?.xp_reward || 30} XP earned!`);
    } catch { toast.error("Failed to mark as complete"); }
  };

  const handleReadAloud = async () => {
    if (!story?.content) return;
    setPlayingAudio(true);
    try {
      const response = await aiApi.textToSpeech({ text: story.content.slice(0, 500), language: "de" });
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { setPlayingAudio(false); URL.revokeObjectURL(url); };
      audio.play();
    } catch { toast.error("TTS not available"); setPlayingAudio(false); }
  };

  const questions = (story as any)?.comprehension_questions || [];
  const correctCount = showResults ? questions.filter((q: any, i: number) => selectedAnswers[i] === q.answer).length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <div className="hidden lg:block"><Sidebar /></div>
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="h-6 bg-white rounded-xl animate-pulse w-32" />
              <div className="h-64 bg-white rounded-3xl animate-pulse" />
              <div className="h-48 bg-white rounded-2xl animate-pulse" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <div className="hidden lg:block"><Sidebar /></div>
          <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">Story not found</p>
              <Link href="/stories" className="text-brand-500 text-sm mt-2 inline-block hover:underline">Back to stories</Link>
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
          <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/stories" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Stories
            </Link>

            {/* Story header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold", getLevelColor(story.level))}>{story.level}</span>
                {story.topic && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{story.topic}</span>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{story.title}</h1>
              {story.title_english && <p className="text-gray-400 italic mb-4">{story.title_english}</p>}

              <div className="flex items-center gap-6 text-xs text-gray-500 mb-6">
                {story.word_count && <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{story.word_count} words</span>}
                {story.reading_time_minutes && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{story.reading_time_minutes} min read</span>}
                <span className="flex items-center gap-1.5 text-yellow-600"><Zap className="w-3.5 h-3.5" />+{story.xp_reward} XP</span>
              </div>

              <button onClick={handleReadAloud} disabled={playingAudio} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-xl text-sm font-semibold hover:bg-brand-100 transition-colors disabled:opacity-50 mb-6">
                <Volume2 className="w-4 h-4" />
                {playingAudio ? "Playing..." : "Listen to Story"}
              </button>

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">{story.content}</p>
              </div>
            </motion.div>

            {/* Vocabulary highlights */}
            {(story as any).vocabulary_highlights?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Key Vocabulary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(story as any).vocabulary_highlights.map((v: any, i: number) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                      <span className="font-medium text-gray-900 text-sm">{v.word}</span>
                      <span className="text-xs text-gray-500">{v.translation}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Comprehension questions */}
            {questions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Comprehension Questions</h2>
                  {showResults && (
                    <span className={cn("text-sm font-bold px-3 py-1 rounded-full", correctCount === questions.length ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                      {correctCount}/{questions.length} correct
                    </span>
                  )}
                </div>
                <div className="space-y-6">
                  {questions.map((q: any, qIdx: number) => (
                    <div key={qIdx}>
                      <p className="font-medium text-gray-900 mb-3">{qIdx + 1}. {q.question}</p>
                      <div className="grid gap-2">
                        {q.options?.map((option: string, oIdx: number) => {
                          const isSelected = selectedAnswers[qIdx] === option;
                          const isCorrect = showResults && option === q.answer;
                          const isWrong = showResults && isSelected && option !== q.answer;
                          return (
                            <button key={oIdx} onClick={() => handleAnswer(qIdx, option)} disabled={showResults} className={cn("text-left p-3 rounded-xl border text-sm transition-all", isCorrect ? "border-green-500 bg-green-50 text-green-800" : isWrong ? "border-red-500 bg-red-50 text-red-800" : isSelected ? "border-brand-500 bg-brand-50 text-brand-800" : "border-gray-200 hover:border-gray-300 bg-white")}>
                              {option}
                              {isCorrect && <CheckCircle2 className="inline w-4 h-4 ml-2 text-green-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                {!showResults && Object.keys(selectedAnswers).length === questions.length && (
                  <button onClick={checkAnswers} className="mt-6 w-full py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors">
                    Check Answers
                  </button>
                )}
              </motion.div>
            )}

            {/* Complete button */}
            {!completed ? (
              <button onClick={handleComplete} className="w-full py-4 bg-gradient-to-r from-brand-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Mark as Complete (+{story.xp_reward} XP)
              </button>
            ) : (
              <div className="w-full py-4 bg-green-50 border border-green-200 text-green-700 font-bold rounded-2xl flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Completed! XP Earned
              </div>
            )}

            <Link href="/ai-tutor" className="flex items-center justify-center gap-2 w-full py-3 border border-purple-300 text-purple-700 rounded-2xl font-semibold hover:bg-purple-50 transition-colors">
              <Sparkles className="w-4 h-4" />
              Ask Germakemi about this story
            </Link>
          </div>
        </main>
      </div>
      <GermakemiWidget
        pageContext="German reading comprehension story"
        suggestedQuestions={[
          "Can you explain difficult words in this story?",
          "What grammar structures appear in this text?",
          "How does this story relate to the Goethe Lesen section?",
        ]}
      />
    </div>
  );
}
