import React from 'react';

export default function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontWeight: 600,
        marginBottom: 6, fontSize: 13, color: '#444',
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ color: '#e53935', fontSize: 12, marginTop: 4, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}