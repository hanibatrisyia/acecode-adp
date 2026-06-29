import React, { useState } from 'react';
import { C } from '../../styles/theme';
import { rolePermissions } from '../../data/mockData';
import { getRoleColor } from '../../utils/helpers';
import { ChatbotSubsystem } from '/src/components/chatbot/ChatbotSubsystem';
export const ExecutiveDashboard = ({ user }) => {
  const [showPermissions, setShowPermissions] = useState(false);
  const userPermissions = rolePermissions[user?.role]?.permissions || [];
  const [inputTab, setInputTab] = useState('upload'); // 'upload' or 'tacit'
  const [uploadType, setUploadType] = useState('SOP'); // 'SOP' or 'WORKFLOW'
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

  const [activeValidationTab, setActiveValidationTab] = useState('all'); 
  const [validationRows, setValidationRows] = useState([
    { id: 'SUB-1014', infoTitle: 'Pindaan_Manual_Borang_I_Cukai_Tanah_V2.pdf', subText: 'Sebab: Nak selaraskan borang cukai harta tanah dengan undang-undang tanah negeri yang baharu.', sender: 'Hani Batrisyia (Admin)', dataType: 'SOP', date: '2026-06-05 14:22', badgeBg: '#E0F2FE', badgeColor: '#0369A1' },
    { id: 'SUB-1015', infoTitle: 'Masalah Semakan IC pada Akaun Harta Tanah', subText: 'Nota: Kalau sistem tak dapat baca IC pemohon, buat semakan manual terus menggunakan kod lejar pangkalan data.', sender: 'Ainin Sofiya (Pegawai Senior)', dataType: 'Tacit', date: '2026-06-07 09:11', badgeBg: '#FEF3C7', badgeColor: '#B45309' }
  ]);

  const handleValidateAction = (id, resolution) => {
    let reason = "";
    if (resolution === 'Tolak') {
      reason = prompt("Sila tulis alasan atau ulasan kenapa anda menolak dokumen ini:");
      if (reason === null) return; 
      if (reason.trim() === "") {
        alert("Tindakan dibatalkan. Anda wajib menulis alasan jika mahu menolak sesuatu dokumen.");
        return;
      }
    } else {
      const level = confirm("Adakah dokumen ini mengandungi maklumat sulit (Private Data)?\n\n[Klik OK jika Sulit / Klik Cancel jika boleh dikongsi sebagai FAQ Awam]");
      reason = level ? "Aset dikunci sebagai Dokumen Sulit Dalaman" : "Aset dikongsi sebagai FAQ Paparan Awam";
    }

    alert(`Status Kemas Kini Berjaya:\nDokumen ${id} telah ditanda sebagai '${resolution}'. Tindakan ini telah direkodkan dalam sistem atas alasan: ${reason}`);
    setValidationRows(prevRows => prevRows.filter(row => row.id !== id));
  };

  const filteredValidationItems = validationRows.filter(item => {
    if (activeValidationTab === 'all') return true;
    return item.dataType.toLowerCase() === activeValidationTab.toLowerCase();
  });

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
           Selamat datang, {user?.name || 'Siti binti Abu'}! 👔
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          Kakitangan Eksekutif · {user?.jabatan || 'Unit Pentadbiran'}
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
         <div key={stat.label} style={{ background: "white", padding: "20px", borderRadius: 14, border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setShowPermissions(!showPermissions)}
          style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #E5E7EB", background: C.white, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 8 }}
        >
          {showPermissions ? "🔽" : "▶️"} Lihat Kebenaran Saya
        </button>

        {showPermissions && (
           <div style={{ marginTop: 12, background: C.white, borderRadius: 12, border: "1px solid #E5E7EB", padding: "20px" }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Peranan: </span>
              <span style={{ padding: "2px 12px", borderRadius: 12, fontSize: 13, fontWeight: 600, background: getRoleColor(user?.role).bg, color: getRoleColor(user?.role).text }}>
                Kakitangan Eksekutif
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {userPermissions.map((perm, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151", padding: "4px 8px", background: "#F9FAFB", borderRadius: 6 }}>
                  <span style={{ color: "#22C55E" }}>✓</span> {perm}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ background: "white", borderRadius: 12, border: "1px solid #E5E7EB", padding: "20px", marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16, fontWeight: 700, color: "#111827" }}>Tindakan Segera</h3>
        {[
          "SOP Permohonan Lesen Perniagaan v2.0 - Menunggu semakan",
          "Pengetahuan Tersirat - Proses Rayuan Cukai",
          "Kemaskini Aliran Kerja - Unit Cukai"
        ].map((item, i) => (
          <div key={i} style={{ padding: "12px 0", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
            <span style={{ fontSize: 14, color: "#374151" }}>• {item}</span>
          </div>
        ))}
      </div>

            <div style={{ background: "white", borderRadius: 12, border: "1px solid #E5E7EB", padding: "24px", marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A4D92", marginBottom: 8 }}>Memasukkan Data &amp; Pengetahuan</h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>Gunakan modul ini untuk menyimpan dokumen rasmi atau berkongsi pengalaman kerja ke dalam sistem SmartWork AI MBPG.</p>
        
        {/* Submodule Menu Tabs */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, borderBottom: "2px solid #E5E7EB" }}>
          <button 
            onClick={() => setInputTab('upload')}
            style={{ background: "none", border: "none", padding: "10px 16px", fontSize: 15, fontWeight: 600, cursor: "pointer", color: inputTab === 'upload' ? "#2563EB" : "#6B7280", borderBottom: inputTab === 'upload' ? "3px solid #2563EB" : "transparent", marginBottom: "-2px" }}>
            Dokumen &amp; Aliran Kerja Rasmi
          </button>
          <button 
            onClick={() => setInputTab('tacit')}
            style={{ background: "none", border: "none", padding: "10px 16px", fontSize: 15, fontWeight: 600, cursor: "pointer", color: inputTab === 'tacit' ? "#B45309" : "#6B7280", borderBottom: inputTab === 'tacit' ? "3px solid #B45309" : "transparent", marginBottom: "-2px" }}>
            Kongsi Pengalaman Kerja (Tacit Knowledge)
          </button>
        </div>

        {/* Tab 1: Upload Official SOPs & Workflow Updates (Fully Allowed for Executive Staff!) */}
        {inputTab === 'upload' && (
          <form onSubmit={handleDocumentUpload} style={{ borderLeft: "4px solid #2563EB", paddingLeft: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E3A8A", margin: 0 }}>Muat Naik Dokumen / Kemas Kini Aliran Kerja</h3>
              <span style={{ fontSize: 11, background: "#EFF6FF", color: "#2563EB", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>Akses Dibenarkan</span>
            </div>
            
            <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 24 }}>Sila muat naik fail SOP rasmi atau hantar kemas kini tentang cara kerja jabatan untuk disimpan dalam sistem.</p>
            
            <div 
              onClick={() => setAttachedFile('SOP_Pelepasan_Cukai_Harta_Tanah_MBPG.pdf')}
              style={{ border: "2px dashed #93C5FD", background: "#F0F9FF", borderRadius: 8, padding: "32px", textAlign: "center", cursor: "pointer", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1E40AF", marginBottom: 8}}>Seret dan lepaskan fail di sini, atau klik untuk pilih fail</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 20}}>Jenis fail yang diterima: PDF, DOCX, XLSX (Maksimum 25MB)</div>
              {attachedFile && <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: "#10B981" }}>✓ Fail Dilampirkan: {attachedFile}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Jenis Dokumen Yang Dihantar</label>
              <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 14, outline: "none" }}>
                <option value="SOP">Dokumen Prosedur Operasi Standard (SOP) Baharu</option>
                <option value="WORKFLOW">Kemas Kini Aliran Kerja Jabatan Sedia Ada</option>
              </select>
            </div>

            {/* Conditional Workflow Update Justification (UC013) */}
            {uploadType === 'WORKFLOW' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Sebab Perubahan (Justifikasi Kerja)</label>
                <input type="text" value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="cth: Mengikut dasar pindaan tanah baharu..." style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 14, outline: "none" }} />
              </div>
            )}

            <button type="submit" style={{ padding: "12px 24px", background: "#2563EB", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Hantar Dokumen</button>
          </form>
        )}

        {/* Tab 2: Capture Tacit Knowledge Entry (UC012) */}
        {inputTab === 'tacit' && (
          <form onSubmit={handleTacitSubmission} style={{ borderLeft: "4px solid #B45309", paddingLeft: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#B45309", marginBottom: 12 }}>Rekod Pengalaman &amp; Cara Kerja (Tacit Knowledge)</h3>
             <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 24 }}>Ruangan ini digunakan oleh pegawai senior atau kakitangan lama untuk menulis petua kerja, cara selesaikan masalah, atau selok-belok kerja yang tiada dalam buku panduan rasmi sebelum bersara.</p>

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
              <input type="text" value={tacitTitle} onChange={(e) => setTacitTitle(e.target.value)} placeholder="cth: Cara semak akaun cukai jika pemilik asal sudah meninggal dunia" style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 14, outline: "none" }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Tulis Penjelasan / Nota Cara Kerja Di Sini</label>
              <textarea rows={4} value={tacitInsight} onChange={(e) => setTacitInsight(e.target.value)} placeholder="Tuliskan langkah-langkah, cara penyelesaian masalah, atau nota penting secara terperinci..." style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            </div>

            <button type="submit" style={{ padding: "12px 24px", background: "#B45309", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Simpan Nota Pengalaman</button>
          </form>
        )}
      </div>



      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Senarai Pengesahan Pengetahuan</h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>Ruangan khas untuk Kakitangan Eksekutif menyemak semula semua dokumen atau nota pengalaman yang dihantar sebelum ia dimasukkan secara rasmi ke dalam sistem.</p>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            {/* Table Filters from your design */}
            <div style={{ display: "flex", gap: 8 }}>
              {['all', 'SOP', 'Tacit'].map(type => (
                <button key={type} onClick={() => setActiveValidationTab(type)} style={{ padding: "6px 12px", border: "1px solid #D1D5DB", background: activeValidationTab === type ? "#EFF6FF" : "white", color: activeValidationTab === type ? "#2563EB" : "#374151", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  {type === 'all' ? 'Semua' : type}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: "#4B5563", fontWeight: 600 }}>{filteredValidationItems.length} dokumen menunggu giliran</span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #E5E7EB", background: "#F9FAFB" }}>
                <th style={{ padding: "12px", fontSize: 12, fontWeight: 700 }}>ID</th>
                <th style={{ padding: "12px", fontSize: 12, fontWeight: 700 }}>Maklumat Dokumen</th>
                <th style={{ padding: "12px", fontSize: 12, fontWeight: 700 }}>Pengirim</th>
                <th style={{ padding: "12px", fontSize: 12, fontWeight: 700 }}>Jenis</th>
                <th style={{ padding: "12px", fontSize: 12, fontWeight: 700, textAlign: "center" }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredValidationItems.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "14px 12px", fontSize: 13, fontWeight: 700 }}>{row.id}</td>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{row.infoTitle}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{row.subText}</div>
                  </td>
                  <td style={{ padding: "14px 12px", fontSize: 13 }}>{row.sender}</td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{ background: row.badgeBg, color: row.badgeColor, fontSize: 11, padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>{row.dataType}</span>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <button onClick={() => handleValidateAction(row.id, 'Lulus')} style={{ padding: "6px 12px", fontSize: 12, background: "#10B981", color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Lulus</button>
                      <button onClick={() => handleValidateAction(row.id, 'Tolak')} style={{ padding: "6px 12px", fontSize: 12, background: "#EF4444", color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Tolak</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🌟 EMBEDDED SUBSYSTEM PANEL */}
      <div style={{ marginTop: '32px' }}>
        <ChatbotSubsystem role = "executive" />
      </div>

    </div>
  );
};