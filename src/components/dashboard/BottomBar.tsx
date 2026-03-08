import { api } from '@/services/apiService';
import type { ApiMissionsResponse } from '@/services/apiService';

interface Props {
  runtime: string;
  isConnected: boolean;
  missions: ApiMissionsResponse;
  onStop: () => void;
}

const BottomBar = ({ runtime, isConnected, missions, onStop }: Props) => {
  const current = missions.current;
  const progress = current?.progress ?? 45;
  const missionGoal = current?.goal ?? 'Freelance Invoicing SaaS Research';

  return (
    <footer className="h-11 flex items-center px-4 font-mono text-[11px] relative z-10"
      style={{
        background: 'rgba(6, 4, 3, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,80,0,0.15)',
      }}>

      {/* LEFT: System Status */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="status-dot-green" style={{ width: '6px', height: '6px' }} />
          <span className="text-neon-green font-semibold text-[10px]">ONLINE</span>
        </div>
        <span className="text-muted-foreground/30">|</span>
        <span className="text-muted-foreground">CPU</span> <span className="font-bold" style={{ color: '#FF8C00' }}>32%</span>
        <span className="text-muted-foreground">RAM</span> <span className="font-bold" style={{ color: '#FF8C00' }}>12G</span>
        <span className="text-muted-foreground">GPU</span> <span className="font-bold" style={{ color: '#FF8C00' }}>89%</span>
        <span className="font-semibold text-neon-green">67°C</span>
        <span className="text-muted-foreground">NET</span> <span className="font-bold" style={{ color: '#FF8C00' }}>↓24K</span>
      </div>

      {/* CENTER: Mission Progress */}
      <div className="flex-1 max-w-[350px] mx-6">
        <div className="flex items-center justify-between text-[9px] mb-0.5">
          <span className="text-muted-foreground truncate max-w-[180px]">{missionGoal}</span>
          <span className="mono-value text-[10px]">{progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full progress-shimmer rounded-full progress-glow-tip relative" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* RIGHT: Tokens & Controls */}
      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        <span className="text-muted-foreground/30">|</span>
        <span className="text-muted-foreground">TOKENS</span>
        <span className="font-bold" style={{ color: '#FF8C00' }}>142K</span>
        <span className="text-neon-green">— $0.00</span>
        <span className="text-muted-foreground/30">|</span>
        <span className="text-muted-foreground">RT</span>
        <span className="font-bold" style={{ color: '#FF8C00' }}>{runtime}</span>
        <button
          onClick={onStop}
          className="ml-2 bg-neon-red/10 text-neon-red border border-neon-red/30 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-neon-red/20 transition-colors glow-red-hover"
        >
          STOP ALL
        </button>
      </div>
    </footer>
  );
};

export default BottomBar;
