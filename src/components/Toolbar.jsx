import React from 'react';

export default function Toolbar({ 
  tool, setTool, color, setColor, width, setWidth, 
  onUndo, onRedo, onClear, isDarkMode, onToggleTheme 
}) {
  
  const containerClass = isDarkMode 
    ? "bg-white/10 backdrop-blur-3xl border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10" 
    : "bg-white/40 backdrop-blur-3xl border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/40";
    
  const textClass = isDarkMode ? "text-white font-medium" : "text-slate-800 font-bold";
  const borderClass = isDarkMode ? "border-white/10" : "border-slate-900/10";

  const getIconClass = (isActive) => {
    const base = "relative p-1.5 rounded-xl flex items-center justify-center transition-all duration-300 ease-out border ";
    
    if (isActive) {
      return base + (isDarkMode 
        ? "bg-amber-900/40 border-amber-500/60 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)] scale-105 translate-y-[-1px]" 
        : "bg-amber-50 border-amber-400 text-amber-700 shadow-[0_0_5px_rgba(245,158,11,0.8)] scale-105 translate-y-[-1px]");
    }
    
    return base + (isDarkMode
      ? "bg-white/5 border-transparent text-gray-300 hover:bg-white/20 hover:text-white hover:scale-105 hover:-translate-y-0.5"
      : "bg-white/30 border-transparent text-slate-600 ring-1 ring-black/5 shadow-sm hover:bg-white/80 hover:text-black hover:scale-105 hover:-translate-y-0.5");
  };

  return (
    <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-5 py-2 rounded-full border transition-all duration-300 ${containerClass}`}>
      
      <div className={`flex items-center gap-2 border-r pr-4 ${borderClass}`}>
        <button onClick={() => setTool('pencil')} className={getIconClass(tool === 'pencil')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
        </button>
        <button onClick={() => setTool('eraser')} className={getIconClass(tool === 'eraser')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L18 15"/><path d="M11 11L20 20"/></svg>
        </button>
      </div>

      <div className={`flex flex-col justify-center gap-0.5 border-r pr-4 ${borderClass}`}>
        <div className="flex justify-between items-center w-24">
          <span className={`text-[9px] uppercase tracking-widest ${textClass}`}>Size</span>
          <span className={`text-[9px] font-mono opacity-80 ${textClass}`}>{width}px</span>
        </div>
        
        <div className="relative w-24 h-4 flex items-center group">
          <input 
            type="range" min="1" max="40" value={width} 
            onChange={(e) => setWidth(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-transparent cursor-pointer relative z-10 focus:outline-none"
            style={{ WebkitAppearance: 'none' }}
          />
          <div className={`absolute left-0 right-0 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/20' : 'bg-black/5 ring-1 ring-black/5'}`}>
            <div 
              className={`h-full transition-all duration-100 ${isDarkMode ? 'bg-white' : 'bg-slate-500'}`}
              style={{ width: `${(width / 40) * 100}%` }}
            />
          </div>
          
          <style jsx>{`
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 14px;
              width: 14px;
              border-radius: 50%;
              background: ${isDarkMode ? '#fff' : '#fff'};
              border: 1px solid ${isDarkMode ? '#fff' : '#94a3b8'};
              box-shadow: 0 1px 2px rgba(0,0,0,0.2);
              margin-top: -1px;
              cursor: pointer;
              transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            input[type=range]::-webkit-slider-thumb:hover {
              transform: scale(1.3);
              box-shadow: 0 0 0 4px rgba(255,255,255,0.3);
            }
          `}</style>
        </div>
      </div>

      <div className={`flex items-center gap-2 border-r pr-4 ${borderClass}`}>
        <div className="relative group transition-transform duration-200 hover:scale-110">
          <input 
            type="color" value={color} onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 p-0 border-0 rounded-full overflow-hidden cursor-pointer shadow-sm ring-1 ring-black/10"
          />
        </div>
        {['#000000', '#EF4444', '#10B981', '#3B82F6'].map((c) => (
          <button
            key={c} onClick={() => setColor(c)}
            className={`w-5 h-5 rounded-full border transition-all duration-200 ease-out shadow-sm ${
              color === c 
                ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black/10 border-transparent z-10' 
                : 'border-black/5 hover:scale-110 hover:-translate-y-0.5'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={onUndo} className={getIconClass(false)} title="Undo">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button onClick={onRedo} className={getIconClass(false)} title="Redo">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7"/></svg>
        </button>
        
        <div className={`w-px h-6 mx-1 ${borderClass}`}></div>

        <button 
          onClick={onClear} 
          className="px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide text-red-600 bg-red-500/10 border border-red-600/10 ring-1 ring-transparent hover:ring-red-200 hover:bg-red-500 hover:text-white hover:scale-105 transition-all duration-200 shadow-sm"
        >
          CLEAR
        </button>

        <button onClick={onToggleTheme} className={`${getIconClass(false)} ml-1`}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
}