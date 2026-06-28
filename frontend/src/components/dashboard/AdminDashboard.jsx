import React from 'react';

export const AdminDashboard = ({ user }) => {
  console.log('AdminDashboard rendering');
  
  return (
    <div style={{ 
      padding: "32px", 
      maxWidth: 1200, 
      margin: "0 auto",
      background: '#F8FAFF',
      minHeight: 'calc(100vh - 68px)'
    }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>
          Selamat datang, {user?.name || 'Admin'}! 👋
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          Pentadbir Sistem · {user?.jabatan || 'Unit IT'}
        </p>
      </div>

      {/* Stats */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4,1fr)", 
        gap: 16, 
        marginBottom: 32 
      }}>
        {[
          { label: "Jumlah Pengguna", value: 5, color: "#2563EB" },
          { label: "Pengguna Aktif", value: 3, color: "#22C55E" },
          { label: "Akaun Dikunci", value: 1, color: "#DC2626" },
          { label: "Jabatan", value: 3, color: "#8B5CF6" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "white",
            padding: "20px",
            borderRadius: 14,
            border: "1px solid #E5E7EB"
          }}>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, marginTop: 4 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "white",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        padding: "20px"
      }}>
        <h3 style={{ marginBottom: 16 }}>Admin Panel</h3>
        <p style={{ color: "#6B7280" }}>
          Anda mempunyai akses penuh ke sistem. Gunakan menu di atas untuk mengurus pengguna, log audit, dan kebenaran.
        </p>
      </div>
    </div>
  );
};