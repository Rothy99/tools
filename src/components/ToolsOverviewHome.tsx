import React, { useState, useMemo, useEffect, useRef } from "react";
import { ToolDefinition } from "../types";
import { getToolTheme, CATEGORY_THEMES } from "../utils/colorUtils";
import {
  FileCode,
  GitCompare,
  FileDiff,
  Binary,
  KeyRound,
  Regex,
  Link,
  ShieldCheck,
  Key,
  Palette,
  Clock,
  Database,
  Calendar,
  Star,
  ArrowRight,
  Search,
  Grid,
  Command,
  X,
  Sparkles,
} from "lucide-react";

interface ToolsOverviewHomeProps {
  tools: ToolDefinition[];
  favorites: string[];
  onSelectTool: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileCode: <FileCode className="w-11 h-11" />,
  GitCompare: <GitCompare className="w-11 h-11" />,
  FileDiff: <FileDiff className="w-11 h-11" />,
  Binary: <Binary className="w-11 h-11" />,
  KeyRound: <KeyRound className="w-11 h-11" />,
  Regex: <Regex className="w-11 h-11" />,
  Link: <Link className="w-11 h-11" />,
  ShieldCheck: <ShieldCheck className="w-11 h-11" />,
  Key: <Key className="w-11 h-11" />,
  Palette: <Palette className="w-11 h-11" />,
  Clock: <Clock className="w-11 h-11" />,
  Database: <Database className="w-11 h-11" />,
  Calendar: <Calendar className="w-11 h-11" />,
};

const CATEGORIES = [
  { id: "all", name: "All Tools" },
  { id: "json", name: "JSON & Data" },
  { id: "security", name: "Security & Auth" },
  { id: "code", name: "Code & Text" },
  { id: "encoding", name: "Encoders & Web" },
  { id: "time", name: "Time & Date" },
  { id: "colors", name: "Design & Color" },
];

export const ToolsOverviewHome: React.FC<ToolsOverviewHomeProps> = ({
  tools,
  favorites,
  onSelectTool,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard listener for `/` or `Cmd+K` to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length };
    tools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [tools]);

  // Filter tools based on search, category, and favorites
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      const matchesFav = !showOnlyFavs || favorites.includes(tool.id);

      return matchesSearch && matchesCategory && matchesFav;
    });
  }, [tools, searchQuery, selectedCategory, showOnlyFavs, favorites]);

  const favoriteTools = useMemo(() => {
    return tools.filter((t) => favorites.includes(t.id));
  }, [tools, favorites]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Search & Filtering Control Panel */}
      <div className="p-4 sm:p-5 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
        {/* Search Input Box with Keyboard Shortcut Indicator */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, description, or keyword (e.g. json, jwt, sql, uuid)..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all shadow-2xs"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600/80 rounded-md shadow-2xs">
                <Command className="w-2.5 h-2.5" /> /
              </kbd>
            )}
          </div>
        </div>

        {/* Category Filter Pills & Favorites Toggle */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Category Track with Scroll Fade Mask */}
          <div className="relative flex-1 min-w-0 flex items-center">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-0.5 pr-6 scroll-smooth">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id && !showOnlyFavs;
                const catTheme = cat.id !== "all" ? CATEGORY_THEMES[cat.id as keyof typeof CATEGORY_THEMES] : null;
                const count = categoryCounts[cat.id] || 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowOnlyFavs(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? catTheme
                          ? `${catTheme.pillActive} shadow-xs`
                          : "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {catTheme && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? "bg-white" : catTheme.dotColor
                        }`}
                      />
                    )}
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Gradient Overlay for Edge Scroll Smoothness */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 dark:from-slate-900/80 to-transparent pointer-events-none" />
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200/80 dark:bg-slate-800 shrink-0 hidden sm:block" />

          {/* Favorites Filter Button */}
          <div className="shrink-0">
            <button
              onClick={() => setShowOnlyFavs(!showOnlyFavs)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                showOnlyFavs
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                  : "bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700"
              }`}
              title="Filter by favorited tools"
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavs ? "fill-amber-400 text-amber-400" : ""}`} />
              <span className="hidden xs:inline">Favorites</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                showOnlyFavs
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-300"
                  : "bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}>
                {favorites.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Showcase Section (If favorites exist and no active query) */}
      {!searchQuery && selectedCategory === "all" && !showOnlyFavs && favoriteTools.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Your Bookmarked Shortcuts ({favoriteTools.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={`fav-${tool.id}`}
                tool={tool}
                isFav={true}
                onSelectTool={onSelectTool}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Tools Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Grid className="w-4 h-4 text-indigo-500" />
            <span>
              {showOnlyFavs
                ? "Favorite Tools"
                : selectedCategory !== "all"
                ? `${CATEGORIES.find((c) => c.id === selectedCategory)?.name}`
                : "All Developer Tools"}
            </span>
            <span className="text-xs font-normal text-slate-400">
              ({filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"})
            </span>
          </h2>
        </div>

        {filteredTools.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching tools found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms or selecting a different category filter above.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setShowOnlyFavs(false);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFav={favorites.includes(tool.id)}
                onSelectTool={onSelectTool}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* Subcomponent: Single Tool Card */
interface ToolCardProps {
  tool: ToolDefinition;
  isFav: boolean;
  onSelectTool: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFav,
  onSelectTool,
  onToggleFavorite,
}) => {
  const theme = getToolTheme(tool.id, tool.category);

  return (
    <div
      onClick={() => onSelectTool(tool.id)}
      className={`group relative flex flex-col justify-between p-5 bg-white/80 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 ${theme.cardBorderHover} rounded-2xl cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-lg ${theme.cardShadowHover}`}
    >
      <div>
        {/* Card Header: Icon + Category Badge + Favorite Star */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`p-3.5 rounded-2xl ${theme.iconBg} transition-colors border border-slate-200/50 dark:border-slate-800 shadow-2xs`}>
            {ICON_MAP[tool.icon] || <FileCode className="w-11 h-11" />}
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge ? (
              <span className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-md ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                {tool.badge}
              </span>
            ) : (
              <span className={`text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider rounded-md ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} opacity-80`}>
                {tool.category}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => onToggleFavorite(tool.id, e)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isFav
                  ? "bg-amber-50 dark:bg-amber-950/80 text-amber-500 border-amber-200 dark:border-amber-800"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-700 hover:text-amber-400"
              }`}
              title={isFav ? "Saved in favorites" : "Add to favorites"}
            >
              <Star className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className={`font-bold text-base text-slate-900 dark:text-white group-hover:${theme.textAccent} transition-colors tracking-tight`}>
          {tool.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
          {tool.description}
        </p>

        {/* Keywords / Capability Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {tool.keywords.slice(0, 3).map((keyword, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
            >
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Launch Tool CTA */}
      <div className={`mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold ${theme.textAccent} group-hover:translate-x-0.5 transition-transform`}>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" /> Open Tool
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

