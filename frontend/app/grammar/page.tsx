"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronRight, Search, ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { GermakemiWidget } from "@/components/germakemi/widget";
import { vocabularyApi } from "@/lib/api";
import type { GrammarRule } from "@/types";
import { cn, getLevelColor } from "@/lib/utils";
import { GRAMMAR_RULES_FALLBACK } from "@/lib/fallback-data";

const CATEGORIES = ["all", "tenses", "cases", "word_order", "articles", "adjectives", "pronouns", "verbs"];

export default function GrammarPage() {
  const [rules, setRules] = useState<GrammarRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (selectedLevel) params.level = selectedLevel;
        if (selectedCategory !== "all") params.category = selectedCategory;
        const response = await vocabularyApi.getGrammarRules(params);
        const data = response.data.rules || [];
        setRules(data.length ? data : GRAMMAR_RULES_FALLBACK.filter((r) => (!selectedLevel || r.level === selectedLevel) && (selectedCategory === "all" || r.category === selectedCategory)));
      } catch { setRules(GRAMMAR_RULES_FALLBACK); } finally { setLoading(false); }
    };
    fetch();
  }, [selectedLevel, selectedCategory]);

  const filtered = rules.filter((r) =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.explanation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-500">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Grammar Rules</h1>
                <p className="text-gray-500 text-sm mt-0.5">Master German grammar with clear explanations, examples, and exercises</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search grammar rules..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
              </div>
              <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm">
                <option value="">All Levels</option>
                {["A1", "A2", "B1"].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
              </select>
            </div>

            {/* Grammar Rules */}
            <div className="space-y-4">
              {loading ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-5 bg-gray-100 rounded w-48 mb-2" /><div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              )) : filtered.map((rule) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === rule.id ? null : rule.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold", getLevelColor(rule.level))}>{rule.level}</span>
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{rule.category}</span>
                      <h3 className="font-bold text-gray-900">{rule.title}</h3>
                    </div>
                    {expandedId === rule.id ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </button>
                  {expandedId === rule.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pb-6 border-t border-gray-100 pt-4">
                      <p className="text-gray-700 mb-4 leading-relaxed">{rule.explanation}</p>
                      {rule.formula && (
                        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-4 font-mono text-sm text-brand-800">
                          {rule.formula}
                        </div>
                      )}
                      {rule.examples.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-3">Examples:</p>
                          <div className="space-y-2">
                            {rule.examples.map((ex, i) => (
                              <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{ex.german}</p>
                                  <p className="text-gray-500 text-sm italic">{ex.english}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {rule.tips.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">💡 Tips:</p>
                          <ul className="space-y-1">
                            {rule.tips.map((tip, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-brand-500 mt-0.5">•</span>{tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Link
                        href={`/ai-tutor?q=Explain+${encodeURIComponent(rule.title)}+with+practice+exercises`}
                        className="mt-4 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <Sparkles className="w-4 h-4" /> Practice this with Germakemi →
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ))}
              {!loading && filtered.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">No grammar rules found. Try different filters.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <GermakemiWidget
        pageContext="German grammar rules"
        suggestedQuestions={[
          "Explain the four German cases (Nominativ, Akkusativ, Dativ, Genitiv)",
          "When do I use 'war' vs 'wurde'?",
          "How does word order work in German sentences?",
        ]}
      />
    </div>
  );
}
