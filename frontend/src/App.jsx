import React, { useState } from 'react';
import { Layout } from './components/common/Layout';
import { PublicHome } from './components/public/PublicHome';
import { Login } from './components/auth/Login';
import { ResetPassword } from './components/auth/ResetPassword';
import { DashboardRouter } from './components/dashboard/DashboardRouter';
import { loginCredentials, mockUsers } from './data/mockData';

function App() {
  const [page, setPage] = useState('public');
  const [user, setUser] = useState(null);
  
  console.log('App rendering, page:', page);

  const handleLogin = (username, password) => {
    console.log('Login attempt:', username);
    
    const creds = Object.values(loginCredentials).find(
      c => c.username === username && c.password === password
    );
    
    if (creds) {
      const userData = mockUsers.find(u => u.role === creds.role);
      setUser(userData);
      setPage('dashboard');
      console.log('Login successful:', userData);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('public');
    console.log('Logged out');
  };

  const handleForgotPassword = () => {
    setPage('resetpw');
  };

  const handleResetComplete = () => {
    setPage('login');
  };

  const renderContent = () => {
    console.log('Rendering page:', page);
    
    if (page === 'public') {
      return <PublicHome />;
    }
    
    if (page === 'login') {
      return (
        <Login 
          onLogin={handleLogin} 
          onBack={() => setPage('public')}
          onForgotPassword={handleForgotPassword}
        />
      );
    }
    
    if (page === 'resetpw') {
      return (
        <ResetPassword 
          onBack={() => setPage('login')}
          onComplete={handleResetComplete}
        />
      );
    }
    
    if (page === 'dashboard' && user) {
      return <DashboardRouter user={user} />;
    }
    
    return <PublicHome />;
  };

  return (
    <Layout
      user={user}
      onLogin={() => setPage('login')}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;