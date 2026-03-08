import { useState, useEffect, useRef, useCallback } from 'react';
import { TERMINAL_MESSAGES } from '@/data/dashboardData';
import LeftPanel from '@/components/dashboard/LeftPanel';
import RightPanel from '@/components/dashboard/RightPanel';
import BottomBar from '@/components/dashboard/BottomBar';
import TabNav from '@/components/dashboard/TabNav';
import MissionControl from '@/components/dashboard/tabs/MissionControl';
import LiveAgents from '@/components/dashboard/tabs/LiveAgents';
import LiveBrowser from '@/components/dashboard/tabs/LiveBrowser';
import Sources from '@/components/dashboard/tabs/Sources';
import Studio from '@/components/dashboard/tabs/Studio';
import FilesTab from '@/components/dashboard/tabs/FilesTab';
import Analytics from '@/components/dashboard/tabs/Analytics';
import SettingsTab from '@/components/dashboard/tabs/SettingsTab';

const TABS = ['Mission Control', 'Live Agents', 'Live Browser', 'Sources', 'Studio', 'Files', 'Analytics', 'Settings'] as const;
type TabId = typeof TABS[number];

export interface LogEntry {
  time: string;
  msg: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('Mission Control');
  const [seconds, setSeconds] = useState(863);
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '10:42:01', msg: '[Supervisor] System core initialized', type: 'info' },
    { time: '10:42:02', msg: '[Supervisor] Connecting to vector DB...', type: 'info' },
    { time: '10:42:03', msg: '[Supervisor] DB Connection established', type: 'success' },
    { time: '10:42:05', msg: '[COO] High latency on Node-3 (142ms)', type: 'warn' },
    { time: '10:42:08', msg: '[Supervisor] Task #402 assigned to Market Research', type: 'info' },
    { time: '10:42:15', msg: '[Market Research] Beginning competitor scan...', type: 'info' },
    { time: '10:42:18', msg: '[Market Research] Scraping freshbooks.com/pricing', type: 'info' },
    { time: '10:43:01', msg: '[Design] Generating hero section assets...', type: 'info' },
    { time: '10:43:05', msg: '[Design] Asset generation complete', type: 'success' },
  ]);

  // Runtime timer
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Terminal auto-log
  useEffect(() => {
    const interval = setInterval(() => {
      const entry = TERMINAL_MESSAGES[Math.floor(Math.random() * TERMINAL_MESSAGES.length)];
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [...prev.slice(-50), { time, msg: entry.msg, type: entry.type as LogEntry['type'] }]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const runtime = `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  const renderTab = useCallback(() => {
    switch (activeTab) {
      case 'Mission Control': return <MissionControl />;
      case 'Live Agents': return <LiveAgents />;
      case 'Live Browser': return <LiveBrowser />;
      case 'Sources': return <Sources />;
      case 'Studio': return <Studio />;
      case 'Files': return <FilesTab />;
      case 'Analytics': return <Analytics />;
      case 'Settings': return <SettingsTab />;
    }
  }, [activeTab]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col relative">
      {/* Animated mesh gradient background */}
      <div className="mesh-gradient-bg">
        <div className="mesh-orb mesh-orb-purple" />
        <div className="mesh-orb mesh-orb-cyan" />
        <div className="mesh-orb mesh-orb-pink" />
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        <LeftPanel />

        <main className="flex-1 flex flex-col overflow-hidden">
          <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-y-auto p-6 tab-fade-in" key={activeTab}>
            {renderTab()}
          </div>
        </main>

        <RightPanel logs={logs} />
      </div>

      <BottomBar runtime={runtime} />
    </div>
  );
};

export default Index;
