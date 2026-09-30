import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SubmissionRecord } from '../types';

interface SubmissionHistoryProps {
  history: SubmissionRecord[];
  onClearHistory: () => void;
  onAnalyzeNew: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  history,
  onClearHistory,
  onAnalyzeNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `n8n_resume_submissions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section id="history" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#0b0f17]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
              <span className="text-blue-400">Step 04</span>
              <span aria-hidden="true">·</span>
              <span>Audit Records</span>
              <span aria-hidden="true">·</span>
              <span>Pipeline Log</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display text-balance">
              Candidate submission history.
            </h2>
            <p className="text-slate-300 mt-2 text-base">
              Track candidate resumes delivered to the n8n automation workflow with timestamps and execution receipts.
            </p>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportJSON}
                className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5 text-slate-400" />
                <span>Export Audit JSON</span>
              </button>
              <button
                onClick={onClearHistory}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/20 border border-slate-800 rounded-lg transition-colors"
                title="Clear History"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/60 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">No submissions recorded yet</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              When you submit resumes through the intake form, each record and its n8n execution confirmation will be logged here.
            </p>
            <button
              onClick={onAnalyzeNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Submit First Resume</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search filter */}
            <div className="flex items-center gap-2 max-w-md bg-slate-900 rounded-lg border border-slate-800 px-3.5 py-2 text-xs">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate name, email, or reference ID..."
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0f172a]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4 font-medium">Reference ID</th>
                    <th className="py-3 px-4 font-medium">Candidate</th>
                    <th className="py-3 px-4 font-medium">Document</th>
                    <th className="py-3 px-4 font-medium">ATS Match</th>
                    <th className="py-3 px-4 font-medium">Dispatched</th>
                    <th className="py-3 px-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-blue-400">
                        {item.id}
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-white block font-medium">{item.name}</strong>
                        <span className="text-[11px] text-slate-400">{item.email}</span>
                      </td>
                      <td className="py-3 px-4 truncate max-w-[180px]">
                        <span className="text-slate-200">{item.fileName}</span>
                        <span className="text-[11px] text-slate-400 block tabular-nums">
                          {(item.fileSizeBytes / 1024).toFixed(1)} KB
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                          {item.atsScore || 80}/100
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px] font-mono tabular-nums">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span>{new Date(item.submittedAt).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Delivered</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
