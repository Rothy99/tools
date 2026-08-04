import React from "react";
import { Terminal, Shield, FileText, Mail, Heart, ExternalLink, Code2 } from "lucide-react";

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 mt-16 transition-colors">
      <div className="max-w-[1530px] mx-auto px-4 lg:px-6 py-10 lg:py-12 space-y-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Identity & Mission */}
          <div className="space-y-3">
            <div
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 cursor-pointer group w-fit"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                DevStudio<span className="text-indigo-500">.</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              DevStudio provides 100% free, client-side, privacy-focused developer tools. No code or payloads leave your browser window.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                100% Offline Client-Side
              </span>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Legal & Identity</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate("privacy")}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("terms")}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Us & Feedback</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Developer Utilities Direct Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-sky-500" />
              <span>Popular Utilities</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate("json-formatter")}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  JSON Formatter & Validator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("jwt-decoder")}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  JWT Token Decoder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("base64")}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Base64 Encoder / Decoder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("regex-tester")}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Regex Match Tester
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} DevStudio. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate("privacy")}
              className="hover:underline text-slate-600 dark:text-slate-300"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate("terms")}
              className="hover:underline text-slate-600 dark:text-slate-300"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate("contact")}
              className="hover:underline text-slate-600 dark:text-slate-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
