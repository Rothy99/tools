import React, { useState } from "react";
import { formatSql } from "../../utils/codeUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { Database, Copy, Check, Trash2, Sparkles } from "lucide-react";

export const SqlFormatterTool: React.FC = () => {
  const [sqlInput, setSqlInput] = useSessionStorageString("devstudio_sql_input", SAMPLE_PRESETS.sqlSample);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFormat = () => {
    if (!sqlInput.trim()) return;
    setSqlInput(formatSql(sqlInput));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            SQL Formatter & Beautifier
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleFormat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Format SQL</span>
          </button>
          <button
            onClick={() => setSqlInput(SAMPLE_PRESETS.sqlSample)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            Load Sample Query
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy SQL"}</span>
          </button>
          <button
            onClick={() => setSqlInput("")}
            className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Single Input Editor */}
      <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between items-center">
          <span>SQL Query Workspace</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy SQL"}</span>
            </button>
            <span className="text-slate-400 font-normal text-[11px]">{sqlInput.length} chars</span>
          </div>
        </div>
        <textarea
          value={sqlInput}
          onChange={(e) => setSqlInput(e.target.value)}
          rows={42}
          placeholder="Paste or type your SQL query here..."
          className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none leading-relaxed min-h-[780px]"
        />
      </div>
    </div>
  );
};
