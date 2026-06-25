"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, Globe, Target, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import type { Token } from "@/types";
import { cn } from "@/lib/utils";

const LEVELS = [
  { value: "A1", label: "A1 Beginner", emoji: "🌱", desc: "Starting from scratch" },
  { value: "A2", label: "A2 Elementary", emoji: "🚀", desc: "Know some basics" },
  { value: "B1", label: "B1 Intermediate", emoji: "⚡", desc: "Can hold conversations" },
];

const LANGUAGES = ["English", "Arabic", "French", "Spanish", "Portuguese", "Chinese", "Hindi", "Turkish", "Persian", "Russian"];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    full_name: "",
    target_level: "A1",
    native_language: "English",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }

    setIsLoading(true);
    try {
      const response = await authApi.register(formData);
      const data: Token = response.data;
      login(data.user, data.access_token, data.refresh_token);
      toast.success("Welcome to GoethePrep! 🎉 Let's start your German journey!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error?.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-black" /><div className="flex-1 bg-red-600" /><div className="flex-1 bg-yellow-400" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              {step === 1 ? "Create your account" : "Set your goals"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {step === 1 ? "Start your Goethe exam preparation today" : "Help us personalize your learning path"}
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all duration-300",
                  s <= step ? "bg-brand-500" : "bg-gray-200"
                )}
              />
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 transition-all"
                      placeholder="username (3+ characters)"
                      minLength={3}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 transition-all"
                      placeholder="Min. 8 characters"
                      minLength={8}
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Target Goethe Level</label>
                  <div className="space-y-2">
                    {LEVELS.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, target_level: level.value })}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                          formData.target_level === level.value
                            ? "border-brand-500 bg-brand-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        )}
                      >
                        <span className="text-2xl">{level.emoji}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{level.label}</p>
                          <p className="text-xs text-gray-500">{level.desc}</p>
                        </div>
                        {formData.target_level === level.value && (
                          <CheckCircle2 className="w-5 h-5 text-brand-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Globe className="inline w-4 h-4 mr-1 text-gray-400" />
                    Native Language
                  </label>
                  <select
                    value={formData.native_language}
                    onChange={(e) => setFormData({ ...formData, native_language: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 transition-all"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                step === 1 ? (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Start Learning Free <CheckCircle2 className="w-4 h-4" /></>
                )
              )}
            </button>
          </form>

          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-3"
            >
              ← Back
            </button>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
