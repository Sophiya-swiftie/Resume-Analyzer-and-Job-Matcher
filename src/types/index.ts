export interface SubmissionRecord {
  id: string;
  name: string;
  email: string;
  fileName: string;
  fileSizeBytes: number;
  submittedAt: string;
  status: 'delivered' | 'processing' | 'failed';
  n8nResponse?: string;
  atsScore?: number;
  detectedSkills?: string[];
  targetRole?: string;
}

export interface ATSAnalysisResult {
  score: number;
  wordCount: number;
  readingTimeMinutes: number;
  skillsFound: string[];
  missingSkills: string[];
  sectionsFound: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    contact: boolean;
  };
  contactInfo: {
    emailDetected: string | null;
    phoneDetected: string | null;
    linksCount: number;
  };
  suggestions: string[];
}

export interface N8nPingResult {
  success: boolean;
  statusCode?: number;
  responseTimeMs?: number;
  targetUrl: string;
  formDetected?: boolean;
  timestamp?: string;
  error?: string;
}
