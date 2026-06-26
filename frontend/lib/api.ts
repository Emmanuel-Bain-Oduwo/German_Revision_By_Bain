import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token, refresh_token } = response.data;
          setTokens(access_token, refresh_token);
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${access_token}`;
            return api.request(error.config);
          }
        } catch {
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
        }
      } else {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function hasToken(): boolean {
  return !!getAccessToken();
}

export const authApi = {
  register: (data: { email: string; username: string; password: string; target_level: string; native_language: string }) =>
    api.post("/auth/register", data),
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  refresh: (refresh_token: string) => api.post("/auth/refresh", { refresh_token }),
  me: () => api.get("/auth/me"),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post("/auth/change-password", data),
  logout: () => api.post("/auth/logout"),
};

export const userApi = {
  getMe: () => api.get("/users/me"),
  updateMe: (data: Record<string, unknown>) => api.patch("/users/me", data),
  getDashboard: () => api.get("/users/me/dashboard"),
  getLeaderboard: (level?: string) => api.get("/users/leaderboard", { params: { level } }),
};

export const vocabularyApi = {
  list: (params?: Record<string, unknown>) => api.get("/vocabulary/", { params }),
  get: (id: number) => api.get(`/vocabulary/${id}`),
  getProgress: (params?: Record<string, unknown>) => api.get("/vocabulary/me/progress", { params }),
  getDueForReview: (limit?: number) => api.get("/vocabulary/me/due-for-review", { params: { limit } }),
  recordReview: (vocabId: number, quality: number) =>
    api.post(`/vocabulary/${vocabId}/review`, null, { params: { quality } }),
  getGrammarRules: (params?: Record<string, unknown>) => api.get("/vocabulary/grammar/rules", { params }),
};

export const examApi = {
  listMockExams: (level?: string) => api.get("/exams/mock", { params: { level } }),
  getMockExam: (id: number) => api.get(`/exams/mock/${id}`),
  generateMockExam: (data: Record<string, unknown>) => api.post("/exams/mock/generate", data),
  startAttempt: (mock_exam_id: number) => api.post("/exams/attempts", { mock_exam_id }),
  submitWriting: (attempt_id: number, text: string, task_type: string) =>
    api.post(`/exams/attempts/${attempt_id}/submit-writing`, { attempt_id, text, task_type }),
  submitSpeaking: (attempt_id: number, transcript: string, topic: string, audio_url?: string) =>
    api.post(`/exams/attempts/${attempt_id}/submit-speaking`, { attempt_id, transcript, topic, audio_url }),
  completeAttempt: (attempt_id: number) => api.post(`/exams/attempts/${attempt_id}/complete`),
  getReadiness: () => api.get("/exams/readiness"),
  getAttemptHistory: () => api.get("/exams/attempts/history"),
};

export const flashcardApi = {
  list: (params?: Record<string, unknown>) => api.get("/flashcards/", { params }),
  getStudySession: (level?: string, limit?: number) =>
    api.get("/flashcards/study-session", { params: { level, limit } }),
  review: (card_id: number, quality: number) =>
    api.post(`/flashcards/${card_id}/review`, null, { params: { quality } }),
  getDecks: () => api.get("/flashcards/decks"),
};

export const contentApi = {
  getStories: (params?: Record<string, unknown>) => api.get("/content/stories", { params }),
  getStory: (id: number) => api.get(`/content/stories/${id}`),
  completeStory: (id: number) => api.post(`/content/stories/${id}/complete`),
  getPodcasts: (params?: Record<string, unknown>) => api.get("/content/podcasts", { params }),
  getPodcast: (id: number) => api.get(`/content/podcasts/${id}`),
};

export const aiApi = {
  tutorChat: (data: Record<string, unknown>) => api.post("/ai/tutor/chat", data),
  generateVocabulary: (data: Record<string, unknown>) => api.post("/ai/vocabulary/generate", data),
  generateStory: (data: Record<string, unknown>) => api.post("/ai/story/generate", data),
  generatePodcast: (data: Record<string, unknown>) => api.post("/ai/podcast/generate", data),
  correctGrammar: (text: string, level: string) => api.post("/ai/grammar/correct", { text, level }),
  generateExercises: (data: Record<string, unknown>) => api.post("/ai/exercises/generate", data),
  evaluateImageDescription: (data: Record<string, unknown>) => api.post("/ai/image-description/evaluate", data),
  getChatSessions: () => api.get("/ai/chat/sessions"),
  textToSpeech: (data: { text: string; voice?: string; language?: string }) =>
    api.post("/ai/tts", data, { responseType: "arraybuffer" }),
  generateVideoLesson: (data: { topic: string; level: string }) =>
    api.post("/ai/video-lesson/generate", data),
  voiceChat: (data: { transcript: string; level: string; conversation_history: { role: string; content: string }[] }) =>
    api.post("/ai/voice-chat", data),
};

export const courseApi = {
  list: (level?: string) => api.get("/courses/", { params: { level } }),
  get: (id: number) => api.get(`/courses/${id}`),
  getTopic: (courseId: number, topicId: number) => api.get(`/courses/${courseId}/topics/${topicId}`),
  getAllTopics: (level?: string) => api.get("/courses/topics/all", { params: { level } }),
};
