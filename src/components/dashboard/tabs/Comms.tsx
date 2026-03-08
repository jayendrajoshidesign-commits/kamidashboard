const Comms = () => (
  <div className="flex items-center justify-center h-full min-h-[500px]">
    <div className="glass-card p-10 text-center max-w-md">
      <div className="text-6xl mb-4">📧</div>
      <h2 className="text-xl font-bold text-foreground heading-cinematic mb-2">Communications Hub</h2>
      <p className="text-sm text-muted-foreground mb-6">Email campaigns, outreach tracking, response monitoring</p>
      <div className="flex gap-3 justify-center mb-4">
        <button className="text-primary-foreground px-5 py-2 rounded-lg text-sm font-bold mission-pulse-btn"
          style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)', boxShadow: '0 0 20px rgba(255,107,0,0.35)' }}>
          Connect Gmail
        </button>
        <button className="glass-card-static px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Connect Outlook
        </button>
      </div>
      <div className="mt-8 opacity-30 blur-[2px] pointer-events-none">
        {['Welcome Sequence', 'Follow-up Template', 'Cold Outreach v2'].map((name, i) => (
          <div key={i} className="glass-card-static p-3 mb-2 text-left flex items-center gap-3">
            <span className="text-sm">📄</span>
            <div>
              <div className="text-xs text-foreground">{name}</div>
              <div className="text-[10px] text-muted-foreground">Draft · Updated 2h ago</div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mt-6">Coming Soon</p>
    </div>
  </div>
);

export default Comms;
