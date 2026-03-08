import { AGENTS, AGENT_COLORS } from '@/data/dashboardData';

const LiveAgents = () => (
  <div className="grid grid-cols-3 gap-4">
    {AGENTS.map(agent => {
      const isWorking = agent.status === 'working';
      const color = AGENT_COLORS[agent.color] || 'hsl(var(--muted-foreground))';
      return (
        <div
          key={agent.id}
          className={`glass-card p-4 flex flex-col gap-3 ${isWorking ? 'pulse-border' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{agent.emoji}</span>
              <span className="text-sm font-semibold text-foreground">{agent.name}</span>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
              isWorking ? 'bg-neon-green/10 text-neon-green' : 'bg-muted text-muted-foreground'
            }`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isWorking ? 'bg-neon-green pulse-dot' : 'bg-muted-foreground'}`} />
              {isWorking ? 'WORKING' : 'IDLE'}
            </span>
          </div>

          {/* Progress */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${isWorking ? 'progress-shimmer' : ''}`}
              style={{ width: `${agent.progress}%`, backgroundColor: !isWorking ? 'hsl(var(--muted))' : undefined }}
            />
          </div>

          {/* Task */}
          <p className="text-[11px] text-muted-foreground leading-snug">{agent.task}</p>

          {/* Last tool */}
          <div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: `${color}15`, color }}>
              {agent.lastTool}
            </span>
          </div>

          {/* Output */}
          <div className="bg-terminal rounded p-2 font-mono text-[10px] text-muted-foreground/80 leading-relaxed whitespace-pre-line">
            {agent.output[0]}
          </div>
        </div>
      );
    })}
  </div>
);

export default LiveAgents;
