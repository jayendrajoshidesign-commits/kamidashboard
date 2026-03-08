import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Tooltip, ReferenceLine } from 'recharts';
import { ANALYTICS_TASKS_PER_AGENT, ANALYTICS_ACTIVITY, TOOL_USAGE } from '@/data/dashboardData';
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

const MiniWatermark = ({ data, color }: { data: { v: number }[]; color: string }) => (
  <div className="absolute right-2 bottom-2 w-16 h-8 opacity-15 pointer-events-none">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <Area type="monotone" dataKey="v" stroke={color} fill={color} strokeWidth={1} dot={false} fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

interface Props {
  missions: ApiMissionsResponse;
}

const Analytics = ({ missions }: Props) => {
  const history = missions.history;

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Tasks', value: '26', trend: '↑ 12%', trendColor: '#4ade80', sparkData: sparkGreen, sparkColor: 'hsl(142,71%,45%)' },
          { label: 'Completed', value: '22', trend: '↑ 8%', trendColor: '#4ade80', sparkData: sparkOrange, sparkColor: '#FF8C00' },
          { label: 'Avg Time', value: '4.2m', trend: '↓ 0.3m', trendColor: '#4ade80', sparkData: sparkFlat, sparkColor: '#FF6B00' },
          { label: 'Tokens Used', value: '142K', trend: '~$0.00', trendColor: '#facc15', sparkData: sparkAmber, sparkColor: '#FF6B00' },
          { label: 'Cost Saved', value: '$0.43', trend: 'vs cloud', trendColor: '#4ade80', isGreen: true, sparkData: sparkCost, sparkColor: 'hsl(142,71%,45%)' },
        ].map((s, i) => (
          <div key={i} className={`glass-card p-4 relative overflow-hidden ${s.isGreen ? 'glow-green-card border-neon-green/20' : ''}`}>
            <div className="text-[9px] uppercase tracking-wider font-mono" style={{ color: '#666' }}>{s.label}</div>
            <div className={`text-3xl font-mono mono-value relative z-10 mt-1 ${s.isGreen ? 'text-neon-green' : ''}`}
              style={s.isGreen ? { textShadow: '0 0 20px rgba(34,197,94,0.4)' } : undefined}>
              {s.value}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] font-mono" style={{ color: s.trendColor }}>{s.trend}</span>
              <div className="w-10 h-5 opacity-40">
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

      {/* Charts grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tasks per agent — monochrome orange */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 heading-cinematic">Tasks Per Agent</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_TASKS_PER_AGENT} layout="vertical" margin={{ left: 100, right: 30 }}>
                <defs>
                  <linearGradient id="barGradMono" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="100%" stopColor="#CC3300" />
                  </linearGradient>
                  <filter id="barGlow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <XAxis type="number" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="agent" tick={({ x, y, payload }: any) => (
                  <text x={x} y={y} dy={4} textAnchor="end" fill="#fff" fontSize={11}>
                    {AGENT_EMOJIS[payload.value] || ''} {payload.value}
                  </text>
                )} axisLine={false} tickLine={false} width={100} />
                <Bar dataKey="tasks" fill="url(#barGradMono)" radius={[0, 6, 6, 0]} barSize={14}
                  label={{ position: 'right', fill: '#ffffff', fontSize: 11, fontFamily: 'JetBrains Mono' }} filter="url(#barGlow)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity over time */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 heading-cinematic">Activity Over Time</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_ACTIVITY}>
                <defs>
                  <linearGradient id="actGradMono" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                  <filter id="actGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={false} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="tasks" stroke="#FF6B00" fill="url(#actGradMono)" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#fff', stroke: '#FF6B00', strokeWidth: 2 }} filter="url(#actGlow)" />
                <ReferenceLine x={ANALYTICS_ACTIVITY[ANALYTICS_ACTIVITY.length - 1]?.time} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3"
                  label={{ value: 'NOW', fill: '#FF8C00', fontSize: 10, position: 'top' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tool usage — monochrome orange donut */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 heading-cinematic">Tool Usage Distribution</h3>
          <div className="h-[280px] flex items-center">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={MONO_TOOL_USAGE} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" labelLine={false}>
                    {MONO_TOOL_USAGE.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f0f0f', border: '1px solid rgba(255,107,0,0.3)', borderRadius: '8px', fontSize: '12px' }} />
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

        {/* Mission history */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 heading-cinematic">Mission History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground" style={{ borderBottom: '1px solid rgba(255,80,0,0.1)' }}>
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
                      borderBottom: '1px solid rgba(255,80,0,0.06)',
                      backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,107,0,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent')}
                  >
                    <td className="py-2.5 font-mono text-muted-foreground">{m.date}</td>
                    <td className="py-2.5 text-foreground">{m.goal}</td>
                    <td className="py-2.5 text-center mono-value">{m.agents}</td>
                    <td className="py-2.5 text-center mono-value">{m.tasks}</td>
                    <td className="py-2.5 text-center font-mono text-muted-foreground">{m.duration}</td>
                    <td className="py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${m.status === 'completed' ? 'bg-neon-green/10 text-neon-green' : m.status === 'partial' ? '' : 'bg-neon-red/10 text-neon-red'}`}
                        style={m.status === 'partial' ? { backgroundColor: 'rgba(255,107,0,0.1)', color: '#FF8C00' } : undefined}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <button className="text-[10px] px-2 py-0.5 rounded glass-card-static text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">View Results</button>
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
