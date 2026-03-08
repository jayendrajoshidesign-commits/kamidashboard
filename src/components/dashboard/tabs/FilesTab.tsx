import { useState } from 'react';
import { Upload, Download, FileText, FileSpreadsheet, Image, FileJson, File } from 'lucide-react';
import { FILES_UPLOADED, FILES_GENERATED, AGENTS } from '@/data/dashboardData';

const FILE_ICONS: Record<string, any> = {
  markdown: FileText,
  csv: FileSpreadsheet,
  image: Image,
  json: FileJson,
  excel: FileSpreadsheet,
};

const FilesTab = () => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        className={`glass-card p-8 border-2 border-dashed text-center transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border-light'}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Drag & drop files here, or click to browse</p>
        <p className="text-[11px] text-muted-foreground/60 mt-1">PDF, CSV, images, documents</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Uploaded */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">📤 Uploaded Files</h3>
          <div className="space-y-3">
            {FILES_UPLOADED.map((f, i) => (
              <div key={i} className="glass-card p-4 flex items-center gap-3">
                <File className="w-8 h-8 text-primary flex-shrink-0" />
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
            ))}
          </div>
        </div>

        {/* Generated */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">📥 Generated Files</h3>
          <div className="space-y-3">
            {FILES_GENERATED.map((f, i) => {
              const Icon = FILE_ICONS[f.type] || FileText;
              return (
                <div key={i} className="glass-card p-4 flex items-center gap-3">
                  <Icon className="w-8 h-8 text-neon-cyan flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.size} · {f.agent} · {f.time}</div>
                  </div>
                  <button className="p-1.5 rounded hover:bg-muted transition-colors">
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button className="glass-card px-4 py-2.5 text-sm font-semibold text-primary flex items-center gap-2 hover:bg-primary/10 transition-colors mx-auto">
        <Download className="w-4 h-4" /> Download All as ZIP
      </button>
    </div>
  );
};

export default FilesTab;
