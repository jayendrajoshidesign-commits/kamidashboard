import { useState } from 'react';
import { Upload, Download, FileText, FileSpreadsheet, Image, FileJson, File } from 'lucide-react';
import { FILES_UPLOADED, FILES_GENERATED, AGENTS, AGENT_COLORS } from '@/data/dashboardData';

const FILE_ICONS: Record<string, { icon: any; color: string }> = {
  markdown: { icon: FileText, color: 'text-muted-foreground' },
  csv: { icon: FileSpreadsheet, color: 'text-neon-green' },
  image: { icon: Image, color: 'text-neon-cyan' },
  json: { icon: FileJson, color: 'text-neon-yellow' },
  excel: { icon: FileSpreadsheet, color: 'text-neon-green' },
};

const FILE_EXT_COLORS: Record<string, string> = {
  pdf: 'border-l-[hsl(0,84%,60%)]',
  csv: 'border-l-[hsl(142,71%,45%)]',
};

const AGENT_BORDER_COLORS: Record<string, string> = {
  'Market Research': 'hsl(187,86%,43%)',
  'Sales': 'hsl(142,71%,45%)',
  'Marketing': 'hsl(330,80%,60%)',
  'Design': 'hsl(263,70%,58%)',
  'Finance': '#84cc16',
};

const FilesTab = () => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        className={`glass-card p-8 border-2 border-dashed text-center transition-all ${dragOver ? 'border-primary bg-primary/5 neon-glow-purple' : 'border-border-light'}`}
        style={dragOver ? { borderStyle: 'solid' } : undefined}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
      >
        <Upload className={`w-8 h-8 mx-auto mb-3 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-sm text-muted-foreground">Drag & drop files here, or click to browse</p>
        <p className="text-[11px] text-muted-foreground/60 mt-1">PDF, CSV, images, documents</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Uploaded */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">📤 Uploaded Files</h3>
          <div className="space-y-3">
            {FILES_UPLOADED.map((f, i) => {
              const ext = f.name.split('.').pop() || '';
              const iconColor = ext === 'pdf' ? 'text-neon-red' : ext === 'csv' ? 'text-neon-green' : 'text-primary';
              return (
                <div key={i} className="glass-card p-4 flex items-center gap-3" style={{ borderLeft: `3px solid ${ext === 'pdf' ? 'hsl(0,84%,60%)' : 'hsl(142,71%,45%)'}` }}>
                  <File className={`w-8 h-8 ${iconColor} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.size}</div>
                  </div>
                  <select className="bg-muted/50 border border-border/50 rounded px-2 py-1 text-[11px] text-muted-foreground outline-none">
                    {AGENTS.map(a => (
                      <option key={a.id} selected={a.name === f.agent}>{a.name}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generated */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">📥 Generated Files</h3>
          <div className="space-y-3">
            {FILES_GENERATED.map((f, i) => {
              const fi = FILE_ICONS[f.type] || { icon: FileText, color: 'text-muted-foreground' };
              const Icon = fi.icon;
              const borderColor = AGENT_BORDER_COLORS[f.agent] || 'hsl(var(--muted))';
              return (
                <div key={i} className="glass-card p-4 flex items-center gap-3" style={{ borderLeft: `3px solid ${borderColor}` }}>
                  <Icon className={`w-8 h-8 ${fi.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.size} · {f.agent} · {f.time}</div>
                  </div>
                  <button className="p-1.5 rounded text-neon-cyan hover:bg-neon-cyan/10 transition-colors neon-glow-cyan">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button className="glass-card px-4 py-2.5 text-sm font-semibold text-neon-cyan flex items-center gap-2 hover:bg-neon-cyan/10 transition-colors mx-auto neon-glow-cyan">
        <Download className="w-4 h-4" /> Download All as ZIP
      </button>
    </div>
  );
};

export default FilesTab;
