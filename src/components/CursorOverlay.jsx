import React from 'react';

export default function CursorOverlay({ cursors }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {Object.entries(cursors).map(([id, cursor]) => (
        <div
          key={id}
          className="absolute flex items-start gap-1 transition-transform duration-75 ease-linear will-change-transform"
          style={{
            left: `${cursor.x * 100}%`,
            top: `${cursor.y * 100}%`,
          }}
        >
          <svg
            className="w-4 h-4 text-blue-500 drop-shadow-md"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="white"
            strokeWidth="1.5"
            style={{ transform: 'rotate(-15deg) translate(-2px, -2px)' }} 
          >
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
          
          <div className="px-1.5 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded-md shadow-sm whitespace-nowrap -mt-1">
            {cursor.name || 'User'}
          </div>
        </div>
      ))}
    </div>
  );
}