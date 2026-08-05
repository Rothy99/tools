import React, { useState } from "react";
import { encodeBase64, decodeBase64 } from "../../utils/encodingUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { Binary, Copy, Check, Upload, Image as ImageIcon, Download, Wand2 } from "lucide-react";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { InfoTooltip } from "../common/Tooltip";

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [textInput, setTextInput] = useSessionStorageString("devstudio_base64_text_input", SAMPLE_PRESETS.base64Sample);
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState<boolean>(false);
  const [autoDetectMsg, setAutoDetectMsg] = useState<{ text: string; type: "success" | "info" | "warning" } | null>(null);

  // Image mode state
  const [imageName, setImageName] = useState<string>("");
  const [imageDataUrl, setImageDataUrl] = useSessionStorageString("devstudio_base64_image_data_url", "");

  let outputText = "";
  let errorMsg = "";

  if (mode === "text") {
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

    // 1. Check if Data URL format
    if (trimmed.startsWith("data:")) {
      setMode("image");
      setImageDataUrl(trimmed);
      setAutoDetectMsg({ text: "✨ Auto-detected Data URL! Switched to Image / File mode.", type: "success" });
      setTimeout(() => setAutoDetectMsg(null), 4500);
      return;
    }

    // 2. Test Base64 candidate
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

    // Default to Encode
    setDirection("encode");
    setAutoDetectMsg({ text: "✨ Auto-detected Plain Text! Switched direction to Encode.", type: "info" });
    setTimeout(() => setAutoDetectMsg(null), 4500);
  };

  return (
    <div className="space-y-4">
      {/* Modes & Directions Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <Binary className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            Base64 Encoder & Decoder
            <InfoTooltip
              text={
                <div className="space-y-1">
                  <div className="font-bold text-indigo-300">Base64 Encoding</div>
                  <div className="text-[11px] leading-relaxed text-slate-200">
                    Converts binary or UTF-8 text into an ASCII string format using 64 safe characters. Increases size by ~33%. Useful for data URIs and API payloads.
                  </div>
                </div>
              }
            />
          </h2>

          {/* Mode Switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium ml-2">
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
                setTextInput(SAMPLE_PRESETS.base64Sample);
                setDirection("encode");
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Load Sample Text
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Panel */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {direction === "encode" ? "Plain Text Input" : "Base64 Input"}
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={36}
              placeholder={direction === "encode" ? "Enter text to Base64 encode..." : "Enter Base64 string to decode..."}
              className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none min-h-[700px]"
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{direction === "encode" ? "Base64 Output" : "Decoded Text Output"}</span>
              <button
                onClick={() => handleCopy(outputText)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="p-4 font-mono text-xs text-slate-900 dark:text-slate-100 overflow-y-auto min-h-[700px] max-h-[1100px] whitespace-pre-wrap leading-relaxed">
              {errorMsg ? (
                <div className="text-red-500 font-medium">⚠️ {errorMsg}</div>
              ) : (
                outputText
              )}
            </div>
          </div>
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
