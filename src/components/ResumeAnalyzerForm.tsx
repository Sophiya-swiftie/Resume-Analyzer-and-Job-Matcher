import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles,
  ExternalLink,
  Target,
  FileCheck,
  Send,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { analyzeResumeFile } from '../utils/resumeParser';
import { ATSAnalysisResult, SubmissionRecord } from '../types';

interface ResumeAnalyzerFormProps {
  onSubmissionSuccess: (record: SubmissionRecord) => void;
  customN8nUrl?: string;
}

const SAMPLE_RESUMES = [
  {
    name: 'Sophia Vance',
    email: 'sophia.vance@example.com',
    role: 'Senior Full Stack Engineer',
    filename: 'sophia_vance_resume.txt',
    content: `Sophia Vance
sophia.vance@example.com | (555) 234-5678 | San Francisco, CA | https://github.com/sophiavance

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 7+ years of expertise in architecting high-concurrency cloud systems, distributed microservices, and modern web applications with React, TypeScript, and Python.

WORK EXPERIENCE
Lead Software Engineer | Apex Systems (2022 - Present)
- Engineered scalable backend microservices using Node.js, TypeScript, and PostgreSQL serving 12M monthly active users.
- Reduced API latency by 42% through Redis caching layers and database query optimization.
- Led automated CI/CD pipeline deployments using Docker, Kubernetes, and AWS ECS.

Senior Software Engineer | DataGrid Technologies (2019 - 2022)
- Built interactive analytics dashboards using React, Next.js, and GraphQL.
- Authored automated test suites with Jest and Playwright achieving 94% test coverage.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2015 - 2019)

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, Go
Frameworks & Libraries: React, Node.js, Next.js, Express, Tailwind CSS, GraphQL
Cloud & DevOps: AWS, Docker, Kubernetes, Git, CI/CD, Terraform, Linux
Data & Tools: PostgreSQL, Redis, MongoDB, REST API, System Design, Agile`,
  },
  {
    name: 'Marcus Reed',
    email: 'marcus.reed@example.com',
    role: 'Technical Product Manager',
    filename: 'marcus_reed_pm.txt',
    content: `Marcus Reed
marcus.reed@example.com | (555) 876-5432 | New York, NY

EXECUTIVE SUMMARY
Technical Product Manager with a track record of driving 0-to-1 SaaS products from ideation to scale. Skilled in agile methodologies, data analysis, user research, and cross-functional leadership between engineering and business stakeholders.

PROFESSIONAL EXPERIENCE
Senior Product Manager | StrataCloud (2021 - Present)
- Owned product roadmap for enterprise workflow automation platform, generating $3.2M ARR.
- Spearheaded user telemetry tracking with SQL and Mixpanel to drive 28% increase in onboarding conversion.
- Collaborated daily with engineering squads across sprint planning, user stories, and feature prioritization.

Product Manager | Vertex Labs (2018 - 2021)
- Led team of 8 engineers and designers launching machine learning developer API.
- Implemented Agile Scrum framework reducing cycle time by 3 weeks.

EDUCATION
B.A. in Economics & Data Science | Columbia University

CORE COMPETENCIES
Product Management, Agile, Scrum, Data Analysis, SQL, REST API, Jira, User Research, System Design, Leadership, Communication`,
  },
];

