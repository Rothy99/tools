import React from "react";
import { Shield, Lock, Eye, Server, CheckCircle2, ArrowLeft } from "lucide-react";

interface PrivacyPageProps {
  onGoHome: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onGoHome }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      <button
        onClick={onGoHome}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tools</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-10 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Last Updated: August 2026 • Effective Immediately
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs leading-relaxed flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <strong>100% Client-Side Guarantee:</strong> mytoolsbox executes all string parsing, formatting, encoding, and hashing locally within your client browser session. No raw payload or API secret is ever transmitted to external servers.
          </div>
        </div>

        <div className="space-y-6 text-xs lg:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>1. Data Collection & Processing</span>
            </h2>
            <p>
              When you use mytoolsbox utilities (JSON Formatter, JWT Decoder, Base64 Encoder, Hash Generator, Regex Tester, etc.), all computations are handled in-memory by your device's JavaScript engine. We do not maintain server-side databases for user inputs, nor do we store key-value data entered into tool inputs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-500" />
              <span>2. Browser Storage & Cookies</span>
            </h2>
            <p>
              We use standard HTML5 <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">localStorage</code> strictly to persist non-sensitive user preferences across browser sessions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Dark / Light appearance theme setting (<code className="font-mono text-xs">devstudio_theme</code>)</li>
              <li>Your bookmarked favorite tools list (<code className="font-mono text-xs">devstudio_favs</code>)</li>
            </ul>
            <p>
              No personal identification data, tracking cookies, or persistent device fingerprints are collected.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-violet-500" />
              <span>3. Advertising & Analytics</span>
            </h2>
            <p>
              To keep DevStudio completely free for developers worldwide, our site may display non-intrusive advertisements served by Google AdSense. Google AdSense uses cookies to serve ads based on user visits. You can opt out of personalized advertising by visiting Google Ad Settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Third-Party Links & Security
            </h2>
            <p>
              DevStudio may contain links to third-party developer repositories or services. We encourage users to review the privacy statements of any external sites visited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              5. Contacting Us About Privacy
            </h2>
            <p>
              If you have questions regarding this Privacy Policy or data security, please reach out via our Contact page or email privacy@devstudio.dev.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
