import { useState, useRef, useEffect } from 'react';
import { Play, Check } from 'lucide-react';
import { KANBAN_TASKS } from '@/data/dashboardData';
import { api } from '@/services/apiService';
import type { ApiMissionsResponse } from '@/services/apiService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const TAG_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  cyan: { bg: 'rgba(34,211,238,0.06)', text: '#22d3ee', border: 'rgba(34,211,238,0.2)' },
  purple: { bg: 'rgba(192,132,252,0.06)', text: '#c084fc', border: 'rgba(192,132,252,0.2)' },
  gold: { bg: 'rgba(251,191,36,0.06)', text: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  orange: { bg: 'rgba(251,146,60,0.06)', text: '#fb923c', border: 'rgba(251,146,60,0.2)' },
  green: { bg: 'rgba(74,222,128,0.06)', text: '#4ade80', border: 'rgba(74,222,128,0.2)' },
  pink: { bg: 'rgba(244,114,182,0.06)', text: '#f472b6', border: 'rgba(244,114,182,0.2)' },
};

const PRESETS = [
  { emoji: '🔍', label: 'Research' },
  { emoji: '🌐', label: 'Build Website' },
  { emoji: '📝', label: 'Content' },
  { emoji: '💰', label: 'Pricing Analysis' },
  { emoji: '📊', label: 'Market Research' },
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
            <stop offset="0%" stopColor={color} stopOpacity={0.5} />
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMissionText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = '80px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 300) + 'px';
    }
  };

  const current = missions.current;
  const tasksCompleted = current ? current.tasks : 22;
  const activeAgents = current ? `${current.agents}/11` : '8/11';

  return (
    <div className="space-y-5">
      {/* ROW 1: Mission Input */}
      <div className="glass-card p-5">
        <div className="flex gap-2 mb-3 flex-wrap">
          {PRESETS.map((p, i) => (
            <button key={i} className="text-[10px] px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span>{p.emoji}</span> {p.label}
            </button>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={missionText}
          onChange={handleTextareaChange}
          className="w-full rounded-lg p-3 text-[15px] text-foreground resize-none outline-none transition-colors placeholder:text-muted-foreground"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '80px', maxHeight: '300px' }}
          placeholder="Describe your mission objective in detail. The more specific, the better results..."
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] text-muted-foreground font-mono">~15 min estimated · 11 agents ready</span>
          <button
            onClick={handleRun}
            disabled={launching || !missionText.trim()}
            className="text-primary-foreground px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mission-pulse-btn transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #CC3300 100%)' }}
          >
            <Play className="w-4 h-4" /> {launching ? 'LAUNCHING...' : 'RUN MISSION'}
          </button>
        </div>
      </div>

      {/* ROW 2: Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Tasks', value: String(tasksCompleted), sub: '↑ 12%', subColor: '#4ade80', sparkData: sparkGreen, sparkColor: '#4ade80' },
          { label: 'Active', value: activeAgents, sub: 'optimizing', subColor: '#FF8C00', sparkData: sparkOrange, sparkColor: '#FF8C00' },
          { label: 'Tokens', value: '142K', sub: '$0.00', subColor: '#facc15', sparkData: sparkAmber, sparkColor: '#FF6B00' },
          { label: 'Success', value: '98.5%', sub: 'optimal', subColor: '#4ade80', sparkData: sparkFlat, sparkColor: '#4ade80' },
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
        }} />
        <span className="text-xs font-bold text-muted-foreground">{title}</span>
      </div>
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#666' }}>{count}</span>
    </div>
    {items.map(item => {
      const tagStyle = TAG_STYLES[item.tagColor] || { bg: 'rgba(255,255,255,0.03)', text: '#666', border: 'rgba(255,255,255,0.06)' };
      return (
        <div
          key={item.id}
          className={`p-2.5 rounded-lg transition-all ${isProgress ? 'shimmer-border-left' : ''}`}
          style={{
            maxHeight: '72px',
            ...(isProgress
              ? { background: 'rgba(12, 12, 16, 0.9)', border: '1px solid rgba(255, 107, 0, 0.12)', borderLeft: '3px solid #FF6B00' }
              : isDone
                ? { background: 'rgba(10, 10, 14, 0.5)', border: '1px solid rgba(255, 255, 255, 0.03)', borderLeft: '3px solid rgba(34, 197, 94, 0.3)', opacity: 0.7 }
                : { background: 'rgba(10, 10, 14, 0.7)', border: '1px solid rgba(255, 255, 255, 0.04)', borderLeft: '3px solid rgba(255, 107, 0, 0.25)' })
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            {isDone && <Check className="w-3 h-3 flex-shrink-0" style={{ color: '#4ade80' }} />}
            <span className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ backgroundColor: tagStyle.bg, color: tagStyle.text, border: `1px solid ${tagStyle.border}` }}>
              {item.tag}
            </span>
            <span className="text-[10px] text-muted-foreground ml-auto">{item.agent}</span>
          </div>
          <h4 className="text-xs font-semibold text-foreground truncate">{item.title}</h4>
          {isProgress && item.status && (
            <span className="text-[10px] font-mono" style={{ color: '#FF8C00' }}>{item.status}</span>
          )}
        </div>
      );
    })}
  </div>
);

export default MissionControl;
