import { useState } from 'react';
import { Play } from 'lucide-react';
import { KANBAN_TASKS, MISSION_PRESETS } from '@/data/dashboardData';

const TAG_COLORS: Record<string, string> = {
  cyan: 'bg-neon-cyan/15 text-neon-cyan',
  purple: 'bg-primary/15 text-primary',
  gold: 'bg-neon-gold/15 text-neon-gold',
  orange: 'bg-neon-orange/15 text-neon-orange',
  green: 'bg-neon-green/15 text-neon-green',
  pink: 'bg-neon-pink/15 text-neon-pink',
};

const MissionControl = () => {
  const [missionText, setMissionText] = useState('');

  return (
    <div className="space-y-6">
      {/* Mission Input */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">🎯 New Mission</h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          {MISSION_PRESETS.map((p, i) => (
            <button key={i} onClick={() => setMissionText(p)} className="text-[11px] px-2.5 py-1 rounded-full glass-card text-muted-foreground hover:text-foreground transition-colors">
              {p.slice(0, 40)}...
            </button>
          ))}
        </div>
        <textarea
          value={missionText}
          onChange={e => setMissionText(e.target.value)}
          className="w-full bg-muted/50 border border-border/50 rounded-lg p-3 text-sm text-foreground resize-none h-20 outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
          placeholder="Describe your mission objective..."
        />
        <button className="mt-3 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 neon-glow-purple transition-all">
          <Play className="w-4 h-4" /> RUN MISSION
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Tasks Completed', value: '22', sub: '↑ 12% vs last hr', subColor: 'text-neon-green' },
          { label: 'Active Agents', value: '8/11', sub: 'Optimization active', subColor: 'text-neon-cyan' },
          { label: 'Tokens Used', value: '142K', sub: '~$0.00 (local)', subColor: 'text-neon-yellow' },
          { label: 'Success Rate', value: '98.5%', sub: 'Optimal', subColor: 'text-neon-green' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{s.label}</div>
            <div className="text-2xl font-mono font-bold text-foreground">{s.value}</div>
            <div className={`text-[11px] mt-1 ${s.subColor}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-3 gap-4">
        <KanbanColumn title="TO DO" count={KANBAN_TASKS.todo.length} items={KANBAN_TASKS.todo.map(t => ({ ...t, borderColor: undefined }))} />
        <KanbanColumn title="IN PROGRESS" count={KANBAN_TASKS.inProgress.length} items={KANBAN_TASKS.inProgress.map(t => ({ ...t, borderColor: TAG_COLORS[t.tagColor]?.includes('cyan') ? 'hsl(var(--neon-cyan))' : 'hsl(var(--neon-purple))', shimmer: true }))} countColor="text-neon-cyan" />
        <KanbanColumn title="DONE" count={KANBAN_TASKS.done.length} items={KANBAN_TASKS.done.map(t => ({ ...t, opacity: true }))} countColor="text-neon-green" />
      </div>
    </div>
  );
};

interface KanbanItem {
  id: number; tag: string; tagColor: string; title: string; agent: string;
  due?: string; status?: string; when?: string;
  borderColor?: string; shimmer?: boolean; opacity?: boolean;
}

const KanbanColumn = ({ title, count, items, countColor }: { title: string; count: number; items: KanbanItem[]; countColor?: string }) => (
  <div className="glass-card p-4 flex flex-col gap-3">
    <div className="flex justify-between items-center">
      <span className="text-sm font-semibold text-muted-foreground">{title}</span>
      <span className={`text-xs font-mono px-2 py-0.5 rounded bg-muted ${countColor || 'text-muted-foreground'}`}>{count}</span>
    </div>
    {items.map(item => (
      <div
        key={item.id}
        className={`glass-card p-3 cursor-grab ${item.shimmer ? 'shimmer-border-left' : ''} ${item.opacity ? 'opacity-60' : ''}`}
        style={item.borderColor && !item.shimmer ? { borderLeft: `3px solid ${item.borderColor}` } : undefined}
      >
        <span className={`text-[10px] px-1.5 py-0.5 rounded inline-block mb-2 ${TAG_COLORS[item.tagColor] || 'bg-muted text-muted-foreground'}`}>{item.tag}</span>
        <h4 className="text-sm font-medium text-foreground mb-2">{item.title}</h4>
        <div className="flex justify-between items-center text-[11px] text-muted-foreground">
          <span>{item.agent}</span>
          <span className={item.status ? 'text-neon-cyan' : ''}>{item.due || item.status || item.when}</span>
        </div>
      </div>
    ))}
  </div>
);

export default MissionControl;
