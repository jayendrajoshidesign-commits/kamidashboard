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
    <footer className="h-12 glass-panel border-t border-border/50 flex items-center px-4 font-mono text-xs relative z-10">
      <div className="flex items-center">
        <div className="flex items-center gap-2 mr-4">
          <div className="status-dot-green" />
          <span className="text-neon-green text-[11px] font-semibold">ONLINE</span>
        </div>
        <Metric label="CPU" value="32%" />
        <Metric label="MEM" value="12GB" />
        <div className="flex items-center gap-2 mr-4">
          <span className="text-muted-foreground">GPU</span>
          <span className="text-neon-green font-semibold">89%</span>
          <span className="text-neon-yellow font-semibold">67°C</span>
        </div>
        <div className="flex items-center gap-2 mr-4">
          <span className="text-muted-foreground">NET</span>
          <span className="text-neon-cyan font-semibold">↓ 24KB/s</span>
          <span className="text-muted-foreground">↑ 0KB/s</span>
        </div>
        <div className="flex items-center gap-2 mr-4 pl-4 border-l border-border/50">
          <span className="text-muted-foreground">TOKENS</span>
          <span className="text-neon-cyan font-semibold">142K</span>
          <span className="text-neon-green">— $0.00</span>
        </div>
        <div className="pl-4 border-l border-border/50 flex items-center gap-2">
          <span className="text-muted-foreground">RUNTIME</span>
          <span className="text-neon-cyan font-semibold">{runtime}</span>
        </div>
      </div>

      <div className="flex-1 max-w-[400px] mx-8 flex items-center gap-3">
        <span className="text-[11px] whitespace-nowrap text-muted-foreground">MISSION PROGRESS</span>
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span className="truncate max-w-[200px]">{missionGoal}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full progress-shimmer rounded-full progress-glow-tip relative" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <button
        onClick={onStop}
        className="ml-auto bg-neon-red/10 text-neon-red border border-neon-red/30 px-3 py-1.5 rounded font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-neon-red/20 transition-colors glow-red-hover"
      >
        STOP ALL AGENTS
      </button>
    </footer>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-2 mr-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-neon-cyan font-semibold">{value}</span>
  </div>
);

export default BottomBar;
