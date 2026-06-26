"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  GraduationCap, BookOpen, Mic, Headphones, Brain, Trophy,
  Flame, Star, CheckCircle2, ArrowRight, Zap, Target,
  ChevronRight, Users, Award, TrendingUp, Clock, Globe2,
  MessageSquare, Volume2, PenTool, FileText
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

const examLevels = [
  {
    level: "A1",
    title: "Goethe A1",
    subtitle: "Start Smart",
    description: "Master everyday German with greetings, numbers, family, food & more.",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    topics: ["Greetings & Introductions", "Numbers & Time", "Family & Friends", "Food & Shopping"],
    badge: "Beginner",
    icon: "🌱",
  },
  {
    level: "A2",
    title: "Goethe A2",
    subtitle: "Build Confidence",
    description: "Navigate daily German life — work, travel, health, and media.",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    topics: ["Work & Education", "Travel & Transport", "Health & Body", "Culture & Media"],
    badge: "Elementary",
    icon: "🚀",
    popular: true,
  },
  {
    level: "B1",
    title: "Goethe B1",
    subtitle: "Reach Independence",
    description: "Engage in complex conversations — society, environment, career.",
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    topics: ["Society & Politics", "Career & Job", "Environment", "Technology & Future"],
    badge: "Intermediate",
    icon: "⚡",
  },
];

