import React from 'react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 2000,
      background: toast.color, color: '#fff', padding: '12px 24px',
      borderRadius: 8, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      animation: 'fadeIn 0.3s',
    }}>
      {toast.msg}
    </div>
  );
}