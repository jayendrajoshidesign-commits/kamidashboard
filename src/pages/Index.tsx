import { useState, useEffect, useCallback } from 'react';
import { TERMINAL_MESSAGES } from '@/data/dashboardData';
import { useApiConnection, usePolledData } from '@/hooks/useApiConnection';
import { api, mockData } from '@/services/apiService';
import type { ApiLogEntry, ApiAgent, ApiMissionsResponse, ApiFile, ApiManifest } from '@/services/apiService';
import { useResponsive } from '@/hooks/useResponsive';
import LeftPanel from '@/components/dashboard/LeftPanel';
import RightPanel from '@/components/dashboard/RightPanel';
import BottomBar from '@/components/dashboard/BottomBar';
import TabNav from '@/components/dashboard/TabNav';
import MobileTabBar from '@/components/dashboard/MobileTabBar';
import MissionControl from '@/components/dashboard/tabs/MissionControl';
import KamiTab from '@/components/dashboard/tabs/KamiTab';
import ProjectsTab from '@/components/dashboard/tabs/ProjectsTab';
import LiveAgents from '@/components/dashboard/tabs/LiveAgents';
import LiveBrowser from '@/components/dashboard/tabs/LiveBrowser';
import Sources from '@/components/dashboard/tabs/Sources';
import Studio from '@/components/dashboard/tabs/Studio';
import FilesTab from '@/components/dashboard/tabs/FilesTab';
import Analytics from '@/components/dashboard/tabs/Analytics';
import SettingsTab from '@/components/dashboard/tabs/SettingsTab';
import Revenue from '@/components/dashboard/tabs/Revenue';
import Comms from '@/components/dashboard/tabs/Comms';
import { Menu, Terminal, X } from 'lucide-react';

const TABS = ['Mission Control', 'KAMI', 'Projects', 'Live Agents', 'Live Browser', 'Sources', 'Analytics', 'Files', 'Studio', 'Revenue', 'Comms', 'Settings'] as const;
type TabId = typeof TABS[number];

