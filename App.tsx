
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles,
  Command,
  LayoutGrid,
  Info,
  ShieldCheck
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import { chatWithGemini } from './services/geminiService';
import { AgentMode, ChatMessage as ChatMessageType, Task } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AgentMode>(AgentMode.GENERAL);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete IoT Dashboard UI', status: 'pending', category: 'DEV' },
    { id: '2', title: 'Fix Python script encoding error', status: 'completed', category: 'SYSTEM' },
    { id: '3', title: 'Research new LLM trends', status: 'pending', category: 'RESEARCH' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      mode: mode
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Filter history for current mode and valid format
    const history = messages
      .filter(m => m.mode === mode)
      .slice(-10) // Only last 10 for context
      .map(m => ({
        role: (m.role === 'assistant' ? 'model' : 'user') as 'model' | 'user',
        parts: [{ text: m.content }]
      }));

    try {
      const { text, links } = await chatWithGemini(userMessage.content, mode, history);
      
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        mode: mode,
        groundingLinks: links
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Logic to auto-add tasks if KRRISH detects a goal
      if (text.toLowerCase().includes("added to your tasks") || text.toLowerCase().includes("i've created a task")) {
        const newTaskTitle = input.length > 30 ? input.substring(0, 30) + '...' : input;
        setTasks(prev => [{
          id: Date.now().toString(),
          title: newTaskTitle,
          status: 'pending',
          category: mode.toString()
        }, ...prev]);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (confirm('Clear entire conversation history?')) {
      setMessages([]);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    ));
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar 
        currentMode={mode} 
        setMode={setMode} 
        tasks={tasks}
        onToggleTask={toggleTask}
      />

      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
              mode === AgentMode.CODING ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' :
              mode === AgentMode.RESEARCH ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' :
              mode === AgentMode.IOT ? 'border-purple-500/30 bg-purple-500/10 text-purple-500' :
              mode === AgentMode.SYSTEM ? 'border-rose-500/30 bg-rose-500/10 text-rose-500' :
              'border-cyan-500/30 bg-cyan-500/10 text-cyan-500'
            }`}>
              {mode.replace('_', ' ')} Mode
            </div>
            <div className="h-4 w-[1px] bg-slate-800"></div>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Command size={14} />
              <span>Shift + Enter for new line</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
              title="Clear session"
            >
              <Trash2 size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
              <Info size={18} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 max-w-3xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 glow-cyan">
                <Sparkles size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Hello, I am KRRISH-AI</h2>
                <p className="text-slate-400 leading-relaxed text-lg">
                  I'm your secure digital partner. How can I assist you today with your code, 
                  system troubleshooting, or technical research?
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {[
                  "Write a Python script to automate file organization",
                  "Explain how to connect an ESP32 to Wi-Fi",
                  "Why is my laptop fan running so fast?",
                  "Summarize the latest trends in quantum computing"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(suggestion)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-sm text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 group"
                  >
                    <span className="text-slate-500 group-hover:text-cyan-400 mr-2 opacity-50">#</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && (
                <div className="flex gap-4 p-6 bg-slate-800/20">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-900 flex items-center justify-center animate-pulse">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="flex-1 space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">KRRISH is thinking...</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <form 
              onSubmit={handleSendMessage}
              className="relative rounded-2xl border-2 border-slate-800 bg-slate-900 focus-within:border-cyan-500/50 shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Message KRRISH-AI in ${mode.toLowerCase()} mode...`}
                rows={1}
                className="w-full bg-transparent px-5 py-4 pr-16 text-slate-200 placeholder-slate-500 focus:outline-none resize-none max-h-60 custom-scrollbar leading-relaxed"
                style={{ height: 'auto', minHeight: '56px' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                    !input.trim() || isTyping 
                      ? 'text-slate-600 bg-transparent' 
                      : 'text-white bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.4)]'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
            <p className="mt-3 text-[10px] text-center text-slate-600 font-medium tracking-wide">
              KRRISH-AI may produce inaccurate information about people, places, or facts. System security is monitored.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
