const BASE_URL = import.meta.env.VITE_API_URL || 'https://nonnormal-phillip-isocarpic.ngrok-free.dev';

// ─── Types ───────────────────────────────────────────────────
export interface ApiAgent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  status: 'working' | 'idle' | 'error';
  progress: number;
  task: string;
  lastTool: string;
  output: string[];
}

export interface ApiLogEntry {
  time: string;
  msg: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export interface ApiMission {
  id: string;
  goal: string;
  status: 'running' | 'completed' | 'partial' | 'stopped';
  progress: number;
  agents: number;
  tasks: number;
  duration: string;
  date: string;
}

export interface ApiMissionsResponse {
  current: ApiMission | null;
  history: ApiMission[];
}

export interface ApiFile {
  name: string;
  size: string;
  type: string;
  agent: string;
  time: string;
  category: 'uploaded' | 'generated';
}

export interface ApiManifest {
  version: string;
  capabilities: string[];
  health: { name: string; status: 'green' | 'yellow' | 'red' }[];
  apiKeys: { name: string; status: 'green' | 'yellow' | 'red'; statusText: string; key: string }[];
}

export interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

// ─── Fetch helper ────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

// ─── API calls ───────────────────────────────────────────────
export const api = {
  // Health check
  async ping(): Promise<boolean> {
    try {
      await fetch(`${BASE_URL}/api/agents`, {
        method: 'GET',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        signal: AbortSignal.timeout(5000),
      });
      return true;
    } catch {
      return false;
    }
  },

  // GET endpoints
  getAgents: () => apiFetch<ApiAgent[]>('/api/agents'),
  getTerminal: () => apiFetch<ApiLogEntry[]>('/api/terminal'),
  getMissions: () => apiFetch<ApiMissionsResponse>('/api/missions'),
  getFiles: () => apiFetch<ApiFile[]>('/api/files'),
  getManifest: () => apiFetch<ApiManifest>('/api/manifest'),
  getScreenshot: () => apiFetch<{ url: string }>('/api/screenshot'),
  getMissionHistory: () => apiFetch<{ filename: string; goal: string; started_at: string; status: string; summary_preview: string }[]>('/api/missions/history'),
  getMissionByFilename: (filename: string) => apiFetch<any>(`/api/missions/history/${encodeURIComponent(filename)}`),

  // POST endpoints
  startMission: (goal: string) => apiFetch<{ id: string; status: string }>('/api/mission', {
    method: 'POST',
    body: JSON.stringify({ goal }),
  }),

  stopMission: () => apiFetch<{ status: string }>('/api/stop', { method: 'POST' }),

  chat: (message: string, history: ChatMessage[]) => apiFetch<{ reply: string }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  }),

  uploadFile: async (file: File): Promise<{ name: string; size: string }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: form,
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return res.json();
  },
};

