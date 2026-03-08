import { useState } from 'react';
import { AGENT_COLORS } from '@/data/dashboardData';
import type { ApiAgent } from '@/services/apiService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, Pause, RotateCcw, FileText } from 'lucide-react';

const genSparkData = () => Array.from({ length: 12 }, () => ({ v: Math.floor(Math.random() * 3000) + 500 }));

type Filter = 'All' | 'Working' | 'Idle' | 'Error';

interface Props {
  agents: ApiAgent[];
}

const LiveAgents = ({ agents }: Props) => {
  const [filter, setFilter] = useState<Filter>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

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
        <h2 className="text-sm font-semibold text-foreground">
          {agents.length} Agents — <span style={{ color: '#FF8C00' }}>{workingCount} Working</span> — <span className="text-muted-foreground">{idleCount} Idle</span>
        </h2>
        <div className="flex gap-1.5">
          {(['All', 'Working', 'Idle', 'Error'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-[11px] px-3 py-1 rounded-full transition-all"
              style={filter === f
                ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' }
                : { background: 'rgba(255,255,255,0.03)', color: '#666', border: '1px solid rgba(255,255,255,0.05)' }
              }>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map(agent => {
          const isWorking = agent.status === 'working';
          const color = AGENT_COLORS[agent.color] || '#666';
          const sparkData = genSparkData();
          const isExpanded = expanded === agent.id;
          return (
            <div
              key={agent.id}
              className={`glass-card p-3 flex flex-col gap-2 transition-all ${isWorking ? 'working-glow' : ''}`}
              style={{
                opacity: isWorking ? 1 : 0.5,
                background: isWorking ? undefined : 'rgba(8,8,12,0.5)',
              }}
            >
              {/* Row 1 */}
              <div className="flex items-center gap-2">
                <span className="text-base">{agent.emoji}</span>
                <span className="text-xs font-semibold text-foreground flex-1 truncate">{agent.name}</span>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1"
                  style={isWorking
                    ? { backgroundColor: 'rgba(255,107,0,0.08)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.25)' }
                    : agent.status === 'error'
                      ? { backgroundColor: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }
                      : { backgroundColor: 'rgba(255,255,255,0.03)', color: '#555', border: '1px solid rgba(255,255,255,0.04)' }}>
                  {agent.status === 'error' ? 'ERR' : isWorking ? 'WORK' : 'IDLE'}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono" style={{ backgroundColor: `${color}10`, color, border: `1px solid ${color}20` }}>
                  {agent.lastTool}
                </span>
                <button onClick={() => setExpanded(isExpanded ? null : agent.id)} className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Row 2 */}
              <p className="text-[10px] leading-snug truncate" style={{ color: '#6b6b6b' }}>{agent.task}</p>

              {/* Progress */}
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <div
                  className={`h-full rounded-full transition-all duration-1000 relative ${isWorking ? 'progress-shimmer progress-glow-tip' : ''}`}
                  style={{ width: `${agent.progress}%`, backgroundColor: !isWorking ? 'rgba(255,255,255,0.06)' : undefined }}
                />
              </div>

              {/* Sparkline + output */}
              <div className="flex gap-2 items-end">
                <div className="flex-1 rounded p-1.5 font-mono text-[9px] leading-relaxed whitespace-pre-line"
                  style={{ backgroundColor: '#030306', color: '#555', maxHeight: '32px', overflow: 'hidden' }}>
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

              {/* Expanded details */}
              {isExpanded && (
                <div className="pt-2 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="text-[9px] text-muted-foreground">
                    <div className="font-mono mb-1">Tools used:</div>
                    <div className="flex gap-2 flex-wrap">
                      <span>web_search: 12x</span>
                      <span>browser_read: 8x</span>
                      <span>run_code: 3x</span>
                    </div>
                  </div>
                  <div className="text-[9px] text-muted-foreground font-mono">
                    Tasks: 34 | Success: 97% | Avg: 4.2min
                  </div>
                  <div className="flex gap-1.5">
                    <button className="text-[9px] px-2 py-1 rounded flex items-center gap-1 transition-colors hover:bg-white/[0.03]" style={{ color: '#FF8C00', border: '1px solid rgba(255,107,0,0.15)' }}>
                      <Pause className="w-3 h-3" /> Pause
                    </button>
                    <button className="text-[9px] px-2 py-1 rounded flex items-center gap-1 text-muted-foreground transition-colors hover:bg-white/[0.03]" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                      <RotateCcw className="w-3 h-3" /> Restart
                    </button>
                    <button className="text-[9px] px-2 py-1 rounded flex items-center gap-1 text-muted-foreground transition-colors hover:bg-white/[0.03]" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                      <FileText className="w-3 h-3" /> Log
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveAgents;
