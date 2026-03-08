import { useState } from 'react';
import { Monitor, Tablet, Smartphone, FolderTree, File, Rocket, RefreshCw, ChevronDown, Check, Circle, X } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

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
  showChat: boolean;
  showFiles: boolean;
  onCloseChat: () => void;
  onCloseFiles: () => void;
}

const StudioWebTab = ({ showChat, showFiles, onCloseChat, onCloseFiles }: Props) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'phone'>('desktop');
  const [leftMode, setLeftMode] = useState<'chat' | 'code'>('chat');
  const { isDesktop } = useResponsive();
  const chatSheetSwipe = useSwipeGesture({ onSwipeDown: onCloseChat, threshold: 40, maxTime: 400 });
  const filesSheetSwipe = useSwipeGesture({ onSwipeDown: onCloseFiles, threshold: 40, maxTime: 400 });

  const previewWidth = device === 'desktop' ? '100%' : device === 'tablet' ? 768 : 375;

  // On desktop, panels push the preview. On mobile/tablet, panels are bottom sheets.
  const leftPanelWidth = isDesktop && showChat ? 200 : 0;
  const rightPanelWidth = isDesktop && showFiles ? 160 : 0;

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      {/* LEFT PANEL — Chat (desktop: pushes preview) */}
      {isDesktop && (
        <div className="flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
          style={{ width: leftPanelWidth, background: 'rgba(8,8,12,0.95)', borderRight: showChat ? '1px solid rgba(255,107,0,0.15)' : 'none' }}>
          {showChat && <ChatPanel onClose={onCloseChat} leftMode={leftMode} setLeftMode={setLeftMode} />}
        </div>
      )}

      {/* CENTER — Browser preview (takes remaining space) */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{ background: '#0a0a0e' }}>
        {/* Browser toolbar */}
        <div className="flex items-center px-3 py-1.5 gap-3 flex-shrink-0"
          style={{ background: 'rgba(8,8,11,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-0.5 mx-auto rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {['Preview', '</> Code', '🎨 Theme'].map(m => (
              <button key={m} className="px-3 py-1 rounded text-[11px] font-medium transition-all"
                style={m === 'Preview' ? { background: 'rgba(255,255,255,0.12)', color: '#fff' } : { color: 'hsl(var(--muted-foreground))' }}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex gap-1">
              {([['desktop', Monitor], ['tablet', Tablet], ['phone', Smartphone]] as const).map(([d, Icon]) => (
                <button key={d} onClick={() => setDevice(d as any)} className="p-1 rounded transition-colors"
                  style={device === d ? { color: '#FF8C00' } : { color: 'hsl(var(--muted-foreground))' }}>
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
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

            {/* Website content */}
            <div className="overflow-hidden rounded-b-lg" style={{ background: '#0f172a' }}>
              <div className="flex items-center justify-between px-6 py-3" style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-white font-bold text-sm">InvoiceFlow</span>
                <div className="flex gap-5 text-[11px] items-center">
                  <span className="text-gray-400">Features</span>
                  <span className="text-gray-400">Pricing</span>
                  <span className="text-gray-400">About</span>
                  <span className="text-[#FF8C00] font-medium">Login</span>
                </div>
              </div>
              <div className="px-8 py-10 text-center" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
                <h1 className="text-white text-2xl font-bold leading-tight">Invoice Faster.</h1>
                <h2 className="text-white text-2xl font-bold mb-3">Get Paid Sooner.</h2>
                <p className="text-gray-400 text-xs mb-6 max-w-[320px] mx-auto">Smart invoicing for modern freelancers. Send professional invoices, get paid faster.</p>
                <div className="flex gap-3 justify-center">
                  <button className="text-white text-xs px-5 py-2.5 rounded-lg font-semibold" style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)' }}>Start Free Trial →</button>
                  <button className="text-gray-300 text-xs px-5 py-2.5 rounded-lg font-medium" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>Watch Demo</button>
                </div>
              </div>
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
              <div className="px-6 py-5" style={{ background: '#0f172a' }}>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[10px]">© 2024 InvoiceFlow. All rights reserved.</span>
                  <div className="flex gap-4 text-gray-500 text-[10px]">
                    <span>Privacy</span><span>Terms</span><span>Contact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — File tree (desktop: pushes preview) */}
      {isDesktop && (
        <div className="flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
          style={{ width: rightPanelWidth, background: 'rgba(8,8,12,0.95)', borderLeft: showFiles ? '1px solid rgba(255,107,0,0.15)' : 'none' }}>
          {showFiles && <FilesPanel onClose={onCloseFiles} />}
        </div>
      )}

      {/* MOBILE/TABLET — Chat bottom sheet */}
      {!isDesktop && showChat && (
        <div className="absolute left-0 right-0 bottom-0 z-30 animate-slide-up"
          style={{ height: '45%', maxHeight: 360, background: 'rgba(8,8,12,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,107,0,0.2)', borderRadius: '16px 16px 0 0' }}>
          <div className="flex justify-center pt-1.5 pb-1">
            <div className="w-8 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
          </div>
          <ChatPanel onClose={onCloseChat} leftMode={leftMode} setLeftMode={setLeftMode} />
        </div>
      )}

      {/* MOBILE/TABLET — Files bottom sheet */}
      {!isDesktop && showFiles && (
        <div className="absolute left-0 right-0 bottom-0 z-30 animate-slide-up"
          style={{ height: '40%', maxHeight: 320, background: 'rgba(8,8,12,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,107,0,0.2)', borderRadius: '16px 16px 0 0' }}>
          <div className="flex justify-center pt-1.5 pb-1">
            <div className="w-8 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
          </div>
          <FilesPanel onClose={onCloseFiles} />
        </div>
      )}
    </div>
  );
};

/* Extracted sub-components to avoid duplication */
const ChatPanel = ({ onClose, leftMode, setLeftMode }: { onClose: () => void; leftMode: 'chat' | 'code'; setLeftMode: (m: 'chat' | 'code') => void }) => (
  <div className="h-full flex flex-col" style={{ minWidth: 0 }}>
    <div className="px-3 py-2.5 flex items-center gap-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="w-5 h-5 rounded bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--neon-pink))] flex items-center justify-center">
        <span className="text-[10px] text-white font-bold">I</span>
      </div>
      <span className="text-xs font-semibold text-foreground">InvoiceFlow</span>
      <ChevronDown className="w-3 h-3 text-muted-foreground" />
      <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors">
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>

    {leftMode === 'chat' ? (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {CHAT_MESSAGES.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-3 py-2 text-[11px] leading-relaxed ${
                m.role === 'user' ? 'rounded-[14px_4px_14px_14px] text-foreground' : 'rounded-[4px_14px_14px_14px] text-foreground/90'
              }`} style={{
                background: m.role === 'user' ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,14,0.9)',
                border: `1px solid ${m.role === 'user' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
              }}>
                {m.text}
              </div>
            </div>
          ))}
          <div className="space-y-1.5 mt-2">
            {BUILD_STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                {s.done ? <Check className="w-3 h-3 text-[hsl(var(--neon-green))]" /> : <Circle className="w-3 h-3 text-muted-foreground animate-pulse" />}
                <span className={s.done ? 'text-foreground/70' : 'text-muted-foreground'}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-2 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="rounded-lg px-2.5 py-1.5 text-[10px] text-muted-foreground"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            Ask Lovable...
          </div>
        </div>
      </div>
    ) : (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex gap-0 px-3 pt-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {['HTML', 'CSS', 'JS'].map(lang => (
            <button key={lang} className="px-2.5 py-1.5 text-[10px] font-medium transition-colors"
              style={lang === 'HTML' ? { color: '#FF8C00', borderBottom: '2px solid #FF6B00' } : { color: 'hsl(var(--muted-foreground))' }}>
              {lang}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-2 font-mono text-[10px] leading-relaxed" style={{ background: '#030306' }}>
          {SAMPLE_HTML.split('\n').map((line, i) => (
            <div key={i} className="flex">
              <span className="w-5 text-right mr-2 select-none" style={{ color: '#333' }}>{i + 1}</span>
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

    <div className="flex gap-1 p-1.5 mx-2 mb-2 rounded-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
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
);

const FilesPanel = ({ onClose }: { onClose: () => void }) => (
  <div className="h-full flex flex-col" style={{ minWidth: 0 }}>
    <div className="flex items-center justify-between px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span className="section-header">Files</span>
      <div className="flex items-center gap-1">
        <RefreshCw className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-pointer" />
        <button onClick={onClose} className="p-1 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
    <div className="flex-1 p-2 space-y-0.5 text-[10px] overflow-y-auto">
      {FILE_TREE.map((f, i) => (
        <div key={i}
          className={`flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer transition-colors ${f.active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          style={{
            paddingLeft: f.indent * 10 + 6,
            background: f.active ? 'rgba(255,107,0,0.06)' : undefined,
            borderLeft: f.active ? '2px solid #FF6B00' : '2px solid transparent',
          }}>
          <f.icon className="w-3 h-3 flex-shrink-0" style={{ color: f.color }} />
          <span className={f.isDir ? 'font-medium' : ''}>{f.name}</span>
        </div>
      ))}
    </div>
    <div className="p-2 flex-shrink-0">
      <button className="w-full text-primary-foreground py-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-pink)))' }}>
        <Rocket className="w-3 h-3" /> Deploy
      </button>
    </div>
  </div>
);

export default StudioWebTab;