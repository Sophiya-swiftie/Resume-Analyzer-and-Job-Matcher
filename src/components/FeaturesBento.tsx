import React from 'react';
import { CheckCircle2, ShieldCheck, Zap, Database } from 'lucide-react';
import workflowImg from '../assets/images/feature_workflow_diagram_1790759162632.jpg';
import reviewImg from '../assets/images/showcase_candidate_review_1790759173654.jpg';

export const FeaturesBento: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#0d131f]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <span className="text-blue-400">Step 03</span>
            <span aria-hidden="true">·</span>
            <span>Platform Capabilities</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display text-balance">
            Engineered for high-volume recruitment pipelines.
          </h2>
          <p className="text-slate-300 mt-2 text-base leading-relaxed">
            From parsing complex multi-column PDFs to scoring against stringent job requisitions,
            our n8n automated workflow delivers reliable intelligence at scale.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 2-col span with Workflow Diagram */}
          <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-[#0f172a] overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span className="text-blue-400">Automated Intake</span>
                <span aria-hidden="true">·</span>
                <span>Binary PDF/DOCX Parser</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                01. Low-latency document extraction & normalization
              </h3>
              <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
                Ingests candidate documents in real time, stripping formatting quirks, parsing tabular
                work histories, and extracting contact credentials without losing contextual syntax.
              </p>
            </div>

            <div className="relative h-64 sm:h-72 w-full overflow-hidden border-t border-slate-800">
              <img
                src={workflowImg}
                alt="Document intelligence automation workflow diagram"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
            </div>
          </div>

          {/* Card 2: 1-col span - Real-time ATS Rubric */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span className="text-blue-400">Scoring Engine</span>
                <span aria-hidden="true">·</span>
                <span>Rubric Matrices</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                02. Multi-factor ATS scoring
              </h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Scores candidate suitability across keyword density, quantifiable business impact,
                career trajectory, and educational credentials.
              </p>
            </div>

            <div className="pt-6 space-y-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Keyword Alignment</span>
                <span className="text-emerald-400 font-mono font-semibold">96%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Impact Quantification</span>
                <span className="text-emerald-400 font-mono font-semibold">92%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">ATS Formatting Index</span>
                <span className="text-emerald-400 font-mono font-semibold">98%</span>
              </div>
            </div>
          </div>

          {/* Card 3: 1-col span - Recruiter Experience */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span className="text-blue-400">Hiring Collaboration</span>
                <span aria-hidden="true">·</span>
                <span>Review Speed</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                03. Talent Acquisition Dossiers
              </h3>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                Generates actionable summaries for interviewers with structured follow-up questions.
              </p>
            </div>

            <div className="relative h-44 w-full overflow-hidden border-t border-slate-800">
              <img
                src={reviewImg}
                alt="Talent acquisition team reviewing candidate analytics"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 4: 2-col span - Infrastructure & Reliability */}
          <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span className="text-blue-400">Infrastructure</span>
                <span aria-hidden="true">·</span>
                <span>n8n Cloud Host</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                04. Enterprise-grade execution & CORS proxy resilience
              </h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Direct browser connections to cloud forms often run into origin and framing restrictions.
                Our dedicated server middleware provides seamless, buffered binary forwarding with zero
                packet loss and immediate response parsing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-800 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Memory Buffering</strong>
                  <span className="text-slate-400 text-[11px]">No temporary disk leaks</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Zap className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Sub-second Dispatch</strong>
                  <span className="text-slate-400 text-[11px]">Instant webhook triggering</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Database className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Schema Audited</strong>
                  <span className="text-slate-400 text-[11px]">Strict field-0/1/2 mapping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
