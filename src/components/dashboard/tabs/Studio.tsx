import { useState } from 'react';
import { Download, Palette, RefreshCw, PanelLeftClose, PanelRightClose, Maximize2 } from 'lucide-react';
import StudioImageTab from './studio/StudioImageTab';
import StudioWebTab from './studio/StudioWebTab';

const Studio = () => {
  const [subTab, setSubTab] = useState<'image' | 'web'>('image');
  const [imgLeftOpen, setImgLeftOpen] = useState(true);
  const [imgRightOpen, setImgRightOpen] = useState(true);
  const [webLeftOpen, setWebLeftOpen] = useState(true);
  const [webRightOpen, setWebRightOpen] = useState(true);

  const leftOpen = subTab === 'image' ? imgLeftOpen : webLeftOpen;
  const rightOpen = subTab === 'image' ? imgRightOpen : webRightOpen;
  const toggleLeft = () => subTab === 'image' ? setImgLeftOpen(p => !p) : setWebLeftOpen(p => !p);
  const toggleRight = () => subTab === 'image' ? setImgRightOpen(p => !p) : setWebRightOpen(p => !p);

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ background: 'rgba(8,8,11,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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

        <div className="flex items-center gap-1.5">
          <button onClick={toggleLeft} className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors" title="Toggle left panel">
            <PanelLeftClose className={`w-3.5 h-3.5 transition-colors ${leftOpen ? 'text-muted-foreground' : 'text-[#FF8C00]'}`} />
          </button>
          <button onClick={toggleRight} className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors" title="Toggle right panel">
            <PanelRightClose className={`w-3.5 h-3.5 transition-colors ${rightOpen ? 'text-muted-foreground' : 'text-[#FF8C00]'}`} />
          </button>
          <div className="w-px h-4 bg-[rgba(255,255,255,0.06)]" />
          {subTab === 'image' && (
            <>
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
          )}
          <button className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors text-muted-foreground hover:text-foreground" title="Fullscreen">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {subTab === 'image' ? (
          <StudioImageTab leftOpen={imgLeftOpen} rightOpen={imgRightOpen} onToggleLeft={() => setImgLeftOpen(p => !p)} onToggleRight={() => setImgRightOpen(p => !p)} />
        ) : (
          <StudioWebTab leftOpen={webLeftOpen} rightOpen={webRightOpen} onToggleLeft={() => setWebLeftOpen(p => !p)} onToggleRight={() => setWebRightOpen(p => !p)} />
        )}
      </div>
    </div>
  );
};

export default Studio;
