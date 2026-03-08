import { useState } from 'react';
import { Image, Layout, Code, Palette, PenTool, Zap, Boxes, Monitor, Tablet, Smartphone, FolderTree, File, Download, RefreshCw, Rocket, Check } from 'lucide-react';

const STYLES = [
  { name: 'Photorealistic', icon: Image, gradient: 'from-orange-900/40 to-amber-800/20' },
  { name: 'Illustration', icon: PenTool, gradient: 'from-orange-900/40 to-red-800/20' },
  { name: 'Diagram', icon: Boxes, gradient: 'from-amber-900/40 to-orange-800/20' },
  { name: 'Logo', icon: Zap, gradient: 'from-amber-900/40 to-orange-800/20' },
  { name: 'UI Mockup', icon: Layout, gradient: 'from-orange-900/40 to-gray-800/20' },
  { name: 'Abstract', icon: Palette, gradient: 'from-red-900/30 via-orange-900/30 to-amber-900/30' },
];

const HISTORY_GRADIENTS = [
  'from-orange-600/40 to-amber-600/20',
  'from-red-600/40 to-orange-600/20',
  'from-amber-600/40 to-yellow-600/20',
  'from-orange-600/40 to-red-600/20',
];

const SAMPLE_HTML = `<div class="hero">
  <nav class="nav-bar">
    <span class="logo">InvoiceFlow</span>
    <a href="#features">Features</a>
    <a href="#pricing">Pricing</a>
    <button class="cta">Get Started</button>
  </nav>
  <section class="hero-content">
    <h1>Invoice Faster.</h1>
    <h2>Get Paid Sooner.</h2>
    <p>Smart invoicing for modern
       freelancers.</p>
    <button class="primary-btn">
      Start Free Trial
    </button>
  </section>
</div>`;

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
                  <button key={s.name} onClick={() => setSelectedStyle(s.name)} className={`glass-card p-2 flex flex-col items-center gap-1 text-center transition-all relative overflow-hidden bg-gradient-to-br ${s.gradient} ${selectedStyle === s.name ? 'border-primary/50 neon-glow-purple' : ''}`}>
                    {selectedStyle === s.name && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
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

            <button onClick={handleGenerate} disabled={generating} className="w-full text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:opacity-90 pulse-glow-btn transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FF4500)', ...(generating ? {} : { animation: 'shimmer-move 3s ease infinite' }) }}>
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
            <div className="flex gap-2">
              <button className="glass-card px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download</button>
              <button className="glass-card px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"><Rocket className="w-3.5 h-3.5" /> Use in Mission</button>
              <button className="glass-card px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"><RefreshCw className="w-3.5 h-3.5" /> Regenerate</button>
              <button className="glass-card px-3 py-1.5 text-[11px] text-primary hover:text-foreground flex items-center gap-1.5 transition-colors"><Palette className="w-3.5 h-3.5" /> Set as Brand Asset</button>
            </div>
            <div className="flex gap-3">
              {HISTORY_GRADIENTS.map((g, i) => (
                <div key={i} className={`w-16 h-16 glass-card overflow-hidden bg-gradient-to-br ${g} flex items-center justify-center`}>
                  <Image className="w-5 h-5 text-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 h-[calc(100%-60px)]" style={{ gridTemplateColumns: '280px 1fr 180px' }}>
          <div className="glass-card p-4 space-y-4 flex flex-col">
            <div className="flex gap-2">
              <button onClick={() => setCodeMode(false)} className={`flex-1 py-1.5 rounded text-[11px] font-medium ${!codeMode ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>Prompt</button>
              <button onClick={() => setCodeMode(true)} className={`flex-1 py-1.5 rounded text-[11px] font-medium ${codeMode ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground'}`}>Code</button>
            </div>
            {codeMode ? (
              <div className="bg-terminal border border-border/50 rounded-lg p-3 text-[11px] font-mono flex-1 overflow-auto">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {SAMPLE_HTML.split('\n').map((line, i) => (
                    <div key={i}>
                      {line.split(/(<[^>]+>)/g).map((part, j) => {
                        if (part.startsWith('<')) return <span key={j} className="text-neon-orange">{part}</span>;
                        if (part.startsWith('"')) return <span key={j} className="text-neon-green">{part}</span>;
                        return <span key={j} className="text-foreground/70">{part}</span>;
                      })}
                    </div>
                  ))}
                </pre>
              </div>
            ) : (
              <textarea className="w-full bg-terminal border border-border/50 rounded-lg p-3 text-xs text-foreground font-mono resize-none flex-1 min-h-[200px] outline-none" placeholder="Describe the page you want to build..." />
            )}
            <div className="flex gap-2 flex-wrap">
              {['SaaS Landing', 'Portfolio', 'Blog', 'Dashboard'].map(t => (
                <button key={t} className="text-[10px] px-2 py-1 rounded-full glass-card text-muted-foreground hover:text-foreground">{t}</button>
              ))}
            </div>
          </div>

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
            <div className="flex-1 bg-gray-950 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
                <span className="text-white font-bold text-sm">InvoiceFlow</span>
                <div className="flex gap-4 text-gray-400 text-[11px]">
                  <span>Features</span><span>Pricing</span><span>About</span>
                  <span className="text-primary">Login</span>
                </div>
              </div>
              <div className="px-8 py-8 text-center">
                <h2 className="text-white text-xl font-bold">Invoice Faster.</h2>
                <h2 className="text-white text-xl font-bold mb-2">Get Paid Sooner.</h2>
                <p className="text-gray-400 text-xs mb-4 max-w-[280px] mx-auto">Smart invoicing for modern freelancers. Create, send, and track invoices in seconds.</p>
                <button className="text-white text-xs px-5 py-2 rounded-lg font-semibold neon-glow-purple"
                  style={{ background: 'linear-gradient(135deg, #FF6B00, #FF4500)' }}>Start Free Trial</button>
              </div>
              <div className="grid grid-cols-3 gap-3 px-6 pb-4">
                {[
                  { icon: '⚡', title: 'Lightning Fast', desc: 'Create invoices in under 60 seconds' },
                  { icon: '🔒', title: 'Secure Payments', desc: 'Stripe & PayPal integration built-in' },
                  { icon: '📊', title: 'Smart Analytics', desc: 'Track revenue and client metrics' },
                ].map(f => (
                  <div key={f.title} className="border border-gray-800 rounded-lg p-3 text-center">
                    <span className="text-lg">{f.icon}</span>
                    <h4 className="text-white text-[11px] font-semibold mt-1">{f.title}</h4>
                    <p className="text-gray-500 text-[9px] mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-4 flex flex-col gap-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Files</div>
            <div className="space-y-1.5 text-xs">
              {[
                { name: 'index.html', icon: File, color: 'text-neon-orange', active: true },
                { name: 'style.css', icon: File, color: 'text-neon-cyan', active: false },
                { name: 'script.js', icon: File, color: 'text-neon-yellow', active: false },
                { name: 'assets/', icon: FolderTree, color: 'text-primary', active: false },
              ].map(f => (
                <div key={f.name} className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${f.active ? 'bg-primary/10 text-foreground' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}`}>
                  <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                  <span>{f.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <button className="w-full text-primary-foreground py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 neon-glow-purple hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #FF6B00, #FF4500)' }}>
                <Rocket className="w-3.5 h-3.5" /> Deploy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Studio;
