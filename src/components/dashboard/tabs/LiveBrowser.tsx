import { BROWSER_WINDOWS } from '@/data/dashboardData';

const LiveBrowser = () => (
  <div className="space-y-6">
    {/* Browser grid */}
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
          <div className="flex-1 bg-foreground/5 relative overflow-hidden">
            <div
              className="absolute left-0 w-full h-0.5 bg-neon-cyan z-10"
              style={{ animation: `scan 3s infinite linear`, animationDelay: bw.delay, boxShadow: '0 0 10px hsl(var(--neon-cyan))' }}
            />
            <div className="p-4 text-muted-foreground text-xs font-mono space-y-2 opacity-40">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="h-8 bg-muted rounded w-full mt-3" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Sources collected feed */}
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
                <span className="text-xs font-medium text-neon-cyan truncate">{s.url}</span>
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

export default LiveBrowser;
