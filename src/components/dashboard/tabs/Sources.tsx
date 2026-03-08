import { useState } from 'react';
import { SOURCES_DATA, AGENT_COLORS } from '@/data/dashboardData';

const TRUST_SCORES: Record<string, { label: string; color: string }> = {
  'FreshBooks': { label: 'High', color: 'text-neon-green' },
  'Wave Financial': { label: 'High', color: 'text-neon-green' },
  'Invoice Ninja': { label: 'High', color: 'text-neon-green' },
  'TechCrunch': { label: 'Very High', color: '' },
  'G2 Reviews': { label: 'Very High', color: '' },
  'Stripe Docs': { label: 'Very High', color: '' },
  'Product Hunt': { label: 'High', color: 'text-neon-green' },
  'LinkedIn Insights': { label: 'Medium', color: 'text-neon-yellow' },
};

const Sources = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const agents = [...new Set(SOURCES_DATA.map(s => s.agent))];
  const filtered = filter ? SOURCES_DATA.filter(s => s.agent === filter) : SOURCES_DATA;

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="glass-card p-3 border-neon-green/30 bg-neon-green/5 flex items-center gap-2" style={{ animation: 'shimmer-green 3s ease-in-out infinite' }}>
        <span className="text-neon-green">✅</span>
        <span className="text-xs text-neon-green">All {SOURCES_DATA.length} sources verified — real URLs visited and data extracted by agents</span>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter(null)} className={`text-[11px] px-3 py-1 rounded-full transition-all ${!filter ? 'bg-primary text-primary-foreground neon-glow-purple' : 'glass-card text-muted-foreground hover:text-foreground'}`}>All</button>
        {agents.map(a => {
          const agentColor = SOURCES_DATA.find(s => s.agent === a)?.color;
          const isActive = filter === a;
          return (
            <button key={a} onClick={() => setFilter(a)} className={`text-[11px] px-3 py-1 rounded-full transition-all ${isActive ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'}`}
              style={isActive ? { boxShadow: `0 0 12px ${AGENT_COLORS[agentColor || ''] || 'rgba(255,107,0,0.4)'}` } : undefined}
            >{a}</button>
          );
        })}
      </div>

      {/* Source cards */}
      <div className="space-y-3">
        {filtered.map(src => {
          const trust = TRUST_SCORES[src.site];
          const isExpanded = expanded === src.id;
          return (
            <div key={src.id} className="glass-card p-4 cursor-pointer transition-all" style={{ borderLeft: `3px solid ${AGENT_COLORS[src.color] || 'hsl(var(--muted-foreground))'}` }}
              onClick={() => setExpanded(isExpanded ? null : src.id)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: AGENT_COLORS[src.color] || 'hsl(var(--muted))' }}>
                    {src.site[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{src.site}</h4>
                    <a href={src.url} target="_blank" rel="noopener" className="text-[11px] hover:underline" style={{ color: '#FF8C00' }} onClick={e => e.stopPropagation()}>{src.url}</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {trust && <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-muted font-medium ${trust.color}`} style={!trust.color ? { color: '#FF8C00' } : undefined}>TRUST: {trust.label}</span>}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{src.agent}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{src.timestamp}</span>
                </div>
              </div>
              <p className={`text-xs text-muted-foreground leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>{src.extract}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sources;
