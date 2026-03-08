const Revenue = () => (
  <div className="flex items-center justify-center h-full min-h-[500px]">
    <div className="glass-card p-10 text-center max-w-md">
      <div className="text-6xl mb-4">💰</div>
      <h2 className="text-xl font-bold text-foreground heading-cinematic mb-2">Revenue Tracker</h2>
      <p className="text-sm text-muted-foreground mb-6">Connect Stripe to track earnings automatically</p>
      <button className="text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-bold mission-pulse-btn"
        style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)', boxShadow: '0 0 20px rgba(255,107,0,0.35)' }}>
        Connect Stripe
      </button>
      <div className="mt-8 opacity-30 blur-[2px] pointer-events-none">
        <div className="flex gap-4 justify-center">
          {['$12.4K', '$8.2K', '$15.1K'].map((v, i) => (
            <div key={i} className="glass-card-static p-3 w-24">
              <div className="text-[10px] text-muted-foreground">Month {i + 1}</div>
              <div className="text-sm font-mono mono-value">{v}</div>
            </div>
          ))}
        </div>
        <div className="h-20 mt-4 rounded bg-muted/20" />
      </div>
      <p className="text-[11px] text-muted-foreground mt-6">Coming Soon</p>
    </div>
  </div>
);

export default Revenue;
