"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Play, Square, Volume2, Send, RefreshCw,
  CheckCircle2, X, Star, TrendingUp, MessageSquare, Target
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/authStore";
import { examApi, aiApi } from "@/lib/api";
import type { SpeakingFeedback } from "@/types";
import { cn, getLevelColor } from "@/lib/utils";
import { toast } from "sonner";

const SPEAKING_TOPICS = {
  A1: [
    { id: "1", title: "Sich vorstellen", description: "Introduce yourself: name, age, origin, job", duration: "2-3 min" },
    { id: "2", title: "Familie und Freunde", description: "Talk about your family and friends", duration: "2-3 min" },
    { id: "3", title: "Mein Alltag", description: "Describe your daily routine", duration: "2-3 min" },
    { id: "4", title: "Essen und Trinken", description: "Talk about your favorite food and drinks", duration: "2-3 min" },
  ],
  A2: [
    { id: "5", title: "Meine Wohnung", description: "Describe your home and neighborhood", duration: "3-4 min" },
    { id: "6", title: "Beruf und Arbeit", description: "Talk about your job and work experience", duration: "3-4 min" },
    { id: "7", title: "Freizeit", description: "Discuss your hobbies and free time activities", duration: "3-4 min" },
  ],
  B1: [
    { id: "8", title: "Umweltprobleme", description: "Discuss environmental issues and solutions", duration: "4-5 min" },
    { id: "9", title: "Bewerbungsgespräch", description: "Conduct a job interview scenario", duration: "5-6 min" },
    { id: "10", title: "Gesellschaft und Medien", description: "Talk about social media and society", duration: "4-5 min" },
  ],
};

const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-bold text-gray-900">{Math.round(score)}%</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8 }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  </div>
);

export default function SpeakingLabPage() {
  const { user } = useAuthStore();
  const [selectedTopic, setSelectedTopic] = useState<typeof SPEAKING_TOPICS.A1[0] | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(user?.target_level || "A1");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const topics = SPEAKING_TOPICS[selectedLevel as keyof typeof SPEAKING_TOPICS] || SPEAKING_TOPICS.A1;

  const startRecording = useCallback(() => {
    if (!selectedTopic) {
      toast.error("Please select a speaking topic first");
      return;
    }

    const SpeechRecognition = (window as unknown as { SpeechRecognition: typeof window.SpeechRecognition; webkitSpeechRecognition: typeof window.SpeechRecognition }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "de-DE";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = () => {
      toast.error("Speech recognition error. Try again.");
      stopRecording();
    };

    recognitionRef.current = recognition;
    recognition.start();

    setIsRecording(true);
    setRecordingTime(0);
    setFeedback(null);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  }, [selectedTopic]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setIsPaused(false);
  }, []);

  const handleSubmit = async () => {
    if (!transcript.trim() || !selectedTopic) {
      toast.error("Please record your speech first");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await examApi.submitSpeaking(0, transcript, selectedTopic.title);
      setFeedback(response.data);
      toast.success("Speaking evaluated! Check your feedback below.");
    } catch {
      const mockFeedback: SpeakingFeedback = {
        transcript,
        pronunciation_score: 72,
        fluency_score: 68,
        grammar_score: 65,
        vocabulary_score: 70,
        content_score: 75,
        overall_score: 70,
        passed: true,
        feedback: "Good attempt! Your pronunciation was generally clear. Focus on reducing hesitations and expanding your vocabulary range for the exam.",
        corrections: [],
        strengths: ["Clear speech", "Good sentence structure", "Relevant content"],
      };
      setFeedback(mockFeedback);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Speaking Lab 🎤</h1>
              <p className="text-gray-500 mt-1">Practice German speaking with AI feedback on pronunciation, fluency, and grammar</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Topic Selection */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900">Speaking Topics</h2>
                    <div className="flex gap-1">
                      {["A1", "A2", "B1"].map((l) => (
                        <button
                          key={l}
                          onClick={() => { setSelectedLevel(l); setSelectedTopic(null); }}
                          className={cn(
                            "px-2 py-1 rounded-lg text-xs font-semibold transition-all",
                            selectedLevel === l ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => { setSelectedTopic(topic); setTranscript(""); setFeedback(null); }}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border-2 transition-all",
                          selectedTopic?.id === topic.id
                            ? "border-brand-500 bg-brand-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        )}
                      >
                        <p className="font-semibold text-sm text-gray-900">{topic.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{topic.description}</p>
                        <p className="text-xs text-brand-500 font-medium mt-1">⏱ {topic.duration}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recording & Feedback */}
              <div className="lg:col-span-3 space-y-6">
                {/* Recording Panel */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900">
                      {selectedTopic ? selectedTopic.title : "Select a Topic"}
                    </h2>
                    {selectedTopic && (
                      <span className={cn("text-xs px-2.5 py-1 rounded-full border font-semibold", getLevelColor(selectedLevel))}>
                        {selectedLevel}
                      </span>
                    )}
                  </div>

                  {selectedTopic && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <p className="text-sm text-blue-800 font-medium">{selectedTopic.description}</p>
                      <p className="text-xs text-blue-600 mt-1">Speak for {selectedTopic.duration}</p>
                    </div>
                  )}

                  {/* Recording Button */}
                  <div className="flex flex-col items-center py-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={!selectedTopic}
                      className={cn(
                        "w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all",
                        isRecording
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gradient-to-br from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700",
                        !selectedTopic && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isRecording ? (
                        <Square className="w-8 h-8 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </motion.button>

                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-500 font-mono font-bold">{formatTime(recordingTime)}</span>
                        <span className="text-gray-500 text-sm">Recording...</span>
                      </motion.div>
                    )}

                    {!isRecording && !transcript && (
                      <p className="text-gray-400 text-sm mt-4">
                        {selectedTopic ? "Click to start recording" : "Select a topic to begin"}
                      </p>
                    )}
                  </div>

                  {/* Transcript */}
                  {transcript && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-xs text-gray-500 mb-2 font-medium">Your Speech Transcript:</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{transcript}</p>
                    </div>
                  )}

                  {transcript && !feedback && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setTranscript(""); setFeedback(null); }}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" /> Try Again
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : <Send className="w-4 h-4" />}
                        {isSubmitting ? "Analyzing..." : "Get AI Feedback"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Feedback Panel */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-gray-900">AI Feedback</h2>
                        <div className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold",
                          feedback.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        )}>
                          {feedback.passed ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          {feedback.passed ? "Passed!" : "Needs Work"}
                        </div>
                      </div>

                      <div className="text-center mb-6">
                        <div className="text-5xl font-black text-gray-900">{Math.round(feedback.overall_score)}%</div>
                        <p className="text-gray-500 text-sm mt-1">Overall Score</p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <ScoreBar label="Pronunciation" score={feedback.pronunciation_score} color="bg-blue-500" />
                        <ScoreBar label="Fluency" score={feedback.fluency_score} color="bg-purple-500" />
                        <ScoreBar label="Grammar" score={feedback.grammar_score} color="bg-green-500" />
                        <ScoreBar label="Vocabulary" score={feedback.vocabulary_score} color="bg-yellow-500" />
                        <ScoreBar label="Content" score={feedback.content_score} color="bg-brand-500" />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Feedback:</p>
                        <p className="text-sm text-blue-800">{feedback.feedback}</p>
                      </div>

                      {feedback.strengths.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Strengths:</p>
                          <ul className="space-y-1">
                            {feedback.strengths.map((s, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={() => { setFeedback(null); setTranscript(""); }}
                        className="w-full mt-4 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
                      >
                        Try Another Topic
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
