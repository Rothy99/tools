import { ToolCategory } from "../types";

export interface ToolTheme {
  accentColor: string;
  iconBg: string;
  iconText: string;
  cardBorderHover: string;
  cardShadowHover: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  pillActive: string;
  textAccent: string;
  dotColor: string;
  gradientFromTo: string;
}

export const CATEGORY_THEMES: Record<ToolCategory, ToolTheme> = {
  json: {
    accentColor: "sky",
    iconBg: "bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white",
    iconText: "text-sky-600 dark:text-sky-400",
    cardBorderHover: "hover:border-sky-500/50 dark:hover:border-sky-500/50",
    cardShadowHover: "hover:shadow-sky-500/10",
    badgeBg: "bg-sky-100 dark:bg-sky-950/80",
    badgeText: "text-sky-700 dark:text-sky-300",
    badgeBorder: "border-sky-200/80 dark:border-sky-800/80",
    pillActive: "bg-sky-600 text-white shadow-sky-600/20 shadow-xs",
    textAccent: "text-sky-600 dark:text-sky-400",
    dotColor: "bg-sky-500",
    gradientFromTo: "from-sky-500 to-blue-600",
  },
  encoding: {
    accentColor: "emerald",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
    iconText: "text-emerald-600 dark:text-emerald-400",
    cardBorderHover: "hover:border-emerald-500/50 dark:hover:border-emerald-500/50",
    cardShadowHover: "hover:shadow-emerald-500/10",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/80",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200/80 dark:border-emerald-800/80",
    pillActive: "bg-emerald-600 text-white shadow-emerald-600/20 shadow-xs",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
    gradientFromTo: "from-emerald-500 to-teal-600",
  },
  code: {
    accentColor: "amber",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white",
    iconText: "text-amber-600 dark:text-amber-400",
    cardBorderHover: "hover:border-amber-500/50 dark:hover:border-amber-500/50",
    cardShadowHover: "hover:shadow-amber-500/10",
    badgeBg: "bg-amber-100 dark:bg-amber-950/80",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200/80 dark:border-amber-800/80",
    pillActive: "bg-amber-600 text-white shadow-amber-600/20 shadow-xs",
    textAccent: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
    gradientFromTo: "from-amber-500 to-orange-600",
  },
  security: {
    accentColor: "rose",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white",
    iconText: "text-rose-600 dark:text-rose-400",
    cardBorderHover: "hover:border-rose-500/50 dark:hover:border-rose-500/50",
    cardShadowHover: "hover:shadow-rose-500/10",
    badgeBg: "bg-rose-100 dark:bg-rose-950/80",
    badgeText: "text-rose-700 dark:text-rose-300",
    badgeBorder: "border-rose-200/80 dark:border-rose-800/80",
    pillActive: "bg-rose-600 text-white shadow-rose-600/20 shadow-xs",
    textAccent: "text-rose-600 dark:text-rose-400",
    dotColor: "bg-rose-500",
    gradientFromTo: "from-rose-500 to-red-600",
  },
  time: {
    accentColor: "cyan",
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white",
    iconText: "text-cyan-600 dark:text-cyan-400",
    cardBorderHover: "hover:border-cyan-500/50 dark:hover:border-cyan-500/50",
    cardShadowHover: "hover:shadow-cyan-500/10",
    badgeBg: "bg-cyan-100 dark:bg-cyan-950/80",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    badgeBorder: "border-cyan-200/80 dark:border-cyan-800/80",
    pillActive: "bg-cyan-600 text-white shadow-cyan-600/20 shadow-xs",
    textAccent: "text-cyan-600 dark:text-cyan-400",
    dotColor: "bg-cyan-500",
    gradientFromTo: "from-cyan-500 to-blue-600",
  },
  colors: {
    accentColor: "fuchsia",
    iconBg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 group-hover:bg-fuchsia-600 group-hover:text-white",
    iconText: "text-fuchsia-600 dark:text-fuchsia-400",
    cardBorderHover: "hover:border-fuchsia-500/50 dark:hover:border-fuchsia-500/50",
    cardShadowHover: "hover:shadow-fuchsia-500/10",
    badgeBg: "bg-fuchsia-100 dark:bg-fuchsia-950/80",
    badgeText: "text-fuchsia-700 dark:text-fuchsia-300",
    badgeBorder: "border-fuchsia-200/80 dark:border-fuchsia-800/80",
    pillActive: "bg-fuchsia-600 text-white shadow-fuchsia-600/20 shadow-xs",
    textAccent: "text-fuchsia-600 dark:text-fuchsia-400",
    dotColor: "bg-fuchsia-500",
    gradientFromTo: "from-fuchsia-500 to-pink-600",
  },
};

