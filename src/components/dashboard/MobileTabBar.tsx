import { useState } from 'react';
import { Target, Bot, Globe, BarChart3, MoreHorizontal, X } from 'lucide-react';

const PRIMARY_TABS = [
  { id: 'Mission Control', icon: Target, label: 'Mission' },
  { id: 'Live Agents', icon: Bot, label: 'Agents' },
  { id: 'Live Browser', icon: Globe, label: 'Browser' },
  { id: 'Analytics', icon: BarChart3, label: 'Analytics' },
] as const;

const MORE_TABS = ['KAMI', 'Projects', 'Sources', 'Files', 'Studio', 'Revenue', 'Comms', 'Settings'] as const;

interface Props {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const MobileTabBar = ({ activeTab, onTabChange }: Props) => {
  const [showMore, setShowMore] = useState(false);
  const isPrimaryActive = PRIMARY_TABS.some(t => t.id === activeTab);

  return (
    <>
      {/* More drawer */}
      {showMore && (
        <>
          <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowMore(false)} />
          <div className="fixed bottom-[92px] left-0 right-0 z-50 rounded-t-2xl overflow-hidden animate-slide-up"
            style={{ background: 'rgba(8,8,10,0.98)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,107,0,0.15)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-sm font-semibold text-foreground">More Tabs</span>
              <button onClick={() => setShowMore(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-4 gap-2 p-4">
              {MORE_TABS.map(tab => (
                <button key={tab}
                  onClick={() => { onTabChange(tab); setShowMore(false); }}
                  className="flex flex-col items-center gap-1 py-3 rounded-lg transition-all min-h-[56px]"
                  style={{
                    background: activeTab === tab ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.03)',
                    border: activeTab === tab ? '1px solid rgba(255,107,0,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  }}>
                  <span className="text-[11px] font-medium" style={{ color: activeTab === tab ? '#FF8C00' : '#888' }}>{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-end"
        style={{ background: 'rgba(6,6,8,0.98)', borderTop: '1px solid rgba(255,107,0,0.15)' }}>
        {/* Main status bar row */}
        <div className="w-full">
          {/* Tab buttons */}
          <div className="flex items-center justify-around px-2" style={{ height: 56 }}>
            {PRIMARY_TABS.map(({ id, icon: Icon, label }) => {
              const isActive = activeTab === id;
              return (
                <button key={id} onClick={() => onTabChange(id)}
                  className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[56px] min-h-[44px] transition-all"
                  style={{ WebkitTapHighlightColor: 'rgba(255,107,0,0.1)' }}>
                  <Icon className="w-5 h-5" style={{ color: isActive ? '#FF8C00' : '#555' }} />
                  <span className="text-[9px] font-medium" style={{ color: isActive ? '#FF8C00' : '#555' }}>{label}</span>
                  {isActive && <div className="w-4 h-0.5 rounded-full mt-0.5" style={{ background: '#FF6B00' }} />}
                </button>
              );
            })}
            <button onClick={() => setShowMore(!showMore)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[56px] min-h-[44px] transition-all"
              style={{ WebkitTapHighlightColor: 'rgba(255,107,0,0.1)' }}>
              <MoreHorizontal className="w-5 h-5" style={{ color: !isPrimaryActive ? '#FF8C00' : '#555' }} />
              <span className="text-[9px] font-medium" style={{ color: !isPrimaryActive ? '#FF8C00' : '#555' }}>More</span>
              {!isPrimaryActive && <div className="w-4 h-0.5 rounded-full mt-0.5" style={{ background: '#FF6B00' }} />}
            </button>
          </div>
          {/* Safe area spacer for iPhone notch */}
          <div className="h-[env(safe-area-inset-bottom,0px)]" />
        </div>
      </div>
    </>
  );
};

export default MobileTabBar;
