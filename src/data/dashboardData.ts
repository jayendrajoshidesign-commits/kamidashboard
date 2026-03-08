export const AGENTS = [
  { id: 'supervisor', name: 'Supervisor', emoji: '🎯', color: 'gray', status: 'working' as const, progress: 90, task: 'Coordinating agent workflows and task distribution', lastTool: 'task_router', output: ['> Routing task #412 to Finance agent\n> All agents healthy, 8/11 active'] },
  { id: 'ceo', name: 'CEO', emoji: '👔', color: 'gold', status: 'working' as const, progress: 75, task: 'Reviewing strategic alignment for SaaS market entry', lastTool: 'web_search', output: ['> Analyzing competitor pricing models\n> Found 12 relevant market reports'] },
  { id: 'coo', name: 'COO', emoji: '⚙️', color: 'blue', status: 'working' as const, progress: 60, task: 'Optimizing operational workflows for MVP delivery', lastTool: 'run_code', output: ['> Workflow efficiency: 94.2%\n> Bottleneck detected in design pipeline'] },
  { id: 'market-research', name: 'Market Research', emoji: '🔍', color: 'cyan', status: 'working' as const, progress: 85, task: 'Scraping competitor pricing pages and feature lists', lastTool: 'browser_read', output: ['> Scraped freshbooks.com/pricing\n> Extracted 4 pricing tiers, 23 features'] },
  { id: 'sales', name: 'Sales', emoji: '💰', color: 'green', status: 'working' as const, progress: 40, task: 'Building outreach email templates for early adopters', lastTool: 'write_file', output: ['> Generated cold_email_v3.md\n> A/B variant created with 2 CTAs'] },
  { id: 'marketing', name: 'Marketing', emoji: '📣', color: 'pink', status: 'working' as const, progress: 55, task: 'Drafting social media content calendar for launch', lastTool: 'web_search', output: ['> Analyzed 50 trending hashtags\n> Content plan: 12 posts over 2 weeks'] },
  { id: 'design', name: 'Design', emoji: '🎨', color: 'purple', status: 'working' as const, progress: 70, task: 'Creating hero section mockup with brand colors', lastTool: 'run_code', output: ['> Rendering hero_v2.png (1920x1080)\n> Applied glassmorphism card overlay'] },
  { id: 'rnd', name: 'R&D', emoji: '🧪', color: 'orange', status: 'idle' as const, progress: 0, task: 'Waiting for research data to begin prototyping', lastTool: 'none', output: ['> Standby mode\n> Awaiting input from Market Research'] },
  { id: 'finance', name: 'Finance', emoji: '📊', color: 'yellow-green', status: 'working' as const, progress: 30, task: 'Building financial projection model for Year 1', lastTool: 'run_code', output: ['> Projected MRR: $12K by month 6\n> Break-even estimate: month 9'] },
  { id: 'legal', name: 'Legal', emoji: '⚖️', color: 'red-orange', status: 'idle' as const, progress: 0, task: 'Queued: Review Terms of Service template', lastTool: 'none', output: ['> No active tasks\n> ToS review scheduled next'] },
  { id: 'customer-success', name: 'Customer Success', emoji: '🤝', color: 'teal', status: 'idle' as const, progress: 0, task: 'Preparing onboarding flow documentation', lastTool: 'none', output: ['> Standby mode\n> Will activate post-launch'] },
] as const;

export type AgentStatus = 'working' | 'idle' | 'error';

export const AGENT_COLORS: Record<string, string> = {
  gray: '#999999',
  gold: '#FF8C00',
  blue: '#3b82f6',
  cyan: '#FF8C00',
  green: 'hsl(var(--neon-green))',
  pink: '#FF4500',
  purple: '#FF6B00',
  orange: '#FF6B00',
  'yellow-green': '#84cc16',
  'red-orange': '#f97316',
  teal: '#FF8C00',
};

