import React from 'react';
import { C } from '../../styles/theme';
import { roleLabels } from '../../data/mockData';

export const Navbar = ({ user, onLogin, onLogout }) => {
  console.log('Navbar rendering, user:', user);
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: { bg: '#FEF3C7', text: '#92400E' },
      executive: { bg: '#EFF6FF', text: '#1D4ED8' },
      experienced: { bg: '#F0FDF4', text: '#166534' },
      normal: { bg: '#F9FAFB', text: '#374151' },
    };
    return colors[role] || colors.normal;
  };

  return (
    <nav style={{
      background: C.navyM,
      borderBottom: `1px solid ${C.border}`,
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 68,
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: C.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0
        }}>🏛️</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, color: C.white }}>
            SmartWork AI
          </div>
          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.2 }}>
            Majlis Bandaraya Pasir Gudang
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {user ? (
          <>
            {/* User info */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.06)",
              padding: "4px 12px 4px 8px",
              borderRadius: 30,
              border: `1px solid ${C.border}`
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: getRoleColor(user.role).bg,
                color: getRoleColor(user.role).text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700
              }}>
                {getInitials(user.name)}
              </div>
              <div style={{ fontSize: 13, color: C.text }}>
                {user.name}
              </div>
              <div style={{
                fontSize: 10,
                padding: "2px 10px",
                borderRadius: 20,
                background: getRoleColor(user.role).bg,
                color: getRoleColor(user.role).text,
                fontWeight: 600
              }}>
                {roleLabels[user.role] || user.role}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              style={{
                background: "rgba(220,38,38,0.15)",
                border: "1px solid rgba(220,38,38,0.3)",
                color: "#FCA5A5",
                padding: "8px 20px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(220,38,38,0.25)";
                e.target.style.borderColor = "#DC2626";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(220,38,38,0.15)";
                e.target.style.borderColor = "rgba(220,38,38,0.3)";
              }}
            >
              🚪 Log Keluar
            </button>
          </>
        ) : (
          <button
            onClick={onLogin}
            style={{
              background: "transparent",
              border: `1.5px solid ${C.accent}`,
              color: C.white,
              padding: "10px 24px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = C.accent;
              e.target.style.color = C.navy;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = C.white;
            }}
          >
            Log Masuk Kakitangan
          </button>
        )}
      </div>
    </nav>
  );
};