"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Layers, MessageSquare, Mic,
  Headphones, FileText, Radio, Image, BarChart3, Settings,
  Trophy, Target, Flame, Zap, GraduationCap, Video, PhoneCall
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn, getLevelColor, formatMinutes } from "@/lib/utils";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/vocabulary", label: "Vocabulary", icon: Layers },
  { href: "/grammar", label: "Grammar", icon: FileText },
  { href: "/flashcards", label: "Flashcards", icon: Target },
  { href: "/stories", label: "Stories", icon: BookOpen },
  { href: "/podcasts", label: "Podcasts", icon: Radio },
  { href: "/ai-tutor", label: "Germakemi", icon: MessageSquare },
  { href: "/mock-exams", label: "Mock Exams", icon: FileText },
  { href: "/video-lessons", label: "Video Lessons", icon: Video },
  { href: "/voice-chat", label: "Voice Chat", icon: PhoneCall },
  { href: "/speaking-lab", label: "Speaking Lab", icon: Mic },
  { href: "/listening-lab", label: "Listening Lab", icon: Headphones },
  { href: "/profile", label: "Profile", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const examReadiness = {
    A1: user.exam_readiness_a1,
    A2: user.exam_readiness_a2,
    B1: user.exam_readiness_b1,
  }[user.target_level] || 0;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">GoethePrep</span>
        </Link>
      </div>

      {/* User Stats */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{user.full_name || user.username}</p>
            <span className={cn("text-xs px-2 py-0.5 rounded-full border", getLevelColor(user.target_level))}>
              {user.target_level}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center bg-orange-50 rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 text-orange-500">
              <Flame className="w-3 h-3" />
              <span className="text-xs font-bold">{user.streak_days}</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">streak</p>
          </div>
          <div className="text-center bg-yellow-50 rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 text-yellow-500">
              <Zap className="w-3 h-3" />
              <span className="text-xs font-bold">{(user.xp_points / 1000).toFixed(1)}k</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">XP</p>
          </div>
          <div className="text-center bg-brand-50 rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 text-brand-500">
              <Trophy className="w-3 h-3" />
              <span className="text-xs font-bold">{user.level}</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">level</p>
          </div>
        </div>

        {/* Exam Readiness */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Exam Readiness</span>
            <span className="font-semibold text-brand-600">{Math.round(examReadiness)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${examReadiness}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto scrollbar-hide">
        <div className="space-y-0.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-brand-600")} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-brand-50 to-purple-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-700">Study time today</p>
          <p className="text-lg font-bold text-brand-600">{formatMinutes(user.total_study_minutes % 1440)}</p>
          <div className="h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full" style={{ width: "45%" }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
