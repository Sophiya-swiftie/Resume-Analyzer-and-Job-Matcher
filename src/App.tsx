import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ResumeAnalyzerForm } from './components/ResumeAnalyzerForm';
import { WorkflowVisualizer } from './components/WorkflowVisualizer';
import { FeaturesBento } from './components/FeaturesBento';
import { SubmissionHistory } from './components/SubmissionHistory';
import { Footer } from './components/Footer';
import { SubmissionRecord, N8nPingResult } from './types';

const DEFAULT_N8N_URL = 'https://sophiya-2712.app.n8n.cloud/form/1800a8bc-5ee9-418a-bbd2-aa2f72fd6b7d';
const STORAGE_KEY = 'apexresume_submissions_history';
const URL_STORAGE_KEY = 'apexresume_n8n_url';

export default function App() {
  const [n8nUrl, setN8nUrl] = useState<string>(() => {
    return localStorage.getItem(URL_STORAGE_KEY) || DEFAULT_N8N_URL;
  });

  const [history, setHistory] = useState<SubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pingResult, setPingResult] = useState<N8nPingResult | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Could not persist submissions to localStorage', e);
    }
  }, [history]);

  // Sync n8n URL to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(URL_STORAGE_KEY, n8nUrl);
    } catch (e) {
      console.warn('Could not persist URL to localStorage', e);
    }
  }, [n8nUrl]);

  // Run initial test ping on mount
  const checkEndpointHealth = async () => {
    setIsPinging(true);
    try {
      const res = await fetch(`/api/test-n8n?url=${encodeURIComponent(n8nUrl)}`);
      const data = await res.json();
      setPingResult(data);
    } catch (err: any) {
      setPingResult({
        success: false,
        error: err.message,
        targetUrl: n8nUrl,
      });
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    checkEndpointHealth();
  }, [n8nUrl]);

  const handleSubmissionSuccess = (newRecord: SubmissionRecord) => {
    setHistory((prev) => [newRecord, ...prev]);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all logged candidate submissions from your browser?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      <Navbar
        onAnalyzeClick={() => scrollToSection('analyzer')}
        onWorkflowClick={() => scrollToSection('workflow')}
        onHistoryClick={() => scrollToSection('history')}
        historyCount={history.length}
      />

      <main className="flex-1">
        <Hero
          onAnalyzeClick={() => scrollToSection('analyzer')}
          onWorkflowClick={() => scrollToSection('workflow')}
          endpointStatus={pingResult?.success ? 'healthy' : 'checking'}
          latencyMs={pingResult?.responseTimeMs}
        />

        <ResumeAnalyzerForm
          onSubmissionSuccess={handleSubmissionSuccess}
          customN8nUrl={n8nUrl !== DEFAULT_N8N_URL ? n8nUrl : undefined}
        />

        <WorkflowVisualizer
          n8nUrl={n8nUrl}
          onUpdateN8nUrl={setN8nUrl}
          pingResult={pingResult}
          isPinging={isPinging}
          onTriggerPing={checkEndpointHealth}
        />

        <FeaturesBento />

        <SubmissionHistory
          history={history}
          onClearHistory={handleClearHistory}
          onAnalyzeNew={() => scrollToSection('analyzer')}
        />
      </main>

      <Footer n8nUrl={n8nUrl} />
    </div>
  );
}
