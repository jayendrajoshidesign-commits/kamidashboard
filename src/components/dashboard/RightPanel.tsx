import { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
import { Globe, Download, ArrowDown, ArrowUp } from 'lucide-react';
import type { LogEntry } from '@/pages/Index';

const LOG_COLORS: Record<string, string> = {
  info: '',
  success: 'text-neon-green',
  warn: 'text-neon-yellow',
  error: 'text-neon-red',
};

const LOG_LABELS: Record<string, string> = {
  info: '[INFO]',
  success: '[OK]',
  warn: '[WARN]',
  error: '[ERR]',
};

const genTokenData = () => Array.from({ length: 20 }, () => ({
  thinking: Math.floor(Math.random() * 6000) + 2000,
  tools: Math.floor(Math.random() * 4000) + 1000,
}));

const genSysData = () => Array.from({ length: 15 }, () => ({
  cpu: Math.floor(Math.random() * 15) + 25,
  ram: Math.floor(Math.random() * 10) + 33,
  gpu: Math.floor(Math.random() * 12) + 83,
}));

const genNetData = () => Array.from({ length: 15 }, () => ({
  rps: Math.floor(Math.random() * 8) + 1,
}));

const TICKER_URLS = [
  'reddit.com/r/freelance',
  'indiehackers.com',
  'freshbooks.com/pricing',
  'waveapps.com/invoicing',
  'g2.com/categories/invoicing',
  'stripe.com/docs',
  'producthunt.com/topics/invoicing',
  'techcrunch.com/tag/saas',
];

interface Props {
  logs: LogEntry[];
}

const RightPanel = ({ logs }: Props) => {
  const termRef = useRef<HTMLDivElement>(null);
  const [tokenData, setTokenData] = useState(genTokenData);
  const [sysData, setSysData] = useState(genSysData);
  const [netData, setNetData] = useState(genNetData);
  const [urlCount, setUrlCount] = useState(12);
  const [kbExtracted, setKbExtracted] = useState(847);
  const [reqCount, setReqCount] = useState(48);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    const i = setInterval(() => {
      setTokenData(prev => [...prev.slice(1), { thinking: Math.floor(Math.random() * 6000) + 2000, tools: Math.floor(Math.random() * 4000) + 1000 }]);
      setSysData(prev => [...prev.slice(1), { cpu: Math.floor(Math.random() * 15) + 25, ram: Math.floor(Math.random() * 10) + 33, gpu: Math.floor(Math.random() * 12) + 83 }]);
      setNetData(prev => [...prev.slice(1), { rps: Math.floor(Math.random() * 8) + 1 }]);
      setUrlCount(c => c + (Math.random() > 0.6 ? 1 : 0));
      setKbExtracted(c => c + Math.floor(Math.random() * 30));
      setReqCount(c => c + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(i);
  }, []);

  const lastSys = sysData[sysData.length - 1];

  return (
    <aside className="w-[320px] flex-shrink-0 flex flex-col"
      style={{
        background: 'rgba(10, 7, 5, 0.85)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255, 80, 0, 0.1)',
      }}>
      {/* Terminal header */}
      <div className="px-4 py-2.5 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,80,0,0.1)' }}>
        <span className="section-header">Live Terminal</span>
        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">zsh</span>
      </div>

      {/* Terminal */}
      <div ref={termRef} className="overflow-y-auto p-3 font-mono text-xs max-h-[200px]" style={{ backgroundColor: '#050505' }}>
        {logs.map((log, i) => (
          <div key={i} className={`mb-0.5 leading-relaxed ${i === logs.length - 1 ? 'terminal-line-enter' : ''}`}>
            <span className="mr-2" style={{ color: '#444444' }}>{log.time}</span>
            <span className={LOG_COLORS[log.type]} style={log.type === 'info' ? { color: '#FF8C00', textShadow: '0 0 8px rgba(255,140,0,0.3)' } : log.type === 'success' ? { textShadow: '0 0 6px rgba(74,222,128,0.3)' } : undefined}>
              {LOG_LABELS[log.type]}
            </span>
            <span className="text-foreground/70 ml-1">{log.msg}</span>
          </div>
        ))}
      </div>

      {/* SECTION A: TOKEN USAGE */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,80,0,0.1)' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="section-header">Token Usage</span>
          <span className="text-[11px] font-mono mono-value">142K <span className="text-muted-foreground">/ 1.2M</span></span>
        </div>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tokenData}>
              <defs>
                <linearGradient id="thinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#FF6B00" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="toolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF8C00" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#FF8C00" stopOpacity={0.02} />
                </linearGradient>
                <filter id="glowOrange">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <Area type="monotone" dataKey="thinking" stroke="#FF6B00" fill="url(#thinkGrad)" strokeWidth={2} dot={false} stackId="1" filter="url(#glowOrange)" />
              <Area type="monotone" dataKey="tools" stroke="#FF8C00" fill="url(#toolGrad)" strokeWidth={1.5} dot={false} stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-[13%] rounded-full progress-shimmer progress-glow-tip relative" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">$0.00 local • ~$0.43 saved vs Claude API</p>
        </div>
      </div>

      {/* SECTION B: SYSTEM RESOURCES */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,80,0,0.1)' }}>
        <div className="flex gap-2 mb-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,140,0,0.1)', color: '#FF8C00' }}>CPU {lastSys.cpu}%</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,107,0,0.1)', color: '#FF6B00' }}>RAM 12GB</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${lastSys.gpu > 80 ? 'pulse-dot' : ''}`} style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>GPU {lastSys.gpu}% 67°C</span>
        </div>
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sysData}>
              <defs>
                <filter id="glowCpu"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="glowRam"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="glowGpu"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <Line type="monotone" dataKey="cpu" stroke="#FF8C00" strokeWidth={1.5} dot={false} filter="url(#glowCpu)" />
              <Line type="monotone" dataKey="ram" stroke="rgba(168,85,247,0.8)" strokeWidth={1.5} dot={false} filter="url(#glowRam)" />
              <Line type="monotone" dataKey="gpu" stroke="#4ade80" strokeWidth={2} dot={false} filter="url(#glowGpu)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-muted-foreground font-mono mt-1">NET ↓ 24KB/s ↑ 0KB/s</p>
      </div>

      {/* SECTION C: NETWORK ACTIVITY */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,80,0,0.1)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-3.5 h-3.5" style={{ color: '#FF8C00' }} />
          <span className="section-header">Network</span>
          <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,140,0,0.1)', color: '#FF8C00' }}>{reqCount} reqs</span>
        </div>
        <div className="h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={netData}>
              <Bar dataKey="rps" fill="#FF6B00" radius={[2, 2, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: '#FF8C00' }} />{urlCount} URLs visited</span>
          <span className="flex items-center gap-1"><Download className="w-3 h-3" />{kbExtracted} KB extracted</span>
        </div>
        <div className="mt-2 overflow-hidden h-4 relative">
          <div className="url-ticker text-[10px] font-mono flex items-center gap-3 absolute" style={{ color: 'rgba(255,140,0,0.6)' }}>
            {TICKER_URLS.map((u, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#FF8C00' }} />
                {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Feed */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ borderTop: '1px solid rgba(255,80,0,0.1)' }}>
        <div className="px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,80,0,0.08)' }}>
          <span className="section-header">Agent Feed</span>
        </div>
        <div className="overflow-y-auto flex-1">
          {[
            { icon: '💻', color: '#FF6B00', title: 'Code Update', desc: 'Market Research committed competitor_matrix.csv' },
            { icon: '🔍', color: '#FF8C00', title: 'New Source Found', desc: 'Added FreshBooks pricing data to knowledge base' },
            { icon: '📧', color: 'hsl(var(--neon-yellow))', title: 'Draft Ready', desc: 'Sales email template v3 ready for review' },
            { icon: '📊', color: 'hsl(var(--neon-green))', title: 'Analysis Complete', desc: 'Finance: Year 1 projection model generated' },
          ].map((item, i) => (
            <div key={i} className="px-4 py-3 flex gap-3" style={{ borderBottom: '1px solid rgba(255,80,0,0.06)' }}>
              <span className="text-lg">{item.icon}</span>
              <div>
                <h4 className="text-xs font-semibold text-foreground heading-cinematic">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