export interface LogEntry {
  time: string;
  msg: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('Mission Control');
  const [seconds, setSeconds] = useState(863);
  const { isConnected } = useApiConnection();
  const [logs, setLogs] = useState<LogEntry[]>(mockData.terminal());
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Panel overlay states for tablet/mobile
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(() => {
        const entry = TERMINAL_MESSAGES[Math.floor(Math.random() * TERMINAL_MESSAGES.length)];
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev.slice(-50), { time, msg: entry.msg, type: entry.type as LogEntry['type'] }]);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      const poll = async () => {
        try { const data = await api.getTerminal(); setLogs(data); } catch {}
      };
      poll();
      const interval = setInterval(poll, 2000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const { data: agents } = usePolledData(api.getAgents, mockData.agents, 3000, isConnected);
  const { data: missions } = usePolledData(api.getMissions, mockData.missions, 5000, isConnected);
  const { data: files } = usePolledData(api.getFiles, mockData.files, 10000, isConnected);
  const { data: manifest } = usePolledData(api.getManifest, mockData.manifest, 30000, isConnected);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const runtime = `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  const isStudio = activeTab === 'Studio';
  const [leftOverlay, setLeftOverlay] = useState(false);
  const [rightOverlay, setRightOverlay] = useState(false);

  useEffect(() => {
    if (!isStudio) { setLeftOverlay(false); setRightOverlay(false); }
  }, [isStudio]);

  // Close panel overlays when switching to desktop
  useEffect(() => {
    if (isDesktop) { setShowLeftPanel(false); setShowRightPanel(false); }
  }, [isDesktop]);

  const renderTab = useCallback(() => {
    switch (activeTab) {
      case 'Mission Control': return <MissionControl isConnected={isConnected} missions={missions} />;
      case 'KAMI': return <KamiTab isConnected={isConnected} />;
      case 'Projects': return <ProjectsTab />;
      case 'Live Agents': return <LiveAgents agents={agents} />;
      case 'Live Browser': return <LiveBrowser isConnected={isConnected} />;
      case 'Sources': return <Sources />;
      case 'Studio': return <Studio />;
      case 'Files': return <FilesTab files={files} isConnected={isConnected} />;
      case 'Analytics': return <Analytics missions={missions} />;
      case 'Settings': return <SettingsTab manifest={manifest} />;
      case 'Revenue': return <Revenue />;
      case 'Comms': return <Comms />;
    }
  }, [activeTab, isConnected, agents, missions, files, manifest]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col relative noise-overlay"
      style={{ borderTop: '1px solid rgba(255,107,0,0.2)' }}>
      <div className="mesh-gradient-bg">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
      </div>

      {/* Top nav — desktop & tablet only */}
      {!isMobile && (
        <div className="relative z-20 flex items-center">
          {/* Hamburger for tablet */}
          {isTablet && (
            <button onClick={() => setShowLeftPanel(true)}
              className="flex-shrink-0 p-2.5 z-30 relative"
              style={{ color: '#FF8C00' }}>
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} isConnected={isConnected} fileBadge={files.length} isTablet={isTablet} />
          </div>
          {/* Terminal icon for tablet */}
          {isTablet && (
            <button onClick={() => setShowRightPanel(true)}
              className="flex-shrink-0 p-2.5 z-30 relative font-mono text-xs"
              style={{ color: '#FF8C00' }}>
              <Terminal className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Mobile top bar with hamburger + title + terminal */}
      {isMobile && (
        <div className="relative z-20 flex items-center h-11 px-3 gap-2 flex-shrink-0"
          style={{ background: 'rgba(5,5,7,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => setShowLeftPanel(true)} style={{ color: '#FF8C00' }}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-foreground">KAMI</span>
            <span className="text-[10px] text-muted-foreground ml-2">{activeTab}</span>
          </div>
          <button onClick={() => setShowRightPanel(true)} className="font-mono text-xs" style={{ color: '#FF8C00' }}>
            <Terminal className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main content row */}
      <div className={`flex flex-1 overflow-hidden relative z-10 ${isMobile ? 'pb-[92px]' : ''}`}
        onClick={() => { if (isStudio) { setLeftOverlay(false); setRightOverlay(false); } }}>

        {/* Left panel — desktop only (not studio) */}
        {isDesktop && (
          <div className="flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
            style={{ width: isStudio ? 0 : undefined }}>
            {!isStudio && <LeftPanel isConnected={isConnected} />}
          </div>
        )}

        {/* Left edge strip in Studio (desktop) */}
        {isDesktop && isStudio && !leftOverlay && (
          <div className="flex-shrink-0 flex items-center cursor-pointer group"
            style={{ width: 24, background: 'rgba(8,8,11,0.6)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
            onClick={e => { e.stopPropagation(); setLeftOverlay(true); }}>
            <span className="text-[9px] text-muted-foreground group-hover:text-[#FF8C00] transition-colors mx-auto"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>◀ KAMI</span>
          </div>
        )}

        {/* Left overlay in Studio (desktop) */}
        {isDesktop && isStudio && leftOverlay && (
          <div className="absolute left-0 top-0 bottom-0 z-40 animate-slide-in-left" onClick={e => e.stopPropagation()}
            style={{ width: 260, boxShadow: '4px 0 24px rgba(0,0,0,0.5)' }}>
            <LeftPanel isConnected={isConnected} />
          </div>
        )}

        {/* Main content area */}
        <div className={`flex-1 overflow-hidden ${isStudio ? '' : 'overflow-y-auto'}`}>
          <div className={`h-full ${isStudio ? '' : isMobile ? 'p-3' : 'p-6'} tab-fade-in`} key={activeTab}>
            {renderTab()}
          </div>
        </div>

        {/* Right panel — desktop only (not studio) */}
        {isDesktop && (
          <div className="flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
            style={{ width: isStudio ? 0 : undefined }}>
            {!isStudio && <RightPanel logs={logs} />}
          </div>
        )}

        {/* Right edge strip in Studio (desktop) */}
        {isDesktop && isStudio && !rightOverlay && (
          <div className="flex-shrink-0 flex items-center cursor-pointer group"
            style={{ width: 24, background: 'rgba(8,8,11,0.6)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}
            onClick={e => { e.stopPropagation(); setRightOverlay(true); }}>
            <span className="text-[9px] text-muted-foreground group-hover:text-[#FF8C00] transition-colors mx-auto"
              style={{ writingMode: 'vertical-rl' }}>TERM ▶</span>
          </div>
        )}

        {/* Right overlay in Studio (desktop) */}
        {isDesktop && isStudio && rightOverlay && (
          <div className="absolute right-0 top-0 bottom-0 z-40 animate-slide-in-right" onClick={e => e.stopPropagation()}
            style={{ width: 320, boxShadow: '-4px 0 24px rgba(0,0,0,0.5)' }}>
            <RightPanel logs={logs} />
          </div>
        )}
      </div>

      {/* Tablet/mobile left panel overlay */}
      {!isDesktop && showLeftPanel && (
        <>
          <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowLeftPanel(false)} />
          {isMobile ? (
            /* Mobile: bottom sheet */
            <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-hidden animate-slide-up"
              style={{ height: '80vh', background: 'rgba(8,8,10,0.98)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,107,0,0.15)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-sm font-semibold text-foreground">Agent Status</span>
                <button onClick={() => setShowLeftPanel(false)} className="p-1"><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="h-[calc(100%-48px)] overflow-y-auto">
                <LeftPanel isConnected={isConnected} isMobileSheet />
              </div>
            </div>
          ) : (
            /* Tablet: side overlay */
            <div className="fixed left-0 top-0 bottom-0 z-50 animate-slide-in-left"
              style={{ width: 240, background: 'rgba(8,8,10,0.98)', backdropFilter: 'blur(24px)', boxShadow: '4px 0 24px rgba(0,0,0,0.5)' }}>
              <LeftPanel isConnected={isConnected} />
            </div>
          )}
        </>
      )}

      {/* Tablet/mobile right panel overlay */}
      {!isDesktop && showRightPanel && (
        <>
          <div className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowRightPanel(false)} />
          {isMobile ? (
            <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-hidden animate-slide-up"
              style={{ height: '80vh', background: 'rgba(8,8,10,0.98)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,107,0,0.15)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-sm font-semibold text-foreground">Terminal & System</span>
                <button onClick={() => setShowRightPanel(false)} className="p-1"><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="h-[calc(100%-48px)] overflow-y-auto">
                <RightPanel logs={logs} isMobileSheet />
              </div>
            </div>
          ) : (
            <div className="fixed right-0 top-0 bottom-0 z-50 animate-slide-in-right-full"
              style={{ width: 280, background: 'rgba(8,8,10,0.98)', backdropFilter: 'blur(24px)', boxShadow: '-4px 0 24px rgba(0,0,0,0.5)' }}>
              <RightPanel logs={logs} />
            </div>
          )}
        </>
      )}

      <BottomBar
        runtime={runtime}
        isConnected={isConnected}
        missions={missions}
        isMobile={isMobile}
        onStop={async () => {
          if (isConnected) { try { await api.stopMission(); } catch {} }
        }}
      />

      {/* Mobile bottom tab bar */}
      {isMobile && (
        <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default Index;
