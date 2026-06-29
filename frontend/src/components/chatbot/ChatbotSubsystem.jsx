import React, { useState } from 'react';

const RECOMMENDATION_CHIPS = [
  { id: 1, label: "Semak Status Cukai", query: "Bagaimana cara menyemak status cukai harta tanah semasa?" },
  { id: 2, label: "Borang Hak Milik", query: "Dimanakah saya boleh memuat turun borang pertukaran hak milik?" },
  { id: 3, label: "SOP Penilaian Cukai", query: "Sila tunjukkan SOP Penilaian Cukai MBPG Fasa 4.1" }
];

// Realistic mock answers database mapped directly from your SDD scope to look fully functional on screen [cite: 25, 50]
const MOCK_ANSWERS = {
  "default": "Mengikut rujukan SOP Penilaian Cukai MBPG, sila pastikan dokumen hak milik diperiksa bersama Kad Pengenalan asal pemohon untuk mengelakkan ralat prosedur.",
  "Bagaimana cara menyemak status cukai harta tanah semasa?": "Sistem mencatatkan bahawa semakan status cukai harta tanah boleh dibuat secara atas talian melalui Portal Rasmi MBPG (Zon Cukai) atau menggunakan nombor akaun cukai 12-digit di kios fizikal Menara MBPG.",
  "Dimanakah saya boleh memuat turun borang pertukaran hak milik?": "Borang Pertukaran Hak Milik (Borang I) boleh diperoleh secara digital melalui tab 'Rujukan & Panduan Tugas Terkini' di bawah skrin anda, atau diambil terus dari Jabatan Penilaian Cukai Harta.",
  "Sila tunjukkan SOP Penilaian Cukai MBPG Fasa 4.1": "Mengikut rujukan SOP Penilaian Cukai MBPG (Fasa 4.1), setiap permohonan untuk kemas kini maklumat hak milik harta tanah mestilah disemak silang secara fizikal dengan Kad Pengenalan (IC) asal pemohon. Sila pastikan langkah ini diselesaikan terlebih dahulu sebelum anda mengemas kini data ke dalam sistem utama bagi mengelakkan ralat prosedur."
};

