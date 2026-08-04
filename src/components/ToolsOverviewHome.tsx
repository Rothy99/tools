import React, { useState, useMemo } from "react";
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
} from "lucide-react";

interface ToolsOverviewHomeProps {
  tools: ToolDefinition[];
  favorites: string[];
  onSelectTool: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileCode: <FileCode className="w-6 h-6" />,
  GitCompare: <GitCompare className="w-6 h-6" />,
  FileDiff: <FileDiff className="w-6 h-6" />,
  Binary: <Binary className="w-6 h-6" />,
  KeyRound: <KeyRound className="w-6 h-6" />,
  Regex: <Regex className="w-6 h-6" />,
  Link: <Link className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Key: <Key className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
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

  // Filter tools based on search and category
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

  const popularTools = useMemo(() => {
    return tools.filter((t) => t.isPopular);
  }, [tools]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Clean Top Search Bar */}
      <div className="p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, description, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* 👉 INJECT ADSENSE SLOT HERE (Between Search and Category Pills) */}
        <div
          id="adsense-upper-leaderboard"
          className="w-full min-h-[90px] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col items-center justify-center p-3 text-center text-slate-400 dark:text-slate-500 text-xs font-mono transition-all relative overflow-hidden"
          title="Google AdSense Auto-Ads Leaderboard Reserved Slot (min-height: 90px)"
        >
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              AdSense Auto-Ads Placement
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400">Leaderboard Slot (728x90 / Responsive)</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 max-w-lg leading-tight">
            Reserved 90px container to prevent layout shifts when Google Auto-Ads loads leaderboard banners.
          </p>
        </div>

        {/* Category Filter Pills & Favorites Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id && !showOnlyFavs;
              const catTheme = cat.id !== "all" ? CATEGORY_THEMES[cat.id as keyof typeof CATEGORY_THEMES] : null;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowOnlyFavs(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? catTheme
                        ? `${catTheme.pillActive}`
                        : "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowOnlyFavs(!showOnlyFavs)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showOnlyFavs
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              }`}
              title="Favorites are saved locally in your browser cache"
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavs ? "fill-amber-400 text-amber-400" : ""}`} />
              <span>Favorites ({favorites.length})</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-normal">
                Cached
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Showcase Section (If favorites exist and not searching) */}
      {!searchQuery && selectedCategory === "all" && !showOnlyFavs && favoriteTools.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Your Favorite Shortcuts ({favoriteTools.length})</span>
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.flatMap((tool, index) => {
              const elements = [
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFav={favorites.includes(tool.id)}
                  onSelectTool={onSelectTool}
                  onToggleFavorite={onToggleFavorite}
                />,
              ];

              // 👉 INJECT NATIVE IN-FEED AD as Card 3 (index 1 -> inserted before index 2)
              if (index === 1 && filteredTools.length >= 2) {
                elements.push(<NativeInFeedAdCard key="native-ad-card-slot" />);
              }

              return elements;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* Subcomponent: Native In-Feed Ad Card Slot */
const NativeInFeedAdCard: React.FC = () => {
  return (
    <div
      id="adsense-native-in-feed-card"
      className="group relative flex flex-col justify-between p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-dashed border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl min-h-[200px] shadow-2xs"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold text-xs uppercase tracking-wider">
            Ad
          </div>
          <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700">
            Sponsored
          </span>
        </div>

        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-1.5">
          <span>AdSense Native In-Feed Unit</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Matches grid card widths and alignments perfectly. Google AdSense automatically populates this slot.
        </p>

        <div className="mt-3 space-y-1.5">
          <div className="h-2.5 bg-slate-200/60 dark:bg-slate-800 rounded-md w-4/5 animate-pulse" />
          <div className="h-2.5 bg-slate-200/40 dark:bg-slate-800/60 rounded-md w-3/5 animate-pulse" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
        <span>Google Native Ad Container</span>
        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-500 font-semibold">
          In-Feed Ready
        </span>
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
      className={`group relative flex flex-col justify-between p-5 bg-white/70 dark:bg-slate-900/60 hover:bg-white/85 dark:hover:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 ${theme.cardBorderHover} rounded-2xl cursor-pointer transition-all duration-200 shadow-xs hover:shadow-lg ${theme.cardShadowHover}`}
    >
      <div>
        {/* Card Header: Icon + Category Badge + Favorite Star */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`p-2.5 rounded-xl ${theme.iconBg} transition-colors border border-slate-200/50 dark:border-slate-800 shadow-2xs`}>
            {ICON_MAP[tool.icon] || <FileCode className="w-6 h-6" />}
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
              className={`p-1.5 rounded-lg border transition-all ${
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
        <span>Open Tool</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