export const ResumeAnalyzerForm: React.FC<ResumeAnalyzerFormProps> = ({
  onSubmissionSuccess,
  customN8nUrl,
}) => {
  // Form fields matching n8n schema: field-0 (name), field-1 (email), field-2 (file)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [showJobMatcher, setShowJobMatcher] = useState(false);

  // States
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [atsDiagnostics, setAtsDiagnostics] = useState<ATSAnalysisResult | null>(null);
  const [isAnalyzingLocal, setIsAnalyzingLocal] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<SubmissionRecord | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze file locally for instant feedback
  useEffect(() => {
    if (!file) {
      setAtsDiagnostics(null);
      return;
    }

    let isMounted = true;
    setIsAnalyzingLocal(true);

    analyzeResumeFile(file, jobDescription)
      .then((diagnostics) => {
        if (isMounted) {
          setAtsDiagnostics(diagnostics);
          setIsAnalyzingLocal(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsAnalyzingLocal(false);
      });

    return () => {
      isMounted = false;
    };
  }, [file, jobDescription]);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const fileNameLower = selectedFile.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileNameLower.endsWith(ext));

    if (!hasValidExt) {
      setError('Please upload a resume in PDF, DOCX, DOC, or TXT format.');
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size exceeds 25MB limit. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = (sample: typeof SAMPLE_RESUMES[0]) => {
    setName(sample.name);
    setEmail(sample.email);
    const sampleBlob = new Blob([sample.content], { type: 'text/plain' });
    const sampleFile = new File([sampleBlob], sample.filename, { type: 'text/plain' });
    setFile(sampleFile);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Candidate Name (field-0) is required.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Valid Email Address (field-1) is required.');
      return;
    }

    if (!file) {
      setError('Please attach a resume file (field-2).');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep('Preparing multipart schema payload...');

    try {
      const formData = new FormData();
      formData.append('field-0', name.trim());
      formData.append('field-1', email.trim());
      formData.append('field-2', file);

      if (customN8nUrl) {
        formData.append('customUrl', customN8nUrl);
      }

      setSubmissionStep('Dispatching payload to n8n cloud webhook...');

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
        headers: customN8nUrl ? { 'x-n8n-url': customN8nUrl } : undefined,
      });

      setSubmissionStep('Awaiting n8n workflow execution...');

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `n8n webhook error (Status ${response.status})`);
      }

      const submissionRecord: SubmissionRecord = {
        id: result.submissionId || `N8N-${Date.now().toString(36).toUpperCase()}`,
        name: name.trim(),
        email: email.trim(),
        fileName: file.name,
        fileSizeBytes: file.size,
        submittedAt: new Date().toISOString(),
        status: 'delivered',
        n8nResponse: typeof result.n8nResponse === 'string' ? result.n8nResponse : 'Workflow received successfully',
        atsScore: atsDiagnostics?.score || 82,
        detectedSkills: atsDiagnostics?.skillsFound || [],
        targetRole: jobDescription ? 'Custom Target' : 'General Evaluation',
      };

      setSubmittedResult(submissionRecord);
      onSubmissionSuccess(submissionRecord);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit resume to n8n webhook. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmissionStep('');
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setFile(null);
    setAtsDiagnostics(null);
    setSubmittedResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copySubmissionId = () => {
    if (submittedResult?.id) {
      navigator.clipboard.writeText(submittedResult.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <section id="analyzer" className="py-16 sm:py-24 border-b border-slate-800/80 bg-[#0d131f]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <span className="text-blue-400">Step 01</span>
            <span aria-hidden="true">·</span>
            <span>Resume Intake Engine</span>
            <span aria-hidden="true">·</span>
            <span>Direct n8n Form Mapping</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display text-balance">
            Submit candidate for automated screening.
          </h2>
          <p className="text-slate-300 mt-2 text-base leading-relaxed">
            Fields map directly to the n8n form schema: Candidate Name (<code className="text-blue-300 font-mono text-xs">field-0</code>),
            Email Address (<code className="text-blue-300 font-mono text-xs">field-1</code>), and
            Resume Document (<code className="text-blue-300 font-mono text-xs">field-2</code>).
          </p>
        </div>

        {/* Quick Sample Candidates */}
        <div className="mb-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="font-semibold text-white">Quick Test Candidates:</span>
            <span className="text-slate-400 hidden sm:inline">Load sample profile to test n8n pipeline without uploading</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_RESUMES.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-md transition-colors whitespace-nowrap"
              >
                Load {sample.name} ({sample.role})
              </button>
            ))}
          </div>
        </div>

        {/* Success Modal / State */}
        {submittedResult ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-md">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Resume Delivered to n8n Pipeline!
                </h3>
                <p className="text-slate-300 text-sm mt-2">
                  The resume for <strong className="text-white">{submittedResult.name}</strong> was successfully dispatched
                  to the n8n automation workflow (<code className="text-xs font-mono text-blue-300">1800a8bc...</code>).
                </p>
              </div>

              {/* Receipt details */}
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 text-left space-y-3">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                  <span className="text-slate-400">Tracking Reference</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-400 font-semibold">{submittedResult.id}</span>
                    <button
                      onClick={copySubmissionId}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                      title="Copy Reference ID"
                    >
                      {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Candidate Email</span>
                    <span className="text-white font-medium">{submittedResult.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Attached Document</span>
                    <span className="text-white font-medium truncate block">{submittedResult.fileName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Estimated ATS Score</span>
                    <span className="text-emerald-400 font-semibold font-mono tabular-nums">{submittedResult.atsScore}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Pipeline Status</span>
                    <span className="text-emerald-400 font-medium">Delivered to Cloud</span>
                  </div>
                </div>

                {submittedResult.detectedSkills && submittedResult.detectedSkills.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 text-xs block mb-1.5">Parsed Key Competencies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {submittedResult.detectedSkills.slice(0, 10).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 text-[11px] font-mono bg-slate-900 text-slate-300 rounded border border-slate-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Analyze Another Candidate</span>
                </button>

                <a
                  href="https://sophiya-2712.app.n8n.cloud/form/1800a8bc-5ee9-418a-bbd2-aa2f72fd6b7d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Open Raw n8n Form</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Main Interactive Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Intake Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#0f172a]/95 p-6 sm:p-8 shadow-xl space-y-6"
            >
              {error && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-red-300">Submission Blocked</strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Field 0: Candidate Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="field-0" className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Candidate Full Name <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">field-0</span>
                </div>
                <input
                  id="field-0"
                  name="field-0"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-slate-950/70 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Field 1: Candidate Email */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="field-1" className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">field-1</span>
                </div>
                <input
                  id="field-1"
                  name="field-1"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@organization.com"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-slate-950/70 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Field 2: Resume File Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="field-2" className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Upload Resume Document <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">field-2 (PDF, DOCX, TXT)</span>
                </div>

                <input
                  ref={fileInputRef}
                  id="field-2"
                  name="field-2"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {!file ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-blue-400 bg-blue-950/30'
                        : 'border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-950/70'
                    }`}
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-blue-400 mb-3">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      Drag and drop candidate resume here, or <span className="text-blue-400 underline underline-offset-2">browse files</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports PDF, DOCX, DOC, or TXT up to 25MB
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-blue-900/30 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        <p className="text-xs text-slate-400 tabular-nums">
                          {(file.size / 1024).toFixed(1)} KB · {file.type || 'Document'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      disabled={isSubmitting}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Optional Job Description Matcher Accordion */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowJobMatcher(!showJobMatcher)}
                  className="flex items-center justify-between w-full text-xs font-medium text-slate-300 hover:text-white transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-blue-400" />
                    <span>Optional: Match Against Specific Job Description</span>
                  </span>
                  <span className="text-slate-500 font-mono">{showJobMatcher ? 'Hide −' : 'Add +'}</span>
                </button>

                {showJobMatcher && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste target job requirements (e.g. Senior Frontend Engineer: React, TypeScript, GraphQL, AWS, CI/CD, 5+ years experience...)"
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-slate-950/70 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <p className="text-[11px] text-slate-400">
                      Keywords from the job description are compared in real-time to compute the candidate alignment score.
                    </p>
                  </div>
                )}
              </div>

              {/* Submission CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !file}
                  className={`w-full py-3.5 px-6 rounded-lg text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isSubmitting || !file
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-900/40 cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-blue-300" />
                      <span>{submissionStep || 'Processing with n8n...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Trigger n8n Resume Analyzer</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 mt-2.5">
                  Submits via secure proxy to <span className="font-mono text-slate-300">sophiya-2712.app.n8n.cloud</span>
                </p>
              </div>
            </form>

            {/* Right 5 cols: Live Heuristics & Inspection Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/95 p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Live Pre-Screening Review
                    </h3>
                  </div>
                  {isAnalyzingLocal && (
                    <span className="flex items-center gap-1 text-[11px] text-blue-400 font-mono">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Inspecting
                    </span>
                  )}
                </div>

                {!file ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <p className="text-xs">Attach a resume or select a sample candidate to view automated diagnostics.</p>
                    <p className="text-[11px] text-slate-400">
                      Calculates ATS readiness, word density, and extracted tech competencies.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-5">
                    {/* Score Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Estimated ATS Compatibility</span>
                        <span className="font-mono text-white font-bold tabular-nums">
                          {atsDiagnostics?.score || 75}/100
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${atsDiagnostics?.score || 75}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Word Count</span>
                        <span className="text-white font-mono font-semibold tabular-nums text-sm">
                          {atsDiagnostics?.wordCount || 0} words
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Est. Read Time</span>
                        <span className="text-white font-mono font-semibold tabular-nums text-sm">
                          {atsDiagnostics?.readingTimeMinutes || 1} min
                        </span>
                      </div>
                    </div>

                    {/* Section Completeness Check */}
                    <div>
                      <span className="text-xs font-semibold text-slate-300 block mb-2">
                        Essential Sections Detected
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {atsDiagnostics?.sectionsFound &&
                          Object.entries(atsDiagnostics.sectionsFound).map(([section, found]) => (
                            <div
                              key={section}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border capitalize ${
                                found
                                  ? 'bg-slate-950 border-slate-800 text-slate-200'
                                  : 'bg-red-950/20 border-red-900/30 text-red-300'
                              }`}
                            >
                              <CheckCircle2
                                className={`h-3 w-3 ${found ? 'text-emerald-400' : 'text-slate-600'}`}
                              />
                              <span className="text-[11px]">{section}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Extracted Skills */}
                    {atsDiagnostics?.skillsFound && atsDiagnostics.skillsFound.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-slate-300 block mb-2">
                          Identified Skills ({atsDiagnostics.skillsFound.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {atsDiagnostics.skillsFound.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 text-[11px] font-mono bg-blue-950/40 text-blue-300 border border-blue-800/50 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {atsDiagnostics?.suggestions && atsDiagnostics.suggestions.length > 0 && (
                      <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                        <span className="font-semibold text-slate-300 block text-[11px] uppercase tracking-wider">
                          Key Recommendation:
                        </span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          {atsDiagnostics.suggestions[0]}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