export default function ChatbotSubsystem() {
  const [messages, setMessages] = useState([
    {
      id: "init-1",
      role: "system",
      content: "Selamat datang ke SmartWork AI MBPG. Saya sedia membantu anda dengan maklumat perkhidmatan Majlis Bandaraya Pasir Gudang. Sila taip soalan anda."
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeDocIndex, setActiveDocIndex] = useState(0);

  const [recommendedDocs, setRecommendedDocs] = useState([
    {
      title: "SOP_Penilaian_Cukai_Harta_MBPG_v2.pdf",
      page: 12,
      department: "Bahagian Kewangan",
      summary: "Modul Latihan 3: Pengesahan Data dan Hak Milik Tanah Berkanun"
    },
    {
      title: "Manual_Prosedur_Rayuan_Cukai_Taksiran.pdf",
      page: 4,
      department: "Unit Hasil",
      summary: "Modul Latihan 5: Pengurusan Proses Aliran Kerja Rayuan & Penilaian Semula"
    }
  ]);

  const handleSendMessage = (queryText) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage = {
      id: "msg_" + Date.now(),
      role: "user",
      content: queryText
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    setTimeout(() => {
      const matchedAnswer = MOCK_ANSWERS[queryText] || MOCK_ANSWERS["default"];
      
      if (queryText.includes("Borang") || queryText.includes("Rayuan")) {
        setActiveDocIndex(1);
      } else {
        setActiveDocIndex(0);
      }

      setMessages(prev => [...prev, {
        id: "ai_" + Date.now(),
        role: "assistant",
        content: matchedAnswer
      }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column', // Changed to stack everything downwards vertically
      gap: '24px',
      padding: '10px 0',
      maxWidth: '1240px',
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* TOP CONTAINER: Chatbot Terminal Main UI Panel */}
      <div style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px -2px rgba(15, 76, 129, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        height: '550px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Header Block Layout */}
        <div style={{
          backgroundColor: '#0f4c81',
          background: 'linear-gradient(135deg, #0f4c81 0%, #1d6fa5 100%)',
          color: '#ffffff',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '700', letterSpacing: '0.3px' }}>
              Pembantu AI 
            </h2>
            <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#cbd5e1', opacity: 0.9 }}>
              Grounded Retrieval-Augmented Generation Workspace
            </p>
          </div>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '600',
            backgroundColor: '#10b981', 
            color: '#ffffff',
            padding: '4px 10px', 
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
          }}>
            ● Live RAG Pipeline
          </span>
        </div>

        {/* Conversation Logs Container */}
        <div style={{ 
          flex: '1', 
          overflowY: 'auto', 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          backgroundColor: '#fdfefe'
        }}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              <span style={{ 
                fontSize: '10px', 
                fontWeight: '700', 
                color: '#64748b', 
                textTransform: 'uppercase', 
                marginBottom: '5px',
                letterSpacing: '0.5px',
                padding: '0 4px'
              }}>
                {msg.role === 'user' ? '👤 Anda' : '🤖 SmartWork AI'}
              </span>
              
              <div style={{
                padding: '14px 18px',
                borderRadius: '16px',
                maxWidth: '85%',
                fontSize: '14px',
                lineHeight: '1.6',
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(15,76,129,0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
                border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                backgroundColor: msg.role === 'user' ? '#0f4c81' : '#f1f5f9',
                color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                borderTopRightRadius: msg.role === 'user' ? '0' : '16px',
                borderTopLeftRadius: msg.role === 'user' ? '16px' : '0',
              }}>
                <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{msg.content}</p>
              </div>
            </div>
          ))}
          
          {/* Animated Thinking Bubble */}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', marginBottom: '5px' }}>🤖 SmartWork AI</span>
              <div style={{
                padding: '14px 20px',
                borderRadius: '16px',
                borderTopLeftRadius: '0',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Shortcut Chips Bar */}
        <div style={{ 
          padding: '14px 20px', 
          backgroundColor: '#f8fafc', 
          borderTop: '1px solid #e2e8f0', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px' 
        }}>
          {RECOMMENDATION_CHIPS.map(chip => (
            <button
              key={chip.id}
              onClick={() => handleSendMessage(chip.query)}
              disabled={isLoading}
              style={{
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: '#ffffff',
                color: '#475569',
                padding: '7px 14px',
                borderRadius: '9999px',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = '#0f4c81'; e.target.style.color = '#0f4c81'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.color = '#475569'; }}
            >
              🔍 {chip.label}
            </button>
          ))}
        </div>

        {/* User Input Field Submission Area */}
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #e2e8f0', 
          display: 'flex', 
          gap: '10px', 
          backgroundColor: '#ffffff'
        }}>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputQuery)}
            placeholder="Tanya mengenai prosedur kerja atau SOP..."
            disabled={isLoading}
            style={{
              flex: '1',
              padding: '10px 16px',
              fontSize: '14px',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              outline: 'none',
              backgroundColor: isLoading ? '#f8fafc' : '#ffffff'
            }}
          />
          <button
            onClick={() => handleSendMessage(inputQuery)}
            disabled={isLoading}
            style={{
              backgroundColor: '#0f4c81',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(15,76,129,0.25)'
            }}
          >
            Hantar
          </button>
        </div>
      </div>

      {/* BOTTOM CONTAINER: Reference Panels Rendered Horizontally side-by-side Below Chat */}
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: '20px' 
      }}>
        
        {/* Resource Box 1: Grounded Document Reference List */}
        <div style={{ 
          flex: '1',
          minWidth: '280px',
          backgroundColor: '#ffffff', 
          padding: '20px', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)' 
        }}>
          <h3 style={{ 
            margin: '0 0 14px 0', 
            fontSize: '11px', 
            fontWeight: '700', 
            color: '#64748b', 
            borderBottom: '1px solid #e2e8f0', 
            paddingBottom: '10px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.7px' 
          }}>
            1. Rujukan & Panduan Tugas Terkini
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendedDocs.map((doc, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveDocIndex(idx)}
                style={{ 
                  padding: '14px', 
                  backgroundColor: activeDocIndex === idx ? '#f0f7ff' : '#ffffff', 
                  border: activeDocIndex === idx ? '2px solid #0f4c81' : '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <p style={{ margin: '0 0 4px 0', fontWeight: '700', color: activeDocIndex === idx ? '#0f4c81' : '#1e293b' }}>
                  📄 {doc.title}
                </p>
                <p style={{ margin: '0 0 8px 0', color: '#64748b', fontWeight: '500' }}>
                  Rujukan Context: Muka Surat {doc.page}
                </p>
                <span style={{ 
                  backgroundColor: activeDocIndex === idx ? '#0f4c81' : '#e2e8f0', 
                  color: activeDocIndex === idx ? '#ffffff' : '#475569', 
                  padding: '3px 8px', 
                  borderRadius: '6px', 
                  fontWeight: '600',
                  fontSize: '10px'
                }}>
                  {doc.department}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Box 2: Adaptive Personal Learning Onboarding Card */}
        <div style={{ 
          flex: '1',
          minWidth: '280px',
          backgroundColor: '#ffffff', 
          padding: '20px', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)' 
        }}>
          <h3 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '11px', 
            fontWeight: '700', 
            color: '#64748b', 
            borderBottom: '1px solid #e2e8f0', 
            paddingBottom: '10px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.7px' 
          }}>
            2. Pelan Pembelajaran Kendiri
          </h3>
          <div style={{ 
            padding: '14px', 
            backgroundColor: '#fffbeb', 
            border: '1px solid #fef3c7', 
            borderRadius: '12px', 
            fontSize: '12px',
            height: 'fit-content'
          }}>
            <span style={{ fontWeight: '700', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              💡 TUGASAN AKTIF HARI INI:
            </span>
            <p style={{ margin: 0, color: '#78350f', fontWeight: '600', lineHeight: '1.5' }}>
              {recommendedDocs[activeDocIndex].summary}
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>

    </div>
  );
}