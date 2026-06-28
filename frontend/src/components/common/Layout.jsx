import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toast } from './Toast';

export const Layout = ({ children, user, onLogin, onLogout, toast }) => {
  console.log('Layout rendering');
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#F8FAFF'
    }}>
      <Toast toast={toast} />
      <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};