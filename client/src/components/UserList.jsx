import React from 'react';

export default function UserList({ users, isDarkMode }) {
  const safeUsers = users || {};
  const userCount = Object.keys(safeUsers).length;

  const containerClass = isDarkMode 
    ? "bg-white/10 backdrop-blur-3xl border-white/20 shadow-2xl shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]" 
    : "bg-white/40 backdrop-blur-3xl border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]";

  const titleClass = isDarkMode ? "text-white" : "text-slate-800";
  const textClass = isDarkMode ? "text-gray-300" : "text-slate-600";
  
  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : '??';

  return (
    <div className={`fixed top-32 right-8 z-40 w-64 p-5 rounded-[2rem] border transition-all duration-300 ${containerClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xs font-black uppercase tracking-widest ${titleClass}`}>
          Online ({userCount})
        </h3>
        <div className={`w-2 h-2 rounded-full ${userCount > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400'}`}></div>
      </div>

      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
        {Object.values(safeUsers).map((user) => (
          <div key={user.id} className="flex items-center gap-3 group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
              isDarkMode ? 'bg-white/10 text-white ring-1 ring-white/20' : 'bg-white text-slate-700 shadow-sm'
            }`}>
              {getInitials(user.name)}
            </div>
            <span className={`text-sm font-medium truncate ${textClass}`}>
              {user.name} {user.id === 'me' && '(You)'}
            </span>
          </div>
        ))}
        {userCount === 0 && (
          <div className={`text-xs italic ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
            Connecting...
          </div>
        )}
      </div>
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