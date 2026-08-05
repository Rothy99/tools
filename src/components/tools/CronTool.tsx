import React, { useState, useMemo } from "react";
import { parseCronExpression } from "../../utils/codeUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { Clock, Calendar, Check, Copy } from "lucide-react";
import { InfoTooltip } from "../common/Tooltip";

export const CronTool: React.FC = () => {
  const [cronInput, setCronInput] = useSessionStorageString("devstudio_cron_input", SAMPLE_PRESETS.cronSample);
  const [copied, setCopied] = useState<boolean>(false);

  const parsed = useMemo(() => {
    return parseCronExpression(cronInput);
  }, [cronInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cronInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: "Every 15 minutes", expr: "*/15 * * * *" },
    { label: "Every hour at :00", expr: "0 * * * *" },
    { label: "Daily at midnight", expr: "0 0 * * *" },
    { label: "Weekdays at 9 AM", expr: "0 9 * * 1-5" },
    { label: "Monthly on 1st at 12 AM", expr: "0 0 1 * *" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Cron Schedule Expression Parser & Builder
            </h2>
            <InfoTooltip
              text={
                <div className="space-y-1.5">
                  <div className="font-bold text-indigo-300">Cron 5-Field Format:</div>
                  <div className="font-mono text-[11px] text-amber-300">
                    * * * * *<br />
                    │ │ │ │ └── Day of Week (0-6) (Sun=0)<br />
                    │ │ │ └──── Month (1-12)<br />
                    │ │ └────── Day of Month (1-31)<br />
                    │ └──────── Hour (0-23)<br />
                    └────────── Minute (0-59)
                  </div>
                  <div className="text-[10px] text-slate-300 pt-1 border-t border-slate-700">
                    <span className="text-amber-300">*</span> = Any value, <span className="text-amber-300">,</span> = Value list, <span className="text-amber-300">-</span> = Range, <span className="text-amber-300">/</span> = Step values
                  </div>
                </div>
              }
            />
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Expression"}</span>
          </button>
        </div>

        {/* Input & Presets */}
        <div className="space-y-2">
          <input
            type="text"
            value={cronInput}
            onChange={(e) => setCronInput(e.target.value)}
            placeholder="e.g. */15 9-17 * * 1-5"
            className="w-full px-4 py-2.5 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 font-bold focus:outline-hidden"
          />

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium">Quick Presets:</span>
            {presets.map((p) => (
              <button
                key={p.expr}
                onClick={() => setCronInput(p.expr)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
          Human Readable Description
        </span>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {parsed.description || "Invalid expression format."}
        </p>
      </div>

      {/* Next Execution Schedule */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" /> Upcoming Scheduled Runs
        </h3>

        <div className="space-y-2 font-mono text-xs">
          {parsed.nextDates?.map((dateStr, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200"
            >
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                Run #{idx + 1}
              </span>
              <span>{dateStr}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