export const TOOL_THEMES: Record<string, ToolTheme> = {
  "json-formatter": {
    ...CATEGORY_THEMES.json,
    accentColor: "sky",
    iconBg: "bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white",
    textAccent: "text-sky-600 dark:text-sky-400",
    cardBorderHover: "hover:border-sky-500/50",
  },
  "json-compare": {
    ...CATEGORY_THEMES.json,
    accentColor: "indigo",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white",
    textAccent: "text-indigo-600 dark:text-indigo-400",
    cardBorderHover: "hover:border-indigo-500/50",
  },
  "text-diff": {
    ...CATEGORY_THEMES.code,
    accentColor: "violet",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white",
    textAccent: "text-violet-600 dark:text-violet-400",
    cardBorderHover: "hover:border-violet-500/50",
  },
  "base64": {
    ...CATEGORY_THEMES.encoding,
    accentColor: "emerald",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    cardBorderHover: "hover:border-emerald-500/50",
  },
  "jwt-decoder": {
    ...CATEGORY_THEMES.security,
    accentColor: "rose",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white",
    textAccent: "text-rose-600 dark:text-rose-400",
    cardBorderHover: "hover:border-rose-500/50",
  },
  "regex-tester": {
    ...CATEGORY_THEMES.code,
    accentColor: "amber",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white",
    textAccent: "text-amber-600 dark:text-amber-400",
    cardBorderHover: "hover:border-amber-500/50",
  },
  "url-encoder": {
    ...CATEGORY_THEMES.encoding,
    accentColor: "teal",
    iconBg: "bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white",
    textAccent: "text-teal-600 dark:text-teal-400",
    cardBorderHover: "hover:border-teal-500/50",
  },
  "hash-generator": {
    ...CATEGORY_THEMES.security,
    accentColor: "red",
    iconBg: "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white",
    textAccent: "text-red-600 dark:text-red-400",
    cardBorderHover: "hover:border-red-500/50",
  },
  "uuid-generator": {
    ...CATEGORY_THEMES.security,
    accentColor: "orange",
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white",
    textAccent: "text-orange-600 dark:text-orange-400",
    cardBorderHover: "hover:border-orange-500/50",
  },
  "color-converter": {
    ...CATEGORY_THEMES.colors,
    accentColor: "fuchsia",
    iconBg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 group-hover:bg-fuchsia-600 group-hover:text-white",
    textAccent: "text-fuchsia-600 dark:text-fuchsia-400",
    cardBorderHover: "hover:border-fuchsia-500/50",
  },
  "cron-parser": {
    ...CATEGORY_THEMES.time,
    accentColor: "cyan",
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white",
    textAccent: "text-cyan-600 dark:text-cyan-400",
    cardBorderHover: "hover:border-cyan-500/50",
  },
  "sql-formatter": {
    ...CATEGORY_THEMES.code,
    accentColor: "blue",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white",
    textAccent: "text-blue-600 dark:text-blue-400",
    cardBorderHover: "hover:border-blue-500/50",
  },
  "timestamp-converter": {
    ...CATEGORY_THEMES.time,
    accentColor: "sky",
    iconBg: "bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white",
    textAccent: "text-sky-600 dark:text-sky-400",
    cardBorderHover: "hover:border-sky-500/50",
  },
};

export function getToolTheme(toolId: string, category: ToolCategory): ToolTheme {
  return TOOL_THEMES[toolId] || CATEGORY_THEMES[category] || CATEGORY_THEMES.json;
}
