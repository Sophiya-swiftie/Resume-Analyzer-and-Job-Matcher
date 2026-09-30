import React from 'react';
import { ArrowRight, Activity, CheckCircle2, ShieldCheck } from 'lucide-react';
import heroImage from '../assets/images/hero_resume_analyzer_1790759145265.jpg';

interface HeroProps {
  onAnalyzeClick: () => void;
  onWorkflowClick: () => void;
  endpointStatus: 'checking' | 'healthy' | 'warning';
  latencyMs?: number;
}

export const Hero: React.FC<HeroProps> = ({
  onAnalyzeClick,
  onWorkflowClick,
  endpointStatus,
  latencyMs,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition & CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed Metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-blue-400">Workflow Node 1800a8bc</span>
              <span aria-hidden="true">·</span>
              <span>n8n Cloud Automation</span>
              <span aria-hidden="true">·</span>
              <span>Candidate Screening</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display text-balance leading-[1.12]">
              Intelligent resume analysis via automated n8n workflows.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Eliminate manual hiring triage. Upload candidate resumes to instantly trigger
              automated parsing, semantic keyword evaluation, and structured ATS scoring
              orchestrated through the n8n automation engine.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onAnalyzeClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-lg shadow-blue-900/30 whitespace-nowrap"
              >
                <span>Analyze Candidate Resume</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onWorkflowClick}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
              >
                <Activity className="h-4 w-4 text-blue-400" />
                <span>Inspect Pipeline</span>
              </button>
            </div>

            {/* Quantified proof metrics */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-2xl font-bold font-display text-white tabular-nums">
                  {latencyMs ? `${latencyMs}ms` : '320ms'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Webhook Dispatch</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-white tabular-nums">3-Point</p>
                <p className="text-xs text-slate-400 mt-1">Schema Compliance</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-emerald-400 tabular-nums">100%</p>
                <p className="text-xs text-slate-400 mt-1">Workflow Sync</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
              <img
                src={heroImage}
                alt="Resume Analyzer candidate screening desk setup"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover object-center brightness-95 contrast-105"
              />

              {/* Scrim overlay with live pipeline status card */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/40 to-transparent flex flex-col justify-end p-6">
                <div className="rounded-xl bg-[#0f172a]/95 border border-slate-700/90 p-4 shadow-xl backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Active n8n Node</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Ready for Payload
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-400 truncate bg-slate-950/70 px-2.5 py-1.5 rounded border border-slate-800">
                    POST /form/1800a8bc-5ee9-418a-bbd2-aa2f72fd6b7d
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                      <span>Name · Email · Resume Upload</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>CORS Secure Proxy</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
