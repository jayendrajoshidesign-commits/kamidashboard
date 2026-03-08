import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Mic, Paperclip, Image, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { KAMI_THREADS, KAMI_MESSAGES, AGENT_COLORS } from '@/data/dashboardData';
import { api } from '@/services/apiService';
import { useResponsive } from '@/hooks/useResponsive';

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

interface Props {
  isConnected: boolean;
}

const CATEGORY_LABELS = {
  mission: { emoji: '🔴', label: 'ACTIVE MISSIONS' },
  project: { emoji: '💼', label: 'PROJECTS' },
  personal: { emoji: '💬', label: 'PERSONAL' },
};

const KamiTab = ({ isConnected }: Props) => {
  const [activeThread, setActiveThread] = useState('thread-1');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(KAMI_MESSAGES);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showThreads, setShowThreads] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, activeThread]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg = input;
    setMessages(prev => ({
      ...prev,
      [activeThread]: [...(prev[activeThread] || []), { role: 'user', text: userMsg }],
    }));
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = '56px';

    if (isConnected) {
      setSending(true);
      try {
        const { reply } = await api.chat(userMsg, messages[activeThread] || []);
        setMessages(prev => ({
          ...prev,
          [activeThread]: [...(prev[activeThread] || []), { role: 'ai', text: reply }],
        }));
      } catch {
        setMessages(prev => ({
          ...prev,
          [activeThread]: [...(prev[activeThread] || []), { role: 'ai', text: 'Connection error. Backend may be offline.' }],
        }));
      } finally {
        setSending(false);
      }
    } else {
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [activeThread]: [...(prev[activeThread] || []), { role: 'ai', text: 'Processing your request. Routing to relevant agents...' }],
        }));
      }, 1000);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  const currentThread = KAMI_THREADS.find(t => t.id === activeThread);
  const currentMessages = messages[activeThread] || [];
  const grouped = KAMI_THREADS.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, typeof KAMI_THREADS>);

  const ThreadList = () => (
    <>
      {(['mission', 'project', 'personal'] as const).map(cat => {
        const threads = grouped[cat] || [];
        if (!threads.length) return null;
        const catInfo = CATEGORY_LABELS[cat];
        return (
          <div key={cat} className="mb-2">
            <div className="px-3 py-1 text-[9px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span>{catInfo.emoji}</span> {catInfo.label}
            </div>
            {threads.map(t => (
              <button key={t.id} onClick={() => { setActiveThread(t.id); setShowThreads(false); }}
                className="w-full px-3 py-2 text-left transition-all hover:bg-white/[0.03]"
                style={{
                  borderLeft: activeThread === t.id ? '2px solid #FF6B00' : '2px solid transparent',
                  backgroundColor: activeThread === t.id ? 'rgba(255,107,0,0.04)' : 'transparent',
                }}>
                <div className="text-[11px] font-medium text-foreground truncate">{t.title}</div>
                <div className="text-[9px] text-muted-foreground truncate mt-0.5">{t.date}</div>
                {t.unread > 0 && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full font-mono" style={{ backgroundColor: 'rgba(255,107,0,0.1)', color: '#FF8C00' }}>
                    {t.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        );
      })}
    </>
  );

  return (
    <div className={`flex ${isMobile ? 'flex-col' : ''} h-[calc(100vh-140px)] gap-0 -m-6 ${isMobile ? '-m-3' : ''}`}>
      {/* Thread Sidebar — desktop/tablet */}
      {!isMobile && (
        <div className="w-[220px] flex-shrink-0 flex flex-col" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,6,9,0.5)' }}>
          <div className="px-3 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-xs font-semibold text-foreground">KAMI Brain</span>
            <button className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-white/[0.05]" style={{ color: '#FF8C00' }}>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 py-2">
            <ThreadList />
          </div>
        </div>
      )}

      {/* Mobile thread selector */}
      {isMobile && (
        <div className="flex-shrink-0">
          <button onClick={() => setShowThreads(!showThreads)}
            className="w-full flex items-center justify-between px-4 py-2 min-h-[44px]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,6,9,0.5)' }}>
            <span className="text-xs font-semibold text-foreground">{currentThread?.title || 'Select Thread'}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showThreads ? 'rotate-180' : ''}`} />
          </button>
          {showThreads && (
            <div className="max-h-[200px] overflow-y-auto" style={{ background: 'rgba(6,6,9,0.9)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <ThreadList />
            </div>
          )}
        </div>
      )}

      {/* CENTER: Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Thread Header — non-mobile */}
        {!isMobile && (
          <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="text-sm font-semibold text-foreground">{currentThread?.title || 'Chat'}</h2>
            {currentThread?.category === 'mission' && (
              <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,107,0,0.08)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.2)' }}>
                Active
              </span>
            )}
          </div>
        )}

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {currentMessages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${isMobile ? 'max-w-[90%]' : 'max-w-[75%]'}`}>
                {m.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#FF8C00' }} />
                    <span className="text-[9px] font-medium" style={{ color: '#FF8C00' }}>KAMI</span>
                  </div>
                )}
                <div className={`px-3.5 py-2.5 ${isMobile ? 'text-[12px]' : 'text-[13px]'} leading-relaxed`}
                  style={m.role === 'user'
                    ? {
                        background: 'rgba(255,107,0,0.06)',
                        border: '1px solid rgba(255,107,0,0.12)',
                        borderRadius: '16px 4px 16px 16px',
                        color: '#ddd',
                      }
                    : {
                        background: 'rgba(10,10,14,0.8)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '4px 16px 16px 16px',
                        color: '#bbb',
                      }
                  }>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="px-3.5 py-2.5 text-[13px] text-muted-foreground" style={{ background: 'rgba(10,10,14,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px 16px 16px 16px' }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: '#FF6B00' }} />
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: '#FF6B00', animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: '#FF6B00', animationDelay: '0.4s' }} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(8,8,12,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              className="w-full bg-transparent text-foreground text-sm outline-none resize-none px-4 pt-3 pb-1 placeholder:text-muted-foreground"
              placeholder="Talk to KAMI — missions, projects, or just how you're feeling..."
              style={{ minHeight: '56px', maxHeight: '200px' }}
            />
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors min-w-[32px] min-h-[32px]">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors min-w-[32px] min-h-[32px]">
                  <Image className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRecording(!recording)}
                  className={`p-1.5 rounded-md transition-colors min-w-[32px] min-h-[32px] ${recording ? '' : 'text-muted-foreground hover:text-foreground'}`}
                  style={recording ? { color: '#ef4444' } : undefined}
                >
                  <Mic className="w-4 h-4" />
                </button>
                {recording && (
                  <div className="flex items-center gap-1.5 ml-1">
                    <span className="text-[10px]" style={{ color: '#ef4444' }}>Recording...</span>
                    <div className="voice-bars">
                      {[0,1,2,3,4].map(i => <div key={i} className="voice-bar" />)}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleSend} disabled={sending || !input.trim()}
                className="p-2 rounded-lg text-primary-foreground disabled:opacity-30 transition-all min-w-[36px] min-h-[36px]"
                style={{ background: input.trim() ? 'linear-gradient(135deg, #FF6B00, #CC3300)' : 'rgba(255,255,255,0.05)' }}>
                <SendHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Context Panel — desktop only */}
      {!isMobile && (
        <div className="w-[200px] flex-shrink-0 flex flex-col p-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,6,9,0.5)' }}>
          {currentThread && (
            <>
              <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Context</div>

              {currentThread.category === 'mission' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-[9px] text-muted-foreground mb-1">Status</div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,107,0,0.08)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.2)' }}>
                      Running
                    </span>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground mb-1">Agents</div>
                    <div className="flex flex-wrap gap-1">
                      {'agents' in currentThread && currentThread.agents?.map((a: string) => (
                        <span key={a} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#999' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                  {'tasksCompleted' in currentThread && (
                    <div>
                      <div className="text-[9px] text-muted-foreground mb-1">Tasks</div>
                      <span className="text-xs font-mono" style={{ color: '#FF8C00' }}>{currentThread.tasksCompleted}/{currentThread.totalTasks}</span>
                    </div>
                  )}
                  <button className="text-[10px] flex items-center gap-1 mt-2 transition-colors hover:text-foreground" style={{ color: '#FF8C00' }}>
                    View in Mission Control <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {currentThread.category === 'project' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-[9px] text-muted-foreground mb-1">Tech Stack</div>
                    <div className="flex flex-wrap gap-1">
                      {'techStack' in currentThread && currentThread.techStack?.map((t: string) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#999' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  {'filesCount' in currentThread && (
                    <div>
                      <div className="text-[9px] text-muted-foreground mb-1">Files</div>
                      <span className="text-xs font-mono" style={{ color: '#FF8C00' }}>{currentThread.filesCount}</span>
                    </div>
                  )}
                </div>
              )}

              {currentThread.category === 'personal' && (
                <div className="space-y-3">
                  <div>
                    <div className="text-[9px] text-muted-foreground mb-1">Started</div>
                    <span className="text-xs text-muted-foreground">{currentThread.date}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default KamiTab;
