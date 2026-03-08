import { useState, useRef, useEffect } from 'react';
import { Mic, Paperclip, Sparkles, SendHorizontal } from 'lucide-react';
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

const LeftPanel = ({ isConnected }: Props) => {
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
      // Mock response
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: 'Processing your request. Routing to relevant agents...' }]);
      }, 1000);
    }
  };

  return (
    <aside className="w-[340px] flex-shrink-0 glass-panel flex flex-col border-r border-border/50 z-10">
      {/* Logo */}
      <div className="p-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow-purple text-primary-foreground text-sm font-bold">
          AI
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-foreground">AIOperator Brain</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="status-dot-green" />
            <span className="text-xs font-mono text-neon-green">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-xs ${m.role === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {m.role === 'ai' ? '🤖' : '👤'}
            </div>
            <div className={`glass-card-static px-3 py-2 text-sm leading-relaxed max-w-[85%] ${m.role === 'user' ? 'bg-primary/10 border-primary/30 text-foreground rounded-xl rounded-tr-none' : 'text-muted-foreground rounded-xl rounded-tl-none'}`}
              style={m.role === 'ai' ? { borderLeft: '2px solid hsla(263,70%,58%,0.4)', boxShadow: '-3px 0 10px hsla(263,70%,58%,0.08)' } : undefined}>
              {m.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-xs bg-primary text-primary-foreground">🤖</div>
            <div className="glass-card-static px-3 py-2 text-sm text-muted-foreground rounded-xl rounded-tl-none" style={{ borderLeft: '2px solid hsla(263,70%,58%,0.4)' }}>
              <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-primary mr-1" /> Thinking...
            </div>
          </div>
        )}
        <button className="self-start ml-10 text-[11px] px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors flex items-center gap-1.5 neon-glow-purple">
          ▶ Deploy as Mission
        </button>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="glass-card-static p-2 focus-glow-purple transition-all">
          <textarea
            className="w-full bg-transparent border-none text-foreground resize-none outline-none min-h-[60px] text-sm font-sans placeholder:text-muted-foreground"
            placeholder="Command the swarm..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
          />
          <div className="flex justify-between items-center mt-1">
            <div className="flex gap-1">
              <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Mic className="w-4 h-4" /></button>
              <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Paperclip className="w-4 h-4" /></button>
              <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Sparkles className="w-4 h-4" /></button>
            </div>
            <button onClick={handleSend} disabled={sending} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity pulse-glow-btn disabled:opacity-50">
              SEND <SendHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Agent strip */}
      <TooltipProvider delayDuration={200}>
        <div className="px-4 py-3 border-t border-border/50 flex gap-1.5 overflow-x-auto">
          {AGENTS.map(a => (
            <Tooltip key={a.id}>
              <TooltipTrigger asChild>
                <div
                  title=""
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all cursor-pointer ${a.status === 'working' ? 'pulse-dot' : 'opacity-40'}`}
                  style={{
                    backgroundColor: a.status === 'working' ? AGENT_COLORS[a.color] || 'hsl(var(--neon-green))' : 'hsl(var(--muted))',
                    boxShadow: a.status === 'working' ? `0 0 6px ${AGENT_COLORS[a.color]}` : 'none',
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="glass-card-static text-xs max-w-[200px]">
                <p className="font-semibold text-foreground">{a.emoji} {a.name}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">{a.task}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </aside>
  );
};

export default LeftPanel;
