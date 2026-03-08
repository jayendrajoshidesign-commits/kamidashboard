import { useState, useEffect } from 'react';
import { BROWSER_WINDOWS } from '@/data/dashboardData';
import { api } from '@/services/apiService';
import { Maximize2, X, ExternalLink, RefreshCw } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

const PANEL_CONTENT = [
  <div key="fb" className="h-full bg-white text-gray-900 text-[10px] overflow-hidden">
    <div className="bg-gray-900 text-white px-3 py-1.5 flex items-center gap-4">
      <span className="font-bold text-[11px]">FreshBooks</span>
      <span className="text-gray-400">Features</span>
      <span className="text-white font-medium">Pricing</span>
      <span className="text-gray-400">Resources</span>
    </div>
    <div className="p-3">
      <h3 className="font-bold text-sm text-center mb-2">Plans & Pricing</h3>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { name: 'Lite', price: '$19/mo', color: 'bg-green-500', features: ['5 Clients', 'Invoicing', 'Expense Tracking'] },
          { name: 'Plus', price: '$33/mo', color: 'bg-blue-500', features: ['50 Clients', 'Proposals', 'Recurring Billing'] },
          { name: 'Premium', price: '$60/mo', color: 'bg-purple-500', features: ['500 Clients', 'Projects', 'Profitability'] },
        ].map(p => (
          <div key={p.name} className="border border-gray-200 rounded p-1.5 text-center">
            <div className="font-bold text-[11px]">{p.name}</div>
            <div className="text-blue-600 font-bold text-xs my-0.5">{p.price}</div>
            {p.features.map(f => <div key={f} className="text-gray-500 text-[8px]">✓ {f}</div>)}
            <button className={`${p.color} text-white text-[8px] px-2 py-0.5 rounded mt-1 w-full`}>Try Free</button>
          </div>
        ))}
      </div>
    </div>
  </div>,
  <div key="wa" className="h-full bg-white text-gray-900 text-[10px] overflow-hidden">
    <div className="bg-emerald-600 text-white px-3 py-1.5 flex items-center gap-4">
      <span className="font-bold text-[11px]">Wave</span>
      <span className="text-emerald-200">Invoicing</span>
      <span className="text-emerald-200">Accounting</span>
      <span className="text-emerald-200">Banking</span>
    </div>
    <div className="p-3">
      <h3 className="font-bold text-sm mb-1">Free Invoice Software</h3>
      <p className="text-gray-500 text-[9px] mb-2">Professional invoices in seconds. Get paid faster.</p>
      <div className="grid grid-cols-2 gap-1.5">
        {['📧 Send Invoices', '💳 Accept Payments', '🔄 Recurring Billing', '📊 Financial Reports'].map(f => (
          <div key={f} className="bg-emerald-50 rounded p-1.5 text-[9px] text-emerald-700">{f}</div>
        ))}
      </div>
    </div>
  </div>,
  <div key="in" className="h-full bg-gray-900 text-white text-[10px] overflow-hidden">
    <div className="bg-black px-3 py-1.5 flex items-center gap-4">
      <span className="font-bold text-[11px] text-blue-400">Invoice Ninja</span>
      <span className="text-gray-400">Features</span>
      <span className="text-gray-400">Pricing</span>
    </div>
    <div className="p-3">
      <span className="bg-blue-500/20 text-blue-400 text-[8px] px-1.5 py-0.5 rounded-full">OPEN SOURCE</span>
      <h3 className="font-bold text-xs mt-1.5 mb-1.5">Features</h3>
      {['✅ Unlimited Invoices', '✅ 40+ Payment Gateways', '✅ Multi-language', '✅ Custom Branding', '✅ Self-hosted Option', '✅ REST API'].map(f => (
        <div key={f} className="text-gray-300 text-[9px] py-0.5">{f}</div>
      ))}
    </div>
  </div>,
  <div key="g2" className="h-full bg-white text-gray-900 text-[10px] overflow-hidden">
    <div className="bg-red-600 text-white px-3 py-1.5 flex items-center gap-4">
      <span className="font-bold text-[11px]">G2</span>
      <span className="text-red-200">Categories</span>
      <span className="text-white font-medium">Invoicing</span>
    </div>
    <div className="p-3">
      <h3 className="font-bold text-xs mb-2">Best Invoicing Software 2024</h3>
      {[
        { name: 'FreshBooks', stars: '★★★★½', reviews: '4,230' },
        { name: 'QuickBooks', stars: '★★★★☆', reviews: '6,891' },
        { name: 'Zoho Invoice', stars: '★★★★☆', reviews: '2,104' },
        { name: 'Invoice Ninja', stars: '★★★★☆', reviews: '142' },
      ].map(p => (
        <div key={p.name} className="flex items-center justify-between py-1 border-b border-gray-100">
          <span className="font-medium text-[9px]">{p.name}</span>
          <span className="text-orange-500 text-[9px]">{p.stars}</span>
          <span className="text-gray-400 text-[8px]">{p.reviews} reviews</span>
        </div>
      ))}
    </div>
  </div>,
];

const PANEL_TITLES = ['FreshBooks — Pricing', 'Wave — Invoicing', 'Invoice Ninja — Features', 'G2 — Best Invoicing'];

interface Props {
  isConnected: boolean;
}

