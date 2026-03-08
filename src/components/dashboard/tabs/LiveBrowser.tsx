import { useState, useEffect, useRef } from 'react';
import { BROWSER_WINDOWS } from '@/data/dashboardData';
import { api } from '@/services/apiService';

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

interface Props {
  isConnected: boolean;
}

const LiveBrowser = ({ isConnected }: Props) => {
  const [extractCounts, setExtractCounts] = useState([0, 0, 0, 0]);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      {screenshotUrl && (
        <div className="glass-card overflow-hidden">
          <div className="px-3 py-2 border-b border-border/50 flex items-center gap-2 bg-muted/30">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green pulse-dot" />
            <span className="text-[11px] font-mono text-neon-green">LIVE BROWSER</span>
          </div>
          <img src={screenshotUrl} alt="Live browser screenshot" className="w-full" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 h-[400px]">
        {BROWSER_WINDOWS.map((bw, i) => (
          <div key={i} className="glass-card overflow-hidden flex flex-col">
            <div className="px-3 py-2 border-b border-border/50 flex items-center gap-2 bg-muted/30">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-neon-red" />
                <span className="w-2 h-2 rounded-full bg-neon-yellow" />
                <span className="w-2 h-2 rounded-full bg-neon-green" />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground ml-1">{bw.url}</span>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <div
                className="absolute left-0 w-full h-0.5 z-20"
                style={{ animation: `scan 3s infinite linear`, animationDelay: bw.delay, backgroundColor: '#FF8C00', boxShadow: '0 0 10px #FF8C00' }}
              />
              {PANEL_CONTENT[i]}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-3 py-1.5 flex items-center justify-between z-10">
                <span className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: '#FF8C00' }}>
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: '#FF8C00' }} />
                  EXTRACTING...
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{extractCounts[i].toLocaleString()} chars</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <div className="px-4 py-3 border-b border-border/50">
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
            <div key={i} className="px-4 py-3 border-b border-border/30 flex gap-3 items-start">
              <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap mt-0.5">{s.time}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium truncate" style={{ color: '#FF8C00' }}>{s.url}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary whitespace-nowrap">{s.agent}</span>
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
