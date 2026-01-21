import React, { useState } from 'react';

export default function LandingPage({ onJoin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a display name');
      return;
    }
    if (typeof onJoin === 'function') {
      onJoin(name);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#fffdf7] flex items-center justify-center font-sans selection:bg-amber-200/30">
      
      <style>{`
        @keyframes rotate-clockwise {
          from { transform: rotate(0deg) scale(1.3); }
          to { transform: rotate(360deg) scale(1.3); }
        }
        @keyframes rotate-counter {
          from { transform: rotate(360deg) scale(1.3); }
          to { transform: rotate(0deg) scale(1.3); }
        }

        .aurora-container {
            position: absolute;
            inset: -50%;
            width: 200%; height: 200%;
            filter: blur(100px);
            opacity: 0.55; 
            pointer-events: none;
            mix-blend-mode: multiply;
        }

        .blob-sun {
            position: absolute;
            top: 15%; left: 15%; width: 60%; height: 60%;
            background: linear-gradient(to bottom right, #fbbf24, #fdba74, #fde047);
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            animation: rotate-clockwise 45s linear infinite;
        }

        .blob-dusk {
            position: absolute;
            bottom: 15%; right: 15%; width: 60%; height: 60%;
            background: linear-gradient(to top left, #e879f9, #fb7185, #a78bfa);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            animation: rotate-counter 50s linear infinite;
        }

        .logo-3d {
          background: linear-gradient(
            110deg, 
            #fbbf24 0%,   
            #f472b6 25%,  
            #a78bfa 50%,  
            #f472b6 75%,  
            #fbbf24 100%  
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-position: 0% center;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: pointer;
        }

        .logo-3d:hover {
          transform: perspective(500px) rotateX(10deg) scale(1.1) translateY(-5px);
          text-shadow: 0 15px 10px rgba(251, 191, 36, 0.15); 
        }
      `}</style>

      <div className="aurora-container">
          <div className="blob-sun"></div>
          <div className="blob-dusk"></div>
      </div>
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[380px] group">
        
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 via-rose-200 to-violet-200 rounded-[35px] blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

        <div className="relative bg-white/20 backdrop-blur-[40px] rounded-[30px] border border-white/50 shadow-2xl px-8 py-10 h-[450px] flex flex-col">
          
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent opacity-80 pointer-events-none rounded-t-[30px]"></div>

          <div className="relative z-10 flex flex-col items-center mt-12">
            <h1 className="text-6xl font-black tracking-tighter logo-3d select-none drop-shadow-sm">
              LUCID
            </h1>
            <p className="text-[10px] font-extrabold tracking-[0.4em] text-slate-600 uppercase mt-4 ml-1">
              Visual Workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 relative z-50 w-full space-y-4">
            
            <div className="relative group/input">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                className="w-full bg-white/40 border border-white/50 rounded-xl px-4 py-3 text-slate-800 font-bold text-center placeholder-slate-600 outline-none focus:bg-white/80 focus:ring-2 focus:ring-rose-400/30 focus:border-rose-300 transition-all text-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"
                placeholder="Enter your name"
                autoFocus
              />
              {error && (
                <div className="absolute -top-10 left-0 right-0 text-center">
                   <span className="inline-block px-3 py-1 bg-rose-100/90 text-rose-600 text-[9px] font-extrabold uppercase tracking-wide rounded-full shadow-sm animate-bounce">
                     {error}
                   </span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full relative overflow-hidden rounded-xl group/btn shadow-lg shadow-rose-500/10 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400 opacity-90 group-hover/btn:opacity-100 transition-opacity"></div>
              
              <div className="relative px-6 py-3 flex items-center justify-center gap-2 transform group-hover/btn:scale-[1.01] transition-transform">
                <span className="text-white font-bold tracking-widest text-[11px] uppercase shadow-sm">
                  Join Session
                </span>
                <svg className="w-3 h-3 text-white group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </button>

            <div className="text-center pt-2">
              <p className="text-[9px] text-slate-500 font-bold hover:text-rose-600 transition-colors cursor-default tracking-wide">
                v2.0 • System Ready
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}