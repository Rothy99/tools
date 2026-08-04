import React, { useState, useMemo } from "react";
import { testRegex } from "../../utils/codeUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { Regex, Check, Copy, AlertCircle } from "lucide-react";

export const RegexTool: React.FC = () => {
  const [pattern, setPattern] = useState<string>(SAMPLE_PRESETS.regexSamplePattern);
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [targetText, setTargetText] = useState<string>(SAMPLE_PRESETS.regexSampleText);
  const [copied, setCopied] = useState<boolean>(false);

  const flagString = useMemo(() => {
    let f = "";
    if (flags.g) f += "g";
    if (flags.i) f += "i";
    if (flags.m) f += "m";
    if (flags.s) f += "s";
    return f;
  }, [flags]);

  const { matches, error } = useMemo(() => {
    return testRegex(pattern, flagString, targetText);
  }, [pattern, flagString, targetText]);

  const toggleFlag = (flag: "g" | "i" | "m" | "s") => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleCopyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${flagString}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Pattern Input & Flags Header */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Regex className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Regex Pattern Tester
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPattern}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Pattern"}</span>
            </button>
          </div>
        </div>

        {/* Expression Input Bar */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-slate-400">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Type regex pattern (e.g. \b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)..."
            className="flex-1 px-3 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <span className="font-mono text-sm font-bold text-slate-400">/{flagString}</span>

          {/* Flag Switches */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(["g", "i", "m", "s"] as const).map((flag) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                  flags[flag]
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title={`Toggle flag: ${flag}`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-mono border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Regex Error: {error}</span>
          </div>
        )}
      </div>

      {/* Target Text & Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Target Text Panel */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Test Text Input</span>
            <button
              onClick={() => {
                setPattern(SAMPLE_PRESETS.regexSamplePattern);
                setTargetText(SAMPLE_PRESETS.regexSampleText);
              }}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset Email Sample
            </button>
          </div>
          <textarea
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            rows={12}
            placeholder="Paste target text to test regex matching..."
            className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none leading-relaxed"
          />
        </div>

        {/* Captured Matches List */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Matched Results ({matches.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">
              {matches.length} matches found
            </span>
          </div>

          <div className="p-4 space-y-2 overflow-y-auto max-h-[380px]">
            {matches.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                No matches found for current pattern.
              </div>
            ) : (
              matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      Match #{idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Index: {m.index}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-semibold break-all border border-emerald-200 dark:border-emerald-800">
                    "{m.match}"
                  </div>

                  {m.groups.length > 0 && (
                    <div className="text-[11px] text-slate-500 font-mono space-y-0.5 pt-1">
                      <span className="font-semibold block text-slate-400">Capturing Groups:</span>
                      {m.groups.map((grp, gIdx) => (
                        <div key={gIdx} className="pl-2">
                          Group ${gIdx + 1}: <span className="text-slate-800 dark:text-slate-200 font-medium">{grp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
