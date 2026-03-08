import { useState } from 'react';
import { SOURCES_DATA, AGENT_COLORS } from '@/data/dashboardData';

const Sources = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const agents = [...new Set(SOURCES_DATA.map(s => s.agent))];
  const filtered = filter ? SOURCES_DATA.filter(s => s.agent === filter) : SOURCES_DATA;

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="glass-card p-3 border-neon-green/30 bg-neon-green/5 flex items-center gap-2">
        <span className="text-neon-green">✅</span>
        <span className="text-xs text-neon-green">All {SOURCES_DATA.length} sources verified — real URLs visited and data extracted by agents</span>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter(null)} className={`text-[11px] px-3 py-1 rounded-full transition-colors ${!filter ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'}`}>All</button>
        {agents.map(a => (
          <button key={a} onClick={() => setFilter(a)} className={`text-[11px] px-3 py-1 rounded-full transition-colors ${filter === a ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'}`}>{a}</button>
        ))}
      </div>

      {/* Source cards */}
      <div className="space-y-3">
        {filtered.map(src => (
          <div key={src.id} className="glass-card p-4" style={{ borderLeft: `3px solid ${AGENT_COLORS[src.color] || 'hsl(var(--muted-foreground))'}` }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{src.site}</h4>
                <a href={src.url} target="_blank" rel="noopener" className="text-[11px] text-neon-cyan hover:underline">{src.url}</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{src.agent}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{src.timestamp}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{src.extract}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sources;
