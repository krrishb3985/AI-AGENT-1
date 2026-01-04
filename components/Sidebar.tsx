
import React from 'react';
import { 
  Terminal, 
  BookOpen, 
  Cpu, 
  Search, 
  Settings, 
  MessageSquare,
  CheckCircle2,
  Circle,
  ShieldCheck
} from 'lucide-react';
import { AgentMode, Task } from '../types';

interface SidebarProps {
  currentMode: AgentMode;
  setMode: (mode: AgentMode) => void;
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, tasks, onToggleTask }) => {
  const menuItems = [
    { mode: AgentMode.GENERAL, icon: <MessageSquare size={20} />, label: 'General' },
    { mode: AgentMode.CODING, icon: <Terminal size={20} />, label: 'Coding' },
    { mode: AgentMode.RESEARCH, icon: <Search size={20} />, label: 'Research' },
    { mode: AgentMode.IOT, icon: <Cpu size={20} />, label: 'IoT & Electronics' },
    { mode: AgentMode.SYSTEM, icon: <Settings size={20} />, label: 'System Support' },
  ];

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 h-screen flex flex-col p-4">
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          <ShieldCheck size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-white">KRRISH-AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold">Active Assistant</p>
        </div>
      </div>

      <nav className="space-y-1 mb-8">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Capabilities</p>
        {menuItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              currentMode === item.mode 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className={`${currentMode === item.mode ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 mb-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Goals</p>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{tasks.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {tasks.length === 0 ? (
            <div className="px-3 py-4 text-center rounded-xl border border-dashed border-slate-800 text-slate-600 text-xs italic">
              No active tasks. Ask KRRISH to help organize your day.
            </div>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer group transition-colors"
              >
                <button className="mt-0.5">
                  {task.status === 'completed' 
                    ? <CheckCircle2 size={16} className="text-cyan-500" /> 
                    : <Circle size={16} className="text-slate-600 group-hover:text-slate-400" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium leading-tight truncate ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {task.title}
                  </p>
                  <p className="text-[9px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">{task.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-300">Local System Optimized</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