const LiveBrowser = ({ isConnected }: Props) => {
  const [extractCounts, setExtractCounts] = useState([0, 0, 0, 0]);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<number | null>(null);
  const [mobileActivePanel, setMobileActivePanel] = useState(0);
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const i = setInterval(() => {
      setExtractCounts(prev => prev.map(c => c < 5000 ? c + Math.floor(Math.random() * 200) + 50 : c));
    }, 800);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const poll = async () => {
      try {
        const { url } = await api.getScreenshot();
        setScreenshotUrl(url);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, [isConnected]);

  const renderPanel = (i: number) => (
    <div className="glass-card overflow-hidden flex flex-col">
      <div className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#eab308' }} />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
        </div>
        <div className="flex-1 px-2 py-0.5 rounded text-[10px] font-mono truncate" style={{ background: 'rgba(255,255,255,0.03)', color: '#FF8C00' }}>{BROWSER_WINDOWS[i].url}</div>
        <button className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-3 h-3" />
        </button>
        <button onClick={() => setExpandedPanel(i)} className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: isMobile ? 250 : 150 }}>
        <div
          className="absolute left-0 w-full h-0.5 z-20"
          style={{ animation: `scan 3s infinite linear`, animationDelay: BROWSER_WINDOWS[i].delay, backgroundColor: '#FF8C00', boxShadow: '0 0 6px #FF8C00' }}
        />
        {PANEL_CONTENT[i]}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 flex items-center justify-between z-10" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: '#FF8C00' }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: '#FF8C00' }} />
            EXTRACTING...
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">{extractCounts[i].toLocaleString()} chars</span>
        </div>
      </div>
      <div className="px-3 py-1 text-[9px] font-mono text-muted-foreground flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span>{PANEL_TITLES[i]}</span>
        <span>Last scraped: 2m ago</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {screenshotUrl && (
        <div className="glass-card overflow-hidden">
          <div className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4ade80' }} />
            <span className="text-[11px] font-mono" style={{ color: '#4ade80' }}>LIVE BROWSER</span>
          </div>
          <img src={screenshotUrl} alt="Live browser screenshot" className="w-full" />
        </div>
      )}

      {isMobile ? (
        /* Mobile: single panel with tab switcher */
        <div className="space-y-3">
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {PANEL_TITLES.map((t, i) => (
              <button key={i} onClick={() => setMobileActivePanel(i)}
                className="text-[10px] px-3 py-1.5 rounded-full flex-shrink-0 transition-all min-h-[32px]"
                style={mobileActivePanel === i
                  ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.03)', color: '#666', border: '1px solid rgba(255,255,255,0.05)' }
                }>
                {t.split(' — ')[0]}
              </button>
            ))}
          </div>
          {renderPanel(mobileActivePanel)}
        </div>
      ) : (
        <div className={`grid gap-4 ${isTablet ? 'grid-cols-2' : 'grid-cols-2'}`} style={{ height: isMobile ? undefined : '400px' }}>
          {BROWSER_WINDOWS.map((_, i) => renderPanel(i))}
        </div>
      )}

      {/* Expanded Panel Modal */}
      {expandedPanel !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className={`glass-card overflow-hidden flex flex-col ${isMobile ? 'w-[95%] h-[85%]' : 'w-[85%] h-[85%]'}`}>
            <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#eab308' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              </div>
              <div className="flex-1 px-3 py-1 rounded text-sm font-mono truncate" style={{ background: 'rgba(255,255,255,0.03)', color: '#FF8C00' }}>
                {BROWSER_WINDOWS[expandedPanel].url}
              </div>
              <a href={`https://${BROWSER_WINDOWS[expandedPanel].url}`} target="_blank" rel="noopener" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
              <button onClick={() => setExpandedPanel(null)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {PANEL_CONTENT[expandedPanel]}
            </div>
          </div>
        </div>
      )}

      {/* Sources list */}
      <div className="glass-card">
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 className="text-sm font-semibold text-foreground">📋 Sources Collected</h3>
        </div>
        <div className="max-h-[250px] overflow-y-auto">
          {[
            { agent: 'Market Research', url: 'freshbooks.com/pricing', time: '10:42', preview: 'Extracted 4 pricing tiers and 23 feature comparisons...' },
            { agent: 'Market Research', url: 'waveapps.com/invoicing', time: '10:43', preview: 'Free invoicing with paid add-ons for payments...' },
            { agent: 'Market Research', url: 'invoiceninja.com/features', time: '10:44', preview: 'Open-source with self-hosted option, Pro at $10/mo...' },
            { agent: 'CEO', url: 'techcrunch.com/tag/saas', time: '10:45', preview: 'SaaS market projected to reach $908B by 2030...' },
            { agent: 'Sales', url: 'g2.com/categories/invoicing', time: '10:46', preview: 'Top complaints: poor mobile UX (34%), complex onboarding...' },
            { agent: 'Finance', url: 'stripe.com/docs/invoicing', time: '10:47', preview: 'Stripe Invoicing charges 0.4% per paid invoice ($2 cap)...' },
          ].map((s, i) => (
            <div key={i} className={`px-4 py-3 flex gap-3 items-start ${isMobile ? 'flex-col gap-1' : ''}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap mt-0.5">{s.time}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-medium truncate" style={{ color: '#FF8C00' }}>{s.url}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#999' }}>{s.agent}</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{s.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveBrowser;
