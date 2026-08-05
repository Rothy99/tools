import React, { useState, useMemo } from "react";
import { hexToRgb, rgbToHsl } from "../../utils/codeUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { Palette, Copy, Check } from "lucide-react";

export const ColorTool: React.FC = () => {
  const [hex, setHex] = useSessionStorageString("devstudio_color_hex", SAMPLE_PRESETS.colorSample);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb]);

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const formattedValues = useMemo(() => {
    if (!rgb || !hsl) return [];
    return [
      { name: "HEX", val: hex.toUpperCase() },
      { name: "RGB", val: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
      { name: "HSL", val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      { name: "CSS Variable", val: `--primary-color: ${hex};` },
    ];
  }, [hex, rgb, hsl]);

  // Compute contrast ratio relative to white (#FFFFFF)
  const contrastRatioWhite = useMemo(() => {
    if (!rgb) return 1;
    const lum = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
    return ((1 + 0.05) / (lum + 0.05)).toFixed(2);
  }, [rgb]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Color Converter & Contrast Studio
            </h2>
          </div>
        </div>

        {/* Color picker input */}
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="w-14 h-14 rounded-2xl border-0 cursor-pointer p-0 bg-transparent"
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              HEX Color Value
            </label>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#6366f1"
              className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 uppercase"
            />
          </div>
        </div>
      </div>

      {/* Main Preview & Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Large Preview Block */}
        <div
          style={{ backgroundColor: hex }}
          className="rounded-2xl p-6 min-h-[220px] flex flex-col justify-between shadow-md transition-colors text-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-xs">
              Color Preview
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-xs">
              {hex.toUpperCase()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 backdrop-blur-xs text-xs space-y-1">
            <p className="font-bold">Text Contrast Preview</p>
            <p className="text-slate-200">
              WCAG Contrast Ratio against White: <span className="font-mono">{contrastRatioWhite}:1</span>
            </p>
          </div>
        </div>

        {/* Formats List */}
        <div className="space-y-3">
          {formattedValues.map((f) => (
            <div
              key={f.name}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs"
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {f.name}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {f.val}
                </span>
              </div>
              <button
                onClick={() => handleCopy(f.val, f.name)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {copiedFormat === f.name ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedFormat === f.name ? "Copied" : "Copy"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
