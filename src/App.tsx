import React, { useState, useEffect, useMemo } from "react";
import { Header } from "./components/Header";
import { QuickSearchModal } from "./components/QuickSearchModal";
import { ToolsOverviewHome } from "./components/ToolsOverviewHome";
import { ToolExplanationSection } from "./components/ToolExplanationSection";
import { Footer } from "./components/Footer";
import { MetaHead } from "./components/MetaHead";
import { PrivacyPage } from "./components/Pages/PrivacyPage";
import { TermsPage } from "./components/Pages/TermsPage";
import { ContactPage } from "./components/Pages/ContactPage";
import { TOOLS } from "./data/tools";
import { getToolTheme } from "./utils/colorUtils";
import { ArrowLeft, ChevronDown, MessageSquarePlus } from "lucide-react";
import { FeedbackModal } from "./components/FeedbackModal";

// Tools Imports
import { JsonFormatterTool } from "./components/tools/JsonFormatterTool";
import { JsonCompareTool } from "./components/tools/JsonCompareTool";
import { TextDiffTool } from "./components/tools/TextDiffTool";
import { Base64Tool } from "./components/tools/Base64Tool";
import { JwtTool } from "./components/tools/JwtTool";
import { RegexTool } from "./components/tools/RegexTool";
import { UrlTool } from "./components/tools/UrlTool";
import { HashTool } from "./components/tools/HashTool";
import { UuidPasswordTool } from "./components/tools/UuidPasswordTool";
import { ColorTool } from "./components/tools/ColorTool";
import { CronTool } from "./components/tools/CronTool";
import { SqlFormatterTool } from "./components/tools/SqlFormatterTool";
import { TimestampTool } from "./components/tools/TimestampTool";