export const TERMINAL_MESSAGES = [
  { msg: '[Market Research] Scraping freshbooks.com/pricing...', type: 'info' },
  { msg: '[CEO] Strategic alignment score: 94.2%', type: 'success' },
  { msg: '[Sales] Generated email template v3', type: 'info' },
  { msg: '[Design] Rendering hero_section_v2.png', type: 'info' },
  { msg: '[Finance] Projected Year 1 revenue: $144K', type: 'success' },
  { msg: '[COO] Workflow bottleneck detected in design pipeline', type: 'warn' },
  { msg: '[Supervisor] Redistributing tasks to idle agents', type: 'info' },
  { msg: '[Marketing] Content calendar: 12 posts scheduled', type: 'success' },
  { msg: '[Market Research] Found 3 direct competitors', type: 'info' },
  { msg: '[Legal] ToS template queued for review', type: 'info' },
  { msg: '[R&D] Awaiting research data from Market Research', type: 'warn' },
  { msg: '[Customer Success] Onboarding docs template loaded', type: 'info' },
  { msg: '[CEO] Approving budget allocation for marketing', type: 'success' },
  { msg: '[Sales] A/B variant email created with 2 CTAs', type: 'info' },
  { msg: '[Design] Applied glassmorphism to card components', type: 'success' },
  { msg: '[Finance] Break-even analysis: Month 9', type: 'info' },
  { msg: '[Supervisor] Health check: all nodes responding', type: 'success' },
  { msg: '[COO] Optimizing parallel task execution', type: 'info' },
  { msg: '[Market Research] Analyzing competitor feature matrix', type: 'info' },
  { msg: '[Marketing] Hashtag analysis complete: 50 trending tags', type: 'success' },
];

export const MISSION_PRESETS = [
  'Research competitors in the freelance invoicing SaaS space',
  'Build a landing page for our MVP product launch',
  'Create a go-to-market strategy for Q1 2025',
  'Analyze pricing models for subscription-based SaaS',
];

export const SOURCES_DATA = [
  { id: 1, site: 'FreshBooks', url: 'https://freshbooks.com/pricing', agent: 'Market Research', color: 'cyan', timestamp: '10:42:15', extract: 'FreshBooks offers 4 tiers: Lite ($19/mo), Plus ($33/mo), Premium ($60/mo), and Select (custom). Key differentiator is time-tracking integration.' },
  { id: 2, site: 'Wave Financial', url: 'https://waveapps.com/invoicing', agent: 'Market Research', color: 'cyan', timestamp: '10:43:22', extract: 'Wave provides free invoicing with paid add-ons for payments (2.9% + $0.60) and payroll. Strong positioning for freelancers and micro-businesses.' },
  { id: 3, site: 'Invoice Ninja', url: 'https://invoiceninja.com/features', agent: 'Market Research', color: 'cyan', timestamp: '10:44:08', extract: 'Open-source invoicing platform with self-hosted option. Pro plan at $10/mo. Appeals to developer-savvy freelancers who want control.' },
  { id: 4, site: 'TechCrunch', url: 'https://techcrunch.com/tag/saas', agent: 'CEO', color: 'gold', timestamp: '10:45:33', extract: 'SaaS market projected to reach $908B by 2030. Micro-SaaS and vertical solutions seeing fastest growth in 2024-2025.' },
  { id: 5, site: 'G2 Reviews', url: 'https://g2.com/categories/invoicing', agent: 'Sales', color: 'green', timestamp: '10:46:11', extract: 'Top complaints across invoicing tools: poor mobile experience (34%), complex onboarding (28%), limited customization (22%).' },
  { id: 6, site: 'Stripe Docs', url: 'https://stripe.com/docs/invoicing', agent: 'Finance', color: 'yellow-green', timestamp: '10:47:45', extract: 'Stripe Invoicing charges 0.4% per paid invoice ($2 cap). Supports recurring invoices, payment links, and 40+ payment methods.' },
  { id: 7, site: 'Product Hunt', url: 'https://producthunt.com/topics/invoicing', agent: 'Marketing', color: 'pink', timestamp: '10:48:30', extract: 'Recent launches show strong interest in AI-powered invoicing — auto-categorization and smart payment reminders are trending features.' },
  { id: 8, site: 'LinkedIn Insights', url: 'https://linkedin.com/pulse/freelance-economy', agent: 'CEO', color: 'gold', timestamp: '10:49:12', extract: '73M Americans freelancing as of 2024. Average freelancer manages 3-5 clients simultaneously, invoicing 2-4 times per month.' },
];

