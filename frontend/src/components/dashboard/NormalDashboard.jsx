import React from 'react';
import { ChatbotSubsystem } from '/src/components/chatbot/ChatbotSubsystem';
export const NormalDashboard = ({ user }) => {
  console.log('NormalDashboard rendering');
  
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
          Selamat datang, {user?.name }! 📋
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          Kakitangan Biasa · {user?.jabatan || 'Unit IT'}
        </p>
      </div>

      <div style={{
        background: "white",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        padding: "20px"
      }}>
        <h3 style={{ marginBottom: 16 }}>Dokumen Terkini</h3>
        {[
          "SOP Permohonan Lesen Perniagaan v2.0",
          "Prosedur Rayuan Cukai Taksiran",
          "Panduan Pendaftaran Harta Baru",
        ].map((doc, i) => (
          <div key={i} style={{
            padding: "12px 0",
            borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <span style={{ fontSize: 16 }}>📄</span>
            <span style={{ fontSize: 14, color: "#374151" }}>{doc}</span>
          </div>
        ))}
      </div>
      <div className="mt-8">
         <ChatbotSubsystem />
         </div>
    </div>
  );
};