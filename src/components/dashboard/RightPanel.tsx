import { useEffect, useRef } from 'react';
import { AreaChart, Area, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { LogEntry } from '@/pages/Index';

const tokenData = Array.from({ length: 10 }, (_, i) => ({ v: Math.floor(Math.random() * 8000) + 4000 }));
const cpuData = Array.from({ length: 10 }, (_, i) => ({ cpu: Math.floor(Math.random() * 30) + 20, ram: Math.floor(Math.random() * 20) + 40 }));

const LOG_COLORS: Record<string, string> = {
  info: 'text-neon-cyan',
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

interface Props {
  logs: LogEntry[];
}

const RightPanel = ({ logs }: Props) => {
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs]);

  return (
    <aside className="w-[320px] flex-shrink-0 glass-panel flex flex-col border-l border-border/50">
      {/* Terminal header */}
      <div className="px-4 py-2.5 border-b border-border/50 flex justify-between items-center">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Live Terminal</span>
        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">zsh</span>
      </div>

      {/* Terminal */}
      <div ref={termRef} className="flex-1 max-h-[40%] overflow-y-auto p-3 font-mono text-[11px] bg-terminal">
        {logs.map((log, i) => (
          <div key={i} className={`mb-0.5 leading-relaxed ${i === logs.length - 1 ? 'terminal-line-enter' : ''}`}>
            <span className="text-muted-foreground mr-2">{log.time}</span>
            <span className={LOG_COLORS[log.type]}>{LOG_LABELS[log.type]}</span>
            <span className="text-foreground/70 ml-1">{log.msg}</span>
          </div>
        ))}
      </div>

      {/* Mini charts */}
      <div className="px-4 py-3 border-t border-border/50">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Token Usage</div>
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tokenData}>
              <defs>
                <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(263,70%,58%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(263,70%,58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="hsl(263,70%,58%)" fill="url(#tokenGrad)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border/50">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">CPU / RAM</div>
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cpuData}>
              <Line type="monotone" dataKey="cpu" stroke="hsl(187,86%,43%)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="ram" stroke="hsl(142,71%,45%)" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Feed */}
      <div className="border-t border-border/50">
        <div className="px-4 py-2.5 border-b border-border/50">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Agent Feed</span>
        </div>
        <div className="overflow-y-auto max-h-[200px]">
          {[
            { icon: '💻', color: 'text-primary', title: 'Code Update', desc: 'Market Research committed competitor_matrix.csv' },
            { icon: '🔍', color: 'text-neon-cyan', title: 'New Source Found', desc: 'Added FreshBooks pricing data to knowledge base' },
            { icon: '📧', color: 'text-neon-yellow', title: 'Draft Ready', desc: 'Sales email template v3 ready for review' },
            { icon: '📊', color: 'text-neon-green', title: 'Analysis Complete', desc: 'Finance: Year 1 projection model generated' },
          ].map((item, i) => (
            <div key={i} className="px-4 py-3 border-b border-border/30 flex gap-3">
              <span className="text-lg">{item.icon}</span>
              <div>
                <h4 className="text-xs font-medium text-foreground">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert */}
      <div className="p-3">
        <div className="glass-card p-3 border-neon-red/30 bg-neon-red/5 flex gap-3 items-start">
          <span className="text-neon-red text-sm mt-0.5">⚠️</span>
          <div>
            <h4 className="text-xs font-bold text-neon-red mb-0.5">Token Usage High</h4>
            <p className="text-[11px] text-muted-foreground">142K tokens used. Running on local Ollama — cost: ~$0.00</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
