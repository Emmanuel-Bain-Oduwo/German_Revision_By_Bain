"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock, Target, Trophy, ArrowRight, Star, Lock,
  BookOpen, Headphones, PenTool, Mic, Sparkles,
  CheckCircle2, BarChart3, TrendingUp, Loader2
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/authStore";
import { examApi } from "@/lib/api";
import type { MockExam } from "@/types";
import { cn, getLevelColor, getLevelGradient } from "@/lib/utils";
import { toast } from "sonner";

const EXAM_SECTIONS = [
  { icon: BookOpen, label: "Lesen", desc: "Reading comprehension with passages & questions", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Headphones, label: "Hören", desc: "Audio listening with comprehension questions", color: "text-green-500", bg: "bg-green-50" },
  { icon: PenTool, label: "Schreiben", desc: "Writing tasks with AI feedback & scoring", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: Mic, label: "Sprechen", desc: "Speaking topics with pronunciation analysis", color: "text-rose-500", bg: "bg-rose-50" },
];

export default function MockExamsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [exams, setExams] = useState<MockExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>(user?.target_level || "A1");
  const [readiness, setReadiness] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, readinessRes] = await Promise.all([
          examApi.listMockExams(),
          examApi.getReadiness(),
        ]);
        setExams(examsRes.data.items || examsRes.data || []);
        setReadiness(readinessRes.data);
      } catch {
        console.error("Failed to load exams");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateExam = async () => {
    setGenerating(true);
    try {
      const response = await examApi.generateMockExam({
        level: selectedLevel,
        sections: ["lesen", "horen", "schreiben", "sprechen"],
      });
      toast.success("AI-generated mock exam ready!");
      router.push(`/mock-exams/${response.data.exam_id}`);
    } catch {
      toast.error("Failed to generate exam. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleStartExam = async (examId: number) => {
    try {
      const response = await examApi.startAttempt(examId);
      router.push(`/mock-exams/${examId}?attempt=${response.data.id}`);
    } catch {
      toast.error("Failed to start exam.");
    }
  };

  const filteredExams = exams.filter((e) => !selectedLevel || e.level === selectedLevel);
  const overallReadiness = readiness.overall_readiness || user?.exam_readiness_a1 || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Mock Examinations</h1>
              <p className="text-gray-500 mt-1">
                Practice with authentic Goethe-style exams across all 4 sections. AI grades your writing & speaking.
              </p>
            </div>

            {/* Readiness Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-brand-600 to-purple-700 rounded-3xl p-8 text-white mb-8 shadow-xl"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-brand-200" />
                    <span className="text-brand-200 text-sm font-medium">Exam Readiness Predictor</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Goethe {selectedLevel} Readiness</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{Math.round(overallReadiness)}%</span>
                    <span className="text-white/60">ready</span>
                  </div>
                  <p className="text-white/70 text-sm mt-2">
                    {overallReadiness >= 75
                      ? "✅ You're ready to book the real exam!"
                      : `📚 ${Math.round(75 - overallReadiness)}% more to go — keep practicing!`}
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Mock Exam Average", value: readiness.mock_exam_average || 0 },
                    { label: "Study Consistency", value: readiness.study_consistency || 0 },
                    { label: "Predicted Pass %", value: Math.min(99, overallReadiness * 1.15) },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold text-white">{Math.round(item.value)}%</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-300 rounded-full transition-all duration-1000"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Exam Sections Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {EXAM_SECTIONS.map((section, idx) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", section.bg)}>
                      <Icon className={cn("w-5 h-5", section.color)} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{section.label}</h3>
                    <p className="text-xs text-gray-500">{section.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-700">Filter by level:</span>
              <div className="flex gap-2">
                {["A1", "A2", "B1"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                      selectedLevel === level
                        ? `bg-gradient-to-r ${getLevelGradient(level)} text-white border-transparent shadow-sm`
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* AI Generate Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-500 to-brand-600 rounded-3xl p-6 text-white shadow-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-semibold text-white/80">AI Generated</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Generate New Exam</h3>
                <p className="text-white/70 text-sm mb-6">
                  Let AI create a fresh, unique Goethe {selectedLevel} mock exam with all 4 sections.
                </p>
                <div className="space-y-2 mb-6">
                  {EXAM_SECTIONS.map((s) => (
                    <div key={s.label} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
                      {s.label}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleGenerateExam}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 bg-white text-brand-700 font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {generating ? "Generating..." : `Generate ${selectedLevel} Exam`}
                </button>
              </motion.div>

              {/* Exam Cards */}
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-20 mb-3" />
                    <div className="h-6 bg-gray-100 rounded w-40 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-full mb-4" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                  </div>
                ))
              ) : filteredExams.length > 0 ? (
                filteredExams.map((exam, idx) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold", getLevelColor(exam.level))}>
                        {exam.level}
                      </span>
                      {exam.is_premium && (
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                          <Star className="w-3 h-3 fill-amber-500" /> Premium
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{exam.title}</h3>
                    {exam.description && (
                      <p className="text-sm text-gray-500 mb-4">{exam.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                      <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{exam.duration_minutes}m</div>
                      <div className="flex items-center gap-1"><Target className="w-3.5 h-3.5" />Pass: {exam.passing_score}%</div>
                      <div className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5" />{exam.total_points}pts</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartExam(exam.id)}
                        disabled={exam.is_premium && user?.subscription_tier === "free"}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                          exam.is_premium && user?.subscription_tier === "free"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : `bg-gradient-to-r ${getLevelGradient(exam.level)} text-white hover:shadow-md`
                        )}
                      >
                        {exam.is_premium && user?.subscription_tier === "free" ? (
                          <><Lock className="w-4 h-4" /> Upgrade</>
                        ) : (
                          <>Start Exam <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">No exams available for this level yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Use the AI generator above to create one!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
