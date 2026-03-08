import { useState } from 'react';
import { Target, Bot, Globe, BarChart3, MoreHorizontal, X, Brain, FolderKanban, Database, FileText, Palette, DollarSign, MessageSquare, Settings } from 'lucide-react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

const PRIMARY_TABS = [
  { id: 'Mission Control', icon: Target, label: 'Mission' },
  { id: 'Live Agents', icon: Bot, label: 'Agents' },
  { id: 'Live Browser', icon: Globe, label: 'Browser' },
  { id: 'Analytics', icon: BarChart3, label: 'Analytics' },
] as const;

const MORE_TABS = [
  { id: 'KAMI', icon: Brain, label: 'KAMI', desc: 'AI Assistant' },
  { id: 'Projects', icon: FolderKanban, label: 'Projects', desc: 'Manage work' },
  { id: 'Sources', icon: Database, label: 'Sources', desc: 'Data feeds' },
  { id: 'Files', icon: FileText, label: 'Files', desc: 'Documents' },
  { id: 'Studio', icon: Palette, label: 'Studio', desc: 'Create & design' },
  { id: 'Revenue', icon: DollarSign, label: 'Revenue', desc: 'Financials' },
  { id: 'Comms', icon: MessageSquare, label: 'Comms', desc: 'Messages' },
  { id: 'Settings', icon: Settings, label: 'Settings', desc: 'Configuration' },
] as const;

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
          <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowMore(false)} />
          <div className="fixed bottom-[56px] left-0 right-0 z-50 rounded-t-2xl overflow-hidden animate-slide-up"
            style={{ background: 'rgba(8,8,10,0.98)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,107,0,0.2)' }}>
            {/* Handle bar */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-8 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF6B00', boxShadow: '0 0 6px rgba(255,107,0,0.5)' }} />
                <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#FF8C00' }}>More Tabs</span>
              </div>
              <button onClick={() => setShowMore(false)} className="p-1 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {/* Grid */}
            <div className="grid grid-cols-4 gap-2.5 p-4">
              {MORE_TABS.map(({ id, icon: Icon, label, desc }) => {
                const isActive = activeTab === id;
                return (
                  <button key={id}
                    onClick={() => { onTabChange(id); setShowMore(false); }}
                    className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all min-h-[72px] relative group"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(255,107,0,0.05))'
                        : 'rgba(255,255,255,0.03)',
                      border: isActive
                        ? '1px solid rgba(255,107,0,0.4)'
                        : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive ? '0 0 12px rgba(255,107,0,0.1)' : 'none',
                    }}>
                    <Icon className="w-5 h-5 transition-colors" style={{ color: isActive ? '#FF8C00' : '#666' }} />
                    <span className="text-[10px] font-semibold leading-tight" style={{ color: isActive ? '#FF8C00' : '#999' }}>{label}</span>
                    <span className="text-[8px] leading-tight" style={{ color: isActive ? 'rgba(255,140,0,0.6)' : '#444' }}>{desc}</span>
                    {isActive && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ background: '#FF6B00' }} />
                    )}
                  </button>
                );
              })}
            </div>
            {/* Safe area */}
            <div className="h-[env(safe-area-inset-bottom,0px)]" />
          </div>
        </>
      )}

      {/* Tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-end"
        style={{ background: 'rgba(6,6,8,0.98)', borderTop: '1px solid rgba(255,107,0,0.15)' }}>
        <div className="w-full">
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
              <MoreHorizontal className="w-5 h-5" style={{ color: !isPrimaryActive || showMore ? '#FF8C00' : '#555' }} />
              <span className="text-[9px] font-medium" style={{ color: !isPrimaryActive || showMore ? '#FF8C00' : '#555' }}>More</span>
              {(!isPrimaryActive || showMore) && <div className="w-4 h-0.5 rounded-full mt-0.5" style={{ background: '#FF6B00' }} />}
            </button>
          </div>
          <div className="h-[env(safe-area-inset-bottom,0px)]" />
        </div>
      </div>
    </>
  );
};

export default MobileTabBar;
