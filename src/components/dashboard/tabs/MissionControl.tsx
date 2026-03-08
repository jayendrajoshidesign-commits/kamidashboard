import { useState } from 'react';
import { Play, Square } from 'lucide-react';
import { KANBAN_TASKS } from '@/data/dashboardData';
import { api } from '@/services/apiService';
import type { ApiMissionsResponse } from '@/services/apiService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const TAG_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  cyan: { bg: 'rgba(255,107,0,0.06)', text: '#FF8C00', border: 'rgba(255,107,0,0.3)' },
  purple: { bg: 'rgba(168,85,247,0.06)', text: '#c084fc', border: 'rgba(168,85,247,0.3)' },
  gold: { bg: 'rgba(59,130,246,0.06)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  orange: { bg: 'rgba(239,68,68,0.06)', text: '#f87171', border: 'rgba(239,68,68,0.3)' },
  green: { bg: 'rgba(34,197,94,0.06)', text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  pink: { bg: 'rgba(234,179,8,0.06)', text: '#facc15', border: 'rgba(234,179,8,0.3)' },
};

const PRESETS = [
  { emoji: '🔍', label: 'Research', text: 'Research competitors in the freelance invoicing SaaS space — pricing, features, market size, and customer pain points' },
  { emoji: '🌐', label: 'Build Website', text: 'Build a modern landing page for our invoice SaaS MVP with hero section, features grid, pricing table, and CTA' },
  { emoji: '📝', label: 'Generate Content', text: 'Create a content marketing strategy: blog posts, social media calendar, email sequences for product launch' },
  { emoji: '💰', label: 'Analyze Pricing', text: 'Analyze pricing models for subscription-based SaaS — compare freemium, tiered, usage-based, and flat-rate approaches' },
];

const sparkGreen = Array.from({ length: 10 }, () => ({ v: Math.floor(Math.random() * 5) + 18 }));
const sparkOrange = Array.from({ length: 10 }, () => ({ v: Math.floor(Math.random() * 3) + 6 }));
const sparkAmber = Array.from({ length: 10 }, () => ({ v: Math.floor(Math.random() * 40000) + 100000 }));
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

interface Props {
  isConnected: boolean;
  missions: ApiMissionsResponse;
}

const MissionControl = ({ isConnected, missions }: Props) => {
  const [missionText, setMissionText] = useState('');
  const [launching, setLaunching] = useState(false);

  const handleRun = async () => {
    if (!missionText.trim()) return;
    if (isConnected) {
      setLaunching(true);
      try {
        await api.startMission(missionText);
        setMissionText('');
      } catch { /* keep text */ }
      finally { setLaunching(false); }
    }
  };

  const handleStop = async () => {
    if (isConnected) {
      try { await api.stopMission(); } catch {}
    }
  };

  const current = missions.current;
  const tasksCompleted = current ? current.tasks : 22;
  const activeAgents = current ? `${current.agents}/11` : '8/11';

  return (
    <div className="space-y-6">
      {/* Mission Input */}
      <div className="glass-card p-5 focus-glow-purple">
        <h3 className="text-sm font-semibold text-foreground mb-3 heading-cinematic">🎯 New Mission</h3>
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
          <button
            onClick={handleRun}
            disabled={launching || !missionText.trim()}
            className="text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 mission-pulse-btn transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #CC3300 100%)', boxShadow: '0 0 20px rgba(255,107,0,0.35), 0 4px 15px rgba(0,0,0,0.4)' }}
          >
            <Play className="w-4 h-4" /> {launching ? 'LAUNCHING...' : 'RUN MISSION'}
          </button>
          <button
            onClick={handleStop}
            className="bg-neon-red/10 text-neon-red border border-neon-red/30 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-neon-red/20 glow-red-hover transition-all"
          >
            <Square className="w-4 h-4" /> STOP
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Tasks Completed', value: String(tasksCompleted), sub: '↑ 12% vs last hr', subColor: 'text-neon-green', sparkData: sparkGreen, sparkColor: 'hsl(142,71%,45%)' },
          { label: 'Active Agents', value: activeAgents, sub: 'Optimization active', subColor: '', sparkData: sparkOrange, sparkColor: '#FF8C00' },
          { label: 'Tokens Used', value: '142K', sub: '~$0.00 (local)', subColor: 'text-neon-yellow', sparkData: sparkAmber, sparkColor: '#FF6B00' },
          { label: 'Success Rate', value: '98.5%', sub: 'Optimal', subColor: 'text-neon-green', sparkData: sparkFlat, sparkColor: 'hsl(142,71%,45%)' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 section-header">{s.label}</div>
            <div className="text-2xl font-mono mono-value relative z-10">{s.value}</div>
            <div className={`text-[11px] mt-1 ${s.subColor}`} style={!s.subColor ? { color: '#FF8C00', textShadow: '0 0 12px rgba(255,140,0,0.4)' } : undefined}>{s.sub}</div>
            <MiniSparkline data={s.sparkData} color={s.sparkColor} />
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-3 gap-4">
        <KanbanColumn title="TO DO" count={KANBAN_TASKS.todo.length} items={KANBAN_TASKS.todo} />
        <KanbanColumn title="IN PROGRESS" count={KANBAN_TASKS.inProgress.length} items={KANBAN_TASKS.inProgress} isProgress countColor="" />
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
      <span className={`text-xs font-mono px-2 py-0.5 rounded bg-muted ${countColor || 'text-muted-foreground'}`}
        style={isProgress ? { color: '#FF8C00' } : undefined}>{count}</span>
    </div>
    {items.map(item => {
      const tagStyle = TAG_STYLES[item.tagColor] || { bg: 'rgba(80,80,80,0.1)', text: '#666', border: 'rgba(255,255,255,0.06)' };
      return (
        <div
          key={item.id}
          className={`p-3 cursor-grab transition-all rounded-lg ${isProgress ? 'shimmer-border-left' : ''}`}
          style={
            isProgress
              ? { background: 'rgba(22, 14, 8, 0.85)', border: '1px solid rgba(255, 100, 0, 0.15)', borderLeft: '3px solid #FF6B00', boxShadow: '0 0 20px rgba(255, 107, 0, 0.12), inset 0 0 20px rgba(255, 107, 0, 0.03)' }
              : isDone
                ? { background: 'rgba(12, 12, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.03)', borderLeft: '3px solid rgba(34, 197, 94, 0.4)', opacity: 0.7 }
                : { background: 'rgba(18, 14, 10, 0.8)', border: '1px solid rgba(255, 255, 255, 0.05)', borderLeft: '3px solid rgba(255, 100, 0, 0.4)' }
          }
        >
          <span className="text-[10px] px-1.5 py-0.5 rounded inline-block mb-2"
            style={{ backgroundColor: tagStyle.bg, color: tagStyle.text, border: `1px solid ${tagStyle.border}` }}>
            {item.tag}
          </span>
          <h4 className="text-sm font-semibold text-foreground mb-2 heading-cinematic">{item.title}</h4>
          <div className="flex justify-between items-center text-[11px] text-muted-foreground">
            <span>{item.agent}</span>
            <span style={item.status ? { color: '#FF8C00', textShadow: '0 0 8px rgba(255,140,0,0.3)' } : undefined}>{item.due || item.status || item.when}</span>
          </div>
        </div>
      );
    })}
  </div>
);

export default MissionControl;
