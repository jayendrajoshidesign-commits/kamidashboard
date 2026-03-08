import { AGENTS, AGENT_COLORS } from '@/data/dashboardData';

interface Props {
  isConnected: boolean;
}

const QUICK_METRICS = [
  { label: 'CPU', value: '32%', color: '#FF8C00' },
  { label: 'RAM', value: '12G', color: '#FF8C00' },
  { label: 'GPU', value: '89%', color: '#4ade80' },
  { label: 'NET', value: '24K', color: '#FF8C00' },
  { label: 'TOK', value: '142K', color: '#FF8C00' },
];

const LeftPanel = ({ isConnected }: Props) => {
  return (
    <aside className="w-[280px] flex-shrink-0 flex flex-col z-10"
      style={{
        background: 'rgba(8, 8, 10, 0.92)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      }}>

      {/* ZONE 1: SYSTEM IDENTITY */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: '60px' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>
          AI
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold tracking-tight text-foreground">KAMI Brain</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'hsl(142,71%,45%)' }} />
            <span className="text-[10px] font-mono" style={{ color: 'hsl(142,71%,45%)' }}>ONLINE</span>
          </div>
          <div className="text-[10px] font-mono truncate mt-0.5" style={{ color: '#FF8C00' }}>
            Active: Freelance Invoicing Research
          </div>
        </div>
      </div>

      {/* ZONE 2: AGENT STATUS */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="section-header">Agent Status</span>
        </div>
        <div className="px-2 py-1 space-y-0 overflow-y-auto flex-1">
          {AGENTS.map(agent => {
            const isWorking = agent.status === 'working';
            const color = AGENT_COLORS[agent.color] || '#666';
            return (
              <div key={agent.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-all cursor-pointer hover:bg-white/[0.03]"
                style={{
                  opacity: isWorking ? 1 : 0.5,
                  borderLeft: isWorking ? `2px solid ${color}30` : '2px solid transparent',
                }}
              >
                <span className="text-sm flex-shrink-0" style={{ width: '18px' }}>{agent.emoji}</span>
                <span className="text-[11px] font-medium text-foreground truncate flex-1" style={{ minWidth: '60px' }}>
                  {agent.name.length > 10 ? agent.name.slice(0, 10) : agent.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[8px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={isWorking
                    ? { backgroundColor: 'rgba(255,107,0,0.08)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.25)' }
                    : { backgroundColor: 'rgba(255,255,255,0.03)', color: '#555', border: '1px solid rgba(255,255,255,0.04)' }
                  }>
                  {isWorking ? 'WORK' : 'IDLE'}
                </span>
                <div className="w-[36px] h-[3px] bg-muted rounded-full overflow-hidden flex-shrink-0">
                  <div className={`h-full rounded-full ${isWorking ? 'progress-shimmer' : ''}`}
                    style={{ width: `${agent.progress}%`, backgroundColor: isWorking ? undefined : 'hsl(var(--muted))' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ZONE 3: QUICK ACTIONS */}
      <div className="px-3 py-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button className="w-full text-primary-foreground py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 mission-pulse-btn"
          style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>
          ▶ NEW MISSION
        </button>
        <button className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors hover:bg-red-500/10"
          style={{ background: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          ⏹ STOP ALL
        </button>
        <button className="w-full glass-card-static py-2 rounded-lg text-xs font-medium text-muted-foreground flex items-center justify-center gap-2 hover:text-foreground transition-colors">
          📋 LAST REPORT
        </button>

        <div className="flex justify-between pt-1">
          {QUICK_METRICS.map(m => (
            <div key={m.label} className="text-center">
              <div className="text-[8px] text-muted-foreground uppercase">{m.label}</div>
              <div className="text-[10px] font-mono font-bold" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftPanel;
