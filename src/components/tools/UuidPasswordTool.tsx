import React, { useState, useEffect } from "react";
import { generateUuidV4, generatePassword } from "../../utils/securityUtils";
import { Key, Copy, Check, RefreshCw } from "lucide-react";
import { InfoTooltip } from "../common/Tooltip";

export const UuidPasswordTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"uuid" | "password">("uuid");

  // UUID State
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidList, setUuidList] = useState<string[]>([]);
  const [copiedUuidIndex, setCopiedUuidIndex] = useState<number | null>(null);
  const [copiedAllUuids, setCopiedAllUuids] = useState<boolean>(false);

  // Password State
  const [passLength, setPassLength] = useState<number>(24);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [copiedPass, setCopiedPass] = useState<boolean>(false);

  const handleGenerateUuids = () => {
    const arr: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      arr.push(generateUuidV4());
    }
    setUuidList(arr);
  };

  const handleGeneratePassword = () => {
    setGeneratedPassword(
      generatePassword({
        length: passLength,
        useUpper,
        useLower,
        useNumbers,
        useSymbols,
      })
    );
  };

  useEffect(() => {
    handleGenerateUuids();
    handleGeneratePassword();
  }, []);

  const handleCopySingleUuid = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedUuidIndex(index);
    setTimeout(() => setCopiedUuidIndex(null), 2000);
  };

  const handleCopyAllUuids = () => {
    navigator.clipboard.writeText(uuidList.join("\n"));
    setCopiedAllUuids(true);
    setTimeout(() => setCopiedAllUuids(false), 2000);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            UUID v4 & Cryptographic Secret Generator
          </h2>
          <InfoTooltip
            text={
              <div className="space-y-1">
                <div className="font-bold text-indigo-300">RFC 4122 UUID v4</div>
                <div className="text-[11px] leading-relaxed text-slate-200">
                  UUID v4 is a 128-bit cryptographically secure pseudorandom identifier (36 chars with hyphens). The chance of collision is virtually zero ($2^{122}$ possibilities).
                </div>
              </div>
            }
          />
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab("uuid")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "uuid"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            UUID v4 Bulk Generator
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "password"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Password & Secret Key
          </button>
        </div>
      </div>

      {activeTab === "uuid" ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
          {/* UUID Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quantity:
              </label>
              <select
                value={uuidCount}
                onChange={(e) => setUuidCount(Number(e.target.value))}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value={1}>1 UUID</option>
                <option value={5}>5 UUIDs</option>
                <option value={10}>10 UUIDs</option>
                <option value={25}>25 UUIDs</option>
                <option value={50}>50 UUIDs</option>
              </select>

              <button
                onClick={handleGenerateUuids}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>

            <button
              onClick={handleCopyAllUuids}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {copiedAllUuids ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAllUuids ? "Copied All" : "Copy All UUIDs"}</span>
            </button>
          </div>

          {/* Generated UUIDs list */}
          <div className="space-y-2">
            {uuidList.map((uuid, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800"
              >
                <span>{uuid}</span>
                <button
                  onClick={() => handleCopySingleUuid(uuid, idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800"
                  title="Copy UUID"
                >
                  {copiedUuidIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Password & Secret Key Builder */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
          {/* Secret Display Box */}
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="font-mono text-sm font-semibold tracking-wider break-all text-emerald-400">
              {generatedPassword}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleGeneratePassword}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyPassword}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPass ? "Copied" : "Copy Secret"}</span>
              </button>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Secret Length: {passLength} characters</span>
              </div>
              <input
                type="range"
                min={8}
                max={64}
                value={passLength}
                onChange={(e) => {
                  setPassLength(Number(e.target.value));
                  handleGeneratePassword();
                }}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={(e) => {
                    setUseUpper(e.target.checked);
                    handleGeneratePassword();
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={(e) => {
                    setUseLower(e.target.checked);
                    handleGeneratePassword();
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => {
                    setUseNumbers(e.target.checked);
                    handleGeneratePassword();
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => {
                    setUseSymbols(e.target.checked);
                    handleGeneratePassword();
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Symbols (!@#$)</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
