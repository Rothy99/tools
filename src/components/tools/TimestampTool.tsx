import React, { useState, useEffect } from "react";
import { Calendar, Clock, Copy, Check, RefreshCw } from "lucide-react";

export const TimestampTool: React.FC = () => {
  const [nowSec, setNowSec] = useState<number>(Math.floor(Date.now() / 1000));
  const [timestampInput, setTimestampInput] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 16));

  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // Convert timestampInput to Date
  let parsedDate: Date | null = null;
  const numericTs = Number(timestampInput.trim());
  if (!isNaN(numericTs) && numericTs > 0) {
    parsedDate = numericTs > 1e11 ? new Date(numericTs) : new Date(numericTs * 1000);
  }

  // Convert dateInput to Timestamp
  let convertedTsFromDate = "";
  if (dateInput) {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) {
      convertedTsFromDate = String(Math.floor(d.getTime() / 1000));
    }
  }

  return (
    <div className="space-y-4">
      {/* Live Clock Header */}
      <div className="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl border border-indigo-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
            Current Unix Epoch Time
          </span>
          <div className="font-mono text-2xl font-extrabold flex items-center gap-3">
            <Clock className="w-6 h-6 text-indigo-400 animate-pulse" />
            <span>{nowSec}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimestampInput(String(nowSec))}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs"
          >
            Use Current Time
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timestamp -> Date Converter */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" /> Unix Timestamp to Date
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Unix Epoch Timestamp (Seconds or Milliseconds)
            </label>
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g. 1785800000"
              className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden"
            />
          </div>

          {parsedDate ? (
            <div className="space-y-2 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">ISO 8601 Standard</span>
                <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">
                  {parsedDate.toISOString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Local Date & Time</span>
                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  {parsedDate.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-rose-500 py-4 font-mono">⚠️ Invalid Timestamp value</div>
          )}
        </div>

        {/* Date -> Timestamp Converter */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> Date Picker to Unix Timestamp
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Select Calendar Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden"
            />
          </div>

          {convertedTsFromDate ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Unix Timestamp (Seconds)</span>
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {convertedTsFromDate}
                </span>
              </div>

              <button
                onClick={() => handleCopy(convertedTsFromDate, "ts")}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {copied === "ts" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === "ts" ? "Copied" : "Copy"}</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-rose-500 py-4 font-mono">Select a valid date</div>
          )}
        </div>
      </div>
    </div>
  );
};
