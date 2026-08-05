import React, { useState, useMemo } from "react";
import { parseJwtToken } from "../../utils/encodingUtils";
import { SAMPLE_PRESETS } from "../../data/samplePresets";
import { useSessionStorageString } from "../../hooks/useSessionStorage";
import { KeyRound, ShieldAlert, ShieldCheck, Clock, Copy, Check } from "lucide-react";
import { InfoTooltip } from "../common/Tooltip";

export const JwtTool: React.FC = () => {
  const [tokenInput, setTokenInput] = useSessionStorageString("devstudio_jwt_token_input", SAMPLE_PRESETS.jwtSample);
  const [copied, setCopied] = useState<boolean>(false);

  const parsedJwt = useMemo(() => {
    return parseJwtToken(tokenInput);
  }, [tokenInput]);

  const handleCopyPayload = () => {
    if (parsedJwt.payload) {
      navigator.clipboard.writeText(JSON.stringify(parsedJwt.payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            JWT Token Inspector & Debugger
          </h2>
          <InfoTooltip
            text={
              <div className="space-y-1">
                <div className="font-bold text-indigo-300">JWT Structure Overview</div>
                <div className="text-[11px] leading-relaxed text-slate-200">
                  A JSON Web Token consists of three parts separated by dots (<span className="text-amber-300">.</span>):
                </div>
                <div className="font-mono text-[10px] space-y-0.5">
                  <span className="text-red-400">Header</span>.<span className="text-purple-400">Payload</span>.<span className="text-sky-400">Signature</span>
                </div>
              </div>
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTokenInput(SAMPLE_PRESETS.jwtSample)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Load Sample Token
          </button>
          <button
            onClick={handleCopyPayload}
            disabled={!parsedJwt.isValid}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Payload"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Token Raw Input */}
        <div className="lg:col-span-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Encoded JWT Token String
          </div>
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            rows={32}
            placeholder="Paste JWT (eyJhbGciOi...)..."
            className="w-full p-4 font-mono text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none break-all leading-relaxed min-h-[650px]"
          />

          {/* Validation Status Badge */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            {parsedJwt.isValid ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Valid JWT Format</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>Invalid JWT: {parsedJwt.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Decoded Claims & Header */}
        <div className="lg:col-span-2 space-y-4">
          {/* Expiration Card */}
          {parsedJwt.isValid && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Issued At (iat)
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {parsedJwt.issuedAt || "Not specified in token"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Expiration Status (exp)
                </span>
                {parsedJwt.isExpired ? (
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Token Expired ({parsedJwt.expiresAt})
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Valid & Active ({parsedJwt.expiresAt})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Header Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-red-600 dark:text-red-400 flex justify-between items-center">
              <span>Header (Algorithm & Token Type)</span>
              {parsedJwt.header && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(parsedJwt.header, null, 2));
                  }}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Copy Header
                </button>
              )}
            </div>
            <pre className="p-4 font-mono text-xs text-slate-900 dark:text-slate-100 overflow-x-auto">
              {parsedJwt.header ? JSON.stringify(parsedJwt.header, null, 2) : "// Invalid Header"}
            </pre>
          </div>

          {/* Payload Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-purple-600 dark:text-purple-400 flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span>Payload Claims (Data)</span>
                <InfoTooltip
                  text={
                    <div className="space-y-1">
                      <div className="font-bold text-indigo-300">Standard Reserved Claims</div>
                      <div className="text-[11px] space-y-0.5 font-mono">
                        <div><span className="text-amber-300">iss</span> : Issuer domain</div>
                        <div><span className="text-amber-300">sub</span> : Subject / User ID</div>
                        <div><span className="text-amber-300">aud</span> : Audience recipient</div>
                        <div><span className="text-amber-300">exp</span> : Expiration timestamp</div>
                        <div><span className="text-amber-300">iat</span> : Issued-at timestamp</div>
                        <div><span className="text-amber-300">nbf</span> : Not before timestamp</div>
                      </div>
                    </div>
                  }
                />
              </div>
              {parsedJwt.payload && (
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1 text-[11px] font-medium text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy Payload"}
                </button>
              )}
            </div>
            <pre className="p-4 font-mono text-xs text-slate-900 dark:text-slate-100 overflow-x-auto min-h-[500px] max-h-[900px]">
              {parsedJwt.payload ? JSON.stringify(parsedJwt.payload, null, 2) : "// Invalid Payload"}
            </pre>
          </div>

          {/* Signature Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 block mb-1">
              Signature
            </span>
            <span className="font-mono text-xs text-slate-500 break-all">
              {parsedJwt.signature || "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
