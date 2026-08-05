import React, { useState, useMemo, useRef } from "react";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { JsonTreeNode } from "../../types";
import {
  formatJsonString,
  minifyJsonString,
  parseJsonSafe,
  buildJsonTree,
  jsonToYaml,
  jsonToXml,
  jsonToCsv,
} from "../../utils/jsonUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import {
  Copy,
  Check,
  Trash2,
  Search,
  Code2,
  FileSpreadsheet,
  FileCode,
  Minimize2,
  ChevronRight,
  ChevronDown,
  Download,
  Sparkles,
  Wand2,
  Edit3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export type ViewTab = "editor" | "tree" | "yaml" | "csv" | "xml";

function highlightJsonHtml(raw: string): string {
  if (!raw) return "";
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-amber-300 font-medium"; // numbers
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          const keyText = match.slice(0, -1);
          return `<span class="text-sky-300 font-semibold">${keyText}</span><span class="text-slate-400">:</span>`;
        } else {
          cls = "text-emerald-300 font-normal"; // string value
        }
      } else if (/true|false/.test(match)) {
        cls = "text-purple-300 font-bold"; // boolean
      } else if (/null/.test(match)) {
        cls = "text-rose-400 italic"; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useSessionStorageString("devstudio_json_formatter_input", SAMPLE_PRESETS.jsonFormatter);
  const [activeTab, setActiveTab] = useState<ViewTab>("editor");
  const [indentSize, setIndentSize] = useState<number>(2);
  const [unescapeEmbedded, setUnescapeEmbedded] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [collapsedPaths, setCollapsedPaths] = useState<Record<string, boolean>>({});
  const [autoDetectMsg, setAutoDetectMsg] = useState<{ text: string; type: "success" | "info" | "warning" } | null>(null);

  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => parseJsonSafe(input, unescapeEmbedded), [input, unescapeEmbedded]);

  const handleAutoDetect = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setAutoDetectMsg({ text: "Input is empty. Paste content first.", type: "warning" });
      setTimeout(() => setAutoDetectMsg(null), 4000);
      return;
    }

    // 1. Check if Base64 encoded JSON
    if (/^[A-Za-z0-9+/=%\s]+$/.test(trimmed) && trimmed.length > 8 && !trimmed.includes(" ")) {
      try {
        const decoded = atob(trimmed.replace(/\s/g, ""));
        const decodedTrimmed = decoded.trim();
        if ((decodedTrimmed.startsWith("{") && decodedTrimmed.endsWith("}")) || (decodedTrimmed.startsWith("[") && decodedTrimmed.endsWith("]"))) {
          const check = parseJsonSafe(decodedTrimmed, false);
          if (!check.error) {
            const formatted = formatJsonString(decodedTrimmed, indentSize, false);
            setInput(formatted);
            setActiveTab("editor");
            setAutoDetectMsg({ text: "✨ Auto-detected: Base64 Encoded JSON! Decoded and formatted as JSON.", type: "success" });
            setTimeout(() => setAutoDetectMsg(null), 4500);
            return;
          }
        }
      } catch (e) {
        // Not Base64 JSON
      }
    }

    // 2. Check if Escaped / Stringified JSON (e.g., contains escaped quotes or newlines)
    const isEscapedCandidate = (trimmed.startsWith('"') && trimmed.endsWith('"')) || trimmed.includes('\\"') || trimmed.includes('\\n') || trimmed.includes('\\t');
    if (isEscapedCandidate) {
      const unescapedResult = parseJsonSafe(trimmed, true);
      if (!unescapedResult.error && unescapedResult.data !== null) {
        setUnescapeEmbedded(true);
        const formatted = formatJsonString(trimmed, indentSize, true);
        setInput(formatted);
        setActiveTab("editor");
        setAutoDetectMsg({ text: "✨ Auto-detected: Escaped / Stringified JSON! Unescaped and formatted.", type: "success" });
        setTimeout(() => setAutoDetectMsg(null), 4500);
        return;
      }
    }

    // 3. Check if standard raw JSON ({...} or [...])
    const rawResult = parseJsonSafe(trimmed, false);
    if (!rawResult.error && rawResult.data !== null) {
      const formatted = formatJsonString(trimmed, indentSize, unescapeEmbedded);
      setInput(formatted);
      setActiveTab("editor");
      setAutoDetectMsg({ text: `✨ Auto-detected: Valid JSON ${Array.isArray(rawResult.data) ? "Array" : "Object"}! Formatted.`, type: "success" });
      setTimeout(() => setAutoDetectMsg(null), 4500);
      return;
    }

    // 4. Check if XML document structure
    if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
      setActiveTab("xml");
      setAutoDetectMsg({ text: "✨ Auto-detected: XML document! Switched view to XML mode.", type: "info" });
      setTimeout(() => setAutoDetectMsg(null), 4500);
      return;
    }

    // 5. Check if CSV / TSV (multiple lines with commas or tabs)
    if (trimmed.includes("\n") && (trimmed.includes(",") || trimmed.includes("\t")) && !trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      setActiveTab("csv");
      setAutoDetectMsg({ text: "✨ Auto-detected: CSV / TSV tabular data! Switched view to CSV mode.", type: "info" });
      setTimeout(() => setAutoDetectMsg(null), 4500);
      return;
    }

    // 6. Check if YAML key-value pairs
    if (/^[a-zA-Z0-9_-]+:\s+/m.test(trimmed) && !trimmed.startsWith("{")) {
      setActiveTab("yaml");
      setAutoDetectMsg({ text: "✨ Auto-detected: YAML format! Switched view to YAML mode.", type: "info" });
      setTimeout(() => setAutoDetectMsg(null), 4500);
      return;
    }

    setAutoDetectMsg({ text: "⚠️ Unrecognized format. Please verify content for valid JSON/YAML/XML/CSV.", type: "warning" });
    setTimeout(() => setAutoDetectMsg(null), 4500);
  };

  const highlightedCode = useMemo(() => {
    return highlightJsonHtml(input);
  }, [input]);

  const lineCount = useMemo(() => {
    return input.split("\n").length;
  }, [input]);

  const handleScroll = () => {
    if (textareaRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
      if (highlightRef.current) {
        highlightRef.current.scrollTop = scrollTop;
        highlightRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  const handleFormatInPlace = () => {
    if (parsed.error) return;
    try {
      const formatted = formatJsonString(input, indentSize, unescapeEmbedded);
      setInput(formatted);
    } catch (e) {
      // ignore
    }
  };

  const handleMinifyInPlace = () => {
    if (parsed.error) return;
    try {
      const minified = minifyJsonString(input, unescapeEmbedded);
      setInput(minified);
    } catch (e) {
      // ignore
    }
  };

  const convertedOutput = useMemo(() => {
    if (parsed.error || parsed.data === null) return "";
    try {
      if (activeTab === "yaml") return jsonToYaml(parsed.data);
      if (activeTab === "xml") return jsonToXml(parsed.data);
      if (activeTab === "csv") return jsonToCsv(parsed.data);
    } catch (err: any) {
      return `Error generating format: ${err.message}`;
    }
    return "";
  }, [input, activeTab, parsed]);

  const treeData = useMemo(() => {
    if (parsed.error || parsed.data === null) return null;
    return buildJsonTree(parsed.data);
  }, [parsed]);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      editor: "json",
      tree: "json",
      yaml: "yaml",
      xml: "xml",
      csv: "csv",
    };
    let content = input;
    if (activeTab === "yaml" || activeTab === "xml" || activeTab === "csv") {
      content = convertedOutput;
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devstudio_export.${extMap[activeTab] || "json"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCollapse = (path: string) => {
    setCollapsedPaths((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTreeNode = (node: JsonTreeNode) => {
    const isCollapsed = collapsedPaths[node.path];

    if (
      searchFilter &&
      !node.key.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !String(node.value).toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      if (node.children) {
        const matchingChildren = node.children.filter((child) =>
          child.key.toLowerCase().includes(searchFilter.toLowerCase())
        );
        if (matchingChildren.length === 0) return null;
      } else {
        return null;
      }
    }

    if (node.type === "object" || node.type === "array") {
      return (
        <div key={node.path} className="ml-3 my-1 font-mono text-xs">
          <div
            onClick={() => toggleCollapse(node.path)}
            className="flex items-center gap-1.5 cursor-pointer py-1 hover:bg-slate-800/80 rounded px-1.5 transition-colors group"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
            )}
            <span className="font-semibold text-sky-300">
              {node.key}:
            </span>
            <span className="text-slate-400 text-[11px] font-normal">
              {node.type === "array" ? `[ ${node.itemCount} items ]` : `{ ${node.itemCount} keys }`}
            </span>
          </div>

          {!isCollapsed && node.children && (
            <div className="pl-4 ml-1 border-l-2 border-slate-800">
              {node.children.map((child) => renderTreeNode(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className="ml-6 py-1 font-mono text-xs flex items-center gap-2 hover:bg-slate-800/80 rounded px-1.5 transition-colors"
      >
        <span className="text-sky-300 font-semibold">{node.key}:</span>
        <span
          className={
            node.type === "string"
              ? "text-emerald-300 font-normal"
              : node.type === "number"
              ? "text-amber-300 font-normal"
              : node.type === "boolean"
              ? "text-purple-300 font-semibold"
              : "text-rose-400 italic"
          }
        >
          {node.value === null ? "null" : JSON.stringify(node.value)}
        </span>
      </div>
    );
  };

  return (
    /* SINGLE UNIFIED SECTION CONTAINER */
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
      {/* UNIFIED SINGLE-ROW TOOLBAR HEADER (STICKY ON SCROLL) */}
      <div className="sticky top-[57px] sm:top-[61px] z-20 p-2.5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 overflow-x-auto whitespace-nowrap scrollbar-none rounded-t-2xl">
        {/* Left Group: View Tabs + Metrics + Status Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl gap-0.5 shrink-0">
            {[
              { id: "editor", label: "Editor", icon: <Edit3 className="w-3.5 h-3.5" /> },
              { id: "tree", label: "Tree", icon: <FileCode className="w-3.5 h-3.5" /> },
              { id: "yaml", label: "YAML", icon: <Code2 className="w-3.5 h-3.5" /> },
              { id: "csv", label: "CSV", icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
              { id: "xml", label: "XML", icon: <Code2 className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ViewTab)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Removed stats element */}

          {parsed.error && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-900">
              <AlertCircle className="w-3.5 h-3.5" />
              Invalid JSON
            </span>
          )}
          {!parsed.error && input.trim().length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Valid JSON
            </span>
          )}

          {activeTab === "tree" && (
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter keys/values..."
                className="pl-7 pr-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden w-40"
              />
            </div>
          )}
        </div>

        {/* Right Group: Actions Row in the same single line */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleAutoDetect}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Auto-detect content type and automatically select mode or format"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-detect input</span>
          </button>

          {activeTab === "editor" && (
            <>
              <button
                onClick={handleFormatInPlace}
                disabled={Boolean(parsed.error)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title="Format JSON with indentation"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Format</span>
              </button>

              <button
                onClick={handleMinifyInPlace}
                disabled={Boolean(parsed.error)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer whitespace-nowrap"
                title="Minify JSON"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Minify</span>
              </button>

              <label className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={unescapeEmbedded}
                  onChange={(e) => setUnescapeEmbedded(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Unescape JSON</span>
              </label>

              <select
                value={indentSize}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  setIndentSize(size);
                  if (!parsed.error && input) {
                    try {
                      setInput(formatJsonString(input, size, unescapeEmbedded));
                    } catch (e) {}
                  }
                }}
                className="px-2 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </>
          )}

          <button
            onClick={() => handleCopy(activeTab === "editor" ? input : convertedOutput || input)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors whitespace-nowrap"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setInput("")}
            className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear Workspace"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {autoDetectMsg && (
        <div
          className={`px-4 py-2 text-xs font-semibold flex items-center justify-between transition-all ${
            autoDetectMsg.type === "success"
              ? "bg-emerald-500/15 text-emerald-300 border-b border-emerald-500/30"
              : autoDetectMsg.type === "warning"
              ? "bg-amber-500/15 text-amber-300 border-b border-amber-500/30"
              : "bg-sky-500/15 text-sky-300 border-b border-sky-500/30"
          }`}
        >
          <span>{autoDetectMsg.text}</span>
          <button onClick={() => setAutoDetectMsg(null)} className="opacity-70 hover:opacity-100 cursor-pointer font-bold px-1.5">
            ✕
          </button>
        </div>
      )}

      {/* SINGLE SECTION WORKSPACE CANVAS */}
      <div className="min-h-[950px] h-[calc(100vh-80px)] max-h-[1600px] flex flex-col relative overflow-hidden bg-[#0b0f19] rounded-b-2xl">
        {/* Floating Canvas Copy to Clipboard Button */}
        <button
          onClick={() => handleCopy(activeTab === "editor" ? input : convertedOutput || input)}
          className="absolute top-3 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 backdrop-blur-md shadow-lg transition-all cursor-pointer opacity-80 hover:opacity-100"
          title="Copy workspace content to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied!" : "Copy Output"}</span>
        </button>

        {activeTab === "editor" ? (
          <div className="flex-1 flex h-full relative font-mono text-xs text-slate-100">
            {/* Line Numbers Sidebar */}
            <div
              ref={lineNumbersRef}
              className="w-14 py-4 select-none bg-[#070a11] text-slate-500 text-right pr-3 font-mono text-xs leading-[22px] overflow-hidden border-r border-slate-800/80 shrink-0 scroll-smooth"
            >
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i + 1} className="hover:text-slate-300 transition-colors">{i + 1}</div>
              ))}
            </div>

            {/* Editor Workspace Container with Colorized Syntax Overlay */}
            <div className="flex-1 h-full relative overflow-hidden">
              {/* Background Syntax Highlighted View */}
              <div
                ref={highlightRef}
                className="pointer-events-none absolute inset-0 p-4 font-mono text-xs leading-[22px] whitespace-pre tab-4 overflow-hidden text-slate-200"
                dangerouslySetInnerHTML={{
                  __html: highlightedCode + "\n",
                }}
              />

              {/* Foreground Interactive Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onScroll={handleScroll}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste or type your JSON here..."
                spellCheck={false}
                className="absolute inset-0 w-full h-full p-4 font-mono text-xs text-transparent caret-indigo-400 bg-transparent focus:outline-hidden resize-none leading-[22px] whitespace-pre tab-4 overflow-auto border-none scroll-smooth selection:bg-indigo-500/30 selection:text-transparent"
              />
            </div>

            {parsed.error && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-red-950/95 text-red-200 text-xs border-t border-red-800 font-mono flex items-center gap-2 backdrop-blur-xs z-10 shadow-lg">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span><strong>Syntax Error:</strong> {parsed.error}</span>
              </div>
            )}
          </div>
        ) : activeTab === "tree" ? (
          <div className="p-6 overflow-auto h-full bg-[#0b0f19] text-slate-100 scroll-smooth">
            {parsed.error ? (
              <div className="text-center py-24 text-slate-400 text-xs font-mono flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 text-amber-500" />
                <span>Cannot display tree view because JSON contains syntax errors.</span>
                <span className="text-slate-500">Switch back to <strong>Editor</strong> to fix the syntax error.</span>
              </div>
            ) : treeData ? (
              <div>{renderTreeNode(treeData)}</div>
            ) : (
              <div className="text-center py-24 text-slate-500 text-xs">
                No JSON content to display.
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 overflow-auto h-full bg-[#0b0f19] text-slate-100 font-mono text-xs scroll-smooth">
            {parsed.error ? (
              <div className="text-center py-24 text-slate-400 text-xs font-mono flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 text-amber-500" />
                <span>Cannot convert format because JSON contains syntax errors.</span>
                <span className="text-slate-500">Switch back to <strong>Editor</strong> to fix the error.</span>
              </div>
            ) : (
              <pre className="leading-[22px] whitespace-pre-wrap text-emerald-300">
                {convertedOutput}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
