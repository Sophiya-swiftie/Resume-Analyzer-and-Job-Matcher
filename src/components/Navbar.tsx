import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onAnalyzeClick: () => void;
  onWorkflowClick: () => void;
  onHistoryClick: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAnalyzeClick,
  onWorkflowClick,
  onHistoryClick,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
        >
          ApexResume
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#analyzer"
            onClick={(e) => {
              e.preventDefault();
              onAnalyzeClick();
            }}
            className="hover:text-white transition-colors"
          >
            Analyze Resume
          </a>
          <a
            href="#workflow"
            onClick={(e) => {
              e.preventDefault();
              onWorkflowClick();
            }}
            className="hover:text-white transition-colors"
          >
            n8n Pipeline
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#history"
            onClick={(e) => {
              e.preventDefault();
              onHistoryClick();
            }}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Submissions</span>
            {historyCount > 0 && (
              <span className="text-xs text-blue-400 tabular-nums">({historyCount})</span>
            )}
          </a>
          <a
            href="https://sophiya-2712.app.n8n.cloud/form/1800a8bc-5ee9-418a-bbd2-aa2f72fd6b7d"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors inline-flex items-center gap-1 text-slate-400"
          >
            <span>Original Form</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAnalyzeClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors whitespace-nowrap shadow-sm shadow-blue-900/40"
          >
            Submit Resume
          </button>
        </div>
      </div>
    </header>
  );
};
