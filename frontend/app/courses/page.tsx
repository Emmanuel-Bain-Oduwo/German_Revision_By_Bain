"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, Zap, ChevronRight, Lock, Star } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/authStore";
import { courseApi } from "@/lib/api";
import type { Course } from "@/types";
import { cn, getLevelColor, getLevelGradient, LEVEL_DESCRIPTIONS } from "@/lib/utils";

export default function CoursesPage() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await courseApi.list(selectedLevel || undefined);
        setCourses(response.data.courses || []);
      } catch { setCourses([]); } finally { setLoading(false); }
    };
    fetch();
  }, [selectedLevel]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">German Courses</h1>
              <p className="text-gray-500 mt-1">Structured learning paths designed for Goethe Institute exam success</p>
            </div>

            {/* Level Filter */}
            <div className="flex gap-2 mb-8">
              <button onClick={() => setSelectedLevel("")} className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all", !selectedLevel ? "bg-brand-500 text-white border-transparent" : "bg-white text-gray-600 border-gray-200")}>All</button>
              {["A1", "A2", "B1"].map((l) => (
                <button key={l} onClick={() => setSelectedLevel(l)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all", selectedLevel === l ? "bg-brand-500 text-white border-transparent" : "bg-white text-gray-600 border-gray-200")}>
                  {l}
                </button>
              ))}
            </div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-32 bg-gray-100 rounded-xl mb-4" /><div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
                </div>
              )) : courses.length > 0 ? courses.map((course, idx) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden card-hover group">
                  <div className={cn("h-36 bg-gradient-to-br flex items-center justify-center text-white relative", getLevelGradient(course.level))}>
                    <BookOpen className="w-12 h-12 opacity-50" />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full font-semibold">{course.level}</span>
                    </div>
                    {course.is_premium && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-semibold">
                        <Star className="w-3 h-3" /> Pro
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-brand-600 transition-colors">{course.title}</h3>
                    {course.description && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.total_lessons} lessons</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.estimated_hours}h</span>
                      <span className="flex items-center gap-1 text-yellow-600"><Zap className="w-3.5 h-3.5" />+{course.xp_reward} XP</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-5">
                      {course.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <Link href={`/courses/${course.id}`} className={cn("flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all", course.is_premium && user?.subscription_tier === "free" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : `bg-gradient-to-r ${getLevelGradient(course.level)} text-white hover:shadow-md`)}>
                      {course.is_premium && user?.subscription_tier === "free" ? <><Lock className="w-4 h-4" /> Upgrade</> : <>Start Course <ChevronRight className="w-4 h-4" /></>}
                    </Link>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-3 text-center py-16">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">No courses available yet. Check back soon!</p>
                </div>
              )}
            </div>

            {/* Level Descriptions */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {["A1", "A2", "B1"].map((level) => (
                <div key={level} className={cn("rounded-2xl border p-6", getLevelColor(level))}>
                  <h3 className="font-bold text-lg mb-2">Goethe {level}</h3>
                  <p className="text-sm opacity-80">{LEVEL_DESCRIPTIONS[level]}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
