import React, { useState } from 'react';
import { useCanvasEngine } from '../hooks/useCanvasEngine';
import Toolbar from './Toolbar';
import CursorOverlay from './CursorOverlay';
import UserList from './UserList';
import ChatBox from './ChatBox';

export default function CanvasBoard({ userName }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000'); 
  const [width, setWidth] = useState(5);

  const { 
    canvasRef, startDrawing, draw, endDrawing, 
    undo, redo, clearCanvas, cursors, users, messages, sendChat
  } = useCanvasEngine(userName, isDarkMode);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setColor(newMode ? '#FFFFFF' : '#000000');
  };

  const effectiveColor = tool === 'eraser' ? 'erase' : color;
  const effectiveWidth = tool === 'eraser' ? width * 2 : width;


  const backgroundClass = isDarkMode
    ? "bg-slate-950 bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#020617_100%)]"
    : "bg-[#fef2f2] bg-[radial-gradient(at_0%_0%,_#fecaca_0px,_transparent_50%),_radial-gradient(at_90%_0%,_#d8b4fe_0px,_transparent_50%),_radial-gradient(at_100%_100%,_#d8b4fe_0px,_transparent_50%),_radial-gradient(at_0%_100%,_#c4b5fd_0px,_transparent_50%)]";

  const canvasContainerClass = isDarkMode
    ? "bg-gray-900/60 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]"
    : "bg-white/50 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]";

  return (
    <div className={`relative w-full h-screen overflow-hidden transition-all duration-700 ${backgroundClass}`}>
      
      <Toolbar 
        tool={tool} setTool={setTool}
        color={color} setColor={setColor}
        width={width} setWidth={setWidth}
        onUndo={undo} onRedo={redo}
        onClear={clearCanvas}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      <UserList users={users} isDarkMode={isDarkMode} />

      <ChatBox 
        messages={messages} 
        onSend={sendChat} 
        isDarkMode={isDarkMode} 
      />
      
      <div className={`absolute top-28 bottom-8 left-8 right-[300px] rounded-[3rem] overflow-hidden transition-all duration-300 ${canvasContainerClass}`}>
        
        <CursorOverlay cursors={cursors} />

        <canvas
          ref={canvasRef}
          onMouseDown={(e) => startDrawing(e, effectiveColor, effectiveWidth)}
          onMouseMove={(e) => draw(e, effectiveColor, effectiveWidth)}
          onMouseUp={() => endDrawing(effectiveColor, effectiveWidth)}
          onMouseLeave={() => endDrawing(effectiveColor, effectiveWidth)}
          className="touch-none cursor-crosshair block w-full h-full relative z-10"
        />
      </div>

    </div>
  );
}