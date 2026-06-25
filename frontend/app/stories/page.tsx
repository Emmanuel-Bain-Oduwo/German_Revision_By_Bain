"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Zap, ArrowRight, Volume2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/authStore";
import { contentApi, aiApi } from "@/lib/api";
import type { Story } from "@/types";
import { cn, getLevelColor } from "@/lib/utils";
import { toast } from "sonner";

export default function StoriesPage() {
  const { user } = useAuthStore();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(user?.target_level || "A1");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await contentApi.getStories({ level: selectedLevel });
        setStories(response.data.stories || []);
      } catch { setStories([]); } finally { setLoading(false); }
    };
    fetch();
  }, [selectedLevel]);

  const generateStory = async () => {
    setGenerating(true);
    const topics = ["daily life", "travel", "work", "family", "food", "technology"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    try {
      const response = await aiApi.generateStory({ topic, level: selectedLevel, word_count: 300, include_questions: true });
      const storyData = response.data.story;
      toast.success("New AI story generated!");
      setStories((prev) => [{
        id: Date.now(),
        title: storyData.title || `${selectedLevel} Story`,
        title_english: storyData.title_english,
        content: storyData.content,
        level: selectedLevel,
        topic,
        word_count: storyData.content?.split(" ").length,
        reading_time_minutes: Math.ceil((storyData.content?.split(" ").length || 300) / 150),
        xp_reward: 30,
        tags: [selectedLevel, topic],
      } as Story, ...prev]);
    } catch { toast.error("Failed to generate story"); } finally { setGenerating(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">German Stories</h1>
                <p className="text-gray-500 mt-1">Improve reading skills with AI-generated stories at your level</p>
              </div>
              <div className="flex gap-3">
                {["A1", "A2", "B1"].map((l) => (
                  <button key={l} onClick={() => setSelectedLevel(l)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all", selectedLevel === l ? "bg-brand-500 text-white border-transparent" : "bg-white text-gray-600 border-gray-200")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Generate Card */}
              <motion.div className="bg-gradient-to-br from-emerald-500 to-brand-600 rounded-3xl p-6 text-white shadow-xl">
                <Sparkles className="w-8 h-8 text-white/80 mb-3" />
                <h3 className="text-xl font-bold mb-2">Generate AI Story</h3>
                <p className="text-white/70 text-sm mb-6">Create a fresh German story at {selectedLevel} level instantly</p>
                <button onClick={generateStory} disabled={generating} className="w-full flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-70">
                  {generating ? "Generating..." : <><Sparkles className="w-4 h-4" /> Generate Story</>}
                </button>
              </motion.div>

              {loading ? Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-32 bg-gray-100 rounded-xl mb-4" /><div className="h-5 bg-gray-100 rounded w-3/4 mb-2" /><div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              )) : stories.map((story, idx) => (
                <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group card-hover">
                  <div className="h-36 bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center text-5xl">
                    {story.topic === "travel" ? "✈️" : story.topic === "food" ? "🍽️" : story.topic === "family" ? "👨‍👩‍👧" : "📖"}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold", getLevelColor(story.level))}>{story.level}</span>
                      {story.topic && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{story.topic}</span>}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">{story.title}</h3>
                    {story.title_english && <p className="text-sm text-gray-500 italic mb-3">{story.title_english}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      {story.word_count && <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{story.word_count} words</span>}
                      {story.reading_time_minutes && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{story.reading_time_minutes} min</span>}
                      <span className="flex items-center gap-1 text-yellow-600"><Zap className="w-3.5 h-3.5" />+{story.xp_reward} XP</span>
                    </div>
                    <Link href={`/stories/${story.id}`} className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors">
                      Read Story <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
