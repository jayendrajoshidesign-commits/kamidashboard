import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend, Tooltip, ReferenceLine, LineChart, Line } from 'recharts';
import { ANALYTICS_TASKS_PER_AGENT, ANALYTICS_ACTIVITY, TOOL_USAGE, MISSION_HISTORY } from '@/data/dashboardData';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AGENT_EMOJIS: Record<string, string> = {
  'Market Research': '🔍', 'CEO': '👔', 'Sales': '💰', 'Marketing': '📣', 'Design': '🎨',
  'COO': '⚙️', 'Finance': '📊', 'Supervisor': '🎯', 'R&D': '🧪', 'Legal': '⚖️', 'Customer Success': '🤝',
};

const sparkGreen = Array.from({ length: 8 }, () => ({ v: Math.floor(Math.random() * 5) + 18 }));
const sparkCyan = Array.from({ length: 8 }, () => ({ v: Math.floor(Math.random() * 3) + 6 }));
const sparkPurple = Array.from({ length: 8 }, () => ({ v: Math.floor(Math.random() * 40000) + 100000 }));
const sparkFlat = Array.from({ length: 8 }, () => ({ v: 4 + Math.random() * 0.5 }));
const sparkCost = Array.from({ length: 8 }, () => ({ v: Math.random() * 0.1 }));

const MiniWatermark = ({ data, color }: { data: { v: number }[]; color: string }) => (
  <div className="absolute right-2 bottom-2 w-20 h-10 opacity-15 pointer-events-none">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <Area type="monotone" dataKey="v" stroke={color} fill={color} strokeWidth={1} dot={false} fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const AnimatedNumber = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    setDisplay(value);
  }, [value]);
  return <span style={{ animation: 'count-flash 0.3s ease-out' }}>{display}{suffix}</span>;
};

const Analytics = () => (
  <div className="space-y-6">
    {/* Stat cards */}
    <div className="grid grid-cols-5 gap-4">
      {[
        { label: 'Total Tasks', value: '26', icon: '📋', sparkData: sparkGreen, sparkColor: 'hsl(142,71%,45%)' },
        { label: 'Completed', value: '22', icon: '✅', sparkData: sparkCyan, sparkColor: 'hsl(187,86%,43%)' },
        { label: 'Avg Task Time', value: '4.2min', icon: '⏱️', sparkData: sparkFlat, sparkColor: 'hsl(263,70%,58%)' },
        { label: 'Tokens Used', value: '142K', icon: '🔤', sub: '~$0.00 local', sparkData: sparkPurple, sparkColor: 'hsl(263,70%,58%)' },
        { label: 'API Cost Saved', value: '$0.43', icon: '💰', sub: 'saved vs cloud', isGreen: true, sparkData: sparkCost, sparkColor: 'hsl(142,71%,45%)' },
      ].map((s, i) => (
        <TooltipProvider key={i}>
          <UITooltip>
            <TooltipTrigger asChild>
              <div className={`glass-card p-4 relative overflow-hidden ${s.isGreen ? 'glow-green-card border-neon-green/20' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{s.icon}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                </div>
                <div className={`text-2xl font-mono font-bold relative z-10 ${s.isGreen ? 'text-neon-green' : 'text-foreground'}`}>
                  <AnimatedNumber value={s.value} />
                </div>
                {s.sub && <div className={`text-[11px] mt-1 ${s.isGreen ? 'text-neon-green' : 'text-neon-green'}`}>{s.sub}</div>}
                <MiniWatermark data={s.sparkData} color={s.sparkColor} />
              </div>
            </TooltipTrigger>
            {s.isGreen && (
              <TooltipContent className="glass-card-static text-xs">
                <p>Claude API: ~$0.43</p>
                <p>GPT-4: ~$1.42</p>
                <p>Gemini: ~$0.21</p>
              </TooltipContent>
            )}
          </UITooltip>
        </TooltipProvider>
      ))}
    </div>

    {/* Charts grid */}
    <div className="grid grid-cols-2 gap-4">
      {/* Tasks per agent */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Tasks Per Agent</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ANALYTICS_TASKS_PER_AGENT} layout="vertical" margin={{ left: 100, right: 30 }}>
              <XAxis type="number" tick={{ fill: 'hsl(215,16%,47%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="agent" tick={({ x, y, payload }: any) => (
                <text x={x} y={y} dy={4} textAnchor="end" fill="hsl(215,16%,47%)" fontSize={11}>
                  {AGENT_EMOJIS[payload.value] || ''} {payload.value}
                </text>
              )} axisLine={false} tickLine={false} width={100} />
              <Bar dataKey="tasks" radius={[0, 6, 6, 0]} barSize={14} label={{ position: 'right', fill: 'hsl(215,16%,47%)', fontSize: 11 }}>
                {ANALYTICS_TASKS_PER_AGENT.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity over time */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Activity Over Time</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ANALYTICS_ACTIVITY}>
              <defs>
                <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(263,70%,58%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(187,86%,43%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: 'hsl(215,16%,47%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215,16%,47%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Area type="monotone" dataKey="tasks" stroke="hsl(263,70%,58%)" fill="url(#activityGrad)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(263,70%,58%)', stroke: 'hsl(263,70%,58%)' }} />
              <ReferenceLine x={ANALYTICS_ACTIVITY[ANALYTICS_ACTIVITY.length - 1]?.time} stroke="hsl(187,86%,43%)" strokeDasharray="3 3" label={{ value: 'NOW', fill: 'hsl(187,86%,43%)', fontSize: 10, position: 'top' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tool usage */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Tool Usage Distribution</h3>
        <div className="h-[280px] flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={TOOL_USAGE} cx="40%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value"
                label={({ name, value }: any) => `${value}%`} labelLine={false}>
                {TOOL_USAGE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend layout="vertical" verticalAlign="middle" align="right" formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>} />
              <Tooltip contentStyle={{ background: 'rgba(12,12,20,0.9)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', fontSize: '12px', backdropFilter: 'blur(16px)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mission history */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Mission History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-border/50">
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
              {MISSION_HISTORY.map((m, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 font-mono text-muted-foreground">{m.date}</td>
                  <td className="py-2.5 text-foreground">{m.goal}</td>
                  <td className="py-2.5 text-center text-foreground">{m.agents}</td>
                  <td className="py-2.5 text-center text-foreground">{m.tasks}</td>
                  <td className="py-2.5 text-center font-mono text-muted-foreground">{m.duration}</td>
                  <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${m.status === 'completed' ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-yellow/10 text-neon-yellow'}`}
                      style={{ boxShadow: m.status === 'completed' ? '0 0 8px hsla(142,71%,45%,0.2)' : '0 0 8px hsla(48,96%,53%,0.2)' }}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <button className="text-[10px] px-2 py-0.5 rounded glass-card text-primary hover:text-foreground transition-colors">View Results</button>
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

export default Analytics;
