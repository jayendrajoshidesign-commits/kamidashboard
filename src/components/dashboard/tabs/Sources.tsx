import { useState } from 'react';
import { SOURCES_DATA, AGENT_COLORS } from '@/data/dashboardData';

const TRUST_STYLES: Record<string, { label: string; color: string; dotColor: string }> = {
  'FreshBooks': { label: 'High', color: '#FF8C00', dotColor: '#FF8C00' },
  'Wave Financial': { label: 'High', color: '#FF8C00', dotColor: '#FF8C00' },
  'Invoice Ninja': { label: 'High', color: '#FF8C00', dotColor: '#FF8C00' },
  'TechCrunch': { label: 'Very High', color: '#4ade80', dotColor: '#4ade80' },
  'G2 Reviews': { label: 'Very High', color: '#4ade80', dotColor: '#4ade80' },
  'Stripe Docs': { label: 'Very High', color: '#4ade80', dotColor: '#4ade80' },
  'Product Hunt': { label: 'High', color: '#FF8C00', dotColor: '#FF8C00' },
  'LinkedIn Insights': { label: 'Medium', color: '#facc15', dotColor: '#facc15' },
};

const SITE_COLORS: Record<string, string> = {
  'FreshBooks': '#FF6B00',
  'Wave Financial': '#14b8a6',
  'Invoice Ninja': '#6366f1',
  'TechCrunch': '#22c55e',
  'G2 Reviews': '#ef4444',
  'Stripe Docs': '#6366f1',
  'Product Hunt': '#FF6B00',
  'LinkedIn Insights': '#0077b5',
};

const Sources = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const agents = [...new Set(SOURCES_DATA.map(s => s.agent))];
  const filtered = filter ? SOURCES_DATA.filter(s => s.agent === filter) : SOURCES_DATA;

  return (
    <div className="space-y-4">
      {/* Banner with shimmer */}
      <div className="glass-card p-3 flex items-center gap-2 overflow-hidden relative"
        style={{ border: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.03)' }}>
        <div className="absolute inset-0 shimmer-sweep pointer-events-none" />
        <span className="text-neon-green relative z-10">✅</span>
        <span className="text-xs text-neon-green relative z-10">All {SOURCES_DATA.length} sources verified — real URLs visited and data extracted by agents</span>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter(null)} className={`text-[11px] px-3 py-1 rounded-full transition-all ${!filter ? 'text-primary-foreground' : 'glass-card-static text-muted-foreground hover:text-foreground'}`}
          style={!filter ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)' } : undefined}>
          All
        </button>
        {agents.map(a => {
          const isActive = filter === a;
          return (
            <button key={a} onClick={() => setFilter(a)} className={`text-[11px] px-3 py-1 rounded-full transition-all ${isActive ? 'text-primary-foreground' : 'glass-card-static text-muted-foreground hover:text-foreground'}`}
              style={isActive ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)' } : undefined}
            >{a}</button>
          );
        })}
      </div>

      {/* Source cards */}
      <div className="space-y-2">
        {filtered.map(src => {
          const trust = TRUST_STYLES[src.site];
          const siteColor = SITE_COLORS[src.site] || '#FF6B00';
          const isExpanded = expanded === src.id;
          return (
            <div key={src.id} className="glass-card p-4 cursor-pointer transition-all"
              style={{ borderLeft: `3px solid ${isExpanded ? siteColor : 'transparent'}` }}
              onClick={() => setExpanded(isExpanded ? null : src.id)}>
              <div className="flex items-start gap-3">
                {/* Site circle */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: siteColor }}>
                  {src.site[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-semibold text-foreground heading-cinematic">{src.site}</h4>
                    <a href={src.url} target="_blank" rel="noopener" className="text-[10px] truncate hover:underline" style={{ color: '#FF8C00' }}
                      onClick={e => e.stopPropagation()}>{src.url}</a>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`} style={{ color: '#888', fontStyle: 'italic' }}>{src.extract}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {trust && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${trust.color}15`, color: trust.color, border: `1px solid ${trust.color}33` }}>
                      {trust.label}
                    </span>
                  )}
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{src.agent}</span>
                  <span className="text-[9px] font-mono text-muted-foreground">{src.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sources;
