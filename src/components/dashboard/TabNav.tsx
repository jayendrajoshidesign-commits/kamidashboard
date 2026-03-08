interface Props {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: any) => void;
  isConnected?: boolean;
}

const TabNav = ({ tabs, activeTab, onTabChange, isConnected }: Props) => (
  <nav className="px-4 flex gap-1 h-12 items-center overflow-x-auto"
    style={{
      background: 'rgba(8, 6, 4, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 80, 0, 0.12)',
    }}>
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`relative px-3 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
          activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {tab}
        {activeTab === tab && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
            style={{
              backgroundColor: '#FF6B00',
              boxShadow: '0 2px 12px rgba(255,107,0,0.6)',
              filter: 'drop-shadow(0 2px 6px rgba(255,107,0,0.8))',
            }} />
        )}
      </button>
    ))}

    {/* Connection badge */}
    <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{
        backgroundColor: isConnected ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,0,0.15)',
        color: isConnected ? 'hsl(142,71%,45%)' : '#FF8C00',
        border: `1px solid ${isConnected ? 'rgba(34,197,94,0.3)' : 'rgba(255,107,0,0.4)'}`,
        boxShadow: isConnected ? '0 0 8px rgba(34,197,94,0.2)' : '0 0 12px rgba(255,107,0,0.2)',
        textShadow: isConnected ? undefined : '0 0 8px rgba(255,107,0,0.5)',
      }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-neon-green pulse-dot' : 'pulse-dot'}`}
        style={!isConnected ? { backgroundColor: '#FF8C00' } : undefined} />
      {isConnected ? 'LIVE' : 'DEMO'}
    </div>
  </nav>
);

export default TabNav;
