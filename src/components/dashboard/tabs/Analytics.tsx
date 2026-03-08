import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { ANALYTICS_TASKS_PER_AGENT, ANALYTICS_ACTIVITY, TOOL_USAGE, MISSION_HISTORY } from '@/data/dashboardData';

const Analytics = () => (
  <div className="space-y-6">
    {/* Stat cards */}
    <div className="grid grid-cols-4 gap-4">
      {[
        { label: 'Total Tasks', value: '26', icon: '📋' },
        { label: 'Completed', value: '22', icon: '✅' },
        { label: 'Avg Task Time', value: '4.2min', icon: '⏱️' },
        { label: 'Tokens Used', value: '142K', icon: '🔤', sub: '~$0.00 local' },
      ].map((s, i) => (
        <div key={i} className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <span>{s.icon}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">{s.value}</div>
          {s.sub && <div className="text-[11px] text-neon-green mt-1">{s.sub}</div>}
        </div>
      ))}
    </div>

    {/* Charts grid */}
    <div className="grid grid-cols-2 gap-4">
      {/* Tasks per agent */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Tasks Per Agent</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ANALYTICS_TASKS_PER_AGENT} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" tick={{ fill: 'hsl(215,16%,47%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="agent" tick={{ fill: 'hsl(215,16%,47%)', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Bar dataKey="tasks" radius={[0, 4, 4, 0]}>
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
        <div className="h-[250px]">
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
              <Area type="monotone" dataKey="tasks" stroke="hsl(263,70%,58%)" fill="url(#activityGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tool usage */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Tool Usage Distribution</h3>
        <div className="h-[250px] flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={TOOL_USAGE} cx="40%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {TOOL_USAGE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend layout="vertical" verticalAlign="middle" align="right" formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>} />
              <Tooltip contentStyle={{ background: 'hsl(240,18%,8%)', border: '1px solid hsl(240,15%,20%)', borderRadius: '8px', fontSize: '12px' }} />
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
              </tr>
            </thead>
            <tbody>
              {MISSION_HISTORY.map((m, i) => (
                <tr key={i} className="border-b border-border/30">
                  <td className="py-2.5 font-mono text-muted-foreground">{m.date}</td>
                  <td className="py-2.5 text-foreground">{m.goal}</td>
                  <td className="py-2.5 text-center text-foreground">{m.agents}</td>
                  <td className="py-2.5 text-center text-foreground">{m.tasks}</td>
                  <td className="py-2.5 text-center font-mono text-muted-foreground">{m.duration}</td>
                  <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${m.status === 'completed' ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-yellow/10 text-neon-yellow'}`}>
                      {m.status}
                    </span>
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
