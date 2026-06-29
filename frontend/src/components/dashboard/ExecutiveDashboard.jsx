import React, { useState } from 'react';
import { C } from '../../styles/theme';
import { rolePermissions } from '../../data/mockData';
import { getRoleColor } from '../../utils/helpers';
import ChatbotSubsystem from '../chatbot/ChatbotSubsystem';

export const ExecutiveDashboard = ({ user }) => {
  const [showPermissions, setShowPermissions] = useState(false);
  const userPermissions = rolePermissions[user?.role]?.permissions || [];

  return (
    <div style={{ 
      padding: "32px", 
      maxWidth: 1200, 
      margin: "0 auto",
      background: '#F8FAFF',
      minHeight: 'calc(100vh - 68px)',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>
          Selamat datang, {user?.name || 'Executive'}! 👔
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          Kakitangan Eksekutif · {user?.jabatan || 'Unit IT'}
        </p>
      </div>

      {/* Stats Section */}
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

      {/* UC004: View own role & permissions */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setShowPermissions(!showPermissions)}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            background: C.white,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "#374151",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          {showPermissions ? "🔽" : "▶️"} Lihat Kebenaran Saya
        </button>

        {showPermissions && (
          <div style={{
            marginTop: 12,
            background: C.white,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            padding: "20px"
          }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Peranan: </span>
              <span style={{
                padding: "2px 12px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                background: getRoleColor(user?.role).bg,
                color: getRoleColor(user?.role).text
              }}>
                Kakitangan Eksekutif
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {userPermissions.map((perm, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#374151",
                  padding: "4px 8px",
                  background: "#F9FAFB",
                  borderRadius: 6
                }}>
                  <span style={{ color: "#22C55E" }}>✓</span> {perm}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Immediate Actions Card */}
      <div style={{
        background: "white",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        padding: "20px",
        marginBottom: 32 // Added margin spacing here
      }}>
        <h3 style={{ marginBottom: 16, fontWeight: 700, color: "#111827" }}>Tindakan Segera</h3>
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

      {/* 🌟 EMBEDDED SUBSYSTEM PANEL */}
      <div style={{ marginTop: '32px' }}>
        <ChatbotSubsystem />
      </div>

    </div>
  );
};