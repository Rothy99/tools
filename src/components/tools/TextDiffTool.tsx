import React, { useState, useMemo } from "react";
import { computeTextDiffLines } from "../../utils/diffUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { FileDiff, Copy, Check, RotateCcw } from "lucide-react";

export const TextDiffTool: React.FC = () => {
  const [textA, setTextA] = useState<string>(SAMPLE_PRESETS.textDiffA);
  const [textB, setTextB] = useState<string>(SAMPLE_PRESETS.textDiffB);
  const [copied, setCopied] = useState<boolean>(false);

  const diffLines = useMemo(() => {
    return computeTextDiffLines(textA, textB);
  }, [textA, textB]);

  const handleCopy = () => {
    navigator.clipboard.writeText(textB);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <FileDiff className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Text & Code Diff Inspector
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTextA(SAMPLE_PRESETS.textDiffA);
              setTextB(SAMPLE_PRESETS.textDiffB);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample Code</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied B" : "Copy Target Text"}</span>
          </button>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Original Version (Text A)
          </div>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Paste original text snippet..."
            className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none leading-relaxed h-[260px]"
          />
        </div>

        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Modified Version (Text B)
          </div>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Paste modified text snippet..."
            className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none leading-relaxed h-[260px]"
          />
        </div>
      </div>

      {/* Render Diff Output */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xs">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Unified Code Diff Result</span>
          <span className="text-[11px] text-slate-400 font-normal">
            {diffLines.length} lines total
          </span>
        </div>

        <div className="p-4 font-mono text-xs overflow-x-auto max-h-[450px]">
          {diffLines.map((line, idx) => {
            const isAdded = line.type === "added";
            const isRemoved = line.type === "removed";
            const isModified = line.type === "modified";

            const bgColor = isAdded
              ? "bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500"
              : isRemoved
              ? "bg-rose-950/40 text-rose-300 border-l-2 border-rose-500"
              : isModified
              ? "bg-amber-950/40 text-amber-300 border-l-2 border-amber-500"
              : "text-slate-300";

            const symbol = isAdded ? "+" : isRemoved ? "-" : isModified ? "~" : " ";

            return (
              <div
                key={idx}
                className={`flex items-start px-2 py-0.5 whitespace-pre ${bgColor}`}
              >
                <span className="w-10 text-right pr-3 text-slate-600 select-none text-[11px]">
                  {line.lineNumberA || " "}
                </span>
                <span className="w-10 text-right pr-3 text-slate-600 select-none text-[11px]">
                  {line.lineNumberB || " "}
                </span>
                <span className="w-6 font-bold select-none">{symbol}</span>
                <span className="flex-1">{line.contentB ?? line.contentA}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
