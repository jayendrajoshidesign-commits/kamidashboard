import { useState } from 'react';
import { Monitor, Tablet, Smartphone, FolderTree, File, Rocket, RefreshCw, Share2, Upload, ChevronDown, Check, Circle } from 'lucide-react';

const FILE_TREE = [
  { name: 'src/', icon: FolderTree, color: '#FF8C00', indent: 0, isDir: true },
  { name: 'App.tsx', icon: File, color: '#3b82f6', indent: 1 },
  { name: 'components/', icon: FolderTree, color: '#FF8C00', indent: 1, isDir: true },
  { name: 'Hero.tsx', icon: File, color: '#3b82f6', indent: 2, active: true },
  { name: 'Pricing.tsx', icon: File, color: '#3b82f6', indent: 2 },
  { name: 'Features.tsx', icon: File, color: '#3b82f6', indent: 2 },
  { name: 'Footer.tsx', icon: File, color: '#3b82f6', indent: 2 },
  { name: 'pages/', icon: FolderTree, color: '#FF8C00', indent: 1, isDir: true },
  { name: 'index.tsx', icon: File, color: '#3b82f6', indent: 2 },
  { name: 'public/', icon: FolderTree, color: '#FF8C00', indent: 0, isDir: true },
  { name: 'hero-bg.jpg', icon: File, color: '#c084fc', indent: 1 },
  { name: 'logo.svg', icon: File, color: '#4ade80', indent: 1 },
  { name: 'package.json', icon: File, color: '#facc15', indent: 0 },
  { name: 'tailwind.config.js', icon: File, color: '#06b6d4', indent: 0 },
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

const BUILD_STEPS = [
  { text: 'Created hero section', done: true },
  { text: 'Added pricing cards', done: true },
  { text: 'Responsive layout', done: true },
  { text: 'Adding animations...', done: false },
];

const CHAT_MESSAGES = [
  { role: 'user' as const, text: 'Build me a landing page for InvoiceFlow — a freelance invoicing SaaS.' },
  { role: 'ai' as const, text: "I'll create a modern landing page with a hero section, features, pricing, and footer. Let me build that for you." },
];

interface Props {
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

const StudioWebTab = ({ leftOpen, rightOpen, onToggleLeft, onToggleRight }: Props) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'phone'>('desktop');
  const [leftMode, setLeftMode] = useState<'chat' | 'code'>('chat');
  const [topMode, setTopMode] = useState<'preview' | 'code' | 'theme'>('preview');

  const previewWidth = device === 'desktop' ? '100%' : device === 'tablet' ? 768 : 375;

  return (
    <div className="flex h-full relative">
      {/* Left Panel */}
      <div className="flex-shrink-0 overflow-hidden transition-all duration-250 ease-in-out"
        style={{ width: leftOpen ? 280 : 0 }}>
        <div className="w-[280px] h-full flex flex-col" style={{ background: 'rgba(8,8,11,0.95)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Project header */}
          <div className="px-3 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--neon-pink))] flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">I</span>
            </div>
            <span className="text-xs font-semibold text-foreground">InvoiceFlow</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto" />
          </div>

          {leftMode === 'chat' ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {CHAT_MESSAGES.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 text-[12px] leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-[14px_4px_14px_14px] text-foreground'
                        : 'rounded-[4px_14px_14px_14px] text-foreground/90'
                    }`} style={{
                      background: m.role === 'user' ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,14,0.9)',
                      border: `1px solid ${m.role === 'user' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                    }}>
                      {m.text}
                    </div>
                  </div>
                ))}

                {/* Build steps */}
                <div className="space-y-1.5 mt-2">
                  {BUILD_STEPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      {s.done ? (
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--neon-green))]" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-muted-foreground animate-pulse" />
                      )}
                      <span className={s.done ? 'text-foreground/70' : 'text-muted-foreground'}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="rounded-lg px-3 py-2 text-xs text-muted-foreground focus-within:border-[rgba(255,107,0,0.3)]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  Ask Lovable...
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Language tabs */}
              <div className="flex gap-0 px-3 pt-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['HTML', 'CSS', 'JS'].map(lang => (
                  <button key={lang} className="px-3 py-1.5 text-[10px] font-medium transition-colors"
                    style={lang === 'HTML' ? { color: '#FF8C00', borderBottom: '2px solid #FF6B00' } : { color: 'hsl(var(--muted-foreground))' }}>
                    {lang}
                  </button>
                ))}
              </div>
              {/* Code view */}
              <div className="flex-1 overflow-auto p-3 font-mono text-[11px] leading-relaxed" style={{ background: '#030306' }}>
                {SAMPLE_HTML.split('\n').map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-6 text-right mr-3 select-none" style={{ color: '#333' }}>{i + 1}</span>
                    <span>
                      {line.split(/(<[^>]+>)/g).map((part, j) => {
                        if (part.startsWith('<')) return <span key={j} style={{ color: '#FF6B00' }}>{part}</span>;
                        if (part.includes('"')) return <span key={j} style={{ color: '#4ade80' }}>{part}</span>;
                        return <span key={j} className="text-foreground/50">{part}</span>;
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode toggle */}
          <div className="flex gap-1 p-2 mx-2 mb-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <button onClick={() => setLeftMode('chat')}
              className="flex-1 py-1 rounded text-[10px] font-medium transition-all text-center"
              style={leftMode === 'chat' ? { background: 'rgba(255,255,255,0.08)', color: '#fff' } : { color: 'hsl(var(--muted-foreground))' }}>
              Chat
            </button>
            <button onClick={() => setLeftMode('code')}
              className="flex-1 py-1 rounded text-[10px] font-medium transition-all text-center"
              style={leftMode === 'code' ? { background: 'rgba(255,255,255,0.08)', color: '#fff' } : { color: 'hsl(var(--muted-foreground))' }}>
              Code
            </button>
          </div>
        </div>
      </div>

      {/* Left toggle */}
      <button onClick={onToggleLeft}
        className="absolute top-1/2 -translate-y-1/2 z-20 w-5 h-10 flex items-center justify-center rounded-r transition-all hover:bg-[rgba(255,107,0,0.1)]"
        style={{
          left: leftOpen ? 280 : 0, background: 'rgba(10,10,14,0.9)',
          border: '1px solid rgba(255,255,255,0.06)', borderLeft: leftOpen ? 'none' : undefined,
          transition: 'left 0.25s ease',
        }}>
        <span className="text-[10px] text-muted-foreground">{leftOpen ? '‹' : '›'}</span>
      </button>

      {/* CENTER — PREVIEW */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0a0a0e' }}>
        {/* Toolbar mimicking Lovable */}
        <div className="flex items-center px-3 py-1.5 gap-3" style={{ background: 'rgba(8,8,11,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Center mode pills */}
          <div className="flex gap-0.5 mx-auto rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {(['preview', 'code', 'theme'] as const).map(m => (
              <button key={m} onClick={() => setTopMode(m)}
                className="px-3 py-1 rounded text-[11px] font-medium transition-all capitalize"
                style={topMode === m ? { background: 'rgba(255,255,255,0.12)', color: '#fff' } : { color: 'hsl(var(--muted-foreground))' }}>
                {m === 'preview' ? 'Preview' : m === 'code' ? '</> Code' : '🎨 Theme'}
              </button>
            ))}
          </div>

          {/* Right - device + actions */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex gap-1">
              {([['desktop', Monitor], ['tablet', Tablet], ['phone', Smartphone]] as const).map(([d, Icon]) => (
                <button key={d} onClick={() => setDevice(d as any)}
                  className="p-1 rounded transition-colors"
                  style={device === d ? { color: '#FF8C00' } : { color: 'hsl(var(--muted-foreground))' }}>
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <div className="w-px h-4 bg-[rgba(255,255,255,0.06)]" />
            <button className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Share
            </button>
            <button className="text-[10px] font-medium px-3 py-1 rounded transition-colors flex items-center gap-1"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              <Upload className="w-3 h-3" /> Publish
            </button>
          </div>
        </div>

        {/* Browser preview */}
        <div className="flex-1 flex items-start justify-center overflow-auto p-4" style={{ background: '#0a0a0c' }}>
          <div className="flex flex-col transition-all duration-300" style={{ width: typeof previewWidth === 'number' ? previewWidth : '100%', maxWidth: '100%' }}>
            {/* Browser chrome */}
            <div className="flex items-center px-3 py-2 gap-3 rounded-t-lg" style={{ background: '#1a1a1e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#eab308' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              </div>
              <div className="flex-1 rounded px-3 py-1 text-[11px] font-mono" style={{ background: 'rgba(255,255,255,0.05)', color: 'hsl(var(--muted-foreground))' }}>
                localhost:3000
              </div>
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            {/* Device frame for phone */}
            {device === 'phone' && (
              <div className="w-full flex justify-center" style={{ background: '#000', borderRadius: '0 0 24px 24px', padding: '0 4px 8px' }}>
                <div className="w-[120px] h-[5px] rounded-full mt-1 mb-1" style={{ background: '#333' }} />
              </div>
            )}

            {/* Website content */}
            <div className="overflow-hidden rounded-b-lg" style={{ background: '#0f172a' }}>
              {/* Navbar */}
              <div className="flex items-center justify-between px-6 py-3" style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-white font-bold text-sm">InvoiceFlow</span>
                <div className="flex gap-5 text-[11px] items-center">
                  <span className="text-gray-400 hover:text-white cursor-pointer">Features</span>
                  <span className="text-gray-400 hover:text-white cursor-pointer">Pricing</span>
                  <span className="text-gray-400 hover:text-white cursor-pointer">About</span>
                  <span className="text-[#FF8C00] font-medium cursor-pointer">Login</span>
                </div>
              </div>

              {/* Hero */}
              <div className="px-8 py-10 text-center" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
                <h1 className="text-white text-2xl font-bold leading-tight">Invoice Faster.</h1>
                <h2 className="text-white text-2xl font-bold mb-3">Get Paid Sooner.</h2>
                <p className="text-gray-400 text-xs mb-6 max-w-[320px] mx-auto">Smart invoicing for modern freelancers. Send professional invoices, get paid faster.</p>
                <div className="flex gap-3 justify-center">
                  <button className="text-white text-xs px-5 py-2.5 rounded-lg font-semibold"
                    style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>Start Free Trial →</button>
                  <button className="text-gray-300 text-xs px-5 py-2.5 rounded-lg font-medium"
                    style={{ border: '1px solid rgba(255,255,255,0.15)' }}>Watch Demo</button>
                </div>
              </div>

              {/* Features */}
              <div className="px-6 py-8" style={{ background: '#f8fafc' }}>
                <h3 className="text-center text-gray-900 text-sm font-bold mb-6">Everything you need</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: '⚡', title: 'Lightning Fast', desc: 'Create invoices in under 60 seconds with smart templates.' },
                    { icon: '🔒', title: 'Secure Payments', desc: 'Stripe & PayPal integration with bank-level security.' },
                    { icon: '📊', title: 'Smart Analytics', desc: 'Track revenue, expenses, and client metrics in real-time.' },
                  ].map(f => (
                    <div key={f.title} className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <span className="text-2xl">{f.icon}</span>
                      <h4 className="text-gray-900 text-[12px] font-semibold mt-2">{f.title}</h4>
                      <p className="text-gray-500 text-[10px] mt-1 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="px-6 py-8" style={{ background: '#fff' }}>
                <h3 className="text-center text-gray-900 text-sm font-bold mb-6">Simple Pricing</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Starter', price: '$9', features: ['5 clients', '50 invoices/mo', 'Basic analytics'] },
                    { name: 'Pro', price: '$29', features: ['Unlimited clients', 'Unlimited invoices', 'Advanced analytics'], popular: true },
                    { name: 'Business', price: '$79', features: ['Everything in Pro', 'Team access', 'Priority support'] },
                  ].map(p => (
                    <div key={p.name} className="rounded-xl p-4 text-center relative" style={{
                      border: p.popular ? '2px solid #FF6B00' : '1px solid #e5e7eb',
                      background: p.popular ? '#fffbf5' : '#fff',
                    }}>
                      {p.popular && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#FF6B00' }}>POPULAR</span>}
                      <div className="text-gray-900 text-[11px] font-semibold">{p.name}</div>
                      <div className="text-gray-900 text-xl font-bold mt-1">{p.price}<span className="text-gray-400 text-[10px] font-normal">/mo</span></div>
                      <ul className="mt-3 space-y-1.5">
                        {p.features.map(f => <li key={f} className="text-gray-600 text-[9px]">✓ {f}</li>)}
                      </ul>
                      <button className="mt-3 w-full py-1.5 rounded-lg text-[10px] font-semibold"
                        style={p.popular ? { background: '#FF6B00', color: '#fff' } : { border: '1px solid #d1d5db', color: '#374151' }}>
                        Get Started
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-5" style={{ background: '#0f172a' }}>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[10px]">© 2024 InvoiceFlow. All rights reserved.</span>
                  <div className="flex gap-4 text-gray-500 text-[10px]">
                    <span>Privacy</span><span>Terms</span><span>Contact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone home indicator */}
            {device === 'phone' && (
              <div className="flex justify-center py-2" style={{ background: '#000', borderRadius: '0 0 24px 24px' }}>
                <div className="w-[100px] h-[4px] rounded-full" style={{ background: '#444' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right toggle */}
      <button onClick={onToggleRight}
        className="absolute top-1/2 -translate-y-1/2 z-20 w-5 h-10 flex items-center justify-center rounded-l transition-all hover:bg-[rgba(255,107,0,0.1)]"
        style={{
          right: rightOpen ? 160 : 0, background: 'rgba(10,10,14,0.9)',
          border: '1px solid rgba(255,255,255,0.06)', borderRight: rightOpen ? 'none' : undefined,
          transition: 'right 0.25s ease',
        }}>
        <span className="text-[10px] text-muted-foreground">{rightOpen ? '›' : '‹'}</span>
      </button>

      {/* Right Panel — File Tree */}
      <div className="flex-shrink-0 overflow-hidden transition-all duration-250 ease-in-out"
        style={{ width: rightOpen ? 160 : 0 }}>
        <div className="w-[160px] h-full flex flex-col overflow-y-auto" style={{ background: 'rgba(8,8,11,0.95)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="section-header">Files</span>
            <RefreshCw className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
          <div className="flex-1 p-2 space-y-0.5 text-[11px]">
            {FILE_TREE.map((f, i) => (
              <div key={i}
                className={`flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer transition-colors ${f.active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                style={{
                  paddingLeft: f.indent * 12 + 6,
                  background: f.active ? 'rgba(255,107,0,0.06)' : undefined,
                  borderLeft: f.active ? '2px solid #FF6B00' : '2px solid transparent',
                }}>
                <f.icon className="w-3 h-3 flex-shrink-0" style={{ color: f.color }} />
                <span className={f.isDir ? 'font-medium' : ''}>{f.name}</span>
              </div>
            ))}
          </div>
          <div className="p-2">
            <button className="w-full text-primary-foreground py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-pink)))' }}>
              <Rocket className="w-3.5 h-3.5" /> Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioWebTab;
