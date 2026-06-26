"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Palette, Volume2, Globe, ChevronRight, Moon, Sun, Check, Trash2, LogOut, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/authStore";
import { userApi, authApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Tab = "notifications" | "privacy" | "appearance" | "audio" | "account";

const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "audio", label: "Audio & Speech", icon: Volume2 },
  { id: "account", label: "Account", icon: Globe },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className={cn("relative w-11 h-6 rounded-full transition-colors", checked ? "bg-brand-500" : "bg-gray-200")}>
      <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50">
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("notifications");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });

  const [notifSettings, setNotifSettings] = useState({
    daily_reminder: true, streak_alerts: true, new_content: true, achievements: true, tips: false,
  });
  const [audioSettings, setAudioSettings] = useState({
    auto_play: false, pronunciation_feedback: true, tts_speed: "normal",
  });
  const [theme, setTheme] = useState("light");

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) { toast.error("Passwords do not match"); return; }
    if (passwordForm.new.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setSavingPassword(true);
    try {
      await authApi.changePassword({ current_password: passwordForm.current, new_password: passwordForm.new });
      toast.success("Password changed successfully!");
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch { toast.error("Failed to change password. Check your current password."); } finally { setSavingPassword(false); }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-500">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account preferences and application settings</p>
              </div>
            </div>

            <div className="grid md:grid-cols-[220px_1fr] gap-6">
              {/* Tab list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 h-fit">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left", activeTab === id ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-50")}>
                    <Icon className="w-4 h-4" />
                    {label}
                    {activeTab === id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                {activeTab === "notifications" && (
                  <div>
                    <h2 className="font-bold text-gray-900 mb-1">Notification Preferences</h2>
                    <p className="text-sm text-gray-500 mb-6">Choose what notifications you want to receive</p>
                    <SettingRow label="Daily Study Reminder" description="Get reminded to practice every day">
                      <Toggle checked={notifSettings.daily_reminder} onChange={(v) => setNotifSettings((p) => ({ ...p, daily_reminder: v }))} />
                    </SettingRow>
                    <SettingRow label="Streak Alerts" description="Get notified before your streak breaks">
                      <Toggle checked={notifSettings.streak_alerts} onChange={(v) => setNotifSettings((p) => ({ ...p, streak_alerts: v }))} />
                    </SettingRow>
                    <SettingRow label="New Content" description="Notifications about new stories and podcasts">
                      <Toggle checked={notifSettings.new_content} onChange={(v) => setNotifSettings((p) => ({ ...p, new_content: v }))} />
                    </SettingRow>
                    <SettingRow label="Achievement Unlocked" description="Celebrate when you earn a badge">
                      <Toggle checked={notifSettings.achievements} onChange={(v) => setNotifSettings((p) => ({ ...p, achievements: v }))} />
                    </SettingRow>
                    <SettingRow label="German Tips" description="Weekly German language tips and tricks">
                      <Toggle checked={notifSettings.tips} onChange={(v) => setNotifSettings((p) => ({ ...p, tips: v }))} />
                    </SettingRow>
                    <button onClick={() => toast.success("Notification settings saved!")} className="mt-6 px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors">
                      Save Preferences
                    </button>
                  </div>
                )}

                {activeTab === "privacy" && (
                  <div>
                    <h2 className="font-bold text-gray-900 mb-1">Privacy & Security</h2>
                    <p className="text-sm text-gray-500 mb-6">Manage your account security</p>

                    <h3 className="font-semibold text-gray-800 text-sm mb-4">Change Password</h3>
                    <div className="space-y-3 mb-6">
                      {[
                        { key: "current", label: "Current Password", placeholder: "Enter current password" },
                        { key: "new", label: "New Password", placeholder: "At least 8 characters" },
                        { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
                          <input type="password" value={passwordForm[key as keyof typeof passwordForm]} onChange={(e) => setPasswordForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                        </div>
                      ))}
                    </div>
                    <button onClick={handleChangePassword} disabled={savingPassword || !passwordForm.current || !passwordForm.new} className="px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50">
                      {savingPassword ? "Updating..." : "Update Password"}
                    </button>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <h3 className="font-semibold text-gray-800 text-sm mb-3">Privacy Controls</h3>
                      <SettingRow label="Show on Leaderboard" description="Let other learners see your ranking">
                        <Toggle checked={true} onChange={() => {}} />
                      </SettingRow>
                      <SettingRow label="Share Progress" description="Allow anonymous analytics to improve the platform">
                        <Toggle checked={true} onChange={() => {}} />
                      </SettingRow>
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div>
                    <h2 className="font-bold text-gray-900 mb-1">Appearance</h2>
                    <p className="text-sm text-gray-500 mb-6">Customize how the app looks</p>

                    <h3 className="font-semibold text-gray-800 text-sm mb-3">Theme</h3>
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      {[
                        { id: "light", label: "Light", icon: Sun, preview: "bg-white border-gray-200" },
                        { id: "dark", label: "Dark", icon: Moon, preview: "bg-gray-900 border-gray-700" },
                        { id: "system", label: "System", icon: Globe, preview: "bg-gradient-to-r from-white to-gray-900 border-gray-400" },
                      ].map(({ id, label, icon: Icon, preview }) => (
                        <button key={id} onClick={() => { setTheme(id); toast.info(`${label} theme selected`); }} className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all", theme === id ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white hover:border-gray-300")}>
                          <div className={cn("w-12 h-8 rounded-lg border", preview)} />
                          <div className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-700">{label}</span>
                          </div>
                          {theme === id && <Check className="w-4 h-4 text-brand-500" />}
                        </button>
                      ))}
                    </div>

                    <h3 className="font-semibold text-gray-800 text-sm mb-3">Language Interface</h3>
                    <select className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white">
                      <option>English</option>
                      <option>Deutsch</option>
                      <option>Français</option>
                      <option>Español</option>
                    </select>
                  </div>
                )}

                {activeTab === "audio" && (
                  <div>
                    <h2 className="font-bold text-gray-900 mb-1">Audio & Speech</h2>
                    <p className="text-sm text-gray-500 mb-6">Configure audio and speech recognition settings</p>

                    <SettingRow label="Auto-play Audio" description="Automatically play German audio when available">
                      <Toggle checked={audioSettings.auto_play} onChange={(v) => setAudioSettings((p) => ({ ...p, auto_play: v }))} />
                    </SettingRow>
                    <SettingRow label="Pronunciation Feedback" description="Get instant feedback on your German pronunciation">
                      <Toggle checked={audioSettings.pronunciation_feedback} onChange={(v) => setAudioSettings((p) => ({ ...p, pronunciation_feedback: v }))} />
                    </SettingRow>

                    <div className="py-4 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Text-to-Speech Speed</p>
                      <p className="text-xs text-gray-500 mb-3">Choose how fast German text is read aloud</p>
                      <div className="flex gap-2">
                        {["slow", "normal", "fast"].map((speed) => (
                          <button key={speed} onClick={() => setAudioSettings((p) => ({ ...p, tts_speed: speed }))} className={cn("px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize", audioSettings.tts_speed === speed ? "bg-brand-500 text-white border-transparent" : "bg-white text-gray-600 border-gray-200")}>
                            {speed}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => toast.success("Audio settings saved!")} className="mt-6 px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors">
                      Save Settings
                    </button>
                  </div>
                )}

                {activeTab === "account" && (
                  <div>
                    <h2 className="font-bold text-gray-900 mb-1">Account Management</h2>
                    <p className="text-sm text-gray-500 mb-6">Manage your subscription and account data</p>

                    {/* Subscription */}
                    <div className={cn("rounded-2xl p-5 mb-6 border", user?.subscription_tier === "premium" ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200")}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{user?.subscription_tier === "premium" ? "Premium Plan" : "Free Plan"}</p>
                          <p className="text-sm text-gray-600 mt-1">{user?.subscription_tier === "premium" ? "Full access to all content and AI features" : "Limited access — upgrade for full features"}</p>
                        </div>
                        {user?.subscription_tier !== "premium" && (
                          <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm rounded-xl hover:shadow-md transition-all">
                            Upgrade
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Data export */}
                    <div className="space-y-3 mb-8">
                      <button onClick={() => toast.info("Data export requested — you'll receive an email")} className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700">
                        Export My Data <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Danger zone */}
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Session & Account</h3>
                      <div className="space-y-3">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                        <button onClick={() => toast.error("Please contact support to delete your account")} className="w-full flex items-center gap-3 px-4 py-3 border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-sm font-semibold text-red-600">
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
