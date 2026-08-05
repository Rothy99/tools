import React, { useState, useMemo } from "react";
import { encodeBase64, decodeBase64 } from "../../utils/encodingUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { Binary, Copy, Check, Upload, Download, Wand2, Layers, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { InfoTooltip } from "../common/Tooltip";

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [textInput, setTextInput] = useSessionStorageString("devstudio_base64_text_input", SAMPLE_PRESETS.base64Sample);
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [autoDetectMsg, setAutoDetectMsg] = useState<{ text: string; type: "success" | "info" | "warning" } | null>(null);

  // Batch Mode State
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [batchOutputFormat, setBatchOutputFormat] = useState<"json" | "list">("json");

  // Image mode state
  const [imageName, setImageName] = useState<string>("");
  const [imageDataUrl, setImageDataUrl] = useSessionStorageString("devstudio_base64_image_data_url", "");

  // Single Mode Processing
  let outputText = "";
  let errorMsg = "";

  if (mode === "text" && !isBatchMode) {
    try {
      if (direction === "encode") {
        outputText = encodeBase64(textInput);
      } else {
        outputText = decodeBase64(textInput);
      }
    } catch (err: any) {
      errorMsg = err.message;
    }
  }

  // Batch Mode Processing
  const batchResults = useMemo(() => {
    if (!isBatchMode || mode !== "text") return [];

    let items: string[] = [];
    const trimmed = textInput.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsedArray = JSON.parse(trimmed);
        if (Array.isArray(parsedArray)) {
          items = parsedArray.map((item) => (typeof item === "string" ? item : JSON.stringify(item)));
        } else {
          items = trimmed.split("\n").filter((line) => line.trim().length > 0);
        }
      } catch {
        items = trimmed.split("\n").filter((line) => line.trim().length > 0);
      }
    } else {
      items = trimmed.split("\n").filter((line) => line.trim().length > 0);
    }

    return items.map((item, idx) => {
      try {
        const res = direction === "encode" ? encodeBase64(item) : decodeBase64(item);
        return { id: idx + 1, input: item, output: res, error: null };
      } catch (err: any) {
        return { id: idx + 1, input: item, output: "", error: err.message || "Invalid Base64 format" };
      }
    });
  }, [isBatchMode, mode, textInput, direction]);

  const batchCombinedOutput = useMemo(() => {
    if (!isBatchMode || batchResults.length === 0) return "";
    if (batchOutputFormat === "json") {
      const outputArray = batchResults.map((r) => (r.error ? `[ERROR: ${r.error}]` : r.output));
      return JSON.stringify(outputArray, null, 2);
    } else {
      return batchResults.map((r) => (r.error ? `[ERROR: ${r.error}]` : r.output)).join("\n");
    }
  }, [isBatchMode, batchResults, batchOutputFormat]);

  const batchStats = useMemo(() => {
    if (!isBatchMode) return { total: 0, valid: 0, failed: 0 };
    const total = batchResults.length;
    const failed = batchResults.filter((r) => r.error !== null).length;
    const valid = total - failed;
    return { total, valid, failed };
  }, [isBatchMode, batchResults]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageDataUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAutoDetect = () => {
    if (mode === "image") {
      if (imageDataUrl) {
        setAutoDetectMsg({ text: "✨ Currently in Image / File mode with active Data URL.", type: "info" });
        setTimeout(() => setAutoDetectMsg(null), 4000);
        return;
      }
    }

    const trimmed = textInput.trim();
    if (!trimmed) {
      setAutoDetectMsg({ text: "Input is empty. Paste text or Base64 content first.", type: "warning" });
      setTimeout(() => setAutoDetectMsg(null), 4000);
      return;
    }

    if (trimmed.startsWith("data:")) {
      setMode("image");
      setImageDataUrl(trimmed);
      setAutoDetectMsg({ text: "✨ Auto-detected Data URL! Switched to Image / File mode.", type: "success" });
      setTimeout(() => setAutoDetectMsg(null), 4500);
      return;
    }

    const cleanStr = trimmed.replace(/\s+/g, "");
    const isBase64Charset = /^[A-Za-z0-9+/=\-_]+$/.test(cleanStr);
    const looksLikeNaturalLanguage = /\b(the|and|is|for|this|you|that|with|have|are|from|not|or|be|at)\b/i.test(trimmed);

    if (isBase64Charset && cleanStr.length >= 8 && !looksLikeNaturalLanguage) {
      try {
        const decoded = decodeBase64(cleanStr);
        const isReadable = /^[\x09\x0A\x0D\x20-\x7E\xA0-\uFFFF]*$/.test(decoded);
        if (decoded && isReadable && decoded !== cleanStr) {
          setDirection("decode");
          setAutoDetectMsg({ text: "✨ Auto-detected valid Base64 string! Switched direction to Decode.", type: "success" });
          setTimeout(() => setAutoDetectMsg(null), 4500);
          return;
        }
      } catch (e) {
        // Decode failed
      }
    }

    setDirection("encode");
    setAutoDetectMsg({ text: "✨ Auto-detected Plain Text! Switched direction to Encode.", type: "info" });
    setTimeout(() => setAutoDetectMsg(null), 4500);
  };

  return (
    <div className="space-y-4">
      {/* Modes & Directions Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Binary className="w-5 h-5 text-indigo-500 shrink-0" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            Base64 Encoder & Decoder
            <InfoTooltip
              text={
                <div className="space-y-1">
                  <div className="font-bold text-indigo-300">Base64 Encoding</div>
                  <div className="text-[11px] leading-relaxed text-slate-200">
                    Converts binary or UTF-8 text into an ASCII string format using 64 safe characters. Supports single items and simultaneously processing arrays in Batch Mode.
                  </div>
                </div>
              }
            />
          </h2>

          {/* Mode Switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMode("text")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === "text"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Text Base64
            </button>
            <button
              onClick={() => setMode("image")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === "image"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Image / File Data URL
            </button>
          </div>

          {/* Encode / Decode Switch for Text */}
          {mode === "text" && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setDirection("encode")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  direction === "encode"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setDirection("decode")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  direction === "decode"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Decode
              </button>
            </div>
          )}

          {/* Batch Mode Toggle */}
          {mode === "text" && (
            <button
              onClick={() => {
                const nextState = !isBatchMode;
                setIsBatchMode(nextState);
                if (nextState && textInput === SAMPLE_PRESETS.base64Sample) {
                  setTextInput(direction === "encode" ? SAMPLE_PRESETS.base64BatchSample : SAMPLE_PRESETS.base64BatchDecodedSample);
                }
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isBatchMode
                  ? "bg-purple-600 text-white border-purple-500 shadow-xs ring-2 ring-purple-500/30"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              title="Toggle Batch Processing mode to convert an array or list of strings simultaneously"
            >
              <Layers className="w-3.5 h-3.5 text-purple-300" />
              <span>Batch Mode</span>
              {isBatchMode && (
                <span className="bg-white/20 px-1.5 py-0.2 text-[10px] rounded-full uppercase tracking-wider font-semibold">
                  Active
                </span>
              )}
            </button>
          )}
        </div>

        {/* Right Action Group: Auto-detect & Load Preset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoDetect}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xs transition-all cursor-pointer active:scale-95"
            title="Auto-detect content type and select Encode, Decode, or Image mode"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-detect input</span>
          </button>

          {mode === "text" && (
            <button
              onClick={() => {
                if (isBatchMode) {
                  setTextInput(direction === "encode" ? SAMPLE_PRESETS.base64BatchSample : SAMPLE_PRESETS.base64BatchDecodedSample);
                } else {
                  setTextInput(SAMPLE_PRESETS.base64Sample);
                }
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {isBatchMode ? "Load Batch Sample" : "Load Sample Text"}
            </button>
          )}
        </div>
      </div>

      {autoDetectMsg && (
        <div
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border ${
            autoDetectMsg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : autoDetectMsg.type === "warning"
              ? "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              : "bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
          }`}
        >
          <span>{autoDetectMsg.text}</span>
          <button onClick={() => setAutoDetectMsg(null)} className="opacity-70 hover:opacity-100 cursor-pointer font-bold px-1">
            ✕
          </button>
        </div>
      )}

      {mode === "text" ? (
        <div className="space-y-4">
          {/* Batch Mode Status Bar */}
          {isBatchMode && (
            <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-500" /> Batch Processing Summary:
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/80 text-purple-700 dark:text-purple-200 rounded-lg font-semibold">
                    Total: {batchStats.total} items
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid: {batchStats.valid}
                  </span>
                  {batchStats.failed > 0 && (
                    <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Errors: {batchStats.failed}
                    </span>
                  )}
                </div>
              </div>

              {/* Output Format Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Output Format:</span>
                <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setBatchOutputFormat("json")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      batchOutputFormat === "json"
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    JSON Array
                  </button>
                  <button
                    onClick={() => setBatchOutputFormat("list")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      batchOutputFormat === "list"
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Line List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid View for Inputs & Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Panel */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>
                  {isBatchMode
                    ? `Batch Inputs (${direction === "encode" ? "Plain Texts" : "Base64 Strings"})`
                    : direction === "encode"
                    ? "Plain Text Input"
                    : "Base64 Input"}
                </span>
                {isBatchMode && (
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-normal">
                    Format: JSON Array `["item1", "item2"]` or 1 item per line
                  </span>
                )}
              </div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={28}
                placeholder={
                  isBatchMode
                    ? direction === "encode"
                      ? '["first input string", "second input string"]\nOR enter items on separate lines...'
                      : '["bXl0b29sc2JveA==", "YmFzZTY0"]\nOR enter Base64 strings on separate lines...'
                    : direction === "encode"
                    ? "Enter text to Base64 encode..."
                    : "Enter Base64 string to decode..."
                }
                className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none min-h-[500px]"
              />
            </div>

            {/* Output Panel */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>
                  {isBatchMode
                    ? `Processed Array Output (${batchOutputFormat === "json" ? "JSON Array" : "Line-Separated List"})`
                    : direction === "encode"
                    ? "Base64 Output"
                    : "Decoded Text Output"}
                </span>
                <button
                  onClick={() => handleCopy(isBatchMode ? batchCombinedOutput : outputText)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied All" : isBatchMode ? "Copy Output Array" : "Copy"}</span>
                </button>
              </div>
              <div className="p-4 font-mono text-xs text-slate-900 dark:text-slate-100 overflow-y-auto min-h-[500px] max-h-[800px] whitespace-pre-wrap leading-relaxed">
                {isBatchMode ? (
                  batchCombinedOutput
                ) : errorMsg ? (
                  <div className="text-red-500 font-medium">⚠️ {errorMsg}</div>
                ) : (
                  outputText
                )}
              </div>
            </div>
          </div>

          {/* Itemized Batch Breakdown Cards */}
          {isBatchMode && batchResults.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Itemized Batch Breakdown ({batchResults.length} Items)</span>
                <span className="text-[11px] font-normal text-slate-500">
                  Click copy button next to any item to copy individual output
                </span>
              </h3>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {batchResults.map((res) => (
                  <div
                    key={res.id}
                    className={`p-3.5 rounded-xl border text-xs font-mono transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      res.error
                        ? "bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/80 text-purple-700 dark:text-purple-300 font-bold shrink-0">
                        #{res.id}
                      </span>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                          <strong className="text-slate-700 dark:text-slate-300">Input:</strong> {res.input}
                        </div>
                        {res.error ? (
                          <div className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Error: {res.error}</span>
                          </div>
                        ) : (
                          <div className="text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                            <strong className="text-slate-700 dark:text-slate-300">Output:</strong> {res.output}
                          </div>
                        )}
                      </div>
                    </div>

                    {!res.error && (
                      <button
                        onClick={() => handleCopy(res.output, res.id)}
                        className="self-end md:self-center px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer"
                      >
                        {copiedIndex === res.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy Item</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Image / File Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload Drop Zone */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center shadow-2xs">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Upload Image or File
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select PNG, JPG, SVG, GIF, or WEBP to convert to Base64 Data URL
            </p>
            <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs cursor-pointer shadow-xs">
              <span>Browse File</span>
              <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" />
            </label>
            {imageName && (
              <p className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Uploaded: {imageName}
              </p>
            )}
          </div>

          {/* Base64 Data URL Output & Image Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Base64 Data URL Output
              </span>
              {imageDataUrl && (
                <button
                  onClick={() => handleCopy(imageDataUrl)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Data URL</span>
                </button>
              )}
            </div>

            {imageDataUrl ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all max-h-36 overflow-y-auto border border-slate-200 dark:border-slate-800">
                  {imageDataUrl}
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-2">
                    Image Preview:
                  </span>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-center max-h-48">
                    <img src={imageDataUrl} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Upload an image file to generate Base64 string and preview.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

