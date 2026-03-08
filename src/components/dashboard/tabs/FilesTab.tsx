import { useState, useRef } from 'react';
import { Upload, Download, FileText, FileSpreadsheet, Image, FileJson, File } from 'lucide-react';
import { AGENTS, AGENT_COLORS } from '@/data/dashboardData';
import { api } from '@/services/apiService';
import type { ApiFile } from '@/services/apiService';

const FILE_ICONS: Record<string, { icon: any; color: string }> = {
  markdown: { icon: FileText, color: 'text-muted-foreground' },
  csv: { icon: FileSpreadsheet, color: 'text-neon-green' },
  image: { icon: Image, color: 'text-neon-cyan' },
  json: { icon: FileJson, color: 'text-neon-yellow' },
  excel: { icon: FileSpreadsheet, color: 'text-neon-green' },
  pdf: { icon: FileText, color: 'text-neon-red' },
};

const AGENT_BORDER_COLORS: Record<string, string> = {
  'Market Research': '#FF8C00',
  'Sales': 'hsl(142,71%,45%)',
  'Marketing': '#FF4500',
  'Design': '#FF6B00',
  'Finance': '#84cc16',
};

interface Props {
  files: ApiFile[];
  isConnected: boolean;
}

const FilesTab = ({ files, isConnected }: Props) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploaded = files.filter(f => f.category === 'uploaded');
  const generated = files.filter(f => f.category === 'generated');

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || !isConnected) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await api.uploadFile(file);
      }
    } catch {}
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-6">
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
      <div
        className={`glass-card p-8 border-2 border-dashed text-center transition-all cursor-pointer ${dragOver ? 'border-primary bg-primary/5 neon-glow-purple' : 'border-border-light'}`}
        style={dragOver ? { borderStyle: 'solid' } : undefined}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
      >
        <Upload className={`w-8 h-8 mx-auto mb-3 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-sm text-muted-foreground">
          {uploading ? 'Uploading...' : 'Drag & drop files here, or click to browse'}
        </p>
        <p className="text-[11px] text-muted-foreground/60 mt-1">PDF, CSV, images, documents</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">📤 Uploaded Files</h3>
          <div className="space-y-3">
            {uploaded.map((f, i) => {
              const ext = f.name.split('.').pop() || '';
              const iconColor = ext === 'pdf' ? 'text-neon-red' : ext === 'csv' ? 'text-neon-green' : 'text-primary';
              return (
                <div key={i} className="glass-card p-4 flex items-center gap-3" style={{ borderLeft: `3px solid ${ext === 'pdf' ? 'hsl(0,84%,60%)' : 'hsl(142,71%,45%)'}` }}>
                  <File className={`w-8 h-8 ${iconColor} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.size}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{f.agent}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">📥 Generated Files</h3>
          <div className="space-y-3">
            {generated.map((f, i) => {
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
                  <button className="p-1.5 rounded transition-colors neon-glow-cyan" style={{ color: '#FF8C00' }}>
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button className="glass-card px-4 py-2.5 text-sm font-semibold flex items-center gap-2 transition-colors mx-auto neon-glow-cyan" style={{ color: '#FF8C00' }}>
        <Download className="w-4 h-4" /> Download All as ZIP
      </button>
    </div>
  );
};

export default FilesTab;
