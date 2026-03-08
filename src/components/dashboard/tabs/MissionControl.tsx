import { useState } from 'react';
import { Play, Square } from 'lucide-react';
import { KANBAN_TASKS } from '@/data/dashboardData';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const TAG_COLORS: Record<string, string> = {
  cyan: 'bg-neon-cyan/15 text-neon-cyan',
  purple: 'bg-primary/15 text-primary',
  gold: 'bg-neon-gold/15 text-neon-gold',
  orange: 'bg-neon-orange/15 text-neon-orange',
  green: 'bg-neon-green/15 text-neon-green',
  pink: 'bg-neon-pink/15 text-neon-pink',
};

const TAG_GLOW: Record<string, string> = {
  cyan: 'hsla(187,86%,43%,0.15)',
  purple: 'hsla(263,70%,58%,0.15)',
  gold: 'hsla(43,96%,56%,0.15)',
  orange: 'hsla(25,95%,53%,0.15)',
  green: 'hsla(142,71%,45%,0.15)',
  pink: 'hsla(330,80%,60%,0.15)',
};

const PRESETS = [
  { emoji: '🔍', label: 'Research', text: 'Research competitors in the freelance invoicing SaaS space — pricing, features, market size, and customer pain points' },
  { emoji: '🌐', label: 'Build Website', text: 'Build a modern landing page for our invoice SaaS MVP with hero section, features grid, pricing table, and CTA' },
  { emoji: '📝', label: 'Generate Content', text: 'Create a content marketing strategy: blog posts, social media calendar, email sequences for product launch' },
  { emoji: '💰', label: 'Analyze Pricing', text: 'Analyze pricing models for subscription-based SaaS — compare freemium, tiered, usage-based, and flat-rate approaches' },
];

const sparkGreen = Array.from({ length: 10 }, () => ({ v: Math.floor(Math.random() * 5) + 18 }));
const sparkCyan = Array.from({ length: 10 }, () => ({ v: Math.floor(Math.random() * 3) + 6 }));
const sparkPurple = Array.from({ length: 10 }, () => ({ v: Math.floor(Math.random() * 40000) + 100000 }));
const sparkFlat = Array.from({ length: 10 }, () => ({ v: 98 + Math.random() * 1.5 }));

const MiniSparkline = ({ data, color }: { data: { v: number }[]; color: string }) => (
  <div className="sparkline-watermark">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} fill={`url(#spark-${color})`} strokeWidth={1} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const MissionControl = () => {
  const [missionText, setMissionText] = useState('');

  return (
    <div className="space-y-6">
      {/* Mission Input */}
      <div className="glass-card p-5 focus-glow-purple">
        <h3 className="text-sm font-semibold text-foreground mb-3">🎯 New Mission</h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => setMissionText(p.text)} className="text-[11px] px-2.5 py-1.5 rounded-full glass-card text-muted-foreground hover:text-foreground transition-all hover:border-primary/30 flex items-center gap-1">
              <span>{p.emoji}</span> {p.label}
            </button>
          ))}
        </div>
        <textarea
          value={missionText}
          onChange={e => setMissionText(e.target.value)}
          className="w-full bg-muted/50 border border-border/50 rounded-lg p-3 text-sm text-foreground resize-none h-20 outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
          placeholder="Describe your mission objective..."
        />
        <div className="flex gap-2 mt-3">
          <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 pulse-glow-btn transition-all">
            <Play className="w-4 h-4" /> RUN MISSION
          </button>
          <button className="bg-neon-red/10 text-neon-red border border-neon-red/30 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-neon-red/20 glow-red-hover transition-all">
            <Square className="w-4 h-4" /> STOP
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Tasks Completed', value: '22', sub: '↑ 12% vs last hr', subColor: 'text-neon-green', sparkData: sparkGreen, sparkColor: 'hsl(142,71%,45%)' },
          { label: 'Active Agents', value: '8/11', sub: 'Optimization active', subColor: 'text-neon-cyan', sparkData: sparkCyan, sparkColor: 'hsl(187,86%,43%)' },
          { label: 'Tokens Used', value: '142K', sub: '~$0.00 (local)', subColor: 'text-neon-yellow', sparkData: sparkPurple, sparkColor: 'hsl(263,70%,58%)' },
          { label: 'Success Rate', value: '98.5%', sub: 'Optimal', subColor: 'text-neon-green', sparkData: sparkFlat, sparkColor: 'hsl(142,71%,45%)' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{s.label}</div>
            <div className="text-2xl font-mono font-bold text-foreground relative z-10">{s.value}</div>
            <div className={`text-[11px] mt-1 ${s.subColor}`}>{s.sub}</div>
            <MiniSparkline data={s.sparkData} color={s.sparkColor} />
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-3 gap-4">
        <KanbanColumn title="TO DO" count={KANBAN_TASKS.todo.length} items={KANBAN_TASKS.todo} />
        <KanbanColumn title="IN PROGRESS" count={KANBAN_TASKS.inProgress.length} items={KANBAN_TASKS.inProgress} isProgress countColor="text-neon-cyan" />
        <KanbanColumn title="DONE" count={KANBAN_TASKS.done.length} items={KANBAN_TASKS.done} isDone countColor="text-neon-green" />
      </div>
    </div>
  );
};

interface KanbanItem {
  id: number; tag: string; tagColor: string; title: string; agent: string;
  due?: string; status?: string; when?: string;
}

const KanbanColumn = ({ title, count, items, countColor, isProgress, isDone }: { title: string; count: number; items: KanbanItem[]; countColor?: string; isProgress?: boolean; isDone?: boolean }) => (
  <div className="glass-card p-4 flex flex-col gap-3">
    <div className="flex justify-between items-center">
      <span className="text-sm font-semibold text-muted-foreground">{title}</span>
      <span className={`text-xs font-mono px-2 py-0.5 rounded bg-muted ${countColor || 'text-muted-foreground'}`}>{count}</span>
    </div>
    {items.map(item => (
      <div
        key={item.id}
        className={`glass-card p-3 cursor-grab transition-all ${isProgress ? 'shimmer-border-left' : ''} ${isDone ? 'opacity-60' : ''}`}
        style={{ ['--hover-glow' as any]: TAG_GLOW[item.tagColor] }}
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
