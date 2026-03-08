import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Tooltip, ReferenceLine } from 'recharts';
import { ANALYTICS_TASKS_PER_AGENT, ANALYTICS_ACTIVITY } from '@/data/dashboardData';
import type { ApiMissionsResponse } from '@/services/apiService';

const AGENT_EMOJIS: Record<string, string> = {
  'Market Research': '🔍', 'CEO': '👔', 'Sales': '💰', 'Marketing': '📣', 'Design': '🎨',
  'COO': '⚙️', 'Finance': '📊', 'Supervisor': '🎯', 'R&D': '🧪', 'Legal': '⚖️', 'Customer Success': '🤝',
};

const sparkGreen = Array.from({ length: 8 }, () => ({ v: Math.floor(Math.random() * 5) + 18 }));
const sparkOrange = Array.from({ length: 8 }, () => ({ v: Math.floor(Math.random() * 3) + 6 }));
const sparkAmber = Array.from({ length: 8 }, () => ({ v: Math.floor(Math.random() * 40000) + 100000 }));
const sparkFlat = Array.from({ length: 8 }, () => ({ v: 4 + Math.random() * 0.5 }));
const sparkCost = Array.from({ length: 8 }, () => ({ v: Math.random() * 0.1 }));

const MONO_TOOL_USAGE = [
  { name: 'web_search', value: 35, color: '#FF6B00' },
  { name: 'browser_read', value: 25, color: '#CC5500' },
  { name: 'run_code', value: 20, color: '#994000' },
  { name: 'write_file', value: 15, color: '#662B00' },
  { name: 'other', value: 5, color: '#331500' },
];

type TimeRange = 'Today' | 'This Week' | 'This Month' | 'All Time';

interface Props {
  missions: ApiMissionsResponse;
}

const Analytics = ({ missions }: Props) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Today');
  const history = missions.history;

  return (
    <div className="space-y-5">
      {/* Time filter */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['Today', 'This Week', 'This Month', 'All Time'] as TimeRange[]).map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              className="text-[11px] px-3 py-1 rounded-full transition-all"
              style={timeRange === r
                ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' }
                : { background: 'rgba(255,255,255,0.03)', color: '#666', border: '1px solid rgba(255,255,255,0.05)' }
              }>
              {r}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">Last updated: just now</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Tasks', value: '26', trend: '↑ 12%', trendColor: '#4ade80', sparkData: sparkGreen, sparkColor: '#4ade80' },
          { label: 'Completed', value: '22', trend: '↑ 8%', trendColor: '#4ade80', sparkData: sparkOrange, sparkColor: '#FF8C00' },
          { label: 'Avg Time', value: '4.2m', trend: '↓ 0.3m', trendColor: '#4ade80', sparkData: sparkFlat, sparkColor: '#FF6B00' },
          { label: 'Tokens Used', value: '142K', trend: '~$0.00', trendColor: '#facc15', sparkData: sparkAmber, sparkColor: '#FF6B00' },
          { label: 'Cost Saved', value: '$0.43', trend: 'vs cloud', trendColor: '#4ade80', isGreen: true, sparkData: sparkCost, sparkColor: '#4ade80' },
        ].map((s, i) => (
          <div key={i} className={`glass-card p-4 relative overflow-hidden ${s.isGreen ? 'glow-green-card' : ''}`}>
            <div className="text-[9px] uppercase tracking-wider font-mono" style={{ color: '#555' }}>{s.label}</div>
            <div className={`text-3xl font-mono mono-value relative z-10 mt-1`}
              style={s.isGreen ? { color: '#4ade80' } : undefined}>
              {s.value}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] font-mono" style={{ color: s.trendColor }}>{s.trend}</span>
              <div className="w-10 h-5 opacity-30">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={s.sparkData}>
                    <Area type="monotone" dataKey="v" stroke={s.sparkColor} fill="transparent" strokeWidth={1} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tasks Per Agent</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_TASKS_PER_AGENT} layout="vertical" margin={{ left: 100, right: 30 }}>
                <defs>
                  <linearGradient id="barGradMono" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="100%" stopColor="#CC3300" />
                  </linearGradient>
                </defs>
                <XAxis type="number" tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="agent" tick={({ x, y, payload }: any) => (
                  <text x={x} y={y} dy={4} textAnchor="end" fill="#ccc" fontSize={11}>
                    {AGENT_EMOJIS[payload.value] || ''} {payload.value}
                  </text>
                )} axisLine={false} tickLine={false} width={100} />
                <Bar dataKey="tasks" fill="url(#barGradMono)" radius={[0, 6, 6, 0]} barSize={14}
                  label={{ position: 'right', fill: '#ffffff', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Activity Over Time</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_ACTIVITY}>
                <defs>
                  <linearGradient id="actGradMono" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={false} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="tasks" stroke="#FF6B00" fill="url(#actGradMono)" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#fff', stroke: '#FF6B00', strokeWidth: 2 }} />
                <ReferenceLine x={ANALYTICS_ACTIVITY[ANALYTICS_ACTIVITY.length - 1]?.time} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3"
                  label={{ value: 'NOW', fill: '#FF8C00', fontSize: 10, position: 'top' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tool Usage Distribution</h3>
          <div className="h-[280px] flex items-center">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={MONO_TOOL_USAGE} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" labelLine={false}>
                    {MONO_TOOL_USAGE.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(10,10,14,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[140px] space-y-2.5">
              {MONO_TOOL_USAGE.map(t => (
                <div key={t.name} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground font-mono">{t.name}</span>
                  <span className="font-mono mono-value">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Mission History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="text-left pb-2 font-medium">Date</th>
                  <th className="text-left pb-2 font-medium">Goal</th>
                  <th className="text-center pb-2 font-medium">Agents</th>
                  <th className="text-center pb-2 font-medium">Tasks</th>
                  <th className="text-center pb-2 font-medium">Duration</th>
                  <th className="text-center pb-2 font-medium">Status</th>
                  <th className="text-center pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {history.map((m, i) => (
                  <tr key={i} className="transition-colors"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,107,0,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent')}
                  >
                    <td className="py-2.5 font-mono text-muted-foreground">{m.date}</td>
                    <td className="py-2.5 text-foreground">{m.goal}</td>
                    <td className="py-2.5 text-center mono-value">{m.agents}</td>
                    <td className="py-2.5 text-center mono-value">{m.tasks}</td>
                    <td className="py-2.5 text-center font-mono text-muted-foreground">{m.duration}</td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium`}
                        style={m.status === 'completed'
                          ? { backgroundColor: 'rgba(34,197,94,0.06)', color: '#4ade80' }
                          : m.status === 'partial'
                            ? { backgroundColor: 'rgba(255,107,0,0.06)', color: '#FF8C00' }
                            : { backgroundColor: 'rgba(239,68,68,0.06)', color: '#ef4444' }
                        }>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <button className="text-[10px] px-2 py-0.5 rounded text-muted-foreground hover:text-foreground transition-colors" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
