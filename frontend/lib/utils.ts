import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CEFRLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevelColor(level: CEFRLevel | string): string {
  const colors: Record<string, string> = {
    A1: "text-emerald-600 bg-emerald-50 border-emerald-200",
    A2: "text-blue-600 bg-blue-50 border-blue-200",
    B1: "text-purple-600 bg-purple-50 border-purple-200",
    B2: "text-orange-600 bg-orange-50 border-orange-200",
    C1: "text-rose-600 bg-rose-50 border-rose-200",
    C2: "text-red-600 bg-red-50 border-red-200",
  };
  return colors[level] || "text-gray-600 bg-gray-50 border-gray-200";
}

export function getLevelGradient(level: CEFRLevel | string): string {
  const gradients: Record<string, string> = {
    A1: "from-emerald-400 to-emerald-600",
    A2: "from-blue-400 to-blue-600",
    B1: "from-purple-400 to-purple-600",
    B2: "from-orange-400 to-orange-600",
    C1: "from-rose-400 to-rose-600",
    C2: "from-red-400 to-red-600",
  };
  return gradients[level] || "from-gray-400 to-gray-600";
}

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return "N/A";
  return `${Math.round(score)}%`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * 500;
}

export function getProgressToNextLevel(xp: number, level: number): number {
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function getReadinessColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

export function getReadinessLabel(score: number): string {
  if (score >= 80) return "Ready!";
  if (score >= 60) return "Almost Ready";
  if (score >= 40) return "Developing";
  return "Needs Work";
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "…";
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export const GOETHE_LEVELS: CEFRLevel[] = ["A1", "A2", "B1"];
export const ALL_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: "Beginner — Basic everyday expressions",
  A2: "Elementary — Simple daily interactions",
  B1: "Intermediate — Independent language use",
  B2: "Upper Intermediate — Complex texts",
  C1: "Advanced — Fluent professional use",
  C2: "Mastery — Near-native proficiency",
};

export const EXAM_SECTIONS = [
  { id: "lesen", label: "Lesen", icon: "📖", description: "Reading comprehension" },
  { id: "horen", label: "Hören", icon: "🎧", description: "Listening comprehension" },
  { id: "schreiben", label: "Schreiben", icon: "✍️", description: "Written production" },
  { id: "sprechen", label: "Sprechen", icon: "🎤", description: "Oral production" },
];
