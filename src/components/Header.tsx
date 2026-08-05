import React, { useState, useRef, useEffect } from "react";
import {
  Wrench,
  Search,
  Command,
  Sun,
  Moon,
  Monitor,
  Palette,
  Zap,
  MoreVertical,
  MessageSquare,
  Coffee,
  Sparkles,
  Info,
  Shield,
  X,
  Check,
  Heart,
  Send,
} from "lucide-react";

interface HeaderProps {
  onOpenSearch: () => void;
  favoriteCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  darkMode,
  onToggleDarkMode,
  onGoHome,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [themePreference, setThemePreference] = useState<"light" | "dark" | "system">(() => {
    try {
      const saved = localStorage.getItem("devstudio_theme_pref") as "light" | "dark" | "system" | null;
      if (saved) return saved;
    } catch {
      // Fallback
    }
    return darkMode ? "dark" : "light";
  });
  const [accentColor, setAccentColor] = useState<"indigo" | "emerald" | "cyan" | "violet" | "rose">("indigo");
  const [isOfflineToastVisible, setIsOfflineToastVisible] = useState(false);

  // Active Modals
  const [activeModal, setActiveModal] = useState<"feedback" | "coffee" | "about" | "privacy" | null>(null);

  // Feedback form state
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("feature");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Coffee state
  const [coffeeAmount, setCoffeeAmount] = useState<number>(5);
  const [coffeeThankYou, setCoffeeThankYou] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Sync system theme changes if system preference is selected
  useEffect(() => {
    if (themePreference === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches && !darkMode) {
          onToggleDarkMode();
        } else if (!e.matches && darkMode) {
          onToggleDarkMode();
        }
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themePreference, darkMode, onToggleDarkMode]);

  // Close menu dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (mode: "light" | "dark" | "system") => {
    setThemePreference(mode);
    try {
      localStorage.setItem("devstudio_theme_pref", mode);
    } catch {
      // Ignore storage errors
    }

