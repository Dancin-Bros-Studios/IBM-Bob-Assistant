import React from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { Minus, X } from 'lucide-react';

export const TitleBar: React.FC = () => {
  const handleMinimize = async () => {
    await appWindow.minimize();
  };

  const handleClose = async () => {
    await appWindow.close();
  };

  return (
    <div
      data-tauri-drag-region
      style={{
        height: '32px',
        background: 'linear-gradient(180deg, #000080 0%, #1084d0 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 8px',
        userSelect: 'none',
        borderBottom: '2px solid #000',
        cursor: 'move',
      }}
    >
      {/* Title */}
      <div
        data-tauri-drag-region
        style={{
          color: '#fff',
          fontSize: '11px',
          fontFamily: 'MS Sans Serif, sans-serif',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flex: 1,
        }}
      >
        <span style={{ fontSize: '14px' }}>🤖</span>
        Bob - Your Desktop Companion
      </div>

      {/* Window Controls */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
        }}
      >
        {/* Minimize Button */}
        <button
          onClick={handleMinimize}
          className="titlebar-button"
          style={{
            width: '24px',
            height: '24px',
            background: '#c0c0c0',
            border: '2px outset #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.border = '2px inset #fff';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.border = '2px outset #fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = '2px outset #fff';
          }}
        >
          <Minus size={12} color="#000" />
        </button>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="titlebar-button"
          style={{
            width: '24px',
            height: '24px',
            background: '#c0c0c0',
            border: '2px outset #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.border = '2px inset #fff';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.border = '2px outset #fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = '2px outset #fff';
          }}
        >
          <X size={12} color="#000" />
        </button>
      </div>
    </div>
  );
};

// Made with Bob