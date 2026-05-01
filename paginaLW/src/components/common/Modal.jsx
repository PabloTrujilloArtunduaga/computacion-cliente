import React from 'react';

export default function Modal({ title, onClose, children }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        
        <div style={header}>
          <span style={titleStyle}>{title}</span>
          <button onClick={onClose} style={closeBtn}>×</button>
        </div>

        <div style={body}>
          {children}
        </div>

      </div>
    </div>
  );
}

/* ─── STYLES ───────────────── */

const overlay = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 12,
};

const modal = {
  background: '#fff',
  borderRadius: 10,
  width: '100%',
  maxWidth: 360,        
  maxHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
  overflow: 'hidden',
};

const header = {
  background: '#1565C0',
  color: '#fff',
  padding: '10px 14px',  
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const titleStyle = {
  fontWeight: 600,
  fontSize: 14,         
};

const closeBtn = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: 18,
  cursor: 'pointer',
};

const body = {
  padding: '12px',      
  overflowY: 'auto',
};