    if (mode === "dark") {
      if (!darkMode) onToggleDarkMode();
    } else if (mode === "light") {
      if (darkMode) onToggleDarkMode();
    } else if (mode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark && !darkMode) {
        onToggleDarkMode();
      } else if (!prefersDark && darkMode) {
        onToggleDarkMode();
      }
    }
  };

  const handleWorkOfflineClick = () => {
    setIsOfflineToastVisible(true);
    setTimeout(() => setIsOfflineToastVisible(false), 3500);
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackText("");
      setActiveModal(null);
    }, 2000);
  };

  const handleCoffeeDonate = () => {
    setCoffeeThankYou(true);
    setTimeout(() => {
      setCoffeeThankYou(false);
      setActiveModal(null);
    }, 2200);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <div
            onClick={onGoHome}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
            title="Go to Home - All Tools Directory"
          >
            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  DevStudio
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Super Toolkit
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                High-performance developer utilities
              </p>
            </div>
          </div>

          {/* Right Actions (Search, Work Offline Badge, More Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Cmd+K Search trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-all shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="hidden sm:inline">Search tools...</span>
              <span className="hidden md:flex items-center text-[10px] text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                <Command className="w-2.5 h-2.5 mr-0.5" /> K
              </span>
            </button>

            {/* Green Work Offline Pill Button */}
            <button
              onClick={handleWorkOfflineClick}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold text-xs hover:bg-emerald-500/10 transition-colors cursor-pointer shrink-0"
              title="100% Client-Side Local Execution"
            >
              <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 shrink-0" />
              <span className="hidden sm:inline">Work Offline</span>
              <span className="sm:hidden text-[10px]">Offline</span>
            </button>

            {/* Options Dropdown Menu Button */}
            <div className="relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
                  isMenuOpen ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white" : ""
                }`}
                title="Options & Preferences"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Options Popover Dropdown */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 shadow-2xl z-50 p-3 space-y-3 text-xs animate-in fade-in zoom-in-95 duration-100">
                  {/* APPEARANCE SECTION */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 px-1">
                      APPEARANCE
                    </span>

                    {/* Segmented Theme Switcher */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-xs rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                      <button
                        onClick={() => handleThemeChange("light")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                          themePreference === "light"
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        <span>Light</span>
                      </button>

                      <button
                        onClick={() => handleThemeChange("dark")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                          themePreference === "dark"
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                        <span>Dark</span>
                      </button>

                      <button
                        onClick={() => handleThemeChange("system")}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                          themePreference === "system"
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>System</span>
                      </button>
                    </div>

                    {/* Theme Color Picker Row */}
                    <div className="mt-2.5 flex items-center justify-between px-1">
                      <div className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/80 text-slate-600 dark:text-slate-300">
                        <Palette className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {(["indigo", "emerald", "cyan", "violet", "rose"] as const).map((color) => {
                          const bgMap = {
                            indigo: "bg-indigo-500",
                            emerald: "bg-emerald-500",
                            cyan: "bg-cyan-500",
                            violet: "bg-violet-500",
                            rose: "bg-rose-500",
                          };
                          return (
                            <button
                              key={color}
                              onClick={() => setAccentColor(color)}
                              className={`w-5 h-5 rounded-full ${bgMap[color]} transition-transform ${
                                accentColor === color ? "scale-125 ring-2 ring-indigo-500/80 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-slate-900" : "opacity-70 hover:opacity-100"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/80 dark:border-slate-800/80" />

                  {/* SUPPORT & COMMUNITY SECTION */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1 px-1">
                      SUPPORT & COMMUNITY
                    </span>

                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setActiveModal("feedback");
                        }}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-xs">Send feedback</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setActiveModal("coffee");
                        }}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                      >
                        <Coffee className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                        <span className="font-medium text-xs">Buy me a coffee</span>
                      </button>

                      <a
                        href="https://www.producthunt.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                      >
                        <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
                        <span className="font-medium text-xs">Product Hunt</span>
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/80 dark:border-slate-800/80" />

                  {/* INFORMATION SECTION */}
                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveModal("about");
                      }}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                    >
                      <Info className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-medium text-xs">About</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveModal("privacy");
                      }}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                    >
                      <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-medium text-xs">Privacy Policy</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-1" />

                  {/* FOOTER */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono px-1">
                    <span>DevStudio</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-700 dark:text-slate-300">v1.10.0</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Offline Toast Banner */}
      {isOfflineToastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-xs">Offline Mode Confirmed</h4>
            <p className="text-[11px] text-emerald-200 mt-0.5">
              All 13 developer utilities run 100% locally in your browser. No data ever leaves your device.
            </p>
          </div>
          <button
            onClick={() => setIsOfflineToastVisible(false)}
            className="p-1 hover:bg-emerald-800 rounded-lg text-emerald-300 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Send Feedback Modal */}
      {activeModal === "feedback" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-bold text-base">Send Feedback</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedbackSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg">Thank You!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your feedback has been received.</p>
              </div>
            ) : (
              <form onSubmit={submitFeedback} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "feature", label: "Feature" },
                      { id: "bug", label: "Bug Report" },
                      { id: "other", label: "Other" },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setFeedbackCategory(cat.id)}
                        className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                          feedbackCategory === cat.id
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Your Thoughts or Suggestions
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what new tools you'd like or any issues you encountered..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Buy Me a Coffee Modal */}
      {activeModal === "coffee" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h3 className="font-bold text-base">Buy Me a Coffee</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {coffeeThankYou ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-500 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 fill-amber-500 dark:fill-amber-400" />
                </div>
                <h4 className="font-bold text-lg">You're Awesome!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Thanks for supporting zero-latency developer utilities.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  DevStudio is a free, privacy-first utility toolkit built for developers. If it saved you time today, consider buying a cup of coffee!
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCoffeeAmount(amt)}
                      className={`py-3 rounded-2xl border text-center transition-all ${
                        coffeeAmount === amt
                          ? "bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 font-bold"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-lg block">☕</span>
                      <span className="text-xs font-semibold">${amt}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCoffeeDonate}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-slate-950" />
                  <span>Support with ${coffeeAmount}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* About Modal */}
      {activeModal === "about" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-bold text-base">About DevStudio</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>DevStudio v1.10.0</strong> is a suite of high-performance developer utilities designed for instant client-side execution.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>100% Local Browser Execution</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Zero Network Overhead / Low Latency</span>
                </div>
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Dark & Light Themes Supported</span>
                </div>
              </div>
              <p className="text-slate-400 text-[11px]">
                Built with React, TypeScript, and Tailwind CSS.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <h3 className="font-bold text-base">Privacy Policy</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-white">Your Data Never Leaves Your Computer</p>
              <p>
                All formatting, encoding, parsing, regular expression testing, cryptographic hashing, and time conversions occur completely inside your local web browser session.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>No server-side logging of input text or keys</li>
                <li>No third-party tracking scripts or cookies</li>
                <li>Favorites saved in local browser storage only</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

