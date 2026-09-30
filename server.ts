import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Setup multer memory storage for fast in-memory forwarding to n8n
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DEFAULT_N8N_URL = 'https://sophiya-2712.app.n8n.cloud/form/1800a8bc-5ee9-418a-bbd2-aa2f72fd6b7d';

// API: Health & Workflow Meta
app.get('/api/workflow-info', async (_req, res) => {
  res.json({
    status: 'online',
    defaultUrl: DEFAULT_N8N_URL,
    service: 'n8n Resume Analyzer Automation',
    version: '1.0.0',
    fields: [
      { id: 'field-0', label: 'Candidate Name', type: 'text', required: true },
      { id: 'field-1', label: 'Email Address', type: 'email', required: true },
      { id: 'field-2', label: 'Upload Resume', type: 'file', required: true, multiple: true },
    ],
  });
});

// API: Ping and test connection to n8n form endpoint
app.get('/api/test-n8n', async (req, res) => {
  const targetUrl = (req.query.url as string) || DEFAULT_N8N_URL;
  const startTime = Date.now();

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'ResumeAnalyzer-Client/1.0',
      },
    });

    const duration = Date.now() - startTime;
    const isOk = response.ok;
    const status = response.status;
    const text = await response.text();
    const hasForm = text.includes('Resume Analyzer') || text.includes('field-0');

    res.json({
      success: isOk,
      statusCode: status,
      responseTimeMs: duration,
      endpointReachable: true,
      formDetected: hasForm,
      targetUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(502).json({
      success: false,
      statusCode: 502,
      error: error.message || 'Unable to reach n8n endpoint',
      targetUrl,
    });
  }
});

// API: Forward resume submission to n8n webhook/form
app.post('/api/analyze-resume', upload.any(), async (req, res) => {
  try {
    const customUrl = (req.headers['x-n8n-url'] as string) || req.body?.customUrl;
    const targetUrl = customUrl || DEFAULT_N8N_URL;

    // Extract form fields
    const name = req.body['field-0'] || req.body.name || '';
    const email = req.body['field-1'] || req.body.email || '';

    if (!name || !email) {
      return res.status(400).json({
        error: 'Missing required fields: Name and Email are mandatory.',
      });
    }

    // Prepare Node FormData for forwarding
    const forwardFormData = new FormData();
    forwardFormData.append('field-0', name);
    forwardFormData.append('field-1', email);

    const files = req.files as Express.Multer.File[] | undefined;
    let fileName = 'resume.pdf';
    let fileSize = 0;
    let mimeType = 'application/pdf';

    if (files && files.length > 0) {
      for (const file of files) {
        fileName = file.originalname;
        fileSize = file.size;
        mimeType = file.mimetype || 'application/octet-stream';
        const blob = new Blob([new Uint8Array(file.buffer)], { type: mimeType });
        forwardFormData.append('field-2', blob, file.originalname);
      }
    } else {
      return res.status(400).json({
        error: 'Please upload a resume file (field-2).',
      });
    }

    // Forward to n8n endpoint
    const n8nStartTime = Date.now();
    const n8nResponse = await fetch(targetUrl, {
      method: 'POST',
      body: forwardFormData,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ResumeAnalyzerProxy/1.0',
        'Accept': '*/*',
      },
    });

    const elapsed = Date.now() - n8nStartTime;
    const responseText = await n8nResponse.text();

    let parsedResponse: any = null;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      // n8n might return HTML or raw text
    }

    const isSuccessful = n8nResponse.ok;
    const submissionId = `N8N-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Perform quick file heuristic diagnostics for immediate rich client feedback
    res.json({
      success: isSuccessful,
      submissionId,
      statusCode: n8nResponse.status,
      elapsedMs: elapsed,
      targetUrl,
      fileInfo: {
        name: fileName,
        sizeBytes: fileSize,
        type: mimeType,
      },
      candidate: {
        name,
        email,
      },
      n8nResponse: parsedResponse || (responseText.length < 500 ? responseText : 'Workflow submission accepted'),
      submittedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-resume:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to communicate with n8n workflow',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (NODE_ENV=${process.env.NODE_ENV})`);
  });
}

startServer();
