import { useState } from 'react';
import { Download, Palette, RefreshCw, Maximize2, PanelLeftClose, PanelRightClose, X, Share2, Upload, Monitor, Tablet, Smartphone } from 'lucide-react';
import StudioImageTab from './studio/StudioImageTab';
import StudioWebTab from './studio/StudioWebTab';

const Studio = () => {
  const [subTab, setSubTab] = useState<'image' | 'web'>('image');
  const [showImgControls, setShowImgControls] = useState(false);
  const [showImgHistory, setShowImgHistory] = useState(false);
  const [showWebChat, setShowWebChat] = useState(false);
  const [showWebFiles, setShowWebFiles] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Top strip — always visible */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: 'rgba(8,8,11,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Left: sub-tab pills */}
        <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <button onClick={() => setSubTab('image')}
            className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-all"
            style={subTab === 'image' ? { background: 'rgba(255,255,255,0.1)', color: '#fff' } : { color: 'hsl(var(--muted-foreground))' }}>
            🖼️ Image Studio
          </button>
          <button onClick={() => setSubTab('web')}
            className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-all"
            style={subTab === 'web' ? { background: 'rgba(255,255,255,0.1)', color: '#fff' } : { color: 'hsl(var(--muted-foreground))' }}>
            🌐 Web Builder
          </button>
        </div>

        {/* Right: context-specific actions */}
        <div className="flex items-center gap-1.5">
          {subTab === 'image' ? (
            <>
              <button onClick={() => setShowImgControls(p => !p)}
                className="px-2 py-1 rounded text-[10px] font-medium transition-all flex items-center gap-1"
                style={showImgControls ? { background: 'rgba(255,107,0,0.12)', color: '#FF8C00' } : { color: 'hsl(var(--muted-foreground))' }}>
                <PanelLeftClose className="w-3.5 h-3.5" /> Controls
              </button>
              <button onClick={() => setShowImgHistory(p => !p)}
                className="px-2 py-1 rounded text-[10px] font-medium transition-all flex items-center gap-1"
                style={showImgHistory ? { background: 'rgba(255,107,0,0.12)', color: '#FF8C00' } : { color: 'hsl(var(--muted-foreground))' }}>
                <PanelRightClose className="w-3.5 h-3.5" /> History
              </button>
              <div className="w-px h-4 bg-[rgba(255,255,255,0.06)]" />
              <button className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors text-muted-foreground hover:text-foreground" title="Download">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[#FF8C00]" title="Brand Asset">
                <Palette className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors text-muted-foreground hover:text-foreground" title="Regenerate">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowWebChat(p => !p)}
                className="px-2 py-1 rounded text-[10px] font-medium transition-all flex items-center gap-1"
                style={showWebChat ? { background: 'rgba(255,107,0,0.12)', color: '#FF8C00' } : { color: 'hsl(var(--muted-foreground))' }}>
                <PanelLeftClose className="w-3.5 h-3.5" /> Chat
              </button>
              <button onClick={() => setShowWebFiles(p => !p)}
                className="px-2 py-1 rounded text-[10px] font-medium transition-all flex items-center gap-1"
                style={showWebFiles ? { background: 'rgba(255,107,0,0.12)', color: '#FF8C00' } : { color: 'hsl(var(--muted-foreground))' }}>
                <PanelRightClose className="w-3.5 h-3.5" /> Files
              </button>
              <div className="w-px h-4 bg-[rgba(255,255,255,0.06)]" />
              <button className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors flex items-center gap-1">
                <Share2 className="w-3 h-3" /> Share
              </button>
              <button className="text-[10px] font-medium px-3 py-1 rounded transition-colors flex items-center gap-1"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <Upload className="w-3 h-3" /> Publish
              </button>
            </>
          )}
          <div className="w-px h-4 bg-[rgba(255,255,255,0.06)]" />
          <button className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors text-muted-foreground hover:text-foreground" title="Fullscreen">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content — canvas is always full, panels float */}
      <div className="flex-1 overflow-hidden relative">
        {subTab === 'image' ? (
          <StudioImageTab
            showControls={showImgControls}
            showHistory={showImgHistory}
            onCloseControls={() => setShowImgControls(false)}
            onCloseHistory={() => setShowImgHistory(false)}
          />
        ) : (
          <StudioWebTab
            showChat={showWebChat}
            showFiles={showWebFiles}
            onCloseChat={() => setShowWebChat(false)}
            onCloseFiles={() => setShowWebFiles(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Studio;
