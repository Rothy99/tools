import React, { useState, useMemo } from "react";
import { parseUrlQueryParams } from "../../utils/encodingUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { Link, Copy, Check, Table, Globe } from "lucide-react";

export const UrlTool: React.FC = () => {
  const [urlInput, setUrlInput] = useSessionStorageString("devstudio_url_input", SAMPLE_PRESETS.urlSample);
  const [copied, setCopied] = useState<boolean>(false);

  const parsedUrl = useMemo(() => {
    return parseUrlQueryParams(urlInput);
  }, [urlInput]);

  const encodedUrl = useMemo(() => {
    try {
      return encodeURIComponent(urlInput);
    } catch {
      return "";
    }
  }, [urlInput]);

  const decodedUrl = useMemo(() => {
    try {
      return decodeURIComponent(urlInput);
    } catch {
      return "";
    }
  }, [urlInput]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            URL Encoder / Decoder & Query Parameter Table
          </h2>
        </div>

        <button
          onClick={() => setUrlInput(SAMPLE_PRESETS.urlSample)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          Load Sample URL
        </button>
      </div>

      {/* Main URL Input */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 shadow-2xs">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Target URL Input
        </label>
        <textarea
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          rows={14}
          placeholder="Paste URL or parameter string..."
          className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden min-h-[260px]"
        />
      </div>

      {/* Decoded & Encoded Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Encoded URL */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              encodeURIComponent Output
            </span>
            <button
              onClick={() => handleCopy(encodedUrl)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Encoded
            </button>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 break-all max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-800">
            {encodedUrl}
          </div>
        </div>

        {/* Decoded URL */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              decodeURIComponent Output
            </span>
            <button
              onClick={() => handleCopy(decodedUrl)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Decoded
            </button>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 break-all max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-800">
            {decodedUrl}
          </div>
        </div>
      </div>

      {/* Query Parameters Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-500" /> Parsed Query Parameters ({parsedUrl.params.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Host: {parsedUrl.host || "None"} | Path: {parsedUrl.pathname || "/"}
          </span>
        </div>

        <div className="p-4 overflow-x-auto">
          {parsedUrl.params.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No query parameters found in URL input.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="pb-2 font-semibold w-1/3">Parameter Key</th>
                  <th className="pb-2 font-semibold">Decoded Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {parsedUrl.params.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 pr-4 text-indigo-600 dark:text-indigo-400 font-bold">
                      {p.key}
                    </td>
                    <td className="py-2.5 text-slate-800 dark:text-slate-200 break-all">
                      {p.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
