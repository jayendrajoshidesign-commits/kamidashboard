import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { ApiManifest } from '@/services/apiService';

interface Props {
  manifest: ApiManifest;
}

const SettingsTab = ({ manifest }: Props) => {
  const [execMode, setExecMode] = useState<'sequential' | 'parallel'>('parallel');
  const [debugMode, setDebugMode] = useState(false);

  const apiKeys = manifest.apiKeys;
  const healthItems = manifest.health;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* System Info */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 section-header" style={{ borderBottom: '1px solid rgba(255,107,0,0.2)', paddingBottom: '8px' }}>🖥️ System Info</h3>
          <div className="space-y-1 text-xs">
            {[
              ['Dashboard Version', manifest.version],
              ['Local URL', 'http://localhost:5000'],
              ['Network URL', 'http://192.168.1.42:5000'],
              ['Memory Backend', 'ChromaDB + AgentDB'],
              ['AI Router', 'LiteLLM + Ollama (local)'],
            ].map(([k, v], i) => (
              <div key={k} className="flex justify-between py-2" style={{
                borderBottom: '1px solid rgba(255,80,0,0.06)',
                backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                padding: '6px 4px',
                borderRadius: '4px',
              }}>
                <span style={{ color: '#666' }}>{k}</span>
                <span className="font-mono mono-value" style={String(v).startsWith('http') ? { color: '#FF8C00', cursor: 'pointer' } : undefined}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 section-header" style={{ borderBottom: '1px solid rgba(255,107,0,0.2)', paddingBottom: '8px' }}>🔑 API Keys</h3>
          <div className="space-y-1">
            {apiKeys.map(a => (
              <div key={a.name} className="flex items-center gap-3 py-2 px-1 text-xs rounded transition-colors"
                style={{
                  borderBottom: '1px solid rgba(255,80,0,0.06)',
                  borderLeft: a.status === 'green' ? '2px solid rgba(34,197,94,0.4)' : a.status === 'red' ? '2px solid rgba(239,68,68,0.3)' : '2px solid transparent',
                }}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.status === 'green' ? 'status-dot-green' : a.status === 'yellow' ? 'status-dot-yellow' : 'status-dot-red'}`} />
                <span className="text-foreground w-20 heading-cinematic text-[11px]">{a.name}</span>
                <span className="font-mono flex-1 truncate text-[10px]" style={{ color: '#FF8C00' }}>{a.key}</span>
                <span className={`text-[10px] ${a.status === 'green' ? 'text-neon-green' : a.status === 'yellow' ? 'text-neon-yellow' : 'text-neon-red'}`}>{a.statusText}</span>
                <button className={`text-[10px] px-2 py-0.5 rounded glass-card-static transition-all ${a.status === 'red' ? 'text-primary hover:neon-glow-purple' : 'text-muted-foreground hover:text-foreground'}`}>
                  {a.status === 'red' ? 'Add' : 'Edit'}
                </button>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-primary-foreground py-2 rounded-lg text-xs font-semibold mission-pulse-btn hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)', boxShadow: '0 0 20px rgba(255,107,0,0.35)' }}>
            ✦ API Setup Wizard
          </button>
        </div>

        {/* Agent Team */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 section-header" style={{ borderBottom: '1px solid rgba(255,107,0,0.2)', paddingBottom: '8px' }}>🤖 Agent Team Config</h3>
          <div className="space-y-4">
            <div>
              <label className="section-header mb-2 block">Execution Mode</label>
              <div className="flex gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,80,0,0.15)' }}>
                <button onClick={() => setExecMode('sequential')}
                  className={`flex-1 py-2.5 text-xs font-medium transition-all ${execMode === 'sequential' ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                  style={execMode === 'sequential' ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)' } : { background: 'rgba(10,10,10,0.5)' }}>
                  Sequential
                </button>
                <button onClick={() => setExecMode('parallel')}
                  className={`flex-1 py-2.5 text-xs font-medium transition-all ${execMode === 'parallel' ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                  style={execMode === 'parallel' ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)' } : { background: 'rgba(10,10,10,0.5)' }}>
                  Parallel
                </button>
              </div>
            </div>
            {[['Max Workers', '8'], ['Task Timeout', '120s'], ['Max Retries', '3']].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs py-2" style={{ borderBottom: '1px solid rgba(255,80,0,0.06)' }}>
                <span style={{ color: '#666' }}>{k}</span>
                <span className="font-mono" style={{ color: '#FF8C00' }}>{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs py-2">
              <span style={{ color: '#666' }}>Debug Mode</span>
              <button onClick={() => setDebugMode(!debugMode)} className={`w-10 h-5 rounded-full transition-colors relative ${debugMode ? '' : 'bg-muted'}`}
                style={debugMode ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)' } : undefined}>
                <div className={`w-4 h-4 rounded-full bg-foreground transition-transform absolute top-0.5 ${debugMode ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Health */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 section-header" style={{ borderBottom: '1px solid rgba(255,107,0,0.2)', paddingBottom: '8px' }}>🏥 Health & Updates</h3>
          <div className="space-y-1">
            {healthItems.map((c, idx) => (
              <div key={c.name} className="flex items-center gap-3 text-xs py-2 health-item-enter" style={{ animationDelay: `${idx * 100}ms`, borderBottom: '1px solid rgba(255,80,0,0.06)' }}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.status === 'green' ? 'status-dot-green' : c.status === 'yellow' ? 'status-dot-yellow' : 'status-dot-red'}`} />
                <span className="text-foreground heading-cinematic text-[11px]">{c.name}</span>
                <span className={`ml-auto text-[10px] ${c.status === 'green' ? 'text-neon-green' : c.status === 'yellow' ? '' : 'text-neon-red'}`}
                  style={c.status === 'yellow' ? { color: '#FF8C00', textShadow: '0 0 8px rgba(255,140,0,0.3)' } : undefined}>
                  {c.status === 'green' ? 'Healthy' : c.status === 'yellow' ? 'Degraded' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 glass-card-static py-2 text-xs font-medium text-foreground flex items-center justify-center gap-1.5 hover:bg-muted/50 transition-colors rounded-lg">
              <RefreshCw className="w-3.5 h-3.5" /> Check Health
            </button>
            <button className="flex-1 bg-neon-green/10 text-neon-green py-2 rounded-lg text-xs font-medium border border-neon-green/30">
              🔄 Update v2.2.0
            </button>
          </div>
        </div>
      </div>

      {/* Session Cost */}
      <div className="glass-card p-5 glow-green-card border-neon-green/20">
        <h3 className="text-sm font-semibold text-foreground mb-3 heading-cinematic">💰 Session Cost Summary</h3>
        <div className="text-5xl font-mono font-bold text-neon-green mb-1" style={{ textShadow: '0 0 30px rgba(34,197,94,0.4), 0 0 60px rgba(34,197,94,0.15)' }}>
          $0.00
        </div>
        <p className="text-xs text-neon-green/80 mb-4">100% local — Ollama running free</p>
        <div className="space-y-1 text-xs">
          {[
            ['Ollama (local)', '$0.00', true],
            ['Anthropic Claude', '$0.00', false],
            ['OpenAI GPT-4', '$0.00', false],
            ['Google Gemini', '$0.00', false],
            ['Stability AI', '$0.00', false],
          ].map(([name, cost, isGreen]) => (
            <div key={name as string} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid rgba(255,80,0,0.06)' }}>
              <span style={{ color: '#666' }}>{name as string}</span>
              <span className={`font-mono ${isGreen ? 'text-neon-green' : ''}`} style={!isGreen ? { color: '#555' } : undefined}>{cost as string}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] mt-3" style={{ color: '#666' }}>Cloud API equivalent: <span className="text-neon-yellow font-semibold">~$0.43</span></p>
      </div>
    </div>
  );
};

export default SettingsTab;
