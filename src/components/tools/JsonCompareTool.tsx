import React, { useState, useMemo } from "react";
import { compareJsonObjects } from "../../utils/diffUtils";
import { parseJsonSafe } from "../../utils/jsonUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { JsonDiffResult } from "../../types";
import {
  GitCompare,
  ArrowRightLeft,
  Filter,
  Check,
  Copy,
  PlusCircle,
  MinusCircle,
  Edit3,
} from "lucide-react";

export const JsonCompareTool: React.FC = () => {
  const [jsonA, setJsonA] = useSessionStorageString("devstudio_json_compare_a", SAMPLE_PRESETS.jsonCompareA);
  const [jsonB, setJsonB] = useSessionStorageString("devstudio_json_compare_b", SAMPLE_PRESETS.jsonCompareB);
  const [filterType, setFilterType] = useState<string>("diffs");
  const [copied, setCopied] = useState<boolean>(false);

  const parsedA = useMemo(() => parseJsonSafe(jsonA), [jsonA]);
  const parsedB = useMemo(() => parseJsonSafe(jsonB), [jsonB]);

  const diffs = useMemo(() => {
    if (parsedA.error || parsedB.error || !parsedA.data || !parsedB.data) return [];
    return compareJsonObjects(parsedA.data, parsedB.data);
  }, [parsedA, parsedB]);

  const filteredDiffs = useMemo(() => {
    if (filterType === "all") return diffs;
    if (filterType === "diffs") return diffs.filter((d) => d.type !== "unchanged");
    return diffs.filter((d) => d.type === filterType);
  }, [diffs, filterType]);

  const stats = useMemo(() => {
    const added = diffs.filter((d) => d.type === "added").length;
    const removed = diffs.filter((d) => d.type === "removed").length;
    const modified = diffs.filter((d) => d.type === "modified").length;
    const unchanged = diffs.filter((d) => d.type === "unchanged").length;
    return { added, removed, modified, unchanged, totalDiffs: added + removed + modified };
  }, [diffs]);

  const handleSwap = () => {
    const temp = jsonA;
    setJsonA(jsonB);
    setJsonB(temp);
  };

  const handleCopyDiffSummary = () => {
    const summary = diffs
      .filter((d) => d.type !== "unchanged")
      .map(
        (d) =>
          `[${d.type.toUpperCase()}] ${d.path}: ${
            d.oldValue !== undefined ? JSON.stringify(d.oldValue) : ""
          } -> ${d.newValue !== undefined ? JSON.stringify(d.newValue) : ""}`
      )
      .join("\n");

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Stats Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
            <PlusCircle className="w-3.5 h-3.5" /> +{stats.added} Added
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
            <MinusCircle className="w-3.5 h-3.5" /> -{stats.removed} Removed
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
            <Edit3 className="w-3.5 h-3.5" /> ~{stats.modified} Modified
          </span>
        </div>

        {/* Filter & Swap Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { id: "diffs", label: "Only Changes" },
              { id: "all", label: "All Keys" },
              { id: "added", label: "Added" },
              { id: "removed", label: "Removed" },
              { id: "modified", label: "Modified" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  filterType === f.id
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSwap}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="Swap A and B"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap A/B</span>
          </button>

          <button
            onClick={handleCopyDiffSummary}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Diff" : "Copy Diff Summary"}</span>
          </button>
        </div>
      </div>

      {/* Inputs Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel A */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>JSON Object A (Original)</span>
            <button
              onClick={() => setJsonA(SAMPLE_PRESETS.jsonCompareA)}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset Sample A
            </button>
          </div>
          <textarea
            value={jsonA}
            onChange={(e) => setJsonA(e.target.value)}
            rows={34}
            placeholder="Paste Original JSON A..."
            className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none min-h-[680px]"
          />
          {parsedA.error && (
            <div className="p-2.5 bg-red-50 text-red-600 text-xs border-t border-red-200 font-mono">
              Syntax Error in A: {parsedA.error}
            </div>
          )}
        </div>

        {/* Panel B */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>JSON Object B (New)</span>
            <button
              onClick={() => setJsonB(SAMPLE_PRESETS.jsonCompareB)}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset Sample B
            </button>
          </div>
          <textarea
            value={jsonB}
            onChange={(e) => setJsonB(e.target.value)}
            rows={34}
            placeholder="Paste New JSON B..."
            className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none min-h-[680px]"
          />
          {parsedB.error && (
            <div className="p-2.5 bg-red-50 text-red-600 text-xs border-t border-red-200 font-mono">
              Syntax Error in B: {parsedB.error}
            </div>
          )}
        </div>
      </div>

      {/* Visual Diff Results Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-500" /> Comparison Differences ({filteredDiffs.length})
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyDiffSummary}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> {copied ? "Copied Diff" : "Copy Differences"}
            </button>
            <span className="text-xs text-slate-400">
              {stats.totalDiffs === 0 ? "Both JSON objects are identical!" : `${stats.totalDiffs} total changes found`}
            </span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto">
          {parsedA.error || parsedB.error ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Please resolve syntax errors in JSON inputs to view differences.
            </div>
          ) : filteredDiffs.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✨ No differences matching filter. Objects are matching!
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDiffs.map((diff, i) => {
                const badgeColor =
                  diff.type === "added"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : diff.type === "removed"
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                    : diff.type === "modified"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";

                return (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs font-mono gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${badgeColor}`}>
                        {diff.type}
                      </span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {diff.path}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 overflow-x-auto">
                      {diff.oldValue !== undefined && (
                        <div className="line-through text-rose-500/80 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                          {JSON.stringify(diff.oldValue)}
                        </div>
                      )}
                      {diff.type === "modified" && <span className="text-slate-400">→</span>}
                      {diff.newValue !== undefined && (
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          {JSON.stringify(diff.newValue)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
