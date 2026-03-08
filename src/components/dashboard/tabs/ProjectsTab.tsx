import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { PROJECTS_DATA } from '@/data/dashboardData';
import { useResponsive } from '@/hooks/useResponsive';

type FilterType = 'All' | 'Active' | 'Completed';

const ProjectsTab = () => {
  const [filter, setFilter] = useState<FilterType>('All');
  const [search, setSearch] = useState('');
  const { isMobile, isTablet } = useResponsive();

  const filtered = PROJECTS_DATA
    .filter(p => filter === 'All' ? true : filter === 'Active' ? p.status === 'In Progress' : p.status === 'Completed')
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
        <div className="flex gap-2">
          {(['All', 'Active', 'Completed'] as FilterType[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-[11px] px-3 py-1.5 rounded-full transition-all"
              style={filter === f
                ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' }
                : { background: 'rgba(255,255,255,0.03)', color: '#666', border: '1px solid rgba(255,255,255,0.05)' }
              }>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className={`bg-transparent text-foreground text-xs outline-none placeholder:text-muted-foreground ${isMobile ? 'w-full' : 'w-40'}`}
              placeholder="Search projects..." />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {filtered.map(p => (
            <div key={p.id} className="glass-card p-4 flex flex-col gap-3 group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.emoji}</span>
                  <h3 className={`font-semibold text-foreground ${isMobile ? 'text-[13px]' : 'text-sm'}`}>{p.name}</h3>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full"
                  style={p.status === 'In Progress'
                    ? { backgroundColor: 'rgba(255,107,0,0.08)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.2)' }
                    : { backgroundColor: 'rgba(34,197,94,0.06)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.15)' }
                  }>
                  {p.status === 'In Progress' ? '● In Progress' : '✓ Completed'}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground line-clamp-2">{p.description}</p>

              <div>
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-mono" style={{ color: '#FF8C00' }}>{p.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <div className={`h-full rounded-full ${p.progress < 100 ? 'progress-shimmer' : ''}`}
                    style={{ width: `${p.progress}%`, backgroundColor: p.progress >= 100 ? '#4ade80' : undefined }} />
                </div>
              </div>

              <div className="flex gap-3 text-[10px] text-muted-foreground flex-wrap">
                <span>📋 {p.tasks} tasks</span>
                <span>🤖 {p.agents} agents</span>
                <span>📁 {p.files} files</span>
                <span>⏱ {p.days}d</span>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {p.techStack.map(t => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#888', border: '1px solid rgba(255,255,255,0.04)' }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-[9px] text-muted-foreground">{p.lastActivity}</span>
                <button className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#FF8C00' }}>
                  Open Project →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">No projects found</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Start a mission to create your first project</p>
          <button className="text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold min-h-[40px]"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>
            + New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
