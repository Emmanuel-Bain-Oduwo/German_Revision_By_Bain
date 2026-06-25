"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Headphones, Clock, Play, Sparkles, Volume2, BookOpen, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/authStore";
import { contentApi, aiApi } from "@/lib/api";
import type { Podcast } from "@/types";
import { cn, getLevelColor } from "@/lib/utils";
import { toast } from "sonner";

const TOPICS = ["daily life", "travel", "shopping", "health", "work", "weather", "culture", "sports"];

export default function PodcastsPage() {
  const { user } = useAuthStore();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(user?.target_level || "A1");
  const [generating, setGenerating] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      try {
        const response = await contentApi.getPodcasts({ level: selectedLevel });
        setPodcasts(response.data.podcasts || []);
      } catch { setPodcasts([]); } finally { setLoading(false); }
    };
    fetchPodcasts();
  }, [selectedLevel]);

  const generatePodcast = async () => {
    setGenerating(true);
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    try {
      const response = await aiApi.generatePodcast({ topic, level: selectedLevel, duration_minutes: 5 });
      const podcastData = response.data.podcast;
      toast.success("New AI podcast generated!");
      setPodcasts((prev) => [{
        id: Date.now(),
        title: podcastData.title || `${selectedLevel} Podcast`,
        description: podcastData.description || `A ${selectedLevel} level German dialogue about ${topic}`,
        level: selectedLevel,
        topic,
        duration_seconds: 300,
        script: podcastData.script,
        vocabulary_highlighted: podcastData.vocabulary_highlighted,
        comprehension_questions: podcastData.comprehension_questions,
        plays_count: 0,
        xp_reward: 25,
      } as Podcast, ...prev]);
    } catch { toast.error("Failed to generate podcast"); } finally { setGenerating(false); }
  };

  const topicEmoji: Record<string, string> = {
    "daily life": "🏠", travel: "✈️", shopping: "🛍️", health: "🏥",
    work: "💼", weather: "🌤️", culture: "🎭", sports: "⚽",
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
                <h1 className="text-3xl font-bold text-gray-900">German Podcasts</h1>
                <p className="text-gray-500 mt-1">AI-generated audio dialogues to sharpen your Hören skills</p>
              </div>
              <div className="flex gap-3">
                {["A1", "A2", "B1"].map((l) => (
                  <button key={l} onClick={() => setSelectedLevel(l)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all", selectedLevel === l ? "bg-brand-500 text-white border-transparent" : "bg-white text-gray-600 border-gray-200")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Episodes", value: podcasts.length, icon: Headphones },
                { label: "Total Minutes", value: `${Math.round(podcasts.reduce((a, p) => a + (p.duration_seconds || 300), 0) / 60)}`, icon: Clock },
                { label: "XP Available", value: podcasts.reduce((a, p) => a + (p.xp_reward || 25), 0), icon: Zap },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Generate Card */}
              <motion.div className="bg-gradient-to-br from-brand-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Generate AI Podcast</h3>
                <p className="text-white/70 text-sm mb-6">Create a fresh German dialogue at {selectedLevel} level with vocab highlights and comprehension questions</p>
                <button onClick={generatePodcast} disabled={generating} className="w-full flex items-center justify-center gap-2 bg-white text-brand-700 font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-70">
                  {generating ? "Generating..." : <><Sparkles className="w-4 h-4" /> Generate</>}
                </button>
              </motion.div>

              {loading ? Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-32 bg-gray-100 rounded-xl mb-4" />
                  <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              )) : podcasts.map((podcast, idx) => (
                <motion.div key={podcast.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                  {/* Podcast thumbnail */}
                  <div className="h-36 bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center relative">
                    <span className="text-5xl">{topicEmoji[podcast.topic] || "🎙️"}</span>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <button
                        onClick={() => setPlayingId(playingId === podcast.id ? null : podcast.id)}
                        className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        {playingId === podcast.id ? <Volume2 className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
                      {Math.floor((podcast.duration_seconds || 300) / 60)}:{String((podcast.duration_seconds || 300) % 60).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold", getLevelColor(podcast.level))}>{podcast.level}</span>
                      {podcast.topic && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{podcast.topic}</span>}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">{podcast.title}</h3>
                    {podcast.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{podcast.description}</p>}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{Math.ceil((podcast.duration_seconds || 300) / 60)} min</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{podcast.script?.length || 0} exchanges</span>
                      <span className="flex items-center gap-1 text-yellow-600"><Zap className="w-3.5 h-3.5" />+{podcast.xp_reward} XP</span>
                    </div>

                    {/* Vocabulary preview */}
                    {podcast.vocabulary_highlighted && podcast.vocabulary_highlighted.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {podcast.vocabulary_highlighted.slice(0, 3).map((v, i) => (
                          <span key={i} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">{v.word}</span>
                        ))}
                        {podcast.vocabulary_highlighted.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{podcast.vocabulary_highlighted.length - 3}</span>
                        )}
                      </div>
                    )}

                    {podcast.plays_count !== undefined && (
                      <p className="text-xs text-gray-400">{podcast.plays_count.toLocaleString()} plays</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {!loading && podcasts.length === 0 && (
              <div className="text-center py-20">
                <Headphones className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No podcasts yet</p>
                <p className="text-gray-400 text-sm mt-1">Generate your first AI podcast above!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
