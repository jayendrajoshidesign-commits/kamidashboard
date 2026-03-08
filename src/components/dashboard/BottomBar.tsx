interface Props {
  runtime: string;
}

const BottomBar = ({ runtime }: Props) => (
  <footer className="h-12 glass-panel border-t border-border/50 flex items-center px-4 font-mono text-xs relative z-10">
    <div className="flex items-center">
      <Metric label="CPU" value="32%" />
      <Metric label="MEM" value="12GB" />
      <Metric label="GPU" value="89%" />
      <div className="ml-4 pl-4 border-l border-border/50 flex items-center gap-2">
        <span className="text-muted-foreground">RUNTIME</span>
        <span className="text-neon-cyan font-semibold">{runtime}</span>
      </div>
    </div>

    <div className="flex-1 max-w-[400px] mx-8 flex items-center gap-3">
      <span className="text-[11px] whitespace-nowrap text-muted-foreground">MISSION PROGRESS</span>
      <div className="flex-1">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Freelance Invoicing SaaS Research</span>
          <span>45%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-[45%] progress-shimmer rounded-full progress-glow-tip relative" />
        </div>
      </div>
    </div>

    <button className="ml-auto bg-neon-red/10 text-neon-red border border-neon-red/30 px-3 py-1.5 rounded font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-neon-red/20 transition-colors">
      STOP ALL AGENTS
    </button>
  </footer>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-2 mr-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-neon-cyan font-semibold">{value}</span>
  </div>
);

export default BottomBar;
