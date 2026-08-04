import React, { useState } from "react";
import { encodeBase64, decodeBase64 } from "../../utils/encodingUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { Binary, Copy, Check, Upload, Image as ImageIcon, Download } from "lucide-react";

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [textInput, setTextInput] = useState<string>(SAMPLE_PRESETS.base64Sample);
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState<boolean>(false);

  // Image mode state
  const [imageName, setImageName] = useState<string>("");
  const [imageDataUrl, setImageDataUrl] = useState<string>("");

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

  return (
    <div className="space-y-4">
      {/* Modes & Directions Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* Mode Switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMode("text")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === "text"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Text Base64
            </button>
            <button
              onClick={() => setMode("image")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
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

        {/* Load Preset */}
        {mode === "text" && (
          <button
            onClick={() => {
              setTextInput(SAMPLE_PRESETS.base64Sample);
              setDirection("encode");
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            Load Sample Text
          </button>
        )}
      </div>

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
              rows={12}
              placeholder={direction === "encode" ? "Enter text to Base64 encode..." : "Enter Base64 string to decode..."}
              className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none"
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
            <div className="p-4 font-mono text-xs text-slate-900 dark:text-slate-100 overflow-y-auto max-h-[380px] whitespace-pre-wrap leading-relaxed">
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
