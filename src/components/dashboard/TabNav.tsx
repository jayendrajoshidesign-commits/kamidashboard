import { useEffect, useRef } from 'react';

interface Props {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: any) => void;
  isConnected?: boolean;
  fileBadge?: number;
  isTablet?: boolean;
}

const TAB_GROUPS = [
  { label: 'OPERATIONS', tabs: ['Mission Control', 'Results', 'KAMI', 'Projects'] },
  { label: 'AGENTS', tabs: ['Live Agents', 'Live Browser'] },
  { label: 'INTELLIGENCE', tabs: ['Sources', 'Analytics', 'Files'] },
  { label: 'TOOLS', tabs: ['Studio', 'Revenue', 'Comms', 'Settings'] },
];

const TabNav = ({ tabs, activeTab, onTabChange, isConnected, fileBadge, isTablet }: Props) => {
  const navRef = useRef<HTMLElement>(null);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (!navRef.current) return;
    const activeBtn = navRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);

  return (
    <nav ref={navRef}
      className="px-2 xl:px-4 flex items-center h-12 overflow-x-auto gap-0 scrollbar-none"
      style={{
        background: 'rgba(5, 5, 7, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
      {TAB_GROUPS.map((group, gi) => (
        <div key={group.label} className="flex items-center flex-shrink-0">
          {gi > 0 && (
            <div className="h-5 mx-1 xl:mx-2" style={{ width: '1px', background: 'rgba(255,255,255,0.06)' }} />
          )}
          <div className="flex items-center gap-0 relative group/nav">
            {!isTablet && (
              <span className="absolute -top-0.5 left-1 text-[7px] font-mono uppercase tracking-widest opacity-0 group-hover/nav:opacity-100 transition-opacity"
                style={{ color: 'rgba(255,107,0,0.3)' }}>
                {group.label}
              </span>
            )}
            {group.tabs.map(tab => {
              if (!tabs.includes(tab)) return null;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  data-active={isActive}
                  onClick={() => onTabChange(tab)}
                  className={`relative py-2.5 font-medium transition-all whitespace-nowrap ${
                    isActive ? '' : 'hover:text-foreground/70'
                  } ${isTablet ? 'px-2 text-[11px]' : 'px-3 text-[13px]'}`}
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
      <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
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
};

export default TabNav;
