import { useState } from 'react';
import { Play, Square, Check } from 'lucide-react';
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
  { emoji: '🔍', label: 'Research' },
  { emoji: '🏗️', label: 'Build' },
  { emoji: '📝', label: 'Content' },
  { emoji: '📊', label: 'Analyze' },
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
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} fill={`url(#spark-${color.replace('#', '')})`} strokeWidth={1} dot={false} />
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
    <div className="space-y-5">
      {/* ROW 1: Mission Input — side by side */}
      <div className="glass-card p-4 flex gap-4" style={{ minHeight: '140px' }}>
        <div className="flex-[3] flex flex-col">
          <textarea
            value={missionText}
            onChange={e => setMissionText(e.target.value)}
            className="w-full bg-muted/30 border border-border/50 rounded-lg p-3 text-sm text-foreground resize-none flex-1 outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
            placeholder="Describe your mission..."
          />
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {PRESETS.map((p, i) => (
              <button key={i} className="text-[10px] px-2.5 py-1 rounded-full glass-card-static text-muted-foreground hover:text-foreground transition-all flex items-center gap-1">
                <span>{p.emoji}</span> {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-[2] flex flex-col gap-2">
          <button
            onClick={handleRun}
            disabled={launching || !missionText.trim()}
            className="flex-1 text-primary-foreground rounded-lg text-sm font-bold flex items-center justify-center gap-2 mission-pulse-btn transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #CC3300 100%)', boxShadow: '0 0 20px rgba(255,107,0,0.35), 0 4px 15px rgba(0,0,0,0.4)' }}
          >
            <Play className="w-5 h-5" /> {launching ? 'LAUNCHING...' : 'RUN MISSION'}
          </button>
          <div className="text-center">
            <span className="text-[10px] text-muted-foreground font-mono">~15 min · 11 agents ready</span>
          </div>
        </div>
      </div>

      {/* ROW 2: Live Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Tasks', value: String(tasksCompleted), sub: '↑ 12%', subColor: '#4ade80', sparkData: sparkGreen, sparkColor: 'hsl(142,71%,45%)' },
          { label: 'Active', value: activeAgents, sub: 'optimizing', subColor: '#FF8C00', sparkData: sparkOrange, sparkColor: '#FF8C00' },
          { label: 'Tokens', value: '142K', sub: '$0.00', subColor: '#facc15', sparkData: sparkAmber, sparkColor: '#FF6B00' },
          { label: 'Success', value: '98.5%', sub: 'optimal', subColor: '#4ade80', sparkData: sparkFlat, sparkColor: 'hsl(142,71%,45%)' },
          { label: 'Runtime', value: current?.duration || '00:17:21', sub: 'Phase 2', subColor: '#FF8C00', sparkData: sparkOrange, sparkColor: '#FF6B00' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-3 relative overflow-hidden" style={{ height: '80px' }}>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">{s.label}</div>
            <div className="text-xl font-mono mono-value relative z-10 mt-0.5">{s.value}</div>
            <div className="text-[10px] font-mono" style={{ color: s.subColor }}>{s.sub}</div>
            <MiniSparkline data={s.sparkData} color={s.sparkColor} />
          </div>
        ))}
      </div>

      {/* ROW 3: Kanban */}
      <div className="grid grid-cols-3 gap-4">
        <KanbanColumn title="TO DO" count={KANBAN_TASKS.todo.length} items={KANBAN_TASKS.todo} />
        <KanbanColumn title="IN PROGRESS" count={KANBAN_TASKS.inProgress.length} items={KANBAN_TASKS.inProgress} isProgress />
        <KanbanColumn title="DONE" count={KANBAN_TASKS.done.length} items={KANBAN_TASKS.done} isDone />
      </div>
    </div>
  );
};

interface KanbanItem {
  id: number; tag: string; tagColor: string; title: string; agent: string;
  due?: string; status?: string; when?: string;
}

const KanbanColumn = ({ title, count, items, isProgress, isDone }: { title: string; count: number; items: KanbanItem[]; isProgress?: boolean; isDone?: boolean }) => (
  <div className="glass-card p-3 flex flex-col gap-2">
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{
          backgroundColor: isProgress ? '#FF6B00' : isDone ? '#4ade80' : '#555',
          boxShadow: isProgress ? '0 0 6px rgba(255,107,0,0.5)' : isDone ? '0 0 6px rgba(34,197,94,0.5)' : 'none'
        }} />
        <span className="text-xs font-bold text-muted-foreground">{title}</span>
      </div>
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{count}</span>
    </div>
    {items.map(item => {
      const tagStyle = TAG_STYLES[item.tagColor] || { bg: 'rgba(80,80,80,0.1)', text: '#666', border: 'rgba(255,255,255,0.06)' };
      return (
        <div
          key={item.id}
          className={`p-2.5 rounded-lg transition-all ${isProgress ? 'shimmer-border-left' : ''}`}
          style={{
            maxHeight: '72px',
            ...(isProgress
              ? { background: 'rgba(22, 14, 8, 0.85)', border: '1px solid rgba(255, 100, 0, 0.15)', borderLeft: '3px solid #FF6B00', boxShadow: '0 0 20px rgba(255, 107, 0, 0.12), inset 0 0 20px rgba(255, 107, 0, 0.03)' }
              : isDone
                ? { background: 'rgba(12, 12, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.03)', borderLeft: '3px solid rgba(34, 197, 94, 0.4)', opacity: 0.7 }
                : { background: 'rgba(18, 14, 10, 0.8)', border: '1px solid rgba(255, 255, 255, 0.05)', borderLeft: '3px solid rgba(255, 100, 0, 0.4)' })
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            {isDone && <Check className="w-3 h-3 text-neon-green flex-shrink-0" />}
            <span className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ backgroundColor: tagStyle.bg, color: tagStyle.text, border: `1px solid ${tagStyle.border}` }}>
              {item.tag}
            </span>
            <span className="text-[10px] text-muted-foreground ml-auto">{item.agent}</span>
          </div>
          <h4 className="text-xs font-semibold text-foreground heading-cinematic truncate">{item.title}</h4>
          {isProgress && item.status && (
            <span className="text-[10px] font-mono" style={{ color: '#FF8C00' }}>{item.status}</span>
          )}
        </div>
      );
    })}
  </div>
);

export default MissionControl;
