import React, { useState, useMemo } from "react";
import { formatSql } from "../../utils/codeUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { Database, Copy, Check, Trash2 } from "lucide-react";

export const SqlFormatterTool: React.FC = () => {
  const [sqlInput, setSqlInput] = useState<string>(SAMPLE_PRESETS.sqlSample);
  const [copied, setCopied] = useState<boolean>(false);

  const formattedSql = useMemo(() => {
    return formatSql(sqlInput);
  }, [sqlInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            SQL Formatter & Beautifier
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSqlInput(SAMPLE_PRESETS.sqlSample)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            Load Sample Query
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Formatted SQL"}</span>
          </button>
        </div>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Raw Query */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Raw Unformatted SQL Input
          </div>
          <textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            rows={14}
            placeholder="Paste messy SQL query here..."
            className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none leading-relaxed"
          />
        </div>

        {/* Formatted Output */}
        <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xs">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-300">
            Prettified SQL Output
          </div>
          <pre className="p-4 font-mono text-xs text-indigo-300 overflow-auto max-h-[360px] leading-relaxed whitespace-pre-wrap">
            {formattedSql}
          </pre>
        </div>
      </div>
    </div>
  );
};
