import React from 'react';

export const Footer = () => {
  console.log('Footer rendering');
  
  return (
    <footer style={{
      background: '#162044',
      borderTop: '1px solid rgba(96,165,250,0.18)',
      padding: '24px 32px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 12, color: '#8BA3D4' }}>
        © 2025 SmartWork AI · Majlis Bandaraya Pasir Gudang
      </div>
    </footer>
  );
};