export const KANBAN_TASKS = {
  todo: [
    { id: 1, tag: 'Research', tagColor: 'cyan', title: 'Competitor Feature Matrix', agent: 'Market Research', due: 'Today' },
    { id: 2, tag: 'Design', tagColor: 'purple', title: 'Landing Page Wireframe', agent: 'Design', due: 'Today' },
    { id: 3, tag: 'Legal', tagColor: 'orange', title: 'Terms of Service Draft', agent: 'Legal', due: 'Tomorrow' },
    { id: 4, tag: 'Finance', tagColor: 'green', title: 'Pricing Model Analysis', agent: 'Finance', due: 'Tomorrow' },
  ],
  inProgress: [
    { id: 5, tag: 'Research', tagColor: 'cyan', title: 'Scrape Competitor Pricing', agent: 'Market Research', status: 'Running...' },
    { id: 6, tag: 'Strategy', tagColor: 'gold', title: 'Go-to-Market Plan', agent: 'CEO', status: 'Analyzing...' },
    { id: 7, tag: 'Content', tagColor: 'pink', title: 'Social Media Calendar', agent: 'Marketing', status: 'Drafting...' },
  ],
  done: [
    { id: 8, tag: 'Research', tagColor: 'cyan', title: 'Initial Market Scan', agent: 'Market Research', when: '2 min ago' },
    { id: 9, tag: 'Strategy', tagColor: 'gold', title: 'Define Target Personas', agent: 'CEO', when: '5 min ago' },
    { id: 10, tag: 'Setup', tagColor: 'purple', title: 'Initialize Agent Swarm', agent: 'Supervisor', when: '8 min ago' },
  ],
};

export const BROWSER_WINDOWS = [
  { url: 'freshbooks.com/pricing', delay: '0s' },
  { url: 'waveapps.com/invoicing', delay: '1s' },
  { url: 'invoiceninja.com/features', delay: '1.5s' },
  { url: 'g2.com/categories/invoicing', delay: '0.5s' },
];

export const FILES_UPLOADED = [
  { name: 'brand_guidelines.pdf', size: '2.4 MB', agent: 'Design' },
  { name: 'competitor_list.csv', size: '156 KB', agent: 'Market Research' },
];

export const FILES_GENERATED = [
  { name: 'market_analysis_report.md', size: '24 KB', type: 'markdown', agent: 'Market Research', time: '10:44' },
  { name: 'competitor_matrix.csv', size: '8 KB', type: 'csv', agent: 'Market Research', time: '10:45' },
  { name: 'cold_email_v3.md', size: '3 KB', type: 'markdown', agent: 'Sales', time: '10:46' },
  { name: 'content_calendar.json', size: '12 KB', type: 'json', agent: 'Marketing', time: '10:47' },
  { name: 'hero_section_v2.png', size: '1.8 MB', type: 'image', agent: 'Design', time: '10:48' },
  { name: 'financial_projections.xlsx', size: '45 KB', type: 'excel', agent: 'Finance', time: '10:49' },
];

export const ANALYTICS_TASKS_PER_AGENT = [
  { agent: 'Market Research', tasks: 8, color: '#FF8C00' },
  { agent: 'CEO', tasks: 5, color: '#FF8C00' },
  { agent: 'Sales', tasks: 4, color: 'hsl(var(--neon-green))' },
  { agent: 'Marketing', tasks: 3, color: '#FF4500' },
  { agent: 'Design', tasks: 3, color: '#FF6B00' },
  { agent: 'COO', tasks: 2, color: '#3b82f6' },
  { agent: 'Finance', tasks: 2, color: '#84cc16' },
  { agent: 'Supervisor', tasks: 1, color: '#999999' },
  { agent: 'R&D', tasks: 1, color: '#FF6B00' },
  { agent: 'Legal', tasks: 0, color: '#f97316' },
  { agent: 'Customer Success', tasks: 0, color: '#FF8C00' },
];

export const ANALYTICS_ACTIVITY = Array.from({ length: 12 }, (_, i) => ({
  time: `${Math.floor(i * 5)}m`,
  tasks: Math.floor(Math.random() * 5) + 1,
}));

export const TOOL_USAGE = [
  { name: 'web_search', value: 35, color: '#FF8C00' },
  { name: 'browser_read', value: 25, color: '#3b82f6' },
  { name: 'run_code', value: 20, color: 'hsl(var(--neon-green))' },
  { name: 'write_file', value: 15, color: 'hsl(var(--neon-yellow))' },
  { name: 'other', value: 5, color: '#999999' },
];

export const MISSION_HISTORY = [
  { date: '2024-12-15', goal: 'E-commerce competitor analysis', agents: 9, tasks: 34, duration: '18 min', status: 'completed' },
  { date: '2024-12-14', goal: 'Landing page generation for SaaS MVP', agents: 7, tasks: 22, duration: '12 min', status: 'completed' },
  { date: '2024-12-13', goal: 'Content marketing strategy research', agents: 6, tasks: 19, duration: '15 min', status: 'partial' },
];
