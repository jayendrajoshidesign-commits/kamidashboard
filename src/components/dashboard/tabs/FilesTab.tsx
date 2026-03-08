import { useState, useRef } from 'react';
import { Upload, Download, FileText, FileSpreadsheet, Image, FileJson, File } from 'lucide-react';
import { AGENT_COLORS } from '@/data/dashboardData';
import { api } from '@/services/apiService';
import type { ApiFile } from '@/services/apiService';

const FILE_ICON_COLORS: Record<string, { icon: any; color: string }> = {
  pdf: { icon: FileText, color: '#ef4444' },
  csv: { icon: FileSpreadsheet, color: '#4ade80' },
  image: { icon: Image, color: '#3b82f6' },
  json: { icon: FileJson, color: '#facc15' },
  excel: { icon: FileSpreadsheet, color: '#4ade80' },
  markdown: { icon: FileText, color: '#ffffff' },
};

const AGENT_BORDER: Record<string, string> = {
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
    <div className="space-y-5">
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
      <div
        className={`glass-card p-6 border-2 border-dashed text-center transition-all cursor-pointer ${dragOver ? 'neon-glow-purple' : ''}`}
        style={{
          borderColor: dragOver ? '#FF6B00' : 'rgba(255,107,0,0.3)',
          borderStyle: dragOver ? 'solid' : 'dashed',
          backgroundColor: dragOver ? 'rgba(255,107,0,0.05)' : undefined,
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
      >
        <Upload className="w-7 h-7 mx-auto mb-2" style={{ color: dragOver ? '#FF6B00' : '#666' }} />
        <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Drag & drop files here, or click to browse'}</p>
        <p className="text-[10px] mt-1" style={{ color: '#555' }}>PDF, CSV, Images, Documents</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 heading-cinematic">📤 Uploaded Files</h3>
          <div className="space-y-2">
            {uploaded.map((f, i) => {
              const ext = f.name.split('.').pop() || '';
              const fi = FILE_ICON_COLORS[ext] || FILE_ICON_COLORS[f.type] || { icon: File, color: '#666' };
              const Icon = fi.icon;
              return (
                <div key={i} className="glass-card p-3 flex items-center gap-3 group" style={{ borderLeft: `3px solid ${fi.color}` }}>
                  <Icon className="w-6 h-6 flex-shrink-0" style={{ color: fi.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground heading-cinematic">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">{f.size}</div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{f.agent}</span>
                  <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10" style={{ color: '#FF8C00' }}>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 heading-cinematic">📥 Generated Files</h3>
          <div className="space-y-2">
            {generated.map((f, i) => {
              const fi = FILE_ICON_COLORS[f.type] || { icon: FileText, color: '#666' };
              const Icon = fi.icon;
              const borderColor = AGENT_BORDER[f.agent] || '#555';
              return (
                <div key={i} className="glass-card p-3 flex items-center gap-3 group" style={{ borderLeft: `3px solid ${borderColor}` }}>
                  <Icon className="w-6 h-6 flex-shrink-0" style={{ color: fi.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground heading-cinematic">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">{f.size} · {f.agent} · {f.time}</div>
                  </div>
                  <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10" style={{ color: '#FF8C00' }}>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button className="glass-card px-5 py-2.5 text-sm font-semibold flex items-center gap-2 transition-all mx-auto hover:border-primary/30"
        style={{ color: '#FF8C00', border: '1px solid rgba(255,107,0,0.2)' }}>
        <Download className="w-4 h-4" /> Download All as ZIP
      </button>
    </div>
  );
};

export default FilesTab;