export default function App() {
  const getRouteFromPath = (): string => {
    try {
      const path = window.location.pathname;
      if (path === "/privacy") return "privacy";
      if (path === "/terms") return "terms";
      if (path === "/contact") return "contact";
      if (path.startsWith("/tools/")) {
        const toolId = path.replace("/tools/", "");
        if (TOOLS.some((t) => t.id === toolId)) {
          return toolId;
        }
      }
    } catch {
      // Fallback
    }
    return "home";
  };

  const [activeToolId, setActiveToolId] = useState<string>(getRouteFromPath);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("devstudio_favs");
      return saved ? JSON.parse(saved) : ["json-formatter", "json-compare", "jwt-decoder"];
    } catch {
      return ["json-formatter", "json-compare", "jwt-decoder"];
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("devstudio_theme") === "dark";
    } catch {
      return true;
    }
  });

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("devstudio_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("devstudio_favs", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveToolId(getRouteFromPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (route: string) => {
    setActiveToolId(route);
    let newPath = "/";
    if (route === "privacy") newPath = "/privacy";
    else if (route === "terms") newPath = "/terms";
    else if (route === "contact") newPath = "/contact";
    else if (route !== "home" && TOOLS.some((t) => t.id === route)) {
      newPath = `/tools/${route}`;
    }
    try {
      window.history.pushState(null, "", newPath);
    } catch {
      // Ignore if pushState blocked
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeToolDef = useMemo(() => {
    return TOOLS.find((t) => t.id === activeToolId);
  }, [activeToolId]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={`min-h-screen bg-grid-pattern text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 overflow-x-clip relative`}>
      {/* Animated Ambient Glow Orbs in Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl animate-orb-1" />
        <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-cyan-400/15 dark:bg-cyan-500/15 rounded-full blur-3xl animate-orb-2" />
        <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] bg-violet-500/15 dark:bg-purple-600/15 rounded-full blur-3xl animate-orb-3" />
      </div>

      {/* Dynamic SEO Meta Head Injection */}
      <MetaHead activeRoute={activeToolId} />

      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        favoriteCount={favorites.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onGoHome={() => navigateTo("home")}
      />

      {/* Main Full-Width Content Container */}
      <main className="flex-1 max-w-[1530px] w-full mx-auto p-3 sm:p-4 lg:p-6 relative z-10">
        {activeToolId === "privacy" ? (
          <PrivacyPage onGoHome={() => navigateTo("home")} />
        ) : activeToolId === "terms" ? (
          <TermsPage onGoHome={() => navigateTo("home")} />
        ) : activeToolId === "contact" ? (
          <ContactPage onGoHome={() => navigateTo("home")} />
        ) : activeToolId === "home" || !activeToolDef ? (
          /* Home Screen: List All Tools */
          <ToolsOverviewHome
            tools={TOOLS}
            favorites={favorites}
            onSelectTool={(id) => navigateTo(id)}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          /* Individual Tool Landing Page & Workspace */
          <div className="space-y-4">
            {/* Active Tool Header Banner */}
            <div className="p-3.5 sm:p-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateTo("home")}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                  title="Return to Home Screen Directory"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span>All Tools</span>
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                      {activeToolDef.name}
                    </h1>
                    {(() => {
                      const activeTheme = getToolTheme(activeToolDef.id, activeToolDef.category);
                      return (
                        <>
                          <span className={`text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider rounded-md ${activeTheme.badgeBg} ${activeTheme.badgeText} border ${activeTheme.badgeBorder}`}>
                            {activeToolDef.category}
                          </span>
                          {activeToolDef.badge && (
                            <span className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-md ${activeTheme.badgeBg} ${activeTheme.badgeText} border ${activeTheme.badgeBorder}`}>
                              {activeToolDef.badge}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeToolDef.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Quick Tool Switcher Dropdown */}
                <div className="relative">
                  <select
                    value={activeToolId}
                    onChange={(e) => navigateTo(e.target.value)}
                    className="appearance-none bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden cursor-pointer transition-all"
                  >
                    <option value="home">🏠 Return to Directory</option>
                    {TOOLS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Report Issue / Feedback Link */}
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Report an issue or suggest an improvement for this tool"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Report Issue / Feedback</span>
                  <span className="sm:hidden">Feedback</span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => toggleFavorite(activeToolId, e)}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    favorites.includes(activeToolId)
                      ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                      : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                  title={favorites.includes(activeToolId) ? "Saved locally in browser cache" : "Add to favorites (saved in browser cache)"}
                >
                  ★ {favorites.includes(activeToolId) ? "Saved" : "Favorite"}
                </button>
              </div>
            </div>

            {/* Active Tool Interactive Component Render */}
            <div className="transition-all duration-150">
              {activeToolId === "json-formatter" && <JsonFormatterTool />}
              {activeToolId === "json-compare" && <JsonCompareTool />}
              {activeToolId === "text-diff" && <TextDiffTool />}
              {activeToolId === "base64" && <Base64Tool />}
              {activeToolId === "jwt-decoder" && <JwtTool />}
              {activeToolId === "regex-tester" && <RegexTool />}
              {activeToolId === "url-encoder" && <UrlTool />}
              {activeToolId === "hash-generator" && <HashTool />}
              {activeToolId === "uuid-generator" && <UuidPasswordTool />}
              {activeToolId === "color-converter" && <ColorTool />}
              {activeToolId === "cron-parser" && <CronTool />}
              {activeToolId === "sql-formatter" && <SqlFormatterTool />}
              {activeToolId === "timestamp-converter" && <TimestampTool />}
            </div>

            {/* Inject Text Explanations Below the Tools (300-500 words guide) */}
            <ToolExplanationSection toolId={activeToolDef.id} />
          </div>
        )}
      </main>

      {/* Visible Footer Section (Privacy, Terms, Contact Us) */}
      <Footer onNavigate={navigateTo} />

      {/* Global Quick Search Modal (Cmd+K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tools={TOOLS}
        onSelectTool={(id) => navigateTo(id)}
      />

      {/* Feedback & Issue Reporting Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        toolName={activeToolDef?.name}
        toolId={activeToolDef?.id}
      />
    </div>
  );
}
