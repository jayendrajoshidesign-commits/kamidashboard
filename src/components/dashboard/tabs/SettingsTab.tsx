import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const SettingsTab = () => {
  const [execMode, setExecMode] = useState<'sequential' | 'parallel'>('parallel');
  const [debugMode, setDebugMode] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* System Info */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">🖥️ System Info</h3>
        <div className="space-y-2.5 text-xs">
          {[
            ['Dashboard Version', 'v2.1.0-beta'],
            ['Local URL', 'http://localhost:5000'],
            ['Network URL', 'http://192.168.1.42:5000'],
            ['Memory Backend', 'ChromaDB + AgentDB'],
            ['AI Router', 'LiteLLM + Ollama (local)'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-mono text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">🔑 API Keys</h3>
        <div className="space-y-2">
          {[
            { name: 'Ollama', status: 'green', statusText: 'Running', key: 'localhost:11434' },
            { name: 'Anthropic', status: 'yellow', statusText: 'Key in .env', key: 'sk-ant-••••••••' },
            { name: 'OpenAI', status: 'red', statusText: 'Not connected', key: '—' },
            { name: 'Google AI', status: 'green', statusText: 'Connected', key: 'AIza••••••••' },
            { name: 'Stability AI', status: 'red', statusText: 'Not connected', key: '—' },
            { name: 'Stripe', status: 'red', statusText: 'Not connected', key: '—' },
          ].map(api => (
            <div key={api.name} className="flex items-center gap-3 py-1.5 border-b border-border/30 text-xs">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${api.status === 'green' ? 'status-dot-green' : api.status === 'yellow' ? 'status-dot-yellow' : 'status-dot-red'}`} />
              <span className="text-foreground w-24">{api.name}</span>
              <span className="font-mono text-muted-foreground flex-1 truncate">{api.key}</span>
              <span className={`text-[10px] ${api.status === 'green' ? 'text-neon-green' : api.status === 'yellow' ? 'text-neon-yellow' : 'text-neon-red'}`}>{api.statusText}</span>
              <button className="text-[10px] px-2 py-0.5 rounded glass-card text-muted-foreground hover:text-foreground">
                {api.status === 'red' ? 'Add Key' : 'Edit'}
              </button>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-lg text-xs font-semibold neon-glow-purple hover:opacity-90 transition-opacity">
          🧙 API Setup Wizard
        </button>
      </div>

      {/* Agent Team */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">🤖 Agent Team Config</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Execution Mode</label>
            <div className="flex gap-2">
              <button onClick={() => setExecMode('sequential')} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${execMode === 'sequential' ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>Sequential</button>
              <button onClick={() => setExecMode('parallel')} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${execMode === 'parallel' ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>Parallel</button>
            </div>
          </div>
          <div className="flex justify-between text-xs border-b border-border/30 py-2">
            <span className="text-muted-foreground">Max Workers</span>
            <span className="text-foreground font-mono">8</span>
          </div>
          <div className="flex justify-between text-xs border-b border-border/30 py-2">
            <span className="text-muted-foreground">Task Timeout</span>
            <span className="text-foreground font-mono">120s</span>
          </div>
          <div className="flex justify-between text-xs border-b border-border/30 py-2">
            <span className="text-muted-foreground">Max Retries</span>
            <span className="text-foreground font-mono">3</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2">
            <span className="text-muted-foreground">Debug Mode</span>
            <button onClick={() => setDebugMode(!debugMode)} className={`w-10 h-5 rounded-full transition-colors ${debugMode ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`w-4 h-4 rounded-full bg-foreground transition-transform ${debugMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Health */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">🏥 Health & Updates</h3>
        <div className="space-y-2">
          {[
            { name: 'Flask Server', status: 'green' },
            { name: 'ChromaDB', status: 'green' },
            { name: 'AgentDB (SQLite)', status: 'green' },
            { name: 'LiteLLM Router', status: 'green' },
            { name: 'Ollama (Local LLM)', status: 'green' },
            { name: 'Browser Automation', status: 'yellow' },
            { name: 'Image Generation', status: 'red' },
            { name: 'WebSocket Server', status: 'green' },
          ].map(c => (
            <div key={c.name} className="flex items-center gap-3 text-xs py-1.5 border-b border-border/30">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.status === 'green' ? 'status-dot-green' : c.status === 'yellow' ? 'status-dot-yellow' : 'status-dot-red'}`} />
              <span className="text-foreground">{c.name}</span>
              <span className={`ml-auto text-[10px] ${c.status === 'green' ? 'text-neon-green' : c.status === 'yellow' ? 'text-neon-yellow' : 'text-neon-red'}`}>
                {c.status === 'green' ? 'Healthy' : c.status === 'yellow' ? 'Degraded' : 'Offline'}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex-1 glass-card py-2 text-xs font-medium text-foreground flex items-center justify-center gap-1.5 hover:bg-muted/50 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Check Health
          </button>
          <button className="flex-1 bg-neon-green/10 text-neon-green py-2 rounded-lg text-xs font-medium border border-neon-green/30">
            🔄 Install Update v2.2.0
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
