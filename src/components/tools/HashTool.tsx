import React, { useState, useEffect } from "react";
import { md5, computeSubtleHash } from "../../utils/securityUtils";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { ShieldCheck, Copy, Check, CheckCircle2, XCircle } from "lucide-react";
import { InfoTooltip } from "../common/Tooltip";

export const HashTool: React.FC = () => {
  const [input, setInput] = useSessionStorageString("devstudio_hash_input", "DevStudio Super Tools 2026");
  const [expectedHash, setExpectedHash] = useState<string>("");

  const [md5Hash, setMd5Hash] = useState<string>("");
  const [sha1Hash, setSha1Hash] = useState<string>("");
  const [sha256Hash, setSha256Hash] = useState<string>("");
  const [sha512Hash, setSha512Hash] = useState<string>("");

  const [copiedAlg, setCopiedAlg] = useState<string | null>(null);

  useEffect(() => {
    setMd5Hash(md5(input));

    computeSubtleHash("SHA-1", input).then(setSha1Hash);
    computeSubtleHash("SHA-256", input).then(setSha256Hash);
    computeSubtleHash("SHA-512", input).then(setSha512Hash);
  }, [input]);

  const handleCopy = (hash: string, alg: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedAlg(alg);
    setTimeout(() => setCopiedAlg(null), 2000);
  };

  const hashes = [
    { name: "MD5", value: md5Hash, bits: "128 bits / 32 chars" },
    { name: "SHA-1", value: sha1Hash, bits: "160 bits / 40 chars" },
    { name: "SHA-256", value: sha256Hash, bits: "256 bits / 64 chars" },
    { name: "SHA-512", value: sha512Hash, bits: "512 bits / 128 chars" },
  ];

  const cleanExpected = expectedHash.trim().toLowerCase();
  const matchedAlg = hashes.find((h) => h.value.toLowerCase() === cleanExpected);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              Cryptographic Hash & Checksum Generator
            </h2>
            <InfoTooltip
              text={
                <div className="space-y-1">
                  <div className="font-bold text-indigo-300">Hash Algorithm Security Note</div>
                  <div className="text-[11px] leading-relaxed text-slate-200">
                    <span className="text-amber-300 font-bold">SHA-256</span> & <span className="text-amber-300 font-bold">SHA-512</span> are modern secure standard cryptographic hashing functions.<br />
                    <span className="text-rose-300">MD5</span> & <span className="text-rose-300">SHA-1</span> are legacy algorithms suitable for legacy checksum verifications.
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* Input Text */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Input Message / Plaintext String
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Type plaintext string to compute checksums..."
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden"
          />
        </div>

        {/* Expected Hash Checker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Verify Against Expected Hash (Optional)
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste expected hash digest to verify match..."
              className="w-full px-3 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
            />
            {cleanExpected && (
              <div className="absolute right-3 flex items-center gap-1 text-xs font-bold">
                {matchedAlg ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Match Found ({matchedAlg.name})
                  </span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> No Match
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Computed Hash List */}
      <div className="space-y-3">
        {hashes.map((h) => {
          const isMatched = cleanExpected && h.value.toLowerCase() === cleanExpected;

          return (
            <div
              key={h.name}
              className={`p-4 rounded-2xl border transition-all ${
                isMatched
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-800"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    {h.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{h.bits}</span>
                </div>

                <button
                  onClick={() => handleCopy(h.value, h.name)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {copiedAlg === h.name ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedAlg === h.name ? "Copied" : "Copy Digest"}</span>
                </button>
              </div>

              <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                {h.value || "Computing..."}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
