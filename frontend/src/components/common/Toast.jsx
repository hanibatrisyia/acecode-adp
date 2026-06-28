import React from 'react';

export const Toast = ({ toast }) => {
  if (!toast) return null;
  
  console.log('Toast rendering');
  
  return (
    <div style={{
      position: 'fixed',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      background: '#F0FDF4',
      border: '1px solid #BBF7D0',
      borderRadius: 12,
      padding: '14px 28px',
      fontSize: 14,
      color: '#166534',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
    }}>
      ✅ {toast.message}
    </div>
  );
};