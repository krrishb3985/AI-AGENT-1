
import React from 'react';
import { User, ShieldCheck, ExternalLink, Copy, Check } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

interface MessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<MessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown-like renderer for code blocks and bold text
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match?.[1] || 'code';
        const code = match?.[2] || part.slice(3, -3);
        
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-lg">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language}</span>
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(code);
                   setCopied(true);
                   setTimeout(() => setCopied(false), 2000);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto mono text-xs leading-relaxed text-slate-300 bg-slate-900/50">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Handle bold text and other basic inline formatting
      const formattedText = part.split(/(\*\*.*?\*\*)/g).map((subPart, subIndex) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          return <strong key={subIndex} className="font-bold text-cyan-400">{subPart.slice(2, -2)}</strong>;
        }
        return subPart;
      });

      return <span key={index} className="whitespace-pre-wrap">{formattedText}</span>;
    });
  };

  return (
    <div className={`flex gap-4 p-6 ${isAssistant ? 'bg-slate-800/20' : ''} group transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}>
      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
        isAssistant 
          ? 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
          : 'bg-slate-700 text-slate-300'
      }`}>
        {isAssistant ? <ShieldCheck size={22} /> : <User size={22} />}
      </div>
      
      <div className="flex-1 space-y-4 max-w-4xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {isAssistant ? 'KRRISH-AI Core' : 'User Session'}
          </span>
          <span className="text-[10px] text-slate-600">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="text-sm leading-7 text-slate-200">
          {renderContent(message.content)}
        </div>

        {isAssistant && message.groundingLinks && message.groundingLinks.length > 0 && (
          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Grounding Sources</p>
            <div className="flex flex-wrap gap-2">
              {message.groundingLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-300 border border-slate-700 transition-colors"
                >
                  <span className="truncate max-w-[150px]">{link.title}</span>
                  <ExternalLink size={10} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"
          title="Copy message"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