const features = [
  {
    icon: Brain,
    title: "Germakemi — Your Personal Tutor",
    description: "24/7 personalized German tutor that knows your level, tracks your weaknesses, and gives grammar corrections, vocabulary help, and exam tips on demand.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Target,
    title: "Exam Readiness Predictor",
    description: "Germakemi analyzes your scores across all 4 exam sections to predict your pass probability before you book the real Goethe exam.",
    color: "text-brand-500",
    bg: "bg-brand-50",
  },
  {
    icon: Mic,
    title: "Speaking & Pronunciation Lab",
    description: "Record yourself, get Germakemi pronunciation scores, fluency ratings, and instant feedback on your Sprechen performance.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: FileText,
    title: "Full Mock Examinations",
    description: "Authentic Goethe-style practice tests for A1, A2, B1 with Germakemi grading for writing & speaking — just like the real exam.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Volume2,
    title: "Germakemi Podcast Generator",
    description: "Listen to Germakemi-created German conversations, news, and stories at your level. Ideal for Hören practice anytime.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: PenTool,
    title: "Writing Coach",
    description: "Submit German essays and get instant Germakemi feedback with grammar corrections, vocabulary suggestions, and exam scores.",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
];

const stats = [
  { value: "50,000+", label: "Students Learning", icon: Users },
  { value: "95%", label: "Pass Rate", icon: Award },
  { value: "A1–B1", label: "Levels Covered", icon: TrendingUp },
  { value: "24/7", label: "Germakemi Support", icon: Clock },
];

const testimonials = [
  {
    name: "Aisha Mahmoud",
    country: "Nigeria 🇳🇬",
    level: "Passed B1",
    quote: "Germakemi corrected my grammar instantly. I passed my Goethe B1 on the first try after just 3 months of practice!",
    avatar: "A",
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "Carlos Rivera",
    country: "Mexico 🇲🇽",
    level: "Passed A2",
    quote: "The Exam Readiness Predictor told me I needed 2 more weeks. It was right — I scored 87% on my actual A2 exam!",
    avatar: "C",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Priya Sharma",
    country: "India 🇮🇳",
    level: "Studying A1",
    quote: "The speaking lab is incredible. I went from being scared to speak German to having actual conversations in 6 weeks!",
    avatar: "P",
    color: "from-emerald-400 to-emerald-600",
  },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-900 to-purple-900 pt-20 pb-32">
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />

        {/* German Flag Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 mb-6"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Germakemi-Powered Goethe Exam Preparation</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Pass Your Goethe
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-cyan-300 to-purple-300">
                Exam First Try
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-white/70 max-w-2xl mx-auto mb-10"
            >
              Master German A1, A2, and B1 with Germakemi — your personal tutor, authentic mock exams,
              speaking practice, and our exclusive Exam Readiness Predictor.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
              >
                <GraduationCap className="w-5 h-5 text-brand-600" />
                Start Learning Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/mock-exams"
                className="flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all"
              >
                Try a Mock Exam
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center glass rounded-2xl p-4">
                    <Icon className="w-5 h-5 text-brand-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Exam Levels */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Your Journey</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Choose Your Goethe Level</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Complete learning paths for A1, A2, and B1 — with B2, C1, C2 coming soon.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {examLevels.map((exam, idx) => (
              <FadeIn key={exam.level} delay={idx * 0.15}>
                <div className={`relative rounded-3xl border-2 ${exam.border} ${exam.bg} p-8 card-hover group`}>
                  {exam.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <div className="text-4xl mb-4">{exam.icon}</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${exam.color} mb-3`}>
                    {exam.badge}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{exam.title}</h3>
                  <p className="text-lg font-medium text-gray-600 mb-3">{exam.subtitle}</p>
                  <p className="text-gray-500 text-sm mb-6">{exam.description}</p>
                  <ul className="space-y-2 mb-8">
                    {exam.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/courses?level=${exam.level}`}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl text-white font-semibold bg-gradient-to-r ${exam.color} hover:shadow-lg transition-all group-hover:-translate-y-0.5`}
                  >
                    Start {exam.level} Course
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Coming Soon */}
          <FadeIn className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-3 shadow-sm">
              <span className="text-gray-500 text-sm">Coming Soon:</span>
              {["B2", "C1", "C2"].map((level) => (
                <span key={level} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                  {level}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Platform Features</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Everything You Need to Pass</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A complete German exam preparation ecosystem powered by Germakemi, your dedicated tutor.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={idx * 0.1}>
                  <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm card-hover group">
                    <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Exam Readiness Predictor Spotlight */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="text-brand-200 font-semibold text-sm uppercase tracking-wider">Exclusive Feature</span>
              <h2 className="text-4xl font-bold text-white mt-2 mb-6">
                Exam Readiness
                <br />
                <span className="text-yellow-300">Predictor</span>
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Germakemi analyzes your performance across ALL exam sections — reading, listening, writing, speaking —
                plus your vocabulary retention and study consistency to give you a precise pass probability score.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Mock Exam Scores", weight: "30%" },
                  { label: "Speaking Performance", weight: "25%" },
                  { label: "Listening Accuracy", weight: "20%" },
                  { label: "Vocabulary Retention", weight: "15%" },
                  { label: "Study Consistency", weight: "10%" },
                ].map((factor) => (
                  <div key={factor.label} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                    <span className="text-white/80 text-sm flex-1">{factor.label}</span>
                    <span className="text-yellow-300 font-bold text-sm">{factor.weight}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <TrendingUp className="w-5 h-5" />
                Check Your Readiness
              </Link>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-lg">Your B1 Readiness</h3>
                  <span className="text-3xl font-bold text-yellow-300">78%</span>
                </div>
                <div className="space-y-4">
                  {[
                    { section: "Lesen (Reading)", score: 82, color: "bg-green-400" },
                    { section: "Hören (Listening)", score: 75, color: "bg-blue-400" },
                    { section: "Schreiben (Writing)", score: 71, color: "bg-purple-400" },
                    { section: "Sprechen (Speaking)", score: 68, color: "bg-orange-400" },
                  ].map((s) => (
                    <div key={s.section}>
                      <div className="flex justify-between text-sm text-white/80 mb-1">
                        <span>{s.section}</span>
                        <span className="font-semibold">{s.score}%</span>
                      </div>
                      <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className={`h-full rounded-full ${s.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-400/20 border border-yellow-400/30 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">Almost Ready! 🎯</p>
                      <p className="text-white/70 text-xs mt-1">
                        Focus on Sprechen — 2 more weeks of speaking practice could push you to 85%+ readiness.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-white/60 text-xs">Predicted Pass Probability:</p>
                  <p className="text-4xl font-black text-green-300 mt-1">84%</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Success Stories</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Students Who Passed</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <FadeIn key={t.name} delay={idx * 0.15}>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 card-hover">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.country} · {t.level}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{t.quote}"</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="bg-gradient-to-br from-brand-600 to-purple-700 rounded-3xl p-12 shadow-2xl">
              <div className="text-5xl mb-4">🇩🇪</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Dein Goethe-Zertifikat wartet! 🏆
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Your Goethe certificate is waiting. Join 50,000+ students already on their path to certification.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
                >
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Start Free Today
                </Link>
                <Link
                  href="/mock-exams"
                  className="flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all"
                >
                  Take a Free Mock Exam
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-white/50 text-sm mt-6">No credit card required • Free tier available forever</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">GoethePrep</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The most advanced platform for Goethe Institute exam preparation, powered by Germakemi.
              </p>
              <div className="flex gap-1 mt-4">
                <div className="h-1 w-8 bg-black rounded" />
                <div className="h-1 w-8 bg-red-600 rounded" />
                <div className="h-1 w-8 bg-yellow-400 rounded" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {["Courses", "Vocabulary", "Grammar", "Flashcards", "Stories", "Podcasts"].map((item) => (
                  <li key={item}><Link href={`/${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Exam Prep</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {["Mock Exams", "Speaking Lab", "Listening Lab", "Germakemi", "Exam Readiness"].map((item) => (
                  <li key={item}><Link href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Levels</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {["Goethe A1", "Goethe A2", "Goethe B1", "B2 (Coming Soon)", "C1 (Coming Soon)", "C2 (Coming Soon)"].map((item) => (
                  <li key={item} className="text-gray-500">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2025 GoethePrep. All rights reserved.</p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Globe2 className="w-4 h-4" />
              <span>Supporting German learners worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
