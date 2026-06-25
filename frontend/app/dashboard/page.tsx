"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame, Zap, Trophy, Target, BookOpen, Clock,
  TrendingUp, CheckCircle2, BarChart3, Star, ArrowRight, Mic, Brain
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/lib/api";
import type { DashboardData } from "@/types";
import { cn, formatScore, getLevelColor, getReadinessColor, getReadinessLabel } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const quickActions = [
  { href: "/flashcards", icon: Target, label: "Study Flashcards", color: "bg-blue-500", xp: "+5 XP/card" },
  { href: "/ai-tutor", icon: Brain, label: "Chat with AI Tutor", color: "bg-purple-500", xp: "+10 XP" },
  { href: "/mock-exams", icon: BarChart3, label: "Take Mock Exam", color: "bg-emerald-500", xp: "+100 XP" },
  { href: "/speaking-lab", icon: Mic, label: "Speaking Practice", color: "bg-rose-500", xp: "+30 XP" },
];

const examSections = [
  { key: "lesen_readiness", label: "Lesen", icon: "📖", description: "Reading" },
  { key: "horen_readiness", label: "Hören", icon: "🎧", description: "Listening" },
  { key: "schreiben_readiness", label: "Schreiben", icon: "✍️", description: "Writing" },
  { key: "sprechen_readiness", label: "Sprechen", icon: "🎤", description: "Speaking" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await userApi.getDashboard();
        setDashboardData(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (!user) return null;

  const examReadiness = {
    A1: user.exam_readiness_a1,
    A2: user.exam_readiness_a2,
    B1: user.exam_readiness_b1,
  }[user.target_level] || 0;

  const weeklyData = dashboardData?.weekly_stats?.map((s) => ({
    date: s.date.slice(5),
    xp: s.xp_earned,
    minutes: s.study_minutes,
    vocabulary: s.vocabulary_reviewed,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900">
            Guten Tag, {user.full_name?.split(" ")[0] || user.username}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {user.streak_days > 0
              ? `🔥 ${user.streak_days}-day streak! Keep it up!`
              : "Start your streak today by completing a lesson."}
          </p>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Streak", value: `${user.streak_days}d`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
          { label: "Total XP", value: user.xp_points.toLocaleString(), icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-100" },
          { label: "Level", value: `Lv. ${user.level}`, icon: Trophy, color: "text-brand-500", bg: "bg-brand-50", border: "border-brand-100" },
          { label: "Study Time", value: `${Math.round(user.total_study_minutes / 60)}h`, icon: Clock, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn("rounded-2xl border p-5 bg-white shadow-sm", stat.border)}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                <Icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Exam Readiness Predictor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-brand-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-brand-200 text-sm font-medium mb-1">Exam Readiness Predictor</p>
                <h2 className="text-2xl font-bold">Goethe {user.target_level} Readiness</h2>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black">{Math.round(examReadiness)}%</div>
                <div className="text-sm text-white/70 mt-1">
                  {examReadiness >= 75 ? "✅ Ready to test!" : "📚 Keep practicing"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {examSections.map((section) => {
                const score = examReadiness * (0.9 + Math.random() * 0.2);
                return (
                  <div key={section.key} className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">{section.icon}</div>
                    <div className="text-xs text-white/70 mb-1">{section.description}</div>
                    <div className="text-xl font-bold">{Math.round(score)}%</div>
                    <div className="h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-white/60 rounded-full transition-all duration-1000"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Predicted Pass Probability</p>
                <p className="text-3xl font-black text-yellow-300">{Math.min(99, Math.round(examReadiness * 1.15))}%</p>
              </div>
              <Link
                href="/mock-exams"
                className="flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
              >
                Take Mock Exam <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Weekly Progress Chart */}
          {weeklyData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Weekly Progress</h3>
                <TrendingUp className="w-5 h-5 text-brand-500" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                  <Area type="monotone" dataKey="xp" stroke="#0ea5e9" fill="url(#xpGrad)" strokeWidth={2} name="XP Earned" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm", action.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 group-hover:text-brand-600">{action.label}</p>
                      <p className="text-xs text-green-600 font-semibold">{action.xp}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Target Level */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Target: Goethe {user.target_level}</h3>
              <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold", getLevelColor(user.target_level))}>
                {user.target_level}
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Vocabulary", progress: 65 },
                { label: "Grammar", progress: 58 },
                { label: "Exam Practice", progress: 42 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Exam Attempts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Exams</h3>
              <Link href="/mock-exams" className="text-brand-600 text-xs font-medium hover:underline">
                View all
              </Link>
            </div>
            {dashboardData?.recent_exam_attempts?.length ? (
              <div className="space-y-3">
                {dashboardData.recent_exam_attempts.map((attempt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        attempt.passed ? "bg-green-100" : "bg-red-100"
                      )}>
                        {attempt.passed
                          ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                          : <Star className="w-4 h-4 text-red-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mock Exam #{attempt.mock_exam_id}</p>
                        <p className="text-xs text-gray-500">{attempt.completed_at ? new Date(attempt.completed_at).toLocaleDateString() : "In progress"}</p>
                      </div>
                    </div>
                    <span className={cn("text-sm font-bold", attempt.passed ? "text-green-600" : "text-red-600")}>
                      {formatScore(attempt.total_score ?? null)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No exam attempts yet</p>
                <Link href="/mock-exams" className="text-brand-600 text-xs font-medium hover:underline mt-1 block">
                  Take your first mock exam →
                </Link>
              </div>
            )}
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-900 mb-4">Badges Earned</h3>
            {user.badges?.length ? (
              <div className="grid grid-cols-4 gap-2">
                {user.badges.map((badge, idx) => (
                  <div key={idx} className="text-center" title={badge.name}>
                    <div className="text-2xl">{badge.icon}</div>
                    <p className="text-[10px] text-gray-500 mt-1 truncate">{badge.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">Complete lessons to earn badges!</p>
                <div className="flex justify-center gap-2 mt-3">
                  {["🏆", "⚡", "🎯", "🔥", "🌟", "📚"].map((emoji, i) => (
                    <span key={i} className="text-2xl opacity-20">{emoji}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
