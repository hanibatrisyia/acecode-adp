import React from 'react';

export const ExperiencedDashboard = ({ user }) => {
  console.log('ExperiencedDashboard rendering');
  
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
          Selamat datang, {user?.name || 'Experienced'}! 🎯
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          Kakitangan Berpengalaman · {user?.jabatan || 'Unit Cukai'}
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3,1fr)", 
        gap: 16, 
        marginBottom: 32 
      }}>
        {[
          { label: "Pengetahuan Dikongsi", value: 8, color: "#2563EB" },
          { label: "Diluluskan", value: 5, color: "#22C55E" },
          { label: "Dalam Semakan", value: 3, color: "#F59E0B" },
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
        <h3 style={{ marginBottom: 16 }}>Kongsi Pengetahuan Tersirat</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            placeholder="Kongsi tip atau pengalaman..."
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "1.5px solid #D1D5DB",
              borderRadius: 10,
              fontSize: 14,
              outline: "none"
            }}
          />
          <button style={{
            padding: "12px 24px",
            borderRadius: 10,
            border: "none",
            background: "#2563EB",
            color: "white",
            fontWeight: 600,
            cursor: "pointer"
          }}>
            Hantar
          </button>
        </div>
      </div>
    </div>
  );
};