import React from "react";
import { TOOL_EXPLANATIONS } from "../data/toolExplanations";
import { BookOpen, CheckCircle, HelpCircle, Lightbulb, Sparkles, ShieldCheck } from "lucide-react";

interface ToolExplanationSectionProps {
  toolId: string;
}

export const ToolExplanationSection: React.FC<ToolExplanationSectionProps> = ({ toolId }) => {
  const explanation = TOOL_EXPLANATIONS[toolId];

  if (!explanation) return null;

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/80 space-y-8 animate-fade-in text-slate-800 dark:text-slate-200">
      {/* Article Header & Overview */}
      <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <BookOpen className="w-4 h-4" />
          <span>Documentation & Guide</span>
        </div>

        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {explanation.title}
        </h2>

        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
          {explanation.subtitle}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none text-xs lg:text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3 pt-2">
          {explanation.whatIsText.split("\n\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Grid: How to Use & Key Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-by-Step Instructions */}
        <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Lightbulb className="w-4 h-4" />
            <span>How to Use This Tool</span>
          </div>

          <ol className="space-y-3 text-xs lg:text-sm">
            {explanation.howToUseSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                  {idx + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-300 pt-0.5 leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Key Features */}
        <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            <Sparkles className="w-4 h-4" />
            <span>Key Features & Benefits</span>
          </div>

          <ul className="space-y-3 text-xs lg:text-sm">
            {explanation.keyFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {feat}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Common Use Cases */}
      <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Practical Developer Use Cases</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {explanation.commonUseCases.map((useCase, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              {useCase}
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {explanation.faq.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5"
            >
              <h4 className="font-bold text-xs lg:text-sm text-slate-900 dark:text-white">
                {item.question}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
