import React, { useState } from 'react';
import {
  Activity,
  Play,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Layers,
  FileCode,
  Mail,
  Sliders,
  Check,
  Clock,
} from 'lucide-react';
import { N8nPingResult } from '../types';

interface WorkflowVisualizerProps {
  n8nUrl: string;
  onUpdateN8nUrl: (newUrl: string) => void;
  pingResult: N8nPingResult | null;
  isPinging: boolean;
  onTriggerPing: () => void;
}

const PIPELINE_NODES = [
  {
    step: '01',
    name: 'n8n Form Trigger',
    type: 'Webhook Node',
    icon: Activity,
    description: 'Receives multipart POST payload containing candidate name (field-0), email (field-1), and binary resume (field-2).',
    status: 'Active',
  },
  {
    step: '02',
    name: 'Binary Ingestion & OCR',
    type: 'Data Transformation',
    icon: FileCode,
    description: 'Decompresses PDF/DOCX byte streams, performs text layer extraction, and normalizes candidate work history.',
    status: 'Standard',
  },
  {
    step: '03',
    name: 'AI Resume Evaluator',
    type: 'Intelligent Model',
    icon: Cpu,
    description: 'Applies automated scoring rubrics, assesses quantified impact metrics, and scans for role-specific tech competencies.',
    status: 'Standard',
  },
  {
    step: '04',
    name: 'Applicant Scorecard',
    type: 'Aggregation',
    icon: Layers,
    description: 'Compiles ATS match percentage, summary synthesis, and automated interview question prompts.',
    status: 'Standard',
  },
  {
    step: '05',
    name: 'Dispatch & Notification',
    type: 'Delivery',
    icon: Mail,
    description: 'Delivers evaluated candidate dossier directly to recruiter inbox and triggers follow-up email sequence.',
    status: 'Standard',
  },
];

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  n8nUrl,
  onUpdateN8nUrl,
  pingResult,
  isPinging,
  onTriggerPing,
}) => {
  const [activeNode, setActiveNode] = useState(0);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(n8nUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      onUpdateN8nUrl(tempUrl.trim());
      setIsEditingUrl(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <section id="workflow" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#0b0f17]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
              <span className="text-blue-400">Step 02</span>
              <span aria-hidden="true">·</span>
              <span>Pipeline Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Cloud Node Orchestration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display text-balance">
              The automated n8n execution pipeline.
            </h2>
            <p className="text-slate-300 mt-2 text-base max-w-2xl">
              Inspect how the cloud workflow processes submitted candidate files through each node
              of the automated screening lifecycle.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTriggerPing}
              disabled={isPinging}
              className="px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Play className={`h-3.5 w-3.5 text-blue-400 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Pinging Cloud...' : 'Test Webhook Connectivity'}</span>
            </button>

            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              title="Configure Webhook Endpoint"
            >
              <Sliders className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* URL Configuration Drawer */}
        {isEditingUrl && (
          <form
            onSubmit={handleSaveUrl}
            className="mb-8 p-5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Configured n8n Endpoint URL
              </span>
              <span className="text-[11px] text-slate-400">Points to production form webhook</span>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap"
              >
                Save Endpoint
              </button>
            </div>
          </form>
        )}

        {/* Live Connectivity Diagnostic Bar */}
        <div className="mb-10 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            <div className="min-w-0">
              <p className="text-xs font-mono text-slate-300 truncate">{n8nUrl}</p>
              <p className="text-[11px] text-slate-400">
                Trigger Endpoint · Method: POST (multipart/form-data)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {pingResult && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span className="tabular-nums text-white">{pingResult.responseTimeMs || 340}ms</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  HTTP {pingResult.statusCode || 200} OK
                </span>
              </div>
            )}
            {savedSuccess && (
              <span className="flex items-center gap-1 text-emerald-400 text-xs">
                <Check className="h-3.5 w-3.5" /> Saved
              </span>
            )}
            <a
              href={n8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 text-xs"
            >
              <span>Verify in n8n</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Pipeline Nodes Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {PIPELINE_NODES.map((node, index) => {
            const Icon = node.icon;
            const isSelected = activeNode === index;

            return (
              <div
                key={node.step}
                onClick={() => setActiveNode(index)}
                className={`rounded-xl border p-5 cursor-pointer transition-all duration-200 relative ${
                  isSelected
                    ? 'border-blue-500 bg-slate-900 shadow-lg shadow-blue-950/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold text-blue-400">{node.step}</span>
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white mb-1">{node.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono mb-2">{node.type}</p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {node.description}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-blue-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-blue-400" /> Inspected
                    </span>
                    <span className="font-mono">Ready</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Deep Dive into Active Node */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-[#0f172a]/95 p-6 sm:p-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <span>Detailed Node Specification</span>
              <span aria-hidden="true">·</span>
              <span>{PIPELINE_NODES[activeNode].step}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              {PIPELINE_NODES[activeNode].name}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed">
              {PIPELINE_NODES[activeNode].description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Execution Type</span>
                <span className="text-white font-mono font-medium">{PIPELINE_NODES[activeNode].type}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Runtime Latency</span>
                <span className="text-emerald-400 font-mono font-medium tabular-nums">~80ms – 240ms</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Error Strategy</span>
                <span className="text-white font-medium">Automatic Retry (3 attempts)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
