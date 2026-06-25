import { create } from "zustand";
import type { MockExam, ExamAttempt, ExamReadiness } from "@/types";

interface ExamState {
  currentExam: MockExam | null;
  currentAttempt: ExamAttempt | null;
  examReadiness: ExamReadiness | null;
  answers: Record<string, unknown>;
  currentSection: string;
  timeRemaining: number;
  isExamActive: boolean;

  setCurrentExam: (exam: MockExam) => void;
  setCurrentAttempt: (attempt: ExamAttempt) => void;
  setExamReadiness: (readiness: ExamReadiness) => void;
  setAnswer: (questionId: string, answer: unknown) => void;
  setCurrentSection: (section: string) => void;
  setTimeRemaining: (time: number) => void;
  setIsExamActive: (active: boolean) => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  currentExam: null,
  currentAttempt: null,
  examReadiness: null,
  answers: {},
  currentSection: "lesen",
  timeRemaining: 0,
  isExamActive: false,

  setCurrentExam: (exam) => set({ currentExam: exam }),
  setCurrentAttempt: (attempt) => set({ currentAttempt: attempt }),
  setExamReadiness: (examReadiness) => set({ examReadiness }),
  setAnswer: (questionId, answer) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  setCurrentSection: (currentSection) => set({ currentSection }),
  setTimeRemaining: (timeRemaining) => set({ timeRemaining }),
  setIsExamActive: (isExamActive) => set({ isExamActive }),
  resetExam: () =>
    set({
      currentExam: null,
      currentAttempt: null,
      answers: {},
      currentSection: "lesen",
      timeRemaining: 0,
      isExamActive: false,
    }),
}));
