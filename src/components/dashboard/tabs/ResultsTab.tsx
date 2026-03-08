import { useEffect, useState, useCallback } from 'react';
import { api } from '@/services/apiService';
import type { ApiAgent, ApiFile } from '@/services/apiService';
import { Download, ExternalLink, Clock, Users, FileText } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

interface MissionData {
  current: any;
  history: any[];
  summary?: string;
  goal?: string;
  phase?: string;
}

interface Props {
  isConnected: boolean;
  files: ApiFile[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  completed: { bg: 'rgba(74,222,128,0.08)', text: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  running: { bg: 'rgba(255,107,0,0.08)', text: '#FF8C00', border: 'rgba(255,107,0,0.25)' },
  idle: { bg: 'rgba(255,255,255,0.04)', text: '#666', border: 'rgba(255,255,255,0.1)' },
  partial: { bg: 'rgba(250,204,21,0.08)', text: '#facc15', border: 'rgba(250,204,21,0.25)' },
  stopped: { bg: 'rgba(239,68,68,0.08)', text: '#ef4444', border: 'rgba(239,68,68,0.25)' },
};

const ResultsTab = ({ isConnected, files }: Props) => {
  const [mission, setMission] = useState<MissionData | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [summary, setSummary] = useState('');
  const [goal, setGoal] = useState('');
  const [phase, setPhase] = useState('');
  const { isMobile } = useResponsive();

  const fetchData = useCallback(async () => {
    try {
      const mData = await api.getMissions();
      const raw = mData as any;
      setMission(raw);
      setGoal(raw?.goal || raw?.current?.goal || '');
      setPhase(raw?.phase || raw?.current?.status || '');
      setSummary(raw?.summary || '');

      const aData = await api.getAgents();
      const rawAgents = Array.isArray(aData) ? aData : (aData as any)?.agents || [];
      setAgents(rawAgents);
    } catch {
      // keep existing state
    }
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isConnected, fetchData]);

  // No mission state
  if (!isConnected || (!goal && !mission?.current)) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <div className="text-4xl">📋</div>
        <h2 className="text-lg font-semibold text-foreground">No mission results yet</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Run a mission in Mission Control to see results here
        </p>
      </div>
    );
  }

  const displayGoal = goal || mission?.current?.goal || 'Mission';
  const displayStatus = phase || mission?.current?.status || 'idle';
  const statusStyle = STATUS_COLORS[displayStatus] || STATUS_COLORS.idle;
  const current = mission?.current;
  const workingAgents = agents.filter((a: any) => a.last_task && a.last_task.trim() !== '');
  const generatedFiles = files.filter(f => f.category === 'generated');

  const handleDownload = () => {
    const text = [
      `MISSION REPORT`,
      `==============`,
      `Goal: ${displayGoal}`,
      `Status: ${displayStatus}`,
      current?.duration ? `Duration: ${current.duration}` : '',
      current?.date ? `Date: ${current.date}` : '',
      '',
      `AGENT REPORTS`,
      `-------------`,
      ...workingAgents.map((a: any) =>
        `${a.icon || '🤖'} ${a.name}: ${a.last_task || 'N/A'} (Tool: ${a.last_tool || 'N/A'}${a.last_url ? `, Source: ${a.last_url}` : ''})`
      ),
      '',
      `SUMMARY`,
      `-------`,
      summary || 'No summary available.',
    ].filter(Boolean).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mission-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* MISSION HEADER */}
      <div className="glass-card p-5">
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-start justify-between'}`}>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground leading-tight mb-2">{displayGoal}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full"
                style={{ background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}` }}>
                {displayStatus}
              </span>
              {current?.date && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                  <Clock className="w-3 h-3" /> {current.date}
                </span>
              )}
              {current?.duration && (
                <span className="text-[11px] text-muted-foreground font-mono">
                  Duration: {current.duration}
                </span>
              )}
            </div>
          </div>
          {current && (
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-mono flex-shrink-0">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {current.agents} agents</span>
              <span>{current.tasks} tasks</span>
            </div>
          )}
        </div>
      </div>

      {/* AGENT REPORTS */}
      {workingAgents.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: '#FF6B00' }} />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Agent Reports</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,107,0,0.06)', color: '#FF8C00' }}>
              {workingAgents.length}
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,107,0,0.1)' }} />
          </div>
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {workingAgents.map((agent: any) => {
              const agentStatus = agent.status === 'done' ? 'completed' : (agent.status || 'idle');
              const aStyle = STATUS_COLORS[agentStatus] || STATUS_COLORS.idle;
              return (
                <div key={agent.id || agent.name} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-base">{agent.icon || '🤖'}</span>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: agent.color || '#666' }} />
                    <span className="text-sm font-semibold text-foreground">{agent.name}</span>
                    <span className="ml-auto text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: aStyle.bg, color: aStyle.text, border: `1px solid ${aStyle.border}` }}>
                      {agentStatus}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground font-mono w-12 flex-shrink-0">Task:</span>
                      <span className="text-foreground">{agent.last_task || agent.current_task || '—'}</span>
                    </div>
                    {agent.last_tool && agent.last_tool !== 'none' && (
                      <div className="flex gap-2">
                        <span className="text-muted-foreground font-mono w-12 flex-shrink-0">Tool:</span>
                        <span className="font-mono" style={{ color: '#FF8C00' }}>{agent.last_tool}</span>
                      </div>
                    )}
                    {agent.last_url && (
                      <div className="flex gap-2">
                        <span className="text-muted-foreground font-mono w-12 flex-shrink-0">Source:</span>
                        <a href={agent.last_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 truncate hover:underline" style={{ color: '#22d3ee' }}>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{agent.last_url}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MISSION SUMMARY */}
      {summary && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: '#FF6B00' }} />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mission Summary</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,107,0,0.1)' }} />
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-5 rounded-full" style={{ background: '#FF6B00' }} />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Files Generated</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,107,0,0.06)', color: '#FF8C00' }}>
            {generatedFiles.length}
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,107,0,0.1)' }} />
        </div>
        {generatedFiles.length > 0 ? (
          <div className="glass-card p-4">
            <div className="flex flex-wrap gap-2">
              {generatedFiles.map((f, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#FF8C00' }}>
                  <FileText className="w-3 h-3" />
                  {f.name}
                  <span className="text-muted-foreground">({f.size})</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-4 text-center text-sm text-muted-foreground">
            No files generated yet
          </div>
        )}

        <button onClick={handleDownload}
          className="mt-4 w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #CC4400 100%)', color: 'white' }}>
          <Download className="w-4 h-4" /> Download Full Report
        </button>
      </div>
    </div>
  );
};

export default ResultsTab;
