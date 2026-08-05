import React, { useState } from "react";
import { HelpCircle, Info } from "lucide-react";

export interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  maxWidth?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className = "",
  maxWidth = "max-w-xs sm:max-w-sm",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent border-t-4 border-x-4",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent border-b-4 border-x-4",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-800 border-y-transparent border-r-transparent border-l-4 border-y-4",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-800 border-y-transparent border-l-transparent border-r-4 border-y-4",
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 ${positionClasses[position]} ${maxWidth} w-max pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95`}
        >
          <div className="relative px-3 py-2 bg-slate-900/95 dark:bg-slate-800/95 text-slate-100 text-xs rounded-xl shadow-xl border border-slate-700/80 dark:border-slate-700 backdrop-blur-md leading-relaxed whitespace-normal font-sans">
            {content}
            <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export interface InfoTooltipProps {
  text: React.ReactNode;
  label?: string;
  icon?: "help" | "info";
  position?: "top" | "bottom" | "left" | "right";
  iconClassName?: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  label,
  icon = "help",
  position = "top",
  iconClassName = "w-3.5 h-3.5 text-slate-400 hover:text-indigo-500 transition-colors",
  className = "",
}) => {
  const IconComponent = icon === "info" ? Info : HelpCircle;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {label && <span>{label}</span>}
      <Tooltip content={text} position={position}>
        <button
          type="button"
          tabIndex={0}
          className="p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-help transition-colors"
          aria-label="More information"
        >
          <IconComponent className={iconClassName} />
        </button>
      </Tooltip>
    </span>
  );
};
