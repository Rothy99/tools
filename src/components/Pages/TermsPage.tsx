import React from "react";
import { FileText, Scale, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

interface TermsPageProps {
  onGoHome: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onGoHome }) => {
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
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Last Updated: August 2026 • Effective Immediately
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-800 dark:text-indigo-200 text-xs leading-relaxed flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <strong>Terms Overview:</strong> By accessing and using DevStudio, you agree to comply with these Terms of Service. All developer tools are provided for lawful formatting, parsing, conversion, and validation tasks.
          </div>
        </div>

        <div className="space-y-6 text-xs lg:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>1. Acceptance of Terms</span>
            </h2>
            <p>
              By accessing DevStudio, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this website.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Permitted Use & Code Integrity
            </h2>
            <p>
              DevStudio provides developer utilities free of charge for personal, commercial, and educational development workflows. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Use the tools for illegal network interference or malicious password cracking.</li>
              <li>Attempt to disrupt website infrastructure or launch automated Denial of Service (DoS) attacks.</li>
              <li>Scrape or mirror the tools in automated bot networks without attribution.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>3. Disclaimer of Warranties</span>
            </h2>
            <p>
              All tools, formats, regex calculations, and cryptographic outputs are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied. DevStudio does not guarantee that conversions will be 100% error-free in all edge cases.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Limitation of Liability
            </h2>
            <p>
              In no event shall DevStudio or its maintainers be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our developer tools.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              5. Modifications to Terms
            </h2>
            <p>
              We reserve the right to revise these terms at any time without prior notice. Continued use of the website following any changes signifies your acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
