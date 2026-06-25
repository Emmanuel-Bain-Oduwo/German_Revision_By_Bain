"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Volume2, BookOpen, Filter, ChevronRight, Star, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { vocabularyApi, aiApi } from "@/lib/api";
import type { Vocabulary } from "@/types";
import { cn, getLevelColor } from "@/lib/utils";
import { toast } from "sonner";

const WORD_TYPES = ["all", "noun", "verb", "adjective", "adverb", "phrase"];
const LEVELS = ["A1", "A2", "B1"];

export default function VocabularyPage() {
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, page_size: 24 };
      if (search) params.search = search;
      if (selectedLevel) params.level = selectedLevel;
      if (selectedType !== "all") params.word_type = selectedType;

      const response = await vocabularyApi.list(params);
      setWords(response.data.items || []);
      setTotal(response.data.total || 0);
    } catch {
      toast.error("Failed to load vocabulary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWords(); }, [page, selectedLevel, selectedType]);
  useEffect(() => {
    const debounce = setTimeout(() => { setPage(1); fetchWords(); }, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const playAudio = async (word: Vocabulary) => {
    if (playingId === word.id) return;
    setPlayingId(word.id);
    try {
      const text = word.article ? `${word.article} ${word.german_word}` : word.german_word;
      const response = await aiApi.textToSpeech(text);
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => { setPlayingId(null); URL.revokeObjectURL(audioUrl); };
      await audio.play();
    } catch {
      setPlayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Vocabulary Builder</h1>
              <p className="text-gray-500 mt-1">Master German words with audio, examples, and spaced repetition</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search German words..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedLevel}
                    onChange={(e) => { setSelectedLevel(e.target.value); setPage(1); }}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">All Levels</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {WORD_TYPES.map((t) => <option key={t} value={t}>{t === "all" ? "All Types" : t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Results info */}
            <p className="text-sm text-gray-500 mb-4">{total} words found</p>

            {/* Vocabulary Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                Array(12).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-5 bg-gray-100 rounded w-24 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-16 mb-4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                ))
              ) : words.map((word) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedWord(word)}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        {word.article && (
                          <span className={cn(
                            "text-xs font-bold",
                            word.article === "der" ? "text-blue-500" :
                            word.article === "die" ? "text-red-500" : "text-green-500"
                          )}>{word.article}</span>
                        )}
                        <h3 className="font-bold text-gray-900 text-lg">{word.german_word}</h3>
                      </div>
                      <p className="text-gray-500 text-sm">{word.english_translation}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); playAudio(word); }}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        playingId === word.id ? "bg-brand-100 text-brand-600 animate-pulse" : "text-gray-400 hover:text-brand-500 hover:bg-brand-50"
                      )}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-semibold", getLevelColor(word.level))}>
                      {word.level}
                    </span>
                    {word.word_type && (
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{word.word_type}</span>
                    )}
                  </div>
                  {word.example_sentence_de && (
                    <p className="text-xs text-gray-500 mt-2 italic leading-relaxed line-clamp-2">
                      "{word.example_sentence_de}"
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {total > 24 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {Math.ceil(total / 24)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / 24)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* Word Detail Modal */}
            {selectedWord && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedWord(null)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {selectedWord.article && (
                          <span className={cn(
                            "text-xl font-bold",
                            selectedWord.article === "der" ? "text-blue-500" :
                            selectedWord.article === "die" ? "text-red-500" : "text-green-500"
                          )}>{selectedWord.article}</span>
                        )}
                        <span className="text-3xl font-bold text-gray-900">{selectedWord.german_word}</span>
                      </div>
                      <p className="text-gray-500 text-lg">{selectedWord.english_translation}</p>
                    </div>
                    <button
                      onClick={() => playAudio(selectedWord)}
                      className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-100 transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  {selectedWord.ipa_pronunciation && (
                    <p className="text-gray-400 text-sm mb-4 font-mono">[{selectedWord.ipa_pronunciation}]</p>
                  )}

                  {selectedWord.example_sentence_de && (
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">{selectedWord.example_sentence_de}</p>
                      <p className="text-sm text-gray-500 italic">{selectedWord.example_sentence_en}</p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap mb-4">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold", getLevelColor(selectedWord.level))}>
                      {selectedWord.level}
                    </span>
                    {selectedWord.word_type && (
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{selectedWord.word_type}</span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedWord(null)}
                    className="w-full py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
