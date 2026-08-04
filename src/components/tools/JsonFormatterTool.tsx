import React, { useState, useMemo } from "react";
import { JsonViewMode, JsonTreeNode } from "../../types";
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
} from "lucide-react";

export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_PRESETS.jsonFormatter);
  const [viewMode, setViewMode] = useState<JsonViewMode>("formatted");
  const [indentSize, setIndentSize] = useState<number>(2);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [collapsedPaths, setCollapsedPaths] = useState<Record<string, boolean>>({});

  const parsed = useMemo(() => parseJsonSafe(input), [input]);

  const convertedOutput = useMemo(() => {
    if (parsed.error || parsed.data === null) return "";

    try {
      if (viewMode === "formatted") {
        return formatJsonString(input, indentSize);
      }
      if (viewMode === "minified") {
        return minifyJsonString(input);
      }
      if (viewMode === "yaml") {
        return jsonToYaml(parsed.data);
      }
      if (viewMode === "xml") {
        return jsonToXml(parsed.data);
      }
      if (viewMode === "csv") {
        return jsonToCsv(parsed.data);
      }
    } catch (err: any) {
      return `Error rendering format: ${err.message}`;
    }
    return "";
  }, [input, viewMode, indentSize, parsed]);

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
      formatted: "json",
      minified: "json",
      yaml: "yaml",
      xml: "xml",
      csv: "csv",
      tree: "json",
    };
    const blob = new Blob([convertedOutput || input], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devstudio_export.${extMap[viewMode] || "json"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCollapse = (path: string) => {
    setCollapsedPaths((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Render Tree Node Component recursively
  const renderTreeNode = (node: JsonTreeNode) => {
    const isCollapsed = collapsedPaths[node.path];

    if (
      searchFilter &&
      !node.key.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !String(node.value).toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      // Filter non-matching child nodes
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
        <div key={node.path} className="ml-3 my-0.5 font-mono text-xs">
          <div
            onClick={() => toggleCollapse(node.path)}
            className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1 group"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {node.key}:
            </span>
            <span className="text-slate-400 text-[11px]">
              {node.type === "array" ? `[ ${node.itemCount} items ]` : `{ ${node.itemCount} keys }`}
            </span>
          </div>

          {!isCollapsed && node.children && (
            <div className="pl-3 border-l border-slate-200 dark:border-slate-800">
              {node.children.map((child) => renderTreeNode(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className="ml-5 py-0.5 font-mono text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded px-1"
      >
        <span className="text-slate-700 dark:text-slate-300 font-medium">{node.key}:</span>
        <span
          className={
            node.type === "string"
              ? "text-emerald-600 dark:text-emerald-400"
              : node.type === "number"
              ? "text-amber-600 dark:text-amber-400"
              : node.type === "boolean"
              ? "text-purple-600 dark:text-purple-400"
              : "text-slate-400"
          }
        >
          {node.value === null ? "null" : JSON.stringify(node.value)}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tool Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Modes */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { id: "formatted", label: "Formatted", icon: <Code2 className="w-3.5 h-3.5" /> },
              { id: "tree", label: "Tree View", icon: <FileCode className="w-3.5 h-3.5" /> },
              { id: "minified", label: "Minified", icon: <Minimize2 className="w-3.5 h-3.5" /> },
              { id: "yaml", label: "YAML", icon: <FileCode className="w-3.5 h-3.5" /> },
              { id: "csv", label: "CSV", icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
              { id: "xml", label: "XML", icon: <Code2 className="w-3.5 h-3.5" /> },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id as JsonViewMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  viewMode === m.id
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Indent selector */}
          {viewMode === "formatted" && (
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          )}
        </div>

        {/* Preset & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInput(SAMPLE_PRESETS.jsonFormatter)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            Load Sample
          </button>
          <button
            onClick={() => setInput("")}
            className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Input JSON Raw</span>
            <span className="text-[11px] font-normal text-slate-400">
              {input.length} chars
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none leading-relaxed h-[500px]"
          />
          {parsed.error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 text-xs border-t border-red-200 dark:border-red-900 font-mono">
              ⚠️ Syntax Error: {parsed.error}
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="capitalize">{viewMode} Output</span>
              {viewMode === "tree" && (
                <div className="relative flex items-center">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter keys..."
                    className="pl-6 pr-2 py-0.5 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(convertedOutput || input)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="p-4 overflow-auto h-[500px]">
            {parsed.error ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Fix the JSON error on the left panel to display {viewMode} output.
              </div>
            ) : viewMode === "tree" && treeData ? (
              <div>{renderTreeNode(treeData)}</div>
            ) : (
              <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {convertedOutput}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
