import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Copy,
  Trash2,
  Search,
  ArrowUp,
  ArrowDown,
  Sparkles,
  MessageSquarePlus,
  Star,
  Check,
  ChevronUp,
  ChevronDown,
  Wand2
} from "lucide-react";

interface QuickActionBarProps {
  activeToolId: string;
  onOpenSearch: () => void;
  onOpenFeedback: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({
  activeToolId,
  onOpenSearch,
  onOpenFeedback,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [clearedSuccess, setClearedSuccess] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Monitor scroll position to show/hide scroll to top/bottom
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2200);
  };

  const handleClear = () => {
    let handled = false;

    // 1. Dispatch custom event for tool-specific state handlers
    const event = new CustomEvent("app:quick-clear", {
      cancelable: true,
      detail: {
        setHandled: () => {
          handled = true;
        },
      },
    });
    window.dispatchEvent(event);

    // 2. Fallback if not handled by event listener: locate clear buttons or textareas
    if (!handled) {
      // Find buttons with 'Clear' or 'Trash' in text/title/aria-label
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("main button"));
      const clearBtn = buttons.find((btn) => {
        const text = (btn.textContent || "").toLowerCase();
        const title = (btn.getAttribute("title") || "").toLowerCase();
        return text.includes("clear") || title.includes("clear") || text.includes("reset") || title.includes("reset");
      });

      if (clearBtn) {
        clearBtn.click();
        handled = true;
      } else {
        // Fallback: clear all editable textareas in main
        const textareas = document.querySelectorAll<HTMLTextAreaElement>("main textarea");
        if (textareas.length > 0) {
          textareas.forEach((ta) => {
            ta.value = "";
            ta.dispatchEvent(new Event("input", { bubbles: true }));
          });
          handled = true;
        }
      }
    }

    setClearedSuccess(true);
    setTimeout(() => setClearedSuccess(false), 1500);
    triggerToast("Input cleared!");
  };

  const handleCopy = () => {
    let copiedText = "";

    // 1. Dispatch custom event for tool-specific copy handlers
    const event = new CustomEvent("app:quick-copy", {
      detail: {
        setText: (text: string) => {
          copiedText = text;
        },
      },
    });
    window.dispatchEvent(event);

    // 2. Fallback if not handled by listener
    if (!copiedText) {
      // Look for copy target elements or copy buttons in main
      const copyBtn = Array.from(document.querySelectorAll<HTMLButtonElement>("main button")).find((btn) => {
        const title = (btn.getAttribute("title") || "").toLowerCase();
        const text = (btn.textContent || "").toLowerCase();
        return (
          title.includes("copy output") ||
          title.includes("copy result") ||
          title.includes("copy formatted") ||
          (text.includes("copy") && !text.includes("link"))
        );
      });

      if (copyBtn) {
        copyBtn.click();
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 1500);
        triggerToast("Result copied to clipboard!");
        return;
      }

      // Try finding <pre> or output code block or output textarea
      const outputElem =
        document.querySelector("main [data-output]") ||
        document.querySelector("main pre code") ||
        document.querySelector("main pre") ||
        Array.from(document.querySelectorAll("main textarea")).pop();

      if (outputElem) {
        copiedText = outputElem.textContent || (outputElem as HTMLTextAreaElement).value || "";
      }
    }

    if (copiedText && copiedText.trim()) {
      navigator.clipboard.writeText(copiedText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 1500);
      triggerToast("Result copied to clipboard!");
      if (typeof (window as any).triggerToolSuccess === "function") {
        (window as any).triggerToolSuccess();
      }
    } else {
      triggerToast("No output result found to copy");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const isToolActive = activeToolId !== "home" && activeToolId !== "privacy" && activeToolId !== "terms" && activeToolId !== "contact";

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
      {/* Toast Notification Floating Above Bar */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto mb-2 px-3.5 py-2 rounded-xl bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 text-xs font-semibold shadow-xl backdrop-blur-md border border-slate-700/50 dark:border-slate-200/50 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600 shrink-0 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Bar Pill */}
      <motion.div
        layout
        className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-slate-900/10 dark:shadow-black/30 rounded-2xl p-1.5 flex items-center gap-1.5 transition-all"
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title={isExpanded ? "Collapse Quick Actions" : "Expand Quick Actions Bar"}
        >
          <Wand2 className={`w-4 h-4 text-indigo-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
        </button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1.5 overflow-hidden"
          >
            {/* Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Quick Actions (Copy & Clear) - Enabled when inside a tool */}
            {isToolActive && (
              <>
                <button
                  onClick={handleCopy}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedSuccess
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                  title="Copy tool output to clipboard"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-indigo-500" />}
                  <span className="hidden sm:inline">{copiedSuccess ? "Copied" : "Copy Output"}</span>
                </button>

                <button
                  onClick={handleClear}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    clearedSuccess
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                  title="Clear tool input"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline">Clear Input</span>
                </button>

                {onToggleFavorite && (
                  <button
                    onClick={onToggleFavorite}
                    className={`p-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isFavorite
                        ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                        : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200"
                    }`}
                    title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-amber-400 text-amber-500" : "text-slate-400"}`} />
                  </button>
                )}

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
              </>
            )}

            {/* Global Actions: Quick Search, Feedback, Scroll Top/Bottom */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              title="Quick Search Tools (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-indigo-500" />
            </button>

            <button
              onClick={onOpenFeedback}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              title="Feedback / Report Issue"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-sky-500" />
            </button>

            {showScrollTop ? (
              <button
                onClick={scrollToTop}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                title="Scroll to Top"
              >
                <ArrowUp className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>
            ) : (
              <button
                onClick={scrollToBottom}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                title="Scroll to Bottom"
              >
                <ArrowDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
