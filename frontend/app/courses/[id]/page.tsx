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
        setCourse(response.data);
      } catch { setCourse(null); } finally { setLoading(false); }
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

            {/* Topics list */}
            <div>
              <h2 className="font-bold text-gray-900 text-xl mb-4">Course Topics ({course.topics?.length || 0})</h2>
              <div className="space-y-3">
                {(course.topics || []).map((topic, idx) => (
                  <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 transition-all", isLocked ? "opacity-60" : "hover:shadow-md hover:border-brand-100 cursor-pointer")}>
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
                ))}
              </div>
            </div>
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
