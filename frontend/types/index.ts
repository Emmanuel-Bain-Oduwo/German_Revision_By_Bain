export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type SubscriptionTier = "free" | "basic" | "pro" | "enterprise";
export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  target_level: CEFRLevel;
  native_language: string;
  xp_points: number;
  level: number;
  streak_days: number;
  subscription_tier: SubscriptionTier;
  exam_readiness_a1: number;
  exam_readiness_a2: number;
  exam_readiness_b1: number;
  badges: Badge[];
  total_study_minutes: number;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
  color: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string;
  level: CEFRLevel;
  thumbnail_url?: string;
  is_premium: boolean;
  total_lessons: number;
  estimated_hours: number;
  xp_reward: number;
  tags: string[];
}

export interface Topic {
  id: number;
  course_id: number;
  title: string;
  title_german?: string;
  description?: string;
  level: CEFRLevel;
  order_index: number;
  icon?: string;
  color?: string;
  xp_reward: number;
}

export interface Vocabulary {
  id: number;
  german_word: string;
  article?: string;
  english_translation: string;
  word_type?: string;
  level: string;
  example_sentence_de?: string;
  example_sentence_en?: string;
  audio_url?: string;
  image_url?: string;
  ipa_pronunciation?: string;
  conjugations?: Record<string, string>;
  synonyms?: string[];
}

export interface GrammarRule {
  id: number;
  title: string;
  level: string;
  category: string;
  explanation: string;
  explanation_simple?: string;
  formula?: string;
  examples: GrammarExample[];
  tips: string[];
}

export interface GrammarExample {
  german: string;
  english: string;
  highlight?: string;
}

export interface Flashcard {
  id: number;
  front_text: string;
  back_text: string;
  front_image_url?: string;
  front_audio_url?: string;
  card_type: string;
  level?: string;
  topic?: string;
  hint?: string;
  status?: string;
  is_new?: boolean;
}

export interface Story {
  id: number;
  title: string;
  title_english?: string;
  content?: string;
  level: string;
  topic?: string;
  word_count?: number;
  reading_time_minutes?: number;
  image_url?: string;
  audio_url?: string;
  xp_reward: number;
  tags: string[];
  comprehension_questions?: Question[];
  vocabulary_list?: VocabItem[];
}

export interface VocabItem {
  german: string;
  english: string;
  article?: string;
}

export interface Podcast {
  id: number;
  title: string;
  description?: string;
  level: string;
  topic?: string;
  audio_url: string;
  duration_seconds?: number;
  thumbnail_url?: string;
  xp_reward: number;
  tags: string[];
  transcript?: string;
  comprehension_questions?: Question[];
}

export interface MockExam {
  id: number;
  title: string;
  level: string;
  description?: string;
  duration_minutes: number;
  is_premium: boolean;
  passing_score: number;
  total_points: number;
  tags: string[];
}

export interface ExamAttempt {
  id: number;
  mock_exam_id: number;
  status: string;
  started_at?: string;
  completed_at?: string;
  total_score?: number;
  passed?: boolean;
  lesen_score?: number;
  horen_score?: number;
  schreiben_score?: number;
  sprechen_score?: number;
  ai_feedback: Record<string, unknown>;
  xp_earned: number;
}

export interface ExamReadiness {
  level: string;
  overall_readiness: number;
  lesen_readiness: number;
  horen_readiness: number;
  schreiben_readiness: number;
  sprechen_readiness: number;
  vocabulary_retention: number;
  grammar_accuracy: number;
  study_consistency: number;
  mock_exam_average: number;
  predicted_pass_probability: number;
  ready_to_take_exam: boolean;
  estimated_ready_date?: string;
  weak_areas: string[];
  strong_areas: string[];
  recommendations: string[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface Question {
  question: string;
  answer?: string;
  options?: string[];
  question_type: string;
}

export interface DashboardData {
  user: Partial<User>;
  exam_readiness: Record<string, number>;
  recent_exam_attempts: Partial<ExamAttempt>[];
  weekly_stats: WeeklyStat[];
  total_study_minutes: number;
}

export interface WeeklyStat {
  date: string;
  study_minutes: number;
  xp_earned: number;
  vocabulary_reviewed: number;
}

export interface WritingFeedback {
  corrected_text: string;
  errors: WritingError[];
  grammar_score: number;
  vocabulary_score: number;
  structure_score: number;
  overall_score: number;
  passed: boolean;
  detailed_feedback: string;
  improvement_tips: string[];
}

export interface WritingError {
  original: string;
  correction: string;
  explanation: string;
  error_type: string;
}

export interface SpeakingFeedback {
  transcript: string;
  pronunciation_score: number;
  fluency_score: number;
  grammar_score: number;
  vocabulary_score: number;
  content_score: number;
  overall_score: number;
  passed: boolean;
  feedback: string;
  corrections: unknown[];
  strengths: string[];
}

export interface ApiPaginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
