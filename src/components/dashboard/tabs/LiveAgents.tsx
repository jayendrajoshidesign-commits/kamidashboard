import { AGENT_COLORS } from '@/data/dashboardData';
import type { ApiAgent } from '@/services/apiService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const genSparkData = () => Array.from({ length: 12 }, () => ({ v: Math.floor(Math.random() * 3000) + 500 }));

interface Props {
  agents: ApiAgent[];
}

const LiveAgents = ({ agents }: Props) => (
  <div className="grid grid-cols-3 gap-4">
    {agents.map(agent => {
      const isWorking = agent.status === 'working';
      const color = AGENT_COLORS[agent.color] || 'hsl(var(--muted-foreground))';
      const sparkData = genSparkData();
      return (
        <div
          key={agent.id}
          className={`glass-card p-4 flex flex-col gap-3 transition-all group ${isWorking ? 'working-glow' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{agent.emoji}</span>
              <span className="text-sm font-semibold text-foreground heading-cinematic">{agent.name}</span>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full font-medium flex items-center gap-1.5"
              style={isWorking
                ? { backgroundColor: 'rgba(255,107,0,0.12)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.4)' }
                : agent.status === 'error'
                  ? { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }
                  : { backgroundColor: 'rgba(80,80,80,0.1)', color: '#666666', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isWorking ? 'pulse-dot' : agent.status === 'error' ? 'bg-neon-red pulse-dot' : ''}`}
                style={isWorking ? { backgroundColor: '#FF6B00' } : agent.status === 'error' ? {} : { backgroundColor: '#666666' }} />
              {agent.status === 'error' ? 'ERROR' : isWorking ? 'WORKING' : 'IDLE'}
            </span>
          </div>

          {/* Progress */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 relative ${isWorking ? 'progress-shimmer progress-glow-tip' : ''}`}
              style={{ width: `${agent.progress}%`, backgroundColor: !isWorking ? 'hsl(var(--muted))' : undefined }}
            />
          </div>

          {/* Task */}
          <p className="text-[11px] leading-snug" style={{ color: '#6b6b6b' }}>{agent.task}</p>

          {/* Token sparkline for working agents */}
          {isWorking && (
            <div className="h-[40px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <defs>
                    <linearGradient id={`agentGrad-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={color} fill={`url(#agentGrad-${agent.id})`} strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Last tool */}
          <div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: `${color}15`, color }}>
              {agent.lastTool}
            </span>
          </div>

          {/* Output */}
          <div className="rounded p-2 font-mono text-[10px] leading-relaxed whitespace-pre-line group-hover:text-muted-foreground transition-colors"
            style={{ backgroundColor: '#050505', color: '#555' }}>
            {agent.output[0]}
          </div>
        </div>
      );
    })}
  </div>
);

export default LiveAgents;
