interface Props {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: any) => void;
  isConnected?: boolean;
  fileBadge?: number;
}

const TAB_GROUPS = [
  { label: 'OPERATIONS', tabs: ['Mission Control', 'KAMI', 'Projects'] },
  { label: 'AGENTS', tabs: ['Live Agents', 'Live Browser'] },
  { label: 'INTELLIGENCE', tabs: ['Sources', 'Analytics', 'Files'] },
  { label: 'TOOLS', tabs: ['Studio', 'Revenue', 'Comms', 'Settings'] },
];

const TabNav = ({ tabs, activeTab, onTabChange, isConnected, fileBadge }: Props) => (
  <nav className="px-4 flex items-center h-12 overflow-x-auto gap-0"
    style={{
      background: 'rgba(6, 6, 9, 0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    }}>
    {TAB_GROUPS.map((group, gi) => (
      <div key={group.label} className="flex items-center">
        {gi > 0 && (
          <div className="h-5 mx-2" style={{ width: '1px', background: 'rgba(255,255,255,0.06)' }} />
        )}
        <div className="flex items-center gap-0 relative group/nav">
          <span className="absolute -top-0.5 left-1 text-[7px] font-mono uppercase tracking-widest opacity-0 group-hover/nav:opacity-100 transition-opacity"
            style={{ color: 'rgba(255,107,0,0.3)' }}>
            {group.label}
          </span>
          {group.tabs.map(tab => {
            if (!tabs.includes(tab)) return null;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative px-3 py-2.5 text-[13px] font-medium transition-all whitespace-nowrap ${
                  isActive ? '' : 'hover:text-foreground/70'
                }`}
                style={{ color: isActive ? '#FF8C00' : '#555' }}
              >
                <span className="flex items-center gap-1.5">
                  {tab}
                  {tab === 'Sources' && (
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#FF6B00' }} />
                  )}
                  {tab === 'Files' && fileBadge !== undefined && (
                    <span className="text-[9px] font-mono px-1 py-0 rounded" style={{ backgroundColor: 'rgba(255,107,0,0.08)', color: '#FF8C00' }}>
                      {fileBadge}
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                    style={{
                      backgroundColor: '#FF6B00',
                      boxShadow: '0 1px 8px rgba(255,107,0,0.4)',
                    }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    ))}

    {/* Connection badge */}
    <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{
        backgroundColor: isConnected ? 'rgba(34,197,94,0.06)' : 'rgba(255,107,0,0.06)',
        color: isConnected ? 'hsl(142,71%,45%)' : '#FF8C00',
        border: `1px solid ${isConnected ? 'rgba(34,197,94,0.2)' : 'rgba(255,107,0,0.2)'}`,
      }}
    >
      <span className={`w-1.5 h-1.5 rounded-full`}
        style={{ backgroundColor: isConnected ? 'hsl(142,71%,45%)' : '#FF8C00' }} />
      {isConnected ? 'LIVE' : 'DEMO'}
    </div>
  </nav>
);

export default TabNav;
