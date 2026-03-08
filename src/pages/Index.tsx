import { useState, useEffect, useCallback } from 'react';
import { TERMINAL_MESSAGES } from '@/data/dashboardData';
import { useApiConnection, usePolledData } from '@/hooks/useApiConnection';
import { api, mockData } from '@/services/apiService';
import type { ApiLogEntry, ApiAgent, ApiMissionsResponse, ApiFile, ApiManifest } from '@/services/apiService';
import LeftPanel from '@/components/dashboard/LeftPanel';
import RightPanel from '@/components/dashboard/RightPanel';
import BottomBar from '@/components/dashboard/BottomBar';
import TabNav from '@/components/dashboard/TabNav';
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
        try {
          const data = await api.getTerminal();
          setLogs(data);
        } catch { /* keep existing */ }
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

  const isStudio = activeTab === 'Studio';
  const [leftOverlay, setLeftOverlay] = useState(false);
  const [rightOverlay, setRightOverlay] = useState(false);

  // Close overlays when leaving studio or clicking canvas
  useEffect(() => {
    if (!isStudio) { setLeftOverlay(false); setRightOverlay(false); }
  }, [isStudio]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col relative noise-overlay"
      style={{ borderTop: '1px solid rgba(255,107,0,0.2)' }}
      onClick={() => { if (isStudio) { setLeftOverlay(false); setRightOverlay(false); } }}>
      <div className="mesh-gradient-bg">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left panel — slides off when Studio active */}
        <div className="relative flex-shrink-0 transition-all duration-300 ease-in-out overflow-visible"
          style={{ width: isStudio ? 0 : undefined, marginLeft: isStudio ? -280 : 0 }}>
          <LeftPanel isConnected={isConnected} />
        </div>

        {/* Left edge strip in Studio mode */}
        {isStudio && !leftOverlay && (
          <div
            className="absolute left-0 top-0 bottom-0 z-30 flex items-center cursor-pointer group"
            style={{ width: 24 }}
            onClick={e => { e.stopPropagation(); setLeftOverlay(true); }}
            title="Click to temporarily show KAMI panel"
          >
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(8,8,11,0.6)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-[9px] text-muted-foreground group-hover:text-[#FF8C00] transition-colors whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>◀ KAMI</span>
            </div>
          </div>
        )}

        {/* Left overlay panel in Studio */}
        {isStudio && leftOverlay && (
          <div className="absolute left-0 top-0 bottom-0 z-40 animate-slide-in-left" onClick={e => e.stopPropagation()}
            style={{ width: 260, boxShadow: '4px 0 24px rgba(0,0,0,0.5)' }}>
            <LeftPanel isConnected={isConnected} />
          </div>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} isConnected={isConnected} fileBadge={files.length} />
          <div className={`flex-1 overflow-y-auto ${isStudio ? 'p-0' : 'p-6'} tab-fade-in`} key={activeTab}>
            {renderTab()}
          </div>
        </main>

        {/* Right panel — slides off when Studio active */}
        <div className="relative flex-shrink-0 transition-all duration-300 ease-in-out overflow-visible"
          style={{ width: isStudio ? 0 : undefined, marginRight: isStudio ? -320 : 0 }}>
          <RightPanel logs={logs} />
        </div>

        {/* Right edge strip in Studio mode */}
        {isStudio && !rightOverlay && (
          <div
            className="absolute right-0 top-0 bottom-0 z-30 flex items-center cursor-pointer group"
            style={{ width: 24 }}
            onClick={e => { e.stopPropagation(); setRightOverlay(true); }}
            title="Click to temporarily show Terminal panel"
          >
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(8,8,11,0.6)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-[9px] text-muted-foreground group-hover:text-[#FF8C00] transition-colors whitespace-nowrap"
                style={{ writingMode: 'vertical-rl' }}>TERM ▶</span>
            </div>
          </div>
        )}

        {/* Right overlay panel in Studio */}
        {isStudio && rightOverlay && (
          <div className="absolute right-0 top-0 bottom-0 z-40 animate-slide-in-right" onClick={e => e.stopPropagation()}
            style={{ width: 320, boxShadow: '-4px 0 24px rgba(0,0,0,0.5)' }}>
            <RightPanel logs={logs} />
          </div>
        )}
      </div>

      <BottomBar
        runtime={runtime}
        isConnected={isConnected}
        missions={missions}
        onStop={async () => {
          if (isConnected) {
            try { await api.stopMission(); } catch {}
          }
        }}
      />
    </div>
  );
};

export default Index;
