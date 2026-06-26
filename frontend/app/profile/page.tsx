"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Globe, Target, Calendar, Award, Zap, Flame, BookOpen, Edit2, Camera, Shield, Star, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { GermakemiWidget } from "@/components/germakemi/widget";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/lib/api";
import { cn, getLevelColor, getReadinessColor, getReadinessLabel, getProgressToNextLevel, getXPForNextLevel } from "@/lib/utils";
import { toast } from "sonner";

const NATIVE_LANGUAGES = ["English", "Arabic", "French", "Spanish", "Portuguese", "Turkish", "Polish", "Russian", "Chinese", "Japanese", "Other"];
const LEVELS = ["A1", "A2", "B1"];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    username: user?.username || "",
    bio: (user as any)?.bio || "",
    native_language: user?.native_language || "English",
    target_level: user?.target_level || "A1",
    daily_goal_minutes: user?.daily_goal_minutes || 30,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await userApi.updateMe(form);
      updateUser(response.data);
      setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update profile"); } finally { setSaving(false); }
  };

  const badges = user?.badges || [];
  const readinessKey = `exam_readiness_${(user?.target_level || "A1").toLowerCase()}` as keyof typeof user;
  const readiness = user ? (user[readinessKey] as number) || 0 : 0;

  const stats = [
    { label: "XP Points", value: user?.xp_points?.toLocaleString() || "0", icon: Zap, color: "text-yellow-600 bg-yellow-50" },
    { label: "Day Streak", value: `${user?.streak_days || 0}`, icon: Flame, color: "text-orange-600 bg-orange-50" },
    { label: "Level", value: `${user?.level || 1}`, icon: Star, color: "text-purple-600 bg-purple-50" },
    { label: "Target", value: user?.target_level || "A1", icon: Target, color: "text-brand-600 bg-brand-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-500">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>

            {/* Profile header card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
              </div>
              <div className="px-8 pb-8">
                <div className="flex items-end justify-between -mt-12 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 border-4 border-white flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {(user?.full_name || user?.username || "U")[0].toUpperCase()}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white shadow hover:bg-brand-600 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => setEditing(!editing)} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all", editing ? "bg-gray-100 text-gray-600" : "bg-brand-500 text-white hover:bg-brand-600")}>
                    <Edit2 className="w-4 h-4" />
                    {editing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Full Name</label>
                        <input value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Username</label>
                        <input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Native Language</label>
                        <select value={form.native_language} onChange={(e) => setForm((p) => ({ ...p, native_language: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white">
                          {NATIVE_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Target Level</label>
                        <select value={form.target_level} onChange={(e) => setForm((p) => ({ ...p, target_level: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white">
                          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Daily Goal (minutes)</label>
                        <input type="number" min={5} max={180} value={form.daily_goal_minutes} onChange={(e) => setForm((p) => ({ ...p, daily_goal_minutes: Number(e.target.value) }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Bio</label>
                      <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none" placeholder="Tell us about your German learning journey..." />
                    </div>
                    <button onClick={handleSave} disabled={saving} className="bg-brand-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-70">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.full_name || user?.username}</h2>
                    <p className="text-gray-500">@{user?.username}</p>
                    {(user as any)?.bio && <p className="text-gray-600 mt-2 text-sm">{(user as any).bio}</p>}
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3.5 h-3.5" />{user?.email}</span>
                      {user?.native_language && <span className="flex items-center gap-1 text-xs text-gray-500"><Globe className="w-3.5 h-3.5" />{user.native_language}</span>}
                      {user?.subscription_tier && (
                        <span className={cn("flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold", user.subscription_tier === "premium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600")}>
                          <Shield className="w-3 h-3" />{user.subscription_tier}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(({ label, value, icon: Icon, color }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3", color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* XP Progress */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> XP Progress</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Level {user?.level || 1}</span>
                  <span className="text-sm text-gray-500">{user?.xp_points || 0} / {getXPForNextLevel(user?.level || 1)} XP</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${getProgressToNextLevel(user?.xp_points || 0, user?.level || 1)}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                </div>
                <p className="text-xs text-gray-500 mt-2">{getXPForNextLevel(user?.level || 1) - (user?.xp_points || 0)} XP until Level {(user?.level || 1) + 1}</p>
              </motion.div>

              {/* Exam Readiness */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-brand-500" /> Exam Readiness</h3>
                <div className="space-y-3">
                  {["A1", "A2", "B1"].map((level) => {
                    const key = `exam_readiness_${level.toLowerCase()}` as keyof typeof user;
                    const score = user ? (user[key] as number) || 0 : 0;
                    return (
                      <div key={level}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", getLevelColor(level))}>{level}</span>
                          <span className={cn("text-xs font-bold", getReadinessColor(score))}>{getReadinessLabel(score)} · {Math.round(score)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} className={cn("h-full rounded-full", score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-400")} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Badges */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-purple-500" /> Badges & Achievements</h3>
              {badges.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {badges.map((badge: any, i: number) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl hover:bg-brand-50 transition-colors">
                      <span className="text-2xl">{badge.icon || "🏆"}</span>
                      <span className="text-xs font-medium text-gray-600 text-center leading-tight">{badge.name || badge}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Complete activities to earn badges!</p>
                  <p className="text-gray-400 text-xs mt-1">Start with a flashcard session or mock exam</p>
                </div>
              )}
            </motion.div>

            {/* Account Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-gray-500" /> Account Information</h3>
              <dl className="grid md:grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Email", value: user?.email },
                  { label: "Username", value: `@${user?.username}` },
                  { label: "Native Language", value: user?.native_language || "—" },
                  { label: "Target Level", value: user?.target_level || "A1" },
                  { label: "Daily Goal", value: `${user?.daily_goal_minutes || 30} min/day` },
                  { label: "Subscription", value: user?.subscription_tier === "premium" ? "Premium" : "Free" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <dt className="text-gray-500 font-medium">{label}</dt>
                    <dd className="text-gray-900 font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

          </div>
        </main>
      </div>
      <GermakemiWidget
        pageContext="user profile and learning progress"
        suggestedQuestions={[
          "How can I improve my exam readiness score?",
          "What should I focus on to level up faster?",
          "Give me a study plan for the next 2 weeks",
        ]}
      />
    </div>
  );
}
