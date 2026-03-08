import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, SendHorizontal, Mic, Paperclip, Sparkles } from 'lucide-react';
import { AGENTS, AGENT_COLORS } from '@/data/dashboardData';
import { api } from '@/services/apiService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

interface Props {
  isConnected: boolean;
}

const QUICK_METRICS = [
  { label: 'CPU', value: '32%', color: '#FF8C00' },
  { label: 'RAM', value: '12G', color: '#FF6B00' },
  { label: 'GPU', value: '89%', color: '#4ade80' },
  { label: 'NET', value: '24K', color: '#FF8C00' },
  { label: 'TOK', value: '142K', color: '#FF6B00' },
];

const LeftPanel = ({ isConnected }: Props) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'System initialized. Connected to 11 agent nodes. Ready for instructions.' },
    { role: 'user', text: 'Research the freelance invoicing SaaS market — competitors, pricing, and key features.' },
    { role: 'ai', text: 'Deploying Market Research, CEO, and Sales agents. Scanning 8 sources across competitor sites, review platforms, and industry reports.' },
    { role: 'ai', text: 'Initial findings ready. 3 direct competitors identified. Shall I generate a comparison matrix?' },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    if (isConnected) {
      setSending(true);
      try {
        const { reply } = await api.chat(userMsg, messages);
        setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      } catch {
        setMessages(prev => [...prev, { role: 'ai', text: 'Connection error. Backend may be offline.' }]);
      } finally {
        setSending(false);
      }
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: 'Processing your request. Routing to relevant agents...' }]);
      }, 1000);
    }
  };

  const lastAiMessage = [...messages].reverse().find(m => m.role === 'ai')?.text || '';

  return (
    <aside className="w-[300px] flex-shrink-0 flex flex-col z-10"
      style={{
        background: 'rgba(10, 7, 5, 0.85)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255, 80, 0, 0.1)',
      }}>

      {/* ZONE 1: SYSTEM IDENTITY */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,80,0,0.1)', minHeight: '60px' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)', boxShadow: '0 0 20px rgba(255, 107, 0, 0.5)' }}>
          AI
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold tracking-tight text-foreground heading-cinematic">AIOperator Brain</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="status-dot-green" style={{ width: '6px', height: '6px' }} />
            <span className="text-[10px] font-mono text-neon-green">ONLINE</span>
          </div>
          <div className="text-[10px] font-mono truncate mt-0.5" style={{ color: '#FF8C00' }}>
            Active: Freelance Invoicing Research
          </div>
        </div>
      </div>

      {/* ZONE 2: MINI AGENT COMMAND CENTER */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(255,80,0,0.06)' }}>
          <span className="section-header">Agent Status</span>
        </div>
        <div className="px-2 py-2 space-y-0.5 overflow-y-auto flex-shrink-0" style={{ maxHeight: 'calc(100% - 200px)' }}>
          {AGENTS.map(agent => {
            const isWorking = agent.status === 'working';
            const color = AGENT_COLORS[agent.color] || '#666';
            const progressWidth = `${agent.progress}%`;
            return (
              <div key={agent.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-all cursor-pointer hover:bg-white/[0.03]"
                style={{
                  opacity: isWorking ? 1 : 0.5,
                  borderLeft: isWorking ? `2px solid ${color}` : '2px solid transparent',
                  boxShadow: isWorking ? `inset 3px 0 8px ${color}22` : 'none',
                }}
              >
                <span className="text-sm flex-shrink-0" style={{ width: '18px' }}>{agent.emoji}</span>
                <span className="text-[11px] font-medium text-foreground truncate flex-1 heading-cinematic" style={{ minWidth: '60px' }}>
                  {agent.name.length > 10 ? agent.name.slice(0, 10) : agent.name}
                </span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${isWorking ? '' : ''}`}
                  style={isWorking
                    ? { backgroundColor: 'rgba(255,107,0,0.12)', color: '#FF8C00', border: '1px solid rgba(255,107,0,0.3)' }
                    : { backgroundColor: 'rgba(80,80,80,0.1)', color: '#555', border: '1px solid rgba(255,255,255,0.04)' }
                  }>
                  {isWorking ? 'WORK' : 'IDLE'}
                </span>
                <div className="w-[40px] h-[4px] bg-muted rounded-full overflow-hidden flex-shrink-0">
                  <div className={`h-full rounded-full ${isWorking ? 'progress-shimmer' : ''}`}
                    style={{ width: progressWidth, backgroundColor: isWorking ? undefined : 'hsl(var(--muted))' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Collapsible Brain Chat */}
        <div className="flex flex-col" style={{ borderTop: '1px solid rgba(255,80,0,0.08)' }}>
          <button onClick={() => setChatOpen(!chatOpen)}
            className="px-3 py-2 flex items-center justify-between w-full hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-sm">💬</span>
              <span className="section-header">Brain Chat</span>
            </div>
            {chatOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>

          {!chatOpen && (
            <div className="px-3 pb-2">
              <p className="text-[10px] text-muted-foreground line-clamp-2 italic">{lastAiMessage}</p>
            </div>
          )}

          {chatOpen && (
            <div className="flex flex-col" style={{ maxHeight: '250px' }}>
              <div ref={chatRef} className="overflow-y-auto px-3 py-2 flex flex-col gap-2 flex-1" style={{ maxHeight: '180px' }}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`px-2.5 py-1.5 text-[11px] leading-relaxed max-w-[90%] rounded-lg ${m.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                      style={m.role === 'ai'
                        ? { background: 'rgba(14,10,8,0.8)', borderLeft: '2px solid rgba(255,107,0,0.4)', color: '#bbb' }
                        : { backgroundColor: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)', color: '#ddd' }}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="px-2.5 py-1.5 text-[11px] text-muted-foreground rounded-lg rounded-tl-none" style={{ background: 'rgba(14,10,8,0.8)', borderLeft: '2px solid rgba(255,107,0,0.4)' }}>
                    <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: '#FF6B00' }} /> Thinking...
                  </div>
                )}
              </div>
              <div className="px-3 pb-2">
                <div className="flex gap-1.5 items-center" style={{ background: 'rgba(14,10,8,0.6)', border: '1px solid rgba(255,100,0,0.08)', borderRadius: '8px', padding: '4px 6px' }}>
                  <input
                    className="flex-1 bg-transparent border-none text-foreground outline-none text-[11px] placeholder:text-muted-foreground"
                    placeholder="Command..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                  />
                  <button onClick={handleSend} disabled={sending}
                    className="p-1 rounded text-primary-foreground disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #FF6B00, #FF4500)' }}>
                    <SendHorizontal className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ZONE 3: QUICK ACTIONS */}
      <div className="px-3 py-3 space-y-2" style={{ borderTop: '1px solid rgba(255,80,0,0.12)' }}>
        <button className="w-full text-primary-foreground py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 mission-pulse-btn"
          style={{ background: 'linear-gradient(135deg, #FF6B00, #CC3300)', boxShadow: '0 0 20px rgba(255,107,0,0.35)' }}>
          ▶ NEW MISSION
        </button>
        <button className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors hover:bg-neon-red/20"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
          ⏹ STOP ALL
        </button>
        <button className="w-full glass-card-static py-2 rounded-lg text-xs font-medium text-muted-foreground flex items-center justify-center gap-2 hover:text-foreground transition-colors">
          📋 LAST REPORT
        </button>

        {/* Quick Metrics */}
        <div className="flex justify-between pt-1">
          {QUICK_METRICS.map(m => (
            <div key={m.label} className="text-center">
              <div className="text-[8px] text-muted-foreground uppercase">{m.label}</div>
              <div className="text-[10px] font-mono font-bold" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftPanel;
