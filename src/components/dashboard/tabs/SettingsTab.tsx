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
          <h3 className="text-sm font-semibold mb-4 section-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>🖥️ System Info</h3>
          <div className="space-y-1 text-xs">
            {[
              ['Dashboard Version', manifest.version],
              ['Local URL', 'http://localhost:5000'],
              ['Network URL', 'http://192.168.1.42:5000'],
              ['Memory Backend', 'ChromaDB + AgentDB'],
              ['AI Router', 'LiteLLM + Ollama (local)'],
            ].map(([k, v], i) => (
              <div key={k} className="flex justify-between py-2" style={{
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                padding: '6px 4px',
                borderRadius: '4px',
              }}>
                <span style={{ color: '#555' }}>{k}</span>
                <span className="font-mono mono-value" style={String(v).startsWith('http') ? { color: '#FF8C00', cursor: 'pointer' } : undefined}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 section-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>🔑 API Keys</h3>
          <div className="space-y-1">
            {apiKeys.map(a => (
              <div key={a.name} className="flex items-center gap-3 py-2 px-1 text-xs rounded transition-colors"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  borderLeft: a.status === 'green' ? '2px solid rgba(34,197,94,0.3)' : a.status === 'red' ? '2px solid rgba(239,68,68,0.2)' : '2px solid transparent',
                }}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0`}
                  style={{ backgroundColor: a.status === 'green' ? '#4ade80' : a.status === 'yellow' ? '#facc15' : '#ef4444' }} />
                <span className="text-foreground w-20 text-[11px]">{a.name}</span>
                <span className="font-mono flex-1 truncate text-[10px]" style={{ color: '#FF8C00' }}>{a.key}</span>
                <span className="text-[10px]" style={{ color: a.status === 'green' ? '#4ade80' : a.status === 'yellow' ? '#facc15' : '#ef4444' }}>{a.statusText}</span>
                <button className="text-[10px] px-2 py-0.5 rounded transition-all" style={{ color: a.status === 'red' ? '#FF8C00' : '#666', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {a.status === 'red' ? 'Add' : 'Edit'}
                </button>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-primary-foreground py-2 rounded-lg text-xs font-semibold mission-pulse-btn transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>
            ✦ API Setup Wizard
          </button>
        </div>

        {/* Agent Team */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 section-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>🤖 Agent Team Config</h3>
          <div className="space-y-4">
            <div>
              <label className="section-header mb-2 block">Execution Mode</label>
              <div className="flex gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setExecMode('sequential')}
                  className="flex-1 py-2.5 text-xs font-medium transition-all"
                  style={execMode === 'sequential' ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' } : { background: 'rgba(8,8,12,0.5)', color: '#666' }}>
                  Sequential
                </button>
                <button onClick={() => setExecMode('parallel')}
                  className="flex-1 py-2.5 text-xs font-medium transition-all"
                  style={execMode === 'parallel' ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' } : { background: 'rgba(8,8,12,0.5)', color: '#666' }}>
                  Parallel
                </button>
              </div>
            </div>
            {[['Max Workers', '8'], ['Task Timeout', '120s'], ['Max Retries', '3']].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ color: '#555' }}>{k}</span>
                <span className="font-mono" style={{ color: '#FF8C00' }}>{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs py-2">
              <span style={{ color: '#555' }}>Debug Mode</span>
              <button onClick={() => setDebugMode(!debugMode)} className="w-10 h-5 rounded-full transition-colors relative"
                style={debugMode ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)' } : { background: 'rgba(255,255,255,0.06)' }}>
                <div className={`w-4 h-4 rounded-full bg-foreground transition-transform absolute top-0.5 ${debugMode ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Health */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 section-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>🏥 Health & Updates</h3>
          <div className="space-y-1">
            {healthItems.map((c, idx) => (
              <div key={c.name} className="flex items-center gap-3 text-xs py-2 health-item-enter" style={{ animationDelay: `${idx * 100}ms`, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: c.status === 'green' ? '#4ade80' : c.status === 'yellow' ? '#facc15' : '#ef4444' }} />
                <span className="text-foreground text-[11px]">{c.name}</span>
                <span className="ml-auto text-[10px]"
                  style={{ color: c.status === 'green' ? '#4ade80' : c.status === 'yellow' ? '#FF8C00' : '#ef4444' }}>
                  {c.status === 'green' ? 'Healthy' : c.status === 'yellow' ? 'Degraded' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 text-xs font-medium text-foreground flex items-center justify-center gap-1.5 transition-colors rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <RefreshCw className="w-3.5 h-3.5" /> Check Health
            </button>
            <button className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(34,197,94,0.06)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.15)' }}>
              🔄 Update v2.2.0
            </button>
          </div>
        </div>
      </div>

      {/* Session Cost */}
      <div className="glass-card p-5 glow-green-card">
        <h3 className="text-sm font-semibold text-foreground mb-3">💰 Session Cost Summary</h3>
        <div className="text-5xl font-mono font-bold mb-1" style={{ color: '#4ade80' }}>
          $0.00
        </div>
        <p className="text-xs mb-4" style={{ color: 'rgba(74,222,128,0.7)' }}>100% local — Ollama running free</p>
        <div className="space-y-1 text-xs">
          {[
            ['Ollama (local)', '$0.00', true],
            ['Anthropic Claude', '$0.00', false],
            ['OpenAI GPT-4', '$0.00', false],
            ['Google Gemini', '$0.00', false],
            ['Stability AI', '$0.00', false],
          ].map(([name, cost, isGreen]) => (
            <div key={name as string} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: '#555' }}>{name as string}</span>
              <span className="font-mono" style={{ color: isGreen ? '#4ade80' : '#444' }}>{cost as string}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] mt-3" style={{ color: '#555' }}>Cloud API equivalent: <span className="font-semibold" style={{ color: '#facc15' }}>~$0.43</span></p>
      </div>
    </div>
  );
};

export default SettingsTab;
