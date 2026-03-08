import type { ApiMissionsResponse } from '@/services/apiService';

interface Props {
  runtime: string;
  isConnected: boolean;
  missions: ApiMissionsResponse;
  onStop: () => void;
  isMobile?: boolean;
}

const BottomBar = ({ runtime, isConnected, missions, onStop, isMobile }: Props) => {
  const current = missions.current;
  const progress = current?.progress ?? 45;
  const missionGoal = current?.goal ?? 'Freelance Invoicing SaaS Research';

  if (isMobile) {
    return (
      <footer className="h-9 flex items-center px-3 font-mono text-[10px] relative z-10"
        style={{
          background: 'rgba(4, 4, 6, 0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'hsl(142,71%,45%)' }} />
          <span className="text-muted-foreground">CPU</span> <span className="font-bold" style={{ color: '#FF8C00' }}>32%</span>
          <span className="text-muted-foreground">TOK</span> <span className="font-bold" style={{ color: '#FF8C00' }}>142K</span>
        </div>
        <button onClick={onStop}
          className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
          style={{ background: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          STOP
        </button>
      </footer>
    );
  }

  return (
    <footer className="h-11 flex items-center px-4 font-mono text-[11px] relative z-10"
      style={{
        background: 'rgba(4, 4, 6, 0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>

      {/* LEFT */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'hsl(142,71%,45%)' }} />
          <span className="font-semibold text-[10px]" style={{ color: 'hsl(142,71%,45%)' }}>ONLINE</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
        <span className="text-muted-foreground">CPU</span> <span className="font-bold" style={{ color: '#FF8C00' }}>32%</span>
        <span className="text-muted-foreground">RAM</span> <span className="font-bold" style={{ color: '#FF8C00' }}>12G</span>
        <span className="text-muted-foreground">GPU</span> <span className="font-bold" style={{ color: '#FF8C00' }}>89%</span>
        <span className="font-semibold" style={{ color: '#4ade80' }}>67°C</span>
        <span className="text-muted-foreground">NET</span> <span className="font-bold" style={{ color: '#FF8C00' }}>↓24K</span>
      </div>

      {/* CENTER */}
      <div className="flex-1 max-w-[350px] mx-6">
        <div className="flex items-center justify-between text-[9px] mb-0.5">
          <span className="text-muted-foreground truncate max-w-[180px]">{missionGoal}</span>
          <span className="mono-value text-[10px]">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
          <div className="h-full progress-shimmer rounded-full progress-glow-tip relative" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
        <span className="text-muted-foreground">TOKENS</span>
        <span className="font-bold" style={{ color: '#FF8C00' }}>142K</span>
        <span style={{ color: '#4ade80' }}>— $0.00</span>
        <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
        <span className="text-muted-foreground">RT</span>
        <span className="font-bold" style={{ color: '#FF8C00' }}>{runtime}</span>
        <button
          onClick={onStop}
          className="ml-2 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
          style={{ background: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          STOP ALL
        </button>
      </div>
    </footer>
  );
};

export default BottomBar;
