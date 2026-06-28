import React, { useState } from 'react';
import { loginCredentials, mockUsers } from '../../data/mockData';

export const Login = ({ onLogin, onBack, onForgotPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  console.log('Login rendering');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Sila masukkan nama pengguna dan kata laluan.');
      return;
    }

    const creds = Object.values(loginCredentials).find(
      c => c.username === username && c.password === password
    );
    
    if (creds) {
      const userData = mockUsers.find(u => u.role === creds.role);
      if (userData) {
        onLogin(username, password);
        return;
      }
    }
    
    setError('Nama pengguna atau kata laluan tidak sah');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 68px)',
      background: '#EFF6FF',
      padding: '40px 20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '48px 40px',
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 32,
            color: 'white'
          }}>🏛️</div>
          <h2 style={{ fontSize: 22, color: '#111827' }}>SmartWork AI</h2>
          <p style={{ fontSize: 13, color: '#6B7280' }}>Majlis Bandaraya Pasir Gudang</p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13,
            color: '#DC2626',
            marginBottom: 16
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#6B7280',
              display: 'block',
              marginBottom: 4,
              textTransform: 'uppercase'
            }}>Nama Pengguna</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #D1D5DB',
                borderRadius: 10,
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563EB'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#6B7280',
              display: 'block',
              marginBottom: 4,
              textTransform: 'uppercase'
            }}>Kata Laluan</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #D1D5DB',
                borderRadius: 10,
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563EB'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginBottom: 22 }}>
            <span
              onClick={onForgotPassword}
              style={{
                fontSize: 13,
                color: '#2563EB',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Lupa kata laluan?
            </span>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: '#2563EB',
              color: 'white',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#3B82F6'}
            onMouseLeave={(e) => e.target.style.background = '#2563EB'}
          >
            Log Masuk
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <span
            onClick={onBack}
            style={{
              fontSize: 13,
              color: '#6B7280',
              cursor: 'pointer'
            }}
          >
            ← Kembali ke Halaman Awam
          </span>
        </div>

        <div style={{
          marginTop: 20,
          padding: "12px",
          background: "#F3F4F6",
          borderRadius: 8,
          border: "1px dashed #D1D5DB"
        }}>
          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>
            🧪 Kredensial Ujian:
          </div>
          <div style={{ fontSize: 11, color: "#374151", lineHeight: 1.6 }}>
            <div><strong>Admin:</strong> admin / password</div>
            <div><strong>Eksekutif:</strong> executive / password</div>
            <div><strong>Berpengalaman:</strong> experienced / password</div>
            <div><strong>Biasa:</strong> normal / password</div>
          </div>
        </div>

        <div style={{
          marginTop: 16,
          padding: "14px",
          background: "#EFF6FF",
          borderRadius: 10,
          border: "1px solid #DBEAFE"
        }}>
          <div style={{
            fontSize: 11,
            color: "#1D4ED8",
            fontWeight: 600,
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            🔒 Notis Keselamatan
          </div>
          <div style={{ fontSize: 11, color: "#2563EB", lineHeight: 1.5 }}>
            Akaun dikunci 30 minit selepas 5 cubaan gagal. Sesi tamat selepas 60 minit tidak aktif.
          </div>
        </div>
      </div>
    </div>
  );
};