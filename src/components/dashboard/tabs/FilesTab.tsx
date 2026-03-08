import { useState, useRef } from 'react';
import { Upload, Download, FileText, FileSpreadsheet, Image, FileJson, File, Search } from 'lucide-react';
import { AGENT_COLORS } from '@/data/dashboardData';
import { api } from '@/services/apiService';
import type { ApiFile } from '@/services/apiService';
import { useResponsive } from '@/hooks/useResponsive';

const FILE_ICON_COLORS: Record<string, { icon: any; color: string }> = {
  pdf: { icon: FileText, color: '#ef4444' },
  csv: { icon: FileSpreadsheet, color: '#4ade80' },
  image: { icon: Image, color: '#3b82f6' },
  json: { icon: FileJson, color: '#facc15' },
  excel: { icon: FileSpreadsheet, color: '#4ade80' },
  markdown: { icon: FileText, color: '#ffffff' },
};

const AGENT_BORDER: Record<string, string> = {
  'Market Research': '#22d3ee',
  'Sales': '#4ade80',
  'Marketing': '#f472b6',
  'Design': '#c084fc',
  'Finance': '#86efac',
};

const FILE_TYPES = ['All', 'PDF', 'CSV', 'Images', 'Code', 'Markdown', 'Excel'] as const;

interface Props {
  files: ApiFile[];
  isConnected: boolean;
}

const FilesTab = ({ files, isConnected }: Props) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isMobile } = useResponsive();

  const uploaded = files.filter(f => f.category === 'uploaded');
  const generated = files.filter(f => f.category === 'generated');

  const filterFiles = (list: ApiFile[]) => list.filter(f => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.agent.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter === 'All') return true;
    const typeMap: Record<string, string[]> = {
      'PDF': ['pdf'], 'CSV': ['csv'], 'Images': ['image'], 'Code': ['json'], 'Markdown': ['markdown'], 'Excel': ['excel'],
    };
    return typeMap[typeFilter]?.includes(f.type);
  });

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

  const filteredUploaded = filterFiles(uploaded);
  const filteredGenerated = filterFiles(generated);

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-foreground text-sm outline-none flex-1 placeholder:text-muted-foreground"
            placeholder="Search files..." />
        </div>
      </div>

      {/* Type filters */}
      <div className={`flex gap-2 ${isMobile ? 'overflow-x-auto scrollbar-none' : 'flex-wrap'}`}>
        {FILE_TYPES.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className="text-[11px] px-3 py-1 rounded-full transition-all flex-shrink-0"
            style={typeFilter === t
              ? { background: 'linear-gradient(135deg, #FF6B00, #CC3300)', color: '#fff' }
              : { background: 'rgba(255,255,255,0.03)', color: '#666', border: '1px solid rgba(255,255,255,0.05)' }
            }>
            {t}
          </button>
        ))}
      </div>

      {/* Upload zone */}
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
      <div
        className="glass-card p-6 border-2 border-dashed text-center transition-all cursor-pointer"
        style={{
          borderColor: dragOver ? '#FF6B00' : 'rgba(255,107,0,0.2)',
          borderStyle: dragOver ? 'solid' : 'dashed',
          backgroundColor: dragOver ? 'rgba(255,107,0,0.03)' : undefined,
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
      >
        <Upload className="w-7 h-7 mx-auto mb-2" style={{ color: dragOver ? '#FF6B00' : '#555' }} />
        <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Drag & drop files here, or click to browse'}</p>
        <p className="text-[10px] mt-1" style={{ color: '#444' }}>PDF, CSV, Images, Documents</p>
      </div>

      <div className={`grid gap-5 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">📤 Uploaded Files</h3>
          <div className="space-y-2">
            {filteredUploaded.map((f, i) => {
              const ext = f.name.split('.').pop() || '';
              const fi = FILE_ICON_COLORS[ext] || FILE_ICON_COLORS[f.type] || { icon: File, color: '#666' };
              const Icon = fi.icon;
              return (
                <div key={i} className="glass-card p-3 flex items-center gap-3 group" style={{ borderLeft: `3px solid ${fi.color}` }}>
                  <Icon className="w-6 h-6 flex-shrink-0" style={{ color: fi.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">{f.size}</div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#999' }}>{f.agent}</span>
                  <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#FF8C00' }}>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">📥 Generated Files</h3>
          <div className="space-y-2">
            {filteredGenerated.map((f, i) => {
              const fi = FILE_ICON_COLORS[f.type] || { icon: FileText, color: '#666' };
              const Icon = fi.icon;
              const borderColor = AGENT_BORDER[f.agent] || '#555';
              return (
                <div key={i} className="glass-card p-3 flex items-center gap-3 group" style={{ borderLeft: `3px solid ${borderColor}` }}>
                  <Icon className="w-6 h-6 flex-shrink-0" style={{ color: fi.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">{f.size} · {f.agent} · {f.time}</div>
                  </div>
                  <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#FF8C00' }}>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button className="glass-card px-5 py-2.5 text-sm font-semibold flex items-center gap-2 transition-all mx-auto hover:border-primary/30 min-h-[44px]"
        style={{ color: '#FF8C00', border: '1px solid rgba(255,107,0,0.15)' }}>
        <Download className="w-4 h-4" /> Download All as ZIP
      </button>
    </div>
  );
};

export default FilesTab;