// ─── Mock data fallbacks ─────────────────────────────────────
export const mockData = {
  agents: (): ApiAgent[] => [
    { id: 'supervisor', name: 'Supervisor', emoji: '🎯', color: 'gray', status: 'working', progress: 90, task: 'Coordinating agent workflows and task distribution', lastTool: 'task_router', output: ['> Routing task #412 to Finance agent\n> All agents healthy, 8/11 active'] },
    { id: 'ceo', name: 'CEO', emoji: '👔', color: 'gold', status: 'working', progress: 75, task: 'Reviewing strategic alignment for SaaS market entry', lastTool: 'web_search', output: ['> Analyzing competitor pricing models\n> Found 12 relevant market reports'] },
    { id: 'coo', name: 'COO', emoji: '⚙️', color: 'blue', status: 'working', progress: 60, task: 'Optimizing operational workflows for MVP delivery', lastTool: 'run_code', output: ['> Workflow efficiency: 94.2%\n> Bottleneck detected in design pipeline'] },
    { id: 'market-research', name: 'Market Research', emoji: '🔍', color: 'cyan', status: 'working', progress: 85, task: 'Scraping competitor pricing pages and feature lists', lastTool: 'browser_read', output: ['> Scraped freshbooks.com/pricing\n> Extracted 4 pricing tiers, 23 features'] },
    { id: 'sales', name: 'Sales', emoji: '💰', color: 'green', status: 'working', progress: 40, task: 'Building outreach email templates for early adopters', lastTool: 'write_file', output: ['> Generated cold_email_v3.md\n> A/B variant created with 2 CTAs'] },
    { id: 'marketing', name: 'Marketing', emoji: '📣', color: 'pink', status: 'working', progress: 55, task: 'Drafting social media content calendar for launch', lastTool: 'web_search', output: ['> Analyzed 50 trending hashtags\n> Content plan: 12 posts over 2 weeks'] },
    { id: 'design', name: 'Design', emoji: '🎨', color: 'purple', status: 'working', progress: 70, task: 'Creating hero section mockup with brand colors', lastTool: 'run_code', output: ['> Rendering hero_v2.png (1920x1080)\n> Applied glassmorphism card overlay'] },
    { id: 'rnd', name: 'R&D', emoji: '🧪', color: 'orange', status: 'idle', progress: 0, task: 'Waiting for research data to begin prototyping', lastTool: 'none', output: ['> Standby mode\n> Awaiting input from Market Research'] },
    { id: 'finance', name: 'Finance', emoji: '📊', color: 'yellow-green', status: 'working', progress: 30, task: 'Building financial projection model for Year 1', lastTool: 'run_code', output: ['> Projected MRR: $12K by month 6\n> Break-even estimate: month 9'] },
    { id: 'legal', name: 'Legal', emoji: '⚖️', color: 'red-orange', status: 'idle', progress: 0, task: 'Queued: Review Terms of Service template', lastTool: 'none', output: ['> No active tasks\n> ToS review scheduled next'] },
    { id: 'customer-success', name: 'Customer Success', emoji: '🤝', color: 'teal', status: 'idle', progress: 0, task: 'Preparing onboarding flow documentation', lastTool: 'none', output: ['> Standby mode\n> Will activate post-launch'] },
  ],

  terminal: (): ApiLogEntry[] => {
    const msgs = [
      { msg: '[Supervisor] System core initialized', type: 'info' as const },
      { msg: '[Supervisor] Connecting to vector DB...', type: 'info' as const },
      { msg: '[Supervisor] DB Connection established', type: 'success' as const },
      { msg: '[COO] High latency on Node-3 (142ms)', type: 'warn' as const },
      { msg: '[Supervisor] Task #402 assigned to Market Research', type: 'info' as const },
      { msg: '[Market Research] Beginning competitor scan...', type: 'info' as const },
      { msg: '[Market Research] Scraping freshbooks.com/pricing', type: 'info' as const },
      { msg: '[Design] Generating hero section assets...', type: 'info' as const },
      { msg: '[Design] Asset generation complete', type: 'success' as const },
    ];
    return msgs.map((m, i) => ({
      time: `10:42:${String(i).padStart(2, '0')}`,
      ...m,
    }));
  },

  missions: (): ApiMissionsResponse => ({
    current: {
      id: 'mission-1',
      goal: 'Research competitors in the freelance invoicing SaaS space',
      status: 'running',
      progress: 45,
      agents: 8,
      tasks: 26,
      duration: '14:23',
      date: new Date().toISOString().split('T')[0],
    },
    history: [
      { id: 'm-h1', date: '2024-12-15', goal: 'E-commerce competitor analysis', status: 'completed', progress: 100, agents: 9, tasks: 34, duration: '18 min' },
      { id: 'm-h2', date: '2024-12-14', goal: 'Landing page generation for SaaS MVP', status: 'completed', progress: 100, agents: 7, tasks: 22, duration: '12 min' },
      { id: 'm-h3', date: '2024-12-13', goal: 'Content marketing strategy research', status: 'partial', progress: 70, agents: 6, tasks: 19, duration: '15 min' },
    ],
  }),

  files: (): ApiFile[] => [
    { name: 'brand_guidelines.pdf', size: '2.4 MB', type: 'pdf', agent: 'Design', time: '10:40', category: 'uploaded' },
    { name: 'competitor_list.csv', size: '156 KB', type: 'csv', agent: 'Market Research', time: '10:41', category: 'uploaded' },
    { name: 'market_analysis_report.md', size: '24 KB', type: 'markdown', agent: 'Market Research', time: '10:44', category: 'generated' },
    { name: 'competitor_matrix.csv', size: '8 KB', type: 'csv', agent: 'Market Research', time: '10:45', category: 'generated' },
    { name: 'cold_email_v3.md', size: '3 KB', type: 'markdown', agent: 'Sales', time: '10:46', category: 'generated' },
    { name: 'content_calendar.json', size: '12 KB', type: 'json', agent: 'Marketing', time: '10:47', category: 'generated' },
    { name: 'hero_section_v2.png', size: '1.8 MB', type: 'image', agent: 'Design', time: '10:48', category: 'generated' },
    { name: 'financial_projections.xlsx', size: '45 KB', type: 'excel', agent: 'Finance', time: '10:49', category: 'generated' },
  ],

  manifest: (): ApiManifest => ({
    version: 'v2.1.0-beta',
    capabilities: ['web_search', 'browser_read', 'run_code', 'write_file', 'image_gen'],
    health: [
      { name: 'Flask Server', status: 'green' },
      { name: 'ChromaDB', status: 'green' },
      { name: 'AgentDB (SQLite)', status: 'green' },
      { name: 'LiteLLM Router', status: 'green' },
      { name: 'Ollama (Local LLM)', status: 'green' },
      { name: 'Browser Automation', status: 'yellow' },
      { name: 'Image Generation', status: 'red' },
      { name: 'WebSocket Server', status: 'green' },
    ],
    apiKeys: [
      { name: 'Ollama', status: 'green', statusText: 'Running', key: 'localhost:11434' },
      { name: 'Anthropic', status: 'yellow', statusText: 'Key in .env', key: 'sk-ant-••••••••' },
      { name: 'OpenAI', status: 'red', statusText: 'Not connected', key: '—' },
      { name: 'Google AI', status: 'green', statusText: 'Connected', key: 'AIza••••••••' },
      { name: 'Stability AI', status: 'red', statusText: 'Not connected', key: '—' },
      { name: 'Stripe', status: 'red', statusText: 'Not connected', key: '—' },
    ],
  }),
};
