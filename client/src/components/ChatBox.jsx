import React, { useState, useEffect, useRef } from 'react';

export default function ChatBox({ messages, onSend, isDarkMode }) {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const containerClass = isDarkMode 
    ? "bg-white/10 backdrop-blur-3xl border-white/20 shadow-2xl shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]" 
    : "bg-white/40 backdrop-blur-3xl border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]";

  const inputBg = isDarkMode ? "bg-black/20 text-white placeholder-white/30 focus:ring-white/20" : "bg-white/50 text-slate-800 placeholder-slate-400 focus:ring-slate-400/30";

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className={`fixed bottom-8 right-8 z-40 w-64 h-96 flex flex-col p-4 rounded-[2rem] border transition-all duration-300 ${containerClass}`}>
      
      <div className={`pb-3 mb-2 border-b ${isDarkMode ? 'border-white/10' : 'border-slate-900/5'}`}>
        <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          Chat
        </h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] px-3 py-2 rounded-2xl text-[10px] leading-relaxed shadow-sm ${
              msg.isMe 
                ? (isDarkMode ? 'bg-white/20 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-br-none') 
                : (isDarkMode ? 'bg-black/20 text-gray-300 rounded-bl-none' : 'bg-white/40 text-slate-700 rounded-bl-none')
            }`}>
              {!msg.isMe && <span className="block text-[8px] font-bold opacity-50 mb-0.5">{msg.name}</span>}
              {msg.text}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className={`h-full flex items-center justify-center text-xs italic ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>
            Say hello!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type..."
          className={`w-full pl-3 pr-9 py-2.5 rounded-xl text-xs outline-none transition-all ring-1 ring-transparent focus:ring-2 ${inputBg}`}
        />
        <button 
          type="submit"
          className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
            input.trim() 
              ? (isDarkMode ? 'text-white hover:bg-white/20' : 'text-slate-800 hover:bg-white/80') 
              : 'text-gray-400 opacity-50 cursor-not-allowed'
          }`}
          disabled={!input.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </form>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; 
          border-radius: 10px; 
        }
      `}</style>
    </div>
  );
}