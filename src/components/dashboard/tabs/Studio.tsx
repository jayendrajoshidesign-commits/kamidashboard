import { useState } from 'react';
import { Image, Layout, Code, Palette, PenTool, Zap, Boxes, Monitor, Tablet, Smartphone, FolderTree, File, Download, RefreshCw, Rocket, Check, Camera } from 'lucide-react';

const STYLES = [
  { name: 'Photorealistic', icon: Camera, gradient: 'from-blue-900/20 to-blue-800/10' },
  { name: 'Illustration', icon: PenTool, gradient: 'from-purple-900/20 to-purple-800/10' },
  { name: 'Diagram', icon: Boxes, gradient: 'from-teal-900/20 to-teal-800/10' },
  { name: 'Logo', icon: Zap, gradient: 'from-amber-900/20 to-amber-800/10' },
  { name: 'UI Mockup', icon: Layout, gradient: 'from-indigo-900/20 to-indigo-800/10' },
  { name: 'Abstract', icon: Palette, gradient: 'from-pink-900/20 to-orange-800/10' },
];

const EXAMPLE_PROMPTS = [
  'Product mockup on dark background',
  'Abstract geometric logo design',
  'UI dashboard wireframe',
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
      <div className="flex gap-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => setSubTab('image')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${subTab === 'image' ? 'glass-card text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>🖼️ Image Studio</button>
        <button onClick={() => setSubTab('web')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${subTab === 'web' ? 'glass-card text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>🌐 Web Builder</button>
      </div>

      {subTab === 'image' ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: '260px 1fr' }}>
          <div className="glass-card p-4 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Prompt</label>
              <textarea className="w-full rounded-lg p-2.5 text-xs text-foreground resize-none h-20 outline-none placeholder:text-muted-foreground"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                placeholder="Describe what to generate..." />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Style</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map(s => (
                  <button key={s.name} onClick={() => setSelectedStyle(s.name)}
                    className={`glass-card p-2 flex flex-col items-center gap-1 text-center transition-all relative overflow-hidden bg-gradient-to-br ${s.gradient}`}
                    style={selectedStyle === s.name ? { borderColor: 'rgba(255,107,0,0.3)' } : undefined}>
                    {selectedStyle === s.name && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>
                        <Check className="w-2.5 h-2.5 text-white" />
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
                  <button key={r} onClick={() => setAspectRatio(r)}
                    className="flex-1 py-1.5 rounded text-[11px] font-medium transition-all"
                    style={aspectRatio === r
                      ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.03)', color: '#666', border: '1px solid rgba(255,255,255,0.05)' }
                    }>{r}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Provider</label>
              <div className="flex gap-2">
                {['Local SD', 'Gemini', 'DALL-E'].map(p => (
                  <button key={p} onClick={() => setProvider(p)}
                    className="flex-1 py-1.5 rounded text-[10px] font-medium transition-all"
                    style={provider === p
                      ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.03)', color: '#666', border: '1px solid rgba(255,255,255,0.05)' }
                    }>{p}</button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={generating}
              className="w-full text-primary-foreground py-2.5 rounded-lg text-sm font-bold mission-pulse-btn transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>
              {generating ? '⏳ Generating...' : '✨ GENERATE'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="glass-card flex-1 min-h-[350px] flex items-center justify-center dot-grid">
              <div className="text-center text-muted-foreground">
                <Camera className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Your generated image will appear here</p>
                <p className="text-[11px] mt-1 mb-4">Select a style and click Generate</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {EXAMPLE_PROMPTS.map((p, i) => (
                    <button key={i} className="text-[10px] px-3 py-1.5 rounded-full transition-all" style={{ background: 'rgba(255,107,0,0.06)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.15)' }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="glass-card px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download</button>
              <button className="glass-card px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"><Rocket className="w-3.5 h-3.5" /> Use in Mission</button>
              <button className="glass-card px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"><RefreshCw className="w-3.5 h-3.5" /> Regenerate</button>
              <button className="glass-card px-3 py-1.5 text-[11px] hover:text-foreground flex items-center gap-1.5 transition-colors" style={{ color: '#FF8C00' }}><Palette className="w-3.5 h-3.5" /> Brand Asset</button>
            </div>
            <div className="flex gap-3">
              {[0,1,2,3].map(i => (
                <div key={i} className="w-16 h-16 glass-card overflow-hidden flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, rgba(${100+i*30},${50+i*20},0,0.15), rgba(${80+i*20},${40+i*15},0,0.05))` }}>
                  <Image className="w-5 h-5 opacity-20 text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 h-[calc(100%-60px)]" style={{ gridTemplateColumns: '280px 1fr 180px' }}>
          <div className="glass-card p-4 space-y-4 flex flex-col">
            <div className="flex gap-2">
              <button onClick={() => setCodeMode(false)} className="flex-1 py-1.5 rounded text-[11px] font-medium transition-all"
                style={!codeMode ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' } : { background: 'rgba(255,255,255,0.03)', color: '#666' }}>Prompt</button>
              <button onClick={() => setCodeMode(true)} className="flex-1 py-1.5 rounded text-[11px] font-medium transition-all"
                style={codeMode ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' } : { background: 'rgba(255,255,255,0.03)', color: '#666' }}>Code</button>
            </div>
            {codeMode ? (
              <div className="rounded-lg p-3 text-[11px] font-mono flex-1 overflow-auto" style={{ background: '#030306', border: '1px solid rgba(255,255,255,0.05)' }}>
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {SAMPLE_HTML.split('\n').map((line, i) => (
                    <div key={i}>
                      {line.split(/(<[^>]+>)/g).map((part, j) => {
                        if (part.startsWith('<')) return <span key={j} style={{ color: '#FF6B00' }}>{part}</span>;
                        if (part.startsWith('"')) return <span key={j} style={{ color: '#4ade80' }}>{part}</span>;
                        return <span key={j} className="text-foreground/60">{part}</span>;
                      })}
                    </div>
                  ))}
                </pre>
              </div>
            ) : (
              <textarea className="w-full rounded-lg p-3 text-xs text-foreground font-mono resize-none flex-1 min-h-[200px] outline-none placeholder:text-muted-foreground"
                style={{ background: '#030306', border: '1px solid rgba(255,255,255,0.05)' }}
                placeholder="Describe the page you want to build..." />
            )}
            <div className="flex gap-2 flex-wrap">
              {['SaaS Landing', 'Portfolio', 'Blog', 'Dashboard'].map(t => (
                <button key={t} className="text-[10px] px-2 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>{t}</button>
              ))}
            </div>
          </div>

          <div className="glass-card flex flex-col overflow-hidden">
            <div className="px-3 py-2 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#eab308' }} />
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              </div>
              <div className="flex-1 rounded px-2 py-1 text-[11px] font-mono text-muted-foreground" style={{ background: 'rgba(255,255,255,0.03)' }}>localhost:3000</div>
              <div className="flex gap-1.5">
                <Monitor className="w-4 h-4" style={{ color: '#FF8C00' }} />
                <Tablet className="w-4 h-4 text-muted-foreground" />
                <Smartphone className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 bg-gray-950 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-white font-bold text-sm">InvoiceFlow</span>
                <div className="flex gap-4 text-gray-400 text-[11px]">
                  <span>Features</span><span>Pricing</span><span>About</span>
                  <span style={{ color: '#FF8C00' }}>Login</span>
                </div>
              </div>
              <div className="px-8 py-8 text-center">
                <h2 className="text-white text-xl font-bold">Invoice Faster.</h2>
                <h2 className="text-white text-xl font-bold mb-2">Get Paid Sooner.</h2>
                <p className="text-gray-400 text-xs mb-4 max-w-[280px] mx-auto">Smart invoicing for modern freelancers.</p>
                <button className="text-white text-xs px-5 py-2 rounded-lg font-semibold"
                  style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>Start Free Trial</button>
              </div>
              <div className="grid grid-cols-3 gap-3 px-6 pb-4">
                {[
                  { icon: '⚡', title: 'Lightning Fast', desc: 'Create invoices in under 60 seconds' },
                  { icon: '🔒', title: 'Secure Payments', desc: 'Stripe & PayPal integration' },
                  { icon: '📊', title: 'Smart Analytics', desc: 'Track revenue and metrics' },
                ].map(f => (
                  <div key={f.title} className="rounded-lg p-3 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
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
                { name: 'index.html', icon: File, color: '#FF6B00', active: true },
                { name: 'style.css', icon: File, color: '#3b82f6', active: false },
                { name: 'script.js', icon: File, color: '#facc15', active: false },
                { name: 'assets/', icon: FolderTree, color: '#FF8C00', active: false },
              ].map(f => (
                <div key={f.name} className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${f.active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  style={f.active ? { background: 'rgba(255,107,0,0.06)' } : undefined}>
                  <f.icon className="w-3.5 h-3.5" style={{ color: f.color }} />
                  <span>{f.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <button className="w-full text-primary-foreground py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>
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
