import { ATSAnalysisResult } from '../types';

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Docker', 'Kubernetes',
  'AWS', 'SQL', 'PostgreSQL', 'GraphQL', 'Next.js', 'Tailwind CSS', 'Git', 'CI/CD',
  'REST API', 'Microservices', 'System Design', 'Agile', 'Scrum', 'Product Management',
  'Data Analysis', 'Machine Learning', 'Leadership', 'Communication', 'FastAPI', 'Java',
  'Go', 'GCP', 'Azure', 'Linux', 'MongoDB', 'Testing', 'Jest', 'Terraform'
];

export async function analyzeResumeFile(file: File, jobDescription: string = ''): Promise<ATSAnalysisResult> {
  let text = '';

  // Attempt to read text if text-like or extract strings
  if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    try {
      text = await file.text();
    } catch {
      text = '';
    }
  }

  // If binary (e.g. PDF/DOCX), we can extract ascii character blocks for quick heuristic preview
  if (!text) {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer.slice(0, 500000)); // scan first 500KB
      let ascii = '';
      for (let i = 0; i < bytes.length; i++) {
        const c = bytes[i];
        if ((c >= 32 && c <= 126) || c === 10 || c === 13) {
          ascii += String.fromCharCode(c);
        } else if (c === 0) {
          ascii += ' ';
        }
      }
      text = ascii;
    } catch {
      text = file.name;
    }
  }

  const words = text.match(/\b[A-Za-z0-9+#.-]+\b/g) || [];
  const wordCount = Math.max(words.length, Math.round(file.size / 7));
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 220));

  const lowerText = text.toLowerCase();
  
  // Find present skills
  const skillsFound = COMMON_SKILLS.filter(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(text);
  });

  // Extract job description target skills if provided
  let targetJobSkills: string[] = [];
  if (jobDescription.trim()) {
    targetJobSkills = COMMON_SKILLS.filter(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(jobDescription);
    });
  }

  const missingSkills = targetJobSkills.filter(s => !skillsFound.includes(s));

  // Section checks
  const sectionsFound = {
    summary: /summary|objective|about me|profile/i.test(lowerText),
    experience: /experience|work history|employment|career/i.test(lowerText),
    education: /education|degree|university|college|bachelor|master|phd/i.test(lowerText),
    skills: /skills|competencies|technologies|tools/i.test(lowerText) || skillsFound.length > 3,
    contact: /@|\.com|phone|tel|email|linkedin/i.test(lowerText),
  };

  // Contact info regexes
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const links = (text.match(/https?:\/\/[^\s"'<>]+/g) || []).length;

  // Calculate ATS Score (0 - 100)
  let score = 55; // baseline

  if (sectionsFound.summary) score += 5;
  if (sectionsFound.experience) score += 12;
  if (sectionsFound.education) score += 8;
  if (sectionsFound.skills) score += 8;
  if (sectionsFound.contact) score += 5;

  if (skillsFound.length >= 8) score += 10;
  else if (skillsFound.length >= 4) score += 6;

  if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
    score += 4; // ATS friendly format
  }

  if (targetJobSkills.length > 0) {
    const matchRatio = (targetJobSkills.length - missingSkills.length) / targetJobSkills.length;
    score = Math.round(score * 0.6 + matchRatio * 40);
  }

  score = Math.min(98, Math.max(38, score));

  // Suggestions
  const suggestions: string[] = [];
  if (!sectionsFound.summary) suggestions.push('Add an executive Summary/About section at the top of your resume.');
  if (!sectionsFound.skills) suggestions.push('Highlight a dedicated Technical Skills section for automated parser discovery.');
  if (skillsFound.length < 5) suggestions.push('Include more specific technology keywords (languages, frameworks, cloud platforms).');
  if (missingSkills.length > 0) suggestions.push(`Add targeted keywords matched in the job description: ${missingSkills.slice(0, 4).join(', ')}.`);
  if (!emailMatch) suggestions.push('Ensure your contact email is clearly formatted in plain text.');

  return {
    score,
    wordCount,
    readingTimeMinutes,
    skillsFound,
    missingSkills,
    sectionsFound,
    contactInfo: {
      emailDetected: emailMatch ? emailMatch[0] : null,
      phoneDetected: phoneMatch ? phoneMatch[0] : null,
      linksCount: links,
    },
    suggestions: suggestions.length > 0 ? suggestions : ['Well-structured formatting and keyword distribution.'],
  };
}
