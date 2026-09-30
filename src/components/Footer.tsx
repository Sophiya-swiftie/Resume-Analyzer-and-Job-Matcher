import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  n8nUrl: string;
}

export const Footer: React.FC<FooterProps> = ({ n8nUrl }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#070a10] py-12 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-base font-bold text-white tracking-tight">ApexResume</span>
            <p className="mt-1 text-slate-400 text-xs max-w-md">
              Automated talent screening and resume parsing interface integrated with n8n Cloud workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a
              href="#analyzer"
              className="hover:text-white transition-colors"
            >
              Intake Studio
            </a>
            <a
              href="#workflow"
              className="hover:text-white transition-colors"
            >
              n8n Nodes
            </a>
            <a
              href="#features"
              className="hover:text-white transition-colors"
            >
              Capabilities
            </a>
            <a
              href={n8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1 text-blue-400"
            >
              <span>Native n8n Form</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} ApexResume. Connected to n8n workflow node 1800a8bc.</p>
          <div className="flex items-center gap-2">
            <span>Powered by n8n Cloud Automation</span>
            <span aria-hidden="true">·</span>
            <span>REST Webhook Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
