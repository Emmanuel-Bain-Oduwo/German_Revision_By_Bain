"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Zap, ChevronRight, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { GermakemiWidget } from "@/components/germakemi/widget";
import { useAuthStore } from "@/store/authStore";
import { courseApi } from "@/lib/api";
import { cn, getLevelGradient, getLevelColor } from "@/lib/utils";

interface Topic {
  id: number;
  title: string;
  title_german?: string;
  icon?: string;
  order_index: number;
  xp_reward: number;
  lesson_count?: number;
}

interface CourseDetail {
  id: number;
  title: string;
  description?: string;
  level: string;
  total_lessons: number;
  estimated_hours: number;
  xp_reward: number;
  tags: string[];
  is_premium: boolean;
  topics: Topic[];
}

const COURSE_DETAILS_FALLBACK: CourseDetail[] = [
  {
    id: 1, title: "Goethe A1 — Foundation German", level: "A1",
    description: "Start your German journey from zero. Master greetings, numbers, family, food, and everyday expressions needed for the Goethe A1 certificate.",
    total_lessons: 12, estimated_hours: 20, xp_reward: 500, is_premium: false,
    tags: ["Beginner", "A1", "Goethe", "Grammar", "Vocabulary"],
    topics: [
      { id: 1, title: "Greetings & Introductions", title_german: "Begrüßungen", icon: "👋", order_index: 1, xp_reward: 40, lesson_count: 3 },
      { id: 2, title: "Numbers, Dates & Time", title_german: "Zahlen, Datum und Uhrzeit", icon: "🔢", order_index: 2, xp_reward: 40, lesson_count: 2 },
      { id: 3, title: "Family & Personal Details", title_german: "Familie und Personen", icon: "👨‍👩‍👧", order_index: 3, xp_reward: 40, lesson_count: 2 },
      { id: 4, title: "Food, Drink & Shopping", title_german: "Essen, Trinken und Einkaufen", icon: "🛒", order_index: 4, xp_reward: 40, lesson_count: 2 },
      { id: 5, title: "Home & Living", title_german: "Wohnen und Zuhause", icon: "🏠", order_index: 5, xp_reward: 40, lesson_count: 2 },
      { id: 6, title: "Articles: der, die, das", title_german: "Artikel", icon: "📝", order_index: 6, xp_reward: 50, lesson_count: 2 },
      { id: 7, title: "Present Tense Verbs", title_german: "Präsens", icon: "⚡", order_index: 7, xp_reward: 50, lesson_count: 2 },
      { id: 8, title: "Negation: nicht & kein", title_german: "Verneinung", icon: "❌", order_index: 8, xp_reward: 40, lesson_count: 1 },
      { id: 9, title: "Accusative Case", title_german: "Akkusativ", icon: "🎯", order_index: 9, xp_reward: 50, lesson_count: 2 },
      { id: 10, title: "W-Questions", title_german: "W-Fragen", icon: "❓", order_index: 10, xp_reward: 40, lesson_count: 1 },
      { id: 11, title: "Colours, Clothes & Weather", title_german: "Farben, Kleidung und Wetter", icon: "🌤️", order_index: 11, xp_reward: 40, lesson_count: 2 },
      { id: 12, title: "A1 Goethe Exam Practice", title_german: "Goethe A1 Prüfungsvorbereitung", icon: "🏆", order_index: 12, xp_reward: 90, lesson_count: 3 },
    ],
  },
  {
    id: 2, title: "Goethe A2 — Everyday German", level: "A2",
    description: "Build confidence to navigate daily life in German. Cover travel, health, work, and communication skills for the Goethe A2 certificate.",
    total_lessons: 16, estimated_hours: 30, xp_reward: 750, is_premium: false,
    tags: ["Elementary", "A2", "Goethe", "Travel", "Work", "Health"],
    topics: [
      { id: 13, title: "Modal Verbs", title_german: "Modalverben", icon: "🔧", order_index: 1, xp_reward: 50, lesson_count: 2 },
      { id: 14, title: "Perfect Tense (Perfekt)", title_german: "Perfekt", icon: "⏪", order_index: 2, xp_reward: 60, lesson_count: 3 },
      { id: 15, title: "Dative Case", title_german: "Dativ", icon: "📦", order_index: 3, xp_reward: 60, lesson_count: 2 },
      { id: 16, title: "Separable Verbs", title_german: "Trennbare Verben", icon: "✂️", order_index: 4, xp_reward: 50, lesson_count: 2 },
      { id: 17, title: "Adjective Endings", title_german: "Adjektivendungen", icon: "🎨", order_index: 5, xp_reward: 60, lesson_count: 2 },
      { id: 18, title: "Comparative & Superlative", title_german: "Komparativ und Superlativ", icon: "📊", order_index: 6, xp_reward: 50, lesson_count: 2 },
      { id: 19, title: "Travel & Transport", title_german: "Reisen und Verkehr", icon: "✈️", order_index: 7, xp_reward: 50, lesson_count: 2 },
      { id: 20, title: "Health & Body", title_german: "Gesundheit und Körper", icon: "🏥", order_index: 8, xp_reward: 50, lesson_count: 2 },
      { id: 21, title: "Work & Professions", title_german: "Arbeit und Berufe", icon: "💼", order_index: 9, xp_reward: 50, lesson_count: 2 },
      { id: 22, title: "Subordinate Clauses: weil, dass, wenn", title_german: "Nebensätze", icon: "🔗", order_index: 10, xp_reward: 60, lesson_count: 2 },
      { id: 23, title: "Two-way Prepositions", title_german: "Wechselpräpositionen", icon: "↔️", order_index: 11, xp_reward: 50, lesson_count: 2 },
      { id: 24, title: "A2 Goethe Exam Practice", title_german: "Goethe A2 Prüfungsvorbereitung", icon: "🏆", order_index: 12, xp_reward: 110, lesson_count: 3 },
    ],
  },
  {
    id: 3, title: "Goethe B1 — Independent German", level: "B1",
    description: "Reach independence in German. Master complex grammar, express opinions, and tackle all four Goethe B1 exam sections: Lesen, Hören, Schreiben, Sprechen.",
    total_lessons: 20, estimated_hours: 40, xp_reward: 1000, is_premium: false,
    tags: ["Intermediate", "B1", "Goethe", "Society", "Career", "Exam Prep"],
    topics: [
      { id: 25, title: "Simple Past (Präteritum)", title_german: "Präteritum", icon: "📜", order_index: 1, xp_reward: 60, lesson_count: 2 },
      { id: 26, title: "Passive Voice (Passiv)", title_german: "Passiv", icon: "🔄", order_index: 2, xp_reward: 70, lesson_count: 2 },
      { id: 27, title: "Konjunktiv II (würde)", title_german: "Konjunktiv II", icon: "💭", order_index: 3, xp_reward: 70, lesson_count: 2 },
      { id: 28, title: "Relative Clauses", title_german: "Relativsätze", icon: "🔗", order_index: 4, xp_reward: 70, lesson_count: 2 },
      { id: 29, title: "Infinitive with zu", title_german: "Infinitiv mit zu", icon: "➡️", order_index: 5, xp_reward: 60, lesson_count: 2 },
      { id: 30, title: "Genitive Case", title_german: "Genitiv", icon: "🏛️", order_index: 6, xp_reward: 60, lesson_count: 2 },
      { id: 31, title: "Society & Current Affairs", title_german: "Gesellschaft und Aktualität", icon: "🌍", order_index: 7, xp_reward: 60, lesson_count: 2 },
      { id: 32, title: "Environment & Nature", title_german: "Umwelt und Natur", icon: "🌱", order_index: 8, xp_reward: 60, lesson_count: 2 },
      { id: 33, title: "Expressing Opinions", title_german: "Meinungen äußern", icon: "💬", order_index: 9, xp_reward: 60, lesson_count: 2 },
      { id: 34, title: "Goethe B1: Lesen (Reading)", title_german: "Lesen", icon: "📖", order_index: 10, xp_reward: 80, lesson_count: 3 },
      { id: 35, title: "Goethe B1: Hören (Listening)", title_german: "Hören", icon: "🎧", order_index: 11, xp_reward: 80, lesson_count: 3 },
      { id: 36, title: "Goethe B1: Schreiben (Writing)", title_german: "Schreiben", icon: "✍️", order_index: 12, xp_reward: 80, lesson_count: 3 },
      { id: 37, title: "Goethe B1: Sprechen (Speaking)", title_german: "Sprechen", icon: "🎤", order_index: 13, xp_reward: 80, lesson_count: 3 },
      { id: 38, title: "Full B1 Mock Exam", title_german: "Vollständige B1 Prüfung", icon: "🏆", order_index: 14, xp_reward: 110, lesson_count: 4 },
    ],
  },
];

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await courseApi.get(Number(id));
        const fallback = COURSE_DETAILS_FALLBACK.find((c) => c.id === Number(id));
        const data = response.data || fallback;
        if (data) setCourse({ ...data, is_premium: false, topics: fallback?.topics || data.topics });
        else setCourse(null);
      } catch {
        setCourse(COURSE_DETAILS_FALLBACK.find((c) => c.id === Number(id)) || null);
      } finally { setLoading(false); }
    };
    if (id) fetchCourse();
  }, [id]);

  const isLocked = course?.is_premium && user?.subscription_tier === "free";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <div className="hidden lg:block"><Sidebar /></div>
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="h-48 bg-white rounded-3xl animate-pulse mb-6" />
              {Array(6).fill(0).map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse mb-3" />)}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <div className="hidden lg:block"><Sidebar /></div>
          <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Course not found</p>
              <Link href="/courses" className="text-brand-500 text-sm mt-2 inline-block hover:underline">Back to courses</Link>
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
          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Link>

            {/* Course header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn("rounded-3xl bg-gradient-to-br p-8 text-white mb-6 relative overflow-hidden", getLevelGradient(course.level))}>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-semibold">{course.level}</span>
                  {course.is_premium && <span className="text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-semibold">Premium</span>}
                </div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                {course.description && <p className="text-white/80 mb-6 max-w-2xl">{course.description}</p>}
                <div className="flex flex-wrap gap-6 text-sm text-white/80">
                  <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" />{course.total_lessons} lessons</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{course.estimated_hours}h estimated</span>
                  <span className="flex items-center gap-2 text-yellow-300"><Zap className="w-4 h-4" />+{course.xp_reward} XP total</span>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full" />
              <div className="absolute -right-4 -bottom-16 w-32 h-32 bg-white/5 rounded-full" />
            </motion.div>

            {/* Tags */}
            {course.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-white text-gray-600 px-3 py-1 rounded-full border border-gray-200">{tag}</span>
                ))}
              </div>
            )}

            {/* Premium lock banner */}
            {isLocked && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
                <Lock className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-yellow-900">Premium Course</p>
                  <p className="text-sm text-yellow-700">Upgrade to access this course and unlock all premium content.</p>
                </div>
                <button className="ml-auto px-4 py-2 bg-yellow-500 text-white font-semibold text-sm rounded-xl hover:bg-yellow-600 transition-colors">
                  Upgrade
                </button>
              </motion.div>
            )}

            {/* Level path */}
            <div className="flex items-center gap-2 mb-6">
              {[
                { id: 1, level: "A1", label: "Foundation" },
                { id: 2, level: "A2", label: "Elementary" },
                { id: 3, level: "B1", label: "Independent" },
              ].map((step, idx, arr) => (
                <div key={step.id} className="flex items-center gap-2">
                  <Link href={`/courses/${step.id}`} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all", course.id === step.id ? "bg-brand-500 text-white border-transparent shadow" : "bg-white text-gray-500 border-gray-200 hover:border-brand-300 hover:text-brand-600")}>
                    <span>{step.level}</span>
                    <span className="hidden sm:inline text-xs opacity-70">— {step.label}</span>
                  </Link>
                  {idx < arr.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                </div>
              ))}
            </div>

            {/* Topics list */}
            <div>
              <h2 className="font-bold text-gray-900 text-xl mb-4">Course Topics ({course.topics?.length || 0})</h2>
              <div className="space-y-3">
                {(course.topics || []).map((topic, idx) => {
                  const inner = (
                    <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 transition-all", isLocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:border-brand-100 cursor-pointer")}>
                      <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {topic.icon || "📚"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                          {topic.title_german && <span className="text-sm text-gray-400 italic">({topic.title_german})</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          {topic.lesson_count && <span><BookOpen className="w-3.5 h-3.5 inline mr-0.5" />{topic.lesson_count} lessons</span>}
                          <span className="text-yellow-600"><Zap className="w-3.5 h-3.5 inline mr-0.5" />+{topic.xp_reward} XP</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium">{idx + 1}/{course.topics.length}</span>
                        {isLocked ? <Lock className="w-4 h-4 text-gray-300" /> : <ChevronRight className="w-5 h-5 text-gray-300" />}
                      </div>
                    </motion.div>
                  );
                  return isLocked ? <div key={topic.id}>{inner}</div> : (
                    <Link key={topic.id} href={`/courses/${course.id}/topics/${topic.id}`}>{inner}</Link>
                  );
                })}
              </div>
            </div>
            {/* Next course CTA */}
            {course.id < 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cn("mt-6 rounded-2xl p-6 flex items-center justify-between gap-4", getLevelGradient(course.level === "A1" ? "A2" : "B1"))}>
                <div className="text-white">
                  <p className="text-white/80 text-sm font-medium mb-1">Ready for the next level?</p>
                  <p className="text-xl font-bold">{course.id === 1 ? "Goethe A2 — Everyday German" : "Goethe B1 — Independent German"}</p>
                </div>
                <Link href={`/courses/${course.id + 1}`} className="flex-shrink-0 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-xl transition-all border border-white/30">
                  Start {course.id === 1 ? "A2" : "B1"} <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </div>
        </main>
      </div>
      <GermakemiWidget
        pageContext={`German course: ${course?.title || "course"}`}
        suggestedQuestions={[
          "Explain what I'll learn in this course",
          "What grammar is covered at this level?",
          "How does this course prepare me for the Goethe exam?",
        ]}
      />
    </div>
  );
}
