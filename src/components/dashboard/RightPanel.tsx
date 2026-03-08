import { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
import { Globe, Download } from 'lucide-react';
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

const genSysData = () => Array.from({ length: 15 }, () => ({
  cpu: Math.floor(Math.random() * 15) + 25,
  ram: Math.floor(Math.random() * 10) + 33,
  gpu: Math.floor(Math.random() * 12) + 83,
}));

const genNetData = () => Array.from({ length: 15 }, () => ({
  rps: Math.floor(Math.random() * 8) + 1,
}));

const TICKER_URLS = [
  'reddit.com/r/freelance', 'indiehackers.com', 'freshbooks.com/pricing',
  'waveapps.com/invoicing', 'g2.com/categories/invoicing', 'stripe.com/docs',
  'producthunt.com/topics/invoicing', 'techcrunch.com/tag/saas',
];

interface Props {
  logs: LogEntry[];
}

const RightPanel = ({ logs }: Props) => {
  const termRef = useRef<HTMLDivElement>(null);
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
    <aside className="w-[300px] flex-shrink-0 flex flex-col"
      style={{
        background: 'rgba(10, 7, 5, 0.85)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255, 80, 0, 0.1)',
      }}>

      {/* SECTION 1: TERMINAL (35%) */}
      <div className="flex flex-col" style={{ height: '35%' }}>
        <div className="px-3 py-2 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,80,0,0.1)' }}>
          <span className="section-header">Terminal</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{logs.length}</span>
            <button className="text-[9px] text-muted-foreground hover:text-foreground transition-colors">CLEAR</button>
          </div>
        </div>
        <div ref={termRef} className="overflow-y-auto p-2 font-mono text-xs flex-1" style={{ backgroundColor: '#030305', lineHeight: '1.6' }}>
          {logs.map((log, i) => (
            <div key={i} className={`${i === logs.length - 1 ? 'terminal-line-enter' : ''}`}>
              <span style={{ color: '#3a3a3a' }}>{log.time} </span>
              <span className={LOG_COLORS[log.type]}
                style={log.type === 'info' ? { color: '#FF8C00', textShadow: '0 0 8px rgba(255,140,0,0.3)' } : log.type === 'success' ? { textShadow: '0 0 6px rgba(74,222,128,0.3)' } : undefined}>
                {LOG_LABELS[log.type]}
              </span>
              <span className="text-foreground/70 ml-1">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SYSTEM (25%) */}
      <div className="flex flex-col px-3 py-2" style={{ height: '25%', borderTop: '1px solid rgba(255,80,0,0.1)' }}>
        <span className="section-header mb-2">System</span>
        <div className="flex justify-between text-[10px] font-mono mb-1">
          <span style={{ color: '#FF8C00' }}>CPU {lastSys.cpu}%</span>
          <span style={{ color: '#a855f7' }}>RAM 12GB</span>
          <span style={{ color: '#4ade80' }}>GPU {lastSys.gpu}% 67°C</span>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sysData}>
              <defs>
                <filter id="cpuG"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="ramG"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="gpuG"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <Line type="monotone" dataKey="cpu" stroke="#FF8C00" strokeWidth={1.5} dot={false} filter="url(#cpuG)" />
              <Line type="monotone" dataKey="ram" stroke="rgba(168,85,247,0.8)" strokeWidth={1.5} dot={false} filter="url(#ramG)" />
              <Line type="monotone" dataKey="gpu" stroke="#4ade80" strokeWidth={2} dot={false} filter="url(#gpuG)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-muted-foreground font-mono mt-1" style={{ color: '#FF8C00' }}>↓ 24KB/s  ↑ 0KB/s</p>
      </div>

      {/* SECTION 3: NETWORK (20%) */}
      <div className="flex flex-col px-3 py-2" style={{ height: '20%', borderTop: '1px solid rgba(255,80,0,0.1)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="section-header">Network</span>
          <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,140,0,0.1)', color: '#FF8C00' }}>{reqCount}</span>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={netData}>
              <Bar dataKey="rps" fill="#FF6B00" radius={[2, 2, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-1">
          <span>🌐 {urlCount} URLs</span>
          <span>⬇ {kbExtracted} KB</span>
        </div>
        <div className="mt-1 overflow-hidden h-3 relative">
          <div className="url-ticker text-[9px] font-mono flex items-center gap-3 absolute" style={{ color: 'rgba(255,140,0,0.5)' }}>
            {TICKER_URLS.map((u, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full inline-block" style={{ backgroundColor: '#FF8C00' }} />
                {u}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: FEED (20%) */}
      <div className="flex flex-col flex-1 overflow-hidden" style={{ borderTop: '1px solid rgba(255,80,0,0.1)' }}>
        <div className="px-3 py-2">
          <span className="section-header">Feed</span>
        </div>
        <div className="overflow-y-auto flex-1 px-3">
          {[
            { icon: '💻', agent: 'Research', desc: 'committed competitor_matrix.csv', time: '2m' },
            { icon: '🔍', agent: 'Research', desc: 'added FreshBooks pricing data', time: '3m' },
            { icon: '📧', agent: 'Sales', desc: 'email template v3 ready', time: '5m' },
            { icon: '📊', agent: 'Finance', desc: 'Y1 projection generated', time: '6m' },
            { icon: '🎨', agent: 'Design', desc: 'hero_v2.png rendered', time: '8m' },
            { icon: '📣', agent: 'Marketing', desc: '12 posts scheduled', time: '10m' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 text-[10px]" style={{ borderBottom: '1px solid rgba(255,80,0,0.04)' }}>
              <span>{item.icon}</span>
              <span className="font-medium" style={{ color: '#FF8C00' }}>{item.agent}</span>
              <span className="text-muted-foreground truncate flex-1">{item.desc}</span>
              <span className="text-muted-foreground flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
