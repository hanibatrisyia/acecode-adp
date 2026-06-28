import React from 'react';

export const ExecutiveDashboard = ({ user }) => {
  console.log('ExecutiveDashboard rendering');
  
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
          Selamat datang, {user?.name || 'Executive'}! 👔
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          Kakitangan Eksekutif · {user?.jabatan || 'Unit IT'}
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3,1fr)", 
        gap: 16, 
        marginBottom: 32 
      }}>
        {[
          { label: "SOP Untuk Disemak", value: 4, color: "#2563EB" },
          { label: "Pengetahuan Diluluskan", value: 12, color: "#22C55E" },
          { label: "Menunggu Kelulusan", value: 3, color: "#F59E0B" },
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
        <h3 style={{ marginBottom: 16 }}>Tindakan Segera</h3>
        {[
          "SOP Permohonan Lesen Perniagaan v2.0 - Menunggu semakan",
          "Pengetahuan Tersirat - Proses Rayuan Cukai",
          "Kemaskini Aliran Kerja - Unit Cukai"
        ].map((item, i) => (
          <div key={i} style={{
            padding: "12px 0",
            borderBottom: i < 2 ? "1px solid #F3F4F6" : "none"
          }}>
            <span style={{ fontSize: 14, color: "#374151" }}>• {item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};