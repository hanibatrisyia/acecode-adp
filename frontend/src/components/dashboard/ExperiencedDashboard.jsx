import React, { useState } from 'react';
import ChatbotSubsystem from '../chatbot/ChatbotSubsystem';

export const ExperiencedDashboard = ({ user }) => {
   const [activeTab, setActiveTab] = useState('tacit'); // Default to 'tacit' since 'upload' (UC011) is locked for this role!
  const [uploadType, setUploadType] = useState('SOP'); 
  const [justification, setJustification] = useState('');
  const [tacitTitle, setTacitTitle] = useState('');
  const [tacitInsight, setTacitInsight] = useState('');
  const [tacitDept, setTacitDept] = useState('Valuation');
  const [attachedFile, setAttachedFile] = useState(null);

  const handleDocumentUpload = (e) => {
    e.preventDefault();
    alert('Dokumen berjaya dihantar!\nFail anda akan disemak dan diletakkan dalam baris gilir pengesahan untuk tindakan Kakitangan Eksekutif.');
    setAttachedFile(null);
    setJustification('');
  };

  const handleTacitSubmission = (e) => {
    e.preventDefault();
    if (!tacitTitle.trim() || !tacitInsight.trim()) {
      alert("Sila isi ruangan Tajuk dan Nota Penjelasan! Maklumat ini penting dan tidak boleh dibiarkan kosong.");
      return;
    }
    alert("Nota pengalaman kerja anda berjaya disimpan dan dihantar ke senarai semakan sistem!");
    setTacitTitle('');
    setTacitInsight('');
  };
  return (
    <div style={{ 
      padding: "32px", 
      maxWidth: 1200, 
      margin: "0 auto",
      background: '#F8FAFF',
       minHeight: 'calc(100vh - 68px)',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Welcome Banner */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>
          Selamat datang, {user?.name || 'Experienced'}! 🎯
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          Kakitangan Berpengalaman · {user?.jabatan || 'Unit Cukai'}
        </p>
      </div>

      {/* Stats Cards */}
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

        <div style={{ background: "white", borderRadius: 12, border: "1px solid #E5E7EB", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Memasukkan Data &amp; Pengetahuan</h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>Gunakan modul ini untuk menyimpan dokumen rasmi atau berkongsi pengalaman kerja ke dalam sistem SmartWork AI MBPG.</p>
        
        {/* Tab Selection Row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, borderBottom: "2px solid #E5E7EB" }}>
          <button 
            onClick={() => setActiveTab('upload')}
            style={{
               background: "none", border: "none", padding: "10px 16px", fontSize: 15, fontWeight: 600, cursor: "pointer",
              color: activeTab === 'upload' ? "#2563EB" : "#6B7280",
              borderBottom: activeTab === 'upload' ? "3px solid #2563EB" : "transparent", marginBottom: "-2px"
            }}>
            Dokumen &amp; Aliran Kerja Rasmi 
          </button>
          <button 
            onClick={() => setActiveTab('tacit')}
            style={{
              background: "none", border: "none", padding: "10px 16px", fontSize: 15, fontWeight: 600, cursor: "pointer",
              color: activeTab === 'tacit' ? "#B45309" : "#6B7280",
              borderBottom: activeTab === 'tacit' ? "3px solid #B45309" : "transparent", marginBottom: "-2px"
            }}>
            Kongsi Pengalaman Kerja (Tacit Knowledge)
          </button>
        </div>
      </div>

 {/* Tab 1: Locked View for Experienced Staff */}
        {activeTab === 'upload' && (
          <div style={{
            backgroundColor: "#FEF2F2", 
            border: "1px solid #FCA5A5", 
            borderRadius: "6px", 
            padding: "2.5rem", 
            textAlign: "center", 
            color: "#991B1B"
          }}>
            <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>🔒</span>
            <strong>Akses Disekat :</strong> Fungsi muat naik SOP rasmi ini hanya boleh dibuka oleh <strong>Kakitangan Eksekutif</strong> sahaja. Sila gunakan tab "Kongsi Pengalaman Kerja (Tacit Knowledge)" yang disediakan untuk peranan anda.
          </div>
        )}

        {/* Tab 2: Capture Unstructured Tacit Knowledge (UC012) - Fully Open */}
        {activeTab === 'tacit' && (
          <form onSubmit={handleTacitSubmission} style={{ borderLeft: "4px solid #B45309", paddingLeft: 20 }}>
            <div style={{ display: "flex", justify: "space-between", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#B45309", margin: 0 }}>Rekod Pengalaman &amp; Cara Kerja (Tacit Knowledge)</h3>
              <span style={{ fontSize: 11, background: "#FFFBEB", color: "#B45309", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>Akses: Kakitangan Berpengalaman / Eksekutif</span>
            </div>
            <p style={{ fontSize: 13, color: "#4B5563", marginBottom: 20 }}>Ruangan ini digunakan oleh pegawai senior atau kakitangan lama untuk menulis petua kerja, cara selesaikan masalah, atau selok-belok kerja yang tiada dalam buku panduan rasmi sebelum bersara.</p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Jabatan Terlibat</label>
              <select value={tacitDept} onChange={(e) => setTacitDept(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 14, outline: "none" }}>
                <option value="Finance">Kewangan &amp; Hasil (Cukai Harta)</option>
                <option value="Valuation">Penilaian &amp; Pengurusan Harta</option>
                <option value="Licensing">Pelesenan &amp; Penguatkuasaan</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Tajuk Panduan / Isu Kerja</label>
              <input 
                type="text" 
                value={tacitTitle}
                onChange={(e) => setTacitTitle(e.target.value)}
                placeholder="cth: Cara semak akaun cukai jika pemilik asal sudah meninggal dunia" 
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 14, outline: "none" }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Tulis Penjelasan / Nota Cara Kerja Di Sini</label>
              <textarea 
                rows={5}
                value={tacitInsight}
                onChange={(e) => setTacitInsight(e.target.value)}
                placeholder="Tuliskan langkah-langkah, cara penyelesaian masalah, atau nota penting secara terperinci..."
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            <button type="submit" style={{ padding: "12px 24px", background: "#B45309", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              Simpan Nota Pengalaman
            </button>
          </form>
        )}
        
      {/* 🌟 EMBEDDED SUBSYSTEM PANEL */}
      <div style={{ marginTop: '32px' }}>
        <ChatbotSubsystem />
      </div>

    </div>
  );
};