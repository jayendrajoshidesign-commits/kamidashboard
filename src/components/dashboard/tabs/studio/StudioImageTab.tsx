import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Check, Download, Rocket, RefreshCw, Palette, Star, ZoomIn, ZoomOut, Maximize2, Grid3X3 } from 'lucide-react';

const STYLES = [
  { name: 'Photorealistic', icon: '📷', gradient: 'from-blue-950/40 to-slate-900/30' },
  { name: 'Illustration', icon: '🎨', gradient: 'from-purple-950/40 to-pink-950/30' },
  { name: 'Diagram', icon: '📊', gradient: 'from-teal-950/40 to-cyan-950/30' },
  { name: 'Logo', icon: '✦', gradient: 'from-amber-950/40 to-yellow-950/30' },
  { name: 'UI Mockup', icon: '🖥', gradient: 'from-indigo-950/40 to-violet-950/30' },
  { name: 'Abstract', icon: '◈', gradient: 'from-rose-950/30 to-orange-950/30' },
];

const EXAMPLE_PROMPTS = [
  'Product mockup on dark background',
  'Abstract geometric logo design',
  'Minimal SaaS dashboard UI',
];

interface Props {
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

const StudioImageTab = ({ leftOpen, rightOpen, onToggleLeft, onToggleRight }: Props) => {
  const [selectedStyle, setSelectedStyle] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [provider, setProvider] = useState('Local SD');
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(300, Math.max(50, prev + (e.deltaY > 0 ? -10 : 10))));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      setIsPanning(true);
      panStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  }, [panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  return (
    <div className="flex h-full relative">
      {/* Left Panel */}
      <div
        className="flex-shrink-0 overflow-hidden transition-all duration-250 ease-in-out relative"
        style={{ width: leftOpen ? 220 : 0 }}
      >
        <div className="w-[220px] h-full overflow-y-auto p-3 space-y-4" style={{ background: 'rgba(8,8,11,0.9)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          {/* PROMPT */}
          <div>
            <label className="section-header block mb-2">Prompt</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full rounded-lg p-2.5 text-xs text-foreground resize-none outline-none placeholder:text-muted-foreground focus-glow-purple"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', minHeight: 80, maxHeight: 200 }}
                placeholder="Describe the image you want to create..."
              />
              <span className="absolute bottom-1.5 right-2 text-[9px] text-muted-foreground">{prompt.length}</span>
            </div>
          </div>

          {/* STYLE */}
          <div>
            <label className="section-header block mb-2">Style</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map(s => (
                <button
                  key={s.name}
                  onClick={() => setSelectedStyle(s.name)}
                  className={`glass-card-static p-2 flex flex-col items-center gap-1 text-center relative overflow-hidden bg-gradient-to-br ${s.gradient} transition-all duration-200 hover:border-[rgba(255,107,0,0.2)]`}
                  style={{
                    width: 64, height: 64,
                    borderColor: selectedStyle === s.name ? 'rgba(255,107,0,0.4)' : undefined,
                    boxShadow: selectedStyle === s.name ? '0 0 12px rgba(255,107,0,0.15)' : undefined,
                  }}
                >
                  {selectedStyle === s.name && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-pink)))' }}>
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  )}
                  <span className="text-[22px] leading-none">{s.icon}</span>
                  <span className="text-[9px] text-muted-foreground leading-tight">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ASPECT RATIO */}
          <div>
            <label className="section-header block mb-2">Aspect Ratio</label>
            <div className="flex gap-1.5">
              {['16:9', '1:1', '9:16'].map(r => (
                <button key={r} onClick={() => setAspectRatio(r)}
                  className="flex-1 py-1.5 rounded text-[11px] font-medium transition-all"
                  style={aspectRatio === r
                    ? { background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-pink)))', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.03)', color: 'hsl(var(--muted-foreground))', border: '1px solid rgba(255,255,255,0.05)' }
                  }>{r}</button>
              ))}
            </div>
          </div>

          {/* PROVIDER */}
          <div>
            <label className="section-header block mb-2">Provider</label>
            <div className="flex gap-1.5">
              {['Local SD', 'Gemini', 'DALL-E'].map(p => (
                <button key={p} onClick={() => setProvider(p)}
                  className="flex-1 py-1.5 rounded text-[10px] font-medium transition-all"
                  style={provider === p
                    ? { background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-pink)))', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.03)', color: 'hsl(var(--muted-foreground))', border: '1px solid rgba(255,255,255,0.05)' }
                  }>{p}</button>
              ))}
            </div>
          </div>

          {/* GENERATE */}
          <button onClick={handleGenerate} disabled={generating}
            className="w-full text-primary-foreground py-2.5 rounded-lg text-sm font-bold mission-pulse-btn transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-pink)))' }}>
            {generating ? '⏳ Generating...' : <><span>✦</span> GENERATE</>}
          </button>
        </div>
      </div>

      {/* Left collapse toggle */}
      <button
        onClick={onToggleLeft}
        className="absolute top-1/2 -translate-y-1/2 z-20 w-5 h-10 flex items-center justify-center rounded-r transition-all hover:bg-[rgba(255,107,0,0.1)]"
        style={{
          left: leftOpen ? 220 : 0,
          background: 'rgba(10,10,14,0.9)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeft: leftOpen ? 'none' : undefined,
          transition: 'left 0.25s ease',
        }}
      >
        <span className="text-[10px] text-muted-foreground">{leftOpen ? '‹' : '›'}</span>
      </button>

      {/* CENTER CANVAS */}
      <div
        ref={canvasRef}
        className={`flex-1 relative overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ background: '#060608' }}
      >
        {/* Dot grid */}
        {showGrid && (
          <div className="canvas-bg absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            transform: `translate(${panOffset.x % 24}px, ${panOffset.y % 24}px)`,
          }} />
        )}

        {/* Canvas content */}
        <div className="absolute inset-0 flex items-center justify-center" style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
          transition: isPanning ? 'none' : 'transform 0.1s ease',
        }}>
          {/* Empty state */}
          <div className="text-center select-none pointer-events-auto">
            <Camera className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.12)' }} />
            <p className="text-sm text-muted-foreground mb-1">Your canvas is empty</p>
            <p className="text-[11px] text-muted-foreground/60 mb-5">Select a style and click Generate</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {EXAMPLE_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => setPrompt(p)}
                  className="text-[10px] px-3 py-1.5 rounded-full transition-all hover:border-[rgba(255,107,0,0.3)]"
                  style={{ background: 'rgba(255,107,0,0.06)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.15)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas toolbar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-full z-10"
          style={{ background: 'rgba(10,10,14,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors">
            <ZoomOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <span className="text-[10px] text-muted-foreground font-mono w-8 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(300, z + 10))} className="p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors">
            <ZoomIn className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <div className="w-px h-4 bg-[rgba(255,255,255,0.08)] mx-1" />
          <button onClick={() => { setZoom(100); setPanOffset({ x: 0, y: 0 }); }} className="p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors">
            <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <div className="w-px h-4 bg-[rgba(255,255,255,0.08)] mx-1" />
          <button onClick={() => setShowGrid(!showGrid)} className="p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors">
            <Grid3X3 className={`w-3.5 h-3.5 ${showGrid ? 'text-[#FF8C00]' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>

      {/* Right collapse toggle */}
      <button
        onClick={onToggleRight}
        className="absolute top-1/2 -translate-y-1/2 z-20 w-5 h-10 flex items-center justify-center rounded-l transition-all hover:bg-[rgba(255,107,0,0.1)]"
        style={{
          right: rightOpen ? 180 : 0,
          background: 'rgba(10,10,14,0.9)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRight: rightOpen ? 'none' : undefined,
          transition: 'right 0.25s ease',
        }}
      >
        <span className="text-[10px] text-muted-foreground">{rightOpen ? '›' : '‹'}</span>
      </button>

      {/* Right Panel */}
      <div
        className="flex-shrink-0 overflow-hidden transition-all duration-250 ease-in-out"
        style={{ width: rightOpen ? 180 : 0 }}
      >
        <div className="w-[180px] h-full overflow-y-auto p-3 space-y-4" style={{ background: 'rgba(8,8,11,0.9)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          {/* HISTORY */}
          <div>
            <label className="section-header block mb-2">History</label>
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="group relative rounded-lg overflow-hidden cursor-pointer" style={{ height: 100 }}>
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, rgba(${80 + i * 30},${40 + i * 15},0,0.15), rgba(${60 + i * 20},${30 + i * 10},0,0.08))` }}>
                    <Camera className="w-5 h-5 text-muted-foreground/20" />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium px-2 py-1 rounded" style={{ background: 'rgba(255,107,0,0.3)' }}>Use this</span>
                  </div>
                  <span className="absolute bottom-1 left-1.5 text-[8px] text-muted-foreground/50">Slot {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div>
            <label className="section-header block mb-2">Info</label>
            <div className="space-y-1.5 text-[10px]">
              {[
                ['Last generated', '—'],
                ['Model', provider],
                ['Resolution', aspectRatio === '16:9' ? '1920×1080' : aspectRatio === '1:1' ? '1024×1024' : '1080×1920'],
                ['Gen time', '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioImageTab;
