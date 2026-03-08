import { useState } from 'react';
import { Image, Layout, Code, Palette, PenTool, Zap, Boxes, Monitor, Tablet, Smartphone, FolderTree, File } from 'lucide-react';

const STYLES = [
  { name: 'Photorealistic', icon: Image },
  { name: 'Illustration', icon: PenTool },
  { name: 'Diagram', icon: Boxes },
  { name: 'Logo', icon: Zap },
  { name: 'UI Mockup', icon: Layout },
  { name: 'Abstract', icon: Palette },
];

const Studio = () => {
  const [subTab, setSubTab] = useState<'image' | 'web'>('image');
  const [selectedStyle, setSelectedStyle] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [provider, setProvider] = useState('Local SD');
  const [codeMode, setCodeMode] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div className="space-y-4 h-full">
      {/* Sub-tabs */}
      <div className="flex gap-3 border-b border-border/50 pb-3">
        <button onClick={() => setSubTab('image')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${subTab === 'image' ? 'glass-card text-foreground border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}>🖼️ Image Studio</button>
        <button onClick={() => setSubTab('web')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${subTab === 'web' ? 'glass-card text-foreground border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}>🌐 Web Builder</button>
      </div>

      {subTab === 'image' ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: '260px 1fr' }}>
          {/* Sidebar */}
          <div className="glass-card p-4 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Prompt</label>
              <textarea className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-xs text-foreground resize-none h-20 outline-none focus:border-primary/50 placeholder:text-muted-foreground" placeholder="Describe what to generate..." />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Style</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map(s => (
                  <button key={s.name} onClick={() => setSelectedStyle(s.name)} className={`glass-card p-2 flex flex-col items-center gap-1 text-center transition-all ${selectedStyle === s.name ? 'border-primary/50 neon-glow-purple' : ''}`}>
                    <s.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Aspect Ratio</label>
              <div className="flex gap-2">
                {['16:9', '1:1', '9:16'].map(r => (
                  <button key={r} onClick={() => setAspectRatio(r)} className={`flex-1 py-1.5 rounded text-[11px] font-medium transition-all ${aspectRatio === r ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>{r}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Provider</label>
              <div className="flex gap-2">
                {['Local SD', 'Gemini', 'DALL-E'].map(p => (
                  <button key={p} onClick={() => setProvider(p)} className={`flex-1 py-1.5 rounded text-[10px] font-medium transition-all ${provider === p ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>{p}</button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={generating} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:opacity-90 neon-glow-purple transition-all disabled:opacity-50">
              {generating ? '⏳ Generating...' : '✨ GENERATE'}
            </button>
          </div>

          {/* Canvas */}
          <div className="space-y-4">
            <div className="glass-card flex-1 min-h-[350px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Generated image will appear here</p>
                <p className="text-[11px] mt-1">Select a style and click Generate</p>
              </div>
            </div>
            {/* History thumbnails */}
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-16 h-16 glass-card flex items-center justify-center">
                  <Image className="w-5 h-5 text-muted-foreground/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Web Builder */
        <div className="grid gap-4 h-[calc(100%-60px)]" style={{ gridTemplateColumns: '280px 1fr 180px' }}>
          {/* Left */}
          <div className="glass-card p-4 space-y-4">
            <div className="flex gap-2">
              <button onClick={() => setCodeMode(false)} className={`flex-1 py-1.5 rounded text-[11px] font-medium ${!codeMode ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>Prompt</button>
              <button onClick={() => setCodeMode(true)} className={`flex-1 py-1.5 rounded text-[11px] font-medium ${codeMode ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>Code</button>
            </div>
            <textarea className="w-full bg-terminal border border-border/50 rounded-lg p-3 text-xs text-foreground font-mono resize-none flex-1 min-h-[200px] outline-none" placeholder={codeMode ? '<div class="hero">...</div>' : 'Describe the page you want to build...'} />
            <div className="flex gap-2 flex-wrap">
              {['SaaS Landing', 'Portfolio', 'Blog', 'Dashboard'].map(t => (
                <button key={t} className="text-[10px] px-2 py-1 rounded-full glass-card text-muted-foreground hover:text-foreground">{t}</button>
              ))}
            </div>
          </div>

          {/* Center - preview */}
          <div className="glass-card flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-border/50 flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-neon-red" />
                <span className="w-2 h-2 rounded-full bg-neon-yellow" />
                <span className="w-2 h-2 rounded-full bg-neon-green" />
              </div>
              <div className="flex-1 bg-muted/50 rounded px-2 py-1 text-[11px] font-mono text-muted-foreground">localhost:3000</div>
              <div className="flex gap-1.5">
                <Monitor className="w-4 h-4 text-primary" />
                <Tablet className="w-4 h-4 text-muted-foreground" />
                <Smartphone className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 bg-foreground/95 p-8">
              <div className="space-y-4">
                <div className="h-6 bg-foreground/10 rounded w-1/3" />
                <div className="h-10 bg-foreground/5 rounded w-2/3" />
                <div className="h-4 bg-foreground/5 rounded w-1/2" />
                <div className="flex gap-3 mt-6">
                  <div className="h-8 bg-primary/30 rounded-lg w-24" />
                  <div className="h-8 bg-foreground/10 rounded-lg w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Right - file tree */}
          <div className="glass-card p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Files</div>
            <div className="space-y-1.5 text-xs">
              {[
                { name: 'index.html', icon: File, color: 'text-neon-orange' },
                { name: 'style.css', icon: File, color: 'text-neon-cyan' },
                { name: 'script.js', icon: File, color: 'text-neon-yellow' },
                { name: 'assets/', icon: FolderTree, color: 'text-primary' },
              ].map(f => (
                <div key={f.name} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                  <span>{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Studio;
