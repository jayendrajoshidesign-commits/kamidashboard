import { useState } from 'react';
import { AGENT_COLORS } from '@/data/dashboardData';
import type { ApiAgent } from '@/services/apiService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const genSparkData = () => Array.from({ length: 12 }, () => ({ v: Math.floor(Math.random() * 3000) + 500 }));

type Filter = 'All' | 'Working' | 'Idle' | 'Error';

interface Props {
  agents: ApiAgent[];
}

const LiveAgents = ({ agents }: Props) => {
  const [filter, setFilter] = useState<Filter>('All');

  const workingCount = agents.filter(a => a.status === 'working').length;
  const idleCount = agents.filter(a => a.status === 'idle').length;

  const filtered = filter === 'All' ? agents
    : filter === 'Working' ? agents.filter(a => a.status === 'working')
    : filter === 'Idle' ? agents.filter(a => a.status === 'idle')
    : agents.filter(a => a.status === 'error');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground heading-cinematic">
            {agents.length} Agents — <span style={{ color: '#FF8C00' }}>{workingCount} Working</span> — <span className="text-muted-foreground">{idleCount} Idle</span>
          </h2>
        </div>
        <div className="flex gap-1.5">
          {(['All', 'Working', 'Idle', 'Error'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-[11px] px-3 py-1 rounded-full transition-all ${filter === f ? 'text-primary-foreground' : 'glass-card-static text-muted-foreground hover:text-foreground'}`}
              style={filter === f ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)' } : undefined}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map(agent => {
          const isWorking = agent.status === 'working';
          const color = AGENT_COLORS[agent.color] || 'hsl(var(--muted-foreground))';
          const sparkData = genSparkData();
          return (
            <div
              key={agent.id}
              className={`glass-card p-3 flex flex-col gap-2 transition-all ${isWorking ? 'working-glow' : ''}`}
              style={{
                maxHeight: '160px',
                opacity: isWorking ? 1 : 0.6,
                background: isWorking ? undefined : 'rgba(10,10,10,0.5)',
              }}
            >
              {/* Row 1: identity + badge + tool */}
              <div className="flex items-center gap-2">
                <span className="text-base">{agent.emoji}</span>
                <span className="text-xs font-semibold text-foreground heading-cinematic flex-1 truncate">{agent.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1"
                  style={isWorking
                    ? { backgroundColor: 'rgba(255,107,0,0.12)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.4)' }
                    : agent.status === 'error'
                      ? { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }
                      : { backgroundColor: 'rgba(80,80,80,0.1)', color: '#666', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className={`inline-block w-1 h-1 rounded-full ${isWorking ? 'pulse-dot' : ''}`}
                    style={{ backgroundColor: isWorking ? '#FF6B00' : agent.status === 'error' ? '#ef4444' : '#555' }} />
                  {agent.status === 'error' ? 'ERR' : isWorking ? 'WORK' : 'IDLE'}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono" style={{ backgroundColor: `${color}15`, color }}>
                  {agent.lastTool}
                </span>
              </div>

              {/* Row 2: task */}
              <p className="text-[10px] leading-snug truncate" style={{ color: '#6b6b6b' }}>{agent.task}</p>

              {/* Progress bar */}
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 relative ${isWorking ? 'progress-shimmer progress-glow-tip' : ''}`}
                  style={{ width: `${agent.progress}%`, backgroundColor: !isWorking ? 'hsl(var(--muted))' : undefined }}
                />
              </div>

              {/* Sparkline + output */}
              <div className="flex gap-2 items-end">
                <div className="flex-1 rounded p-1.5 font-mono text-[9px] leading-relaxed whitespace-pre-line"
                  style={{ backgroundColor: '#030305', color: '#555', maxHeight: '32px', overflow: 'hidden' }}>
                  {agent.output[0]?.split('\n')[0]}
                </div>
                {isWorking && (
                  <div className="w-[50px] h-[30px] flex-shrink-0">
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveAgents;
