import React, { useState, useEffect } from 'react';

export const ChatbotSubsystem = ({ role = 'normal' }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  
  // Local state to track manually checked-off tasks
  const [completedTasks, setCompletedTasks] = useState({});

  // Reset checkboxes smoothly when switching roles during your demo
  useEffect(() => {
    setCompletedTasks({});
  }, [role]);

  const handleToggleTask = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // 1. Dynamic Chat Content & Document Recommendations based on Roles
  const getRoleBasedMessages = () => {
    const baseMessages = [
      {
        id: 1,
        sender: 'bot',
        text: 'Selamat datang! Saya Pembantu AI Orang Awam. Ada apa yang boleh saya bantu mengenai perkhidmatan MBPG?',
      },
      {
        id: 2,
        sender: 'user',
        text: 'Boleh saya dapatkan dokumen rujukan terkini untuk tugasan saya?',
      }
    ];

    if (role === 'executive') {
      return [
        ...baseMessages,
        {
          id: 3,
          sender: 'bot',
          text: 'Untuk peringkat Pengurusan Eksekutif, berikut adalah laporan analisis prestasi perkhidmatan perbandaran dan dokumen polisi strategik MBPG.',
          recommendation: {
            title: 'Laporan Strategik & Analisis Prestasi MBPG 2026.pdf',
            link: '#/docs/executive-report'
          }
        }
      ];
    } else if (role === 'experienced') {
      return [
        ...baseMessages,
        {
          id: 3,
          sender: 'bot',
          text: 'Berikut adalah manual teknikal pengurusan data tacit dan sistem input pengetahuan untuk panduan pengesahan anda.',
          recommendation: {
            title: 'Manual Pengesahan Validasi Pengetahuan_v2.pdf',
            link: '#/docs/experienced-validation'
          }
        }
      ];
    } else {
      return [
        ...baseMessages,
        {
          id: 3,
          sender: 'bot',
          text: 'Berikut adalah garis panduan umum permohonan lesen perniagaan dan piagam pelanggan untuk rujukan harian anda.',
          recommendation: {
            title: 'Garis Panduan Am Permohonan Lesen Perniagaan.pdf',
            link: '#/docs/general-guidelines'
          }
        }
      ];
    }
  };

  // 2. Dynamic Tasks and Action Paths matching the Workflow Routing
  const getRoleBasedTasks = () => {
    switch(role) {
      case 'executive':
        return [
          { id: 'exec_1', text: 'Semak ringkasan eksekutif papan pemuka (Dashboard)', path: '#/executive/summary' },
          { id: 'exec_2', text: 'Sahkan kelulusan permohonan dana fasa kedua SmartWork AI', path: '#/executive/approvals' }
        ];
      case 'experienced':
        return [
          { id: 'exp_1', text: 'Sahkan borang kemasukan modul tacit pegawai baharu', path: '#/experienced/tacit-input' },
          { id: 'exp_2', text: 'Kemas kini maklum balas pengesahan repositori data', path: '#/experienced/validation' }
        ];
      default:
        return [
          { id: 'norm_1', text: 'Kemaskini profil maklumat peribadi pengguna', path: '#/profile/edit' },
          { id: 'norm_2', text: 'Hantar maklum balas borang pendaftaran umum MBPG', path: '#/forms/feedback' }
        ];
    }
  };

  const messages = getRoleBasedMessages();
  const tasks = getRoleBasedTasks();

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', zIndex: 9999 }}>
      
      {/* ========================================================= */}
      {/* CHATBOT FLOATING WINDOW                                   */}
      {/* ========================================================= */}
      {isChatOpen && (
        <div style={{
          width: '360px', height: '420px', backgroundColor: '#FFFFFF',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)', borderRadius: '16px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #E5E7EB',
          marginBottom: '4px'
        }}>
          {/* Header */}
          <div style={{ backgroundColor: '#1E40AF', padding: '14px', color: '#FFFFFF' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>SmartWork AI Assistant</h4>
            <div style={{ margin: '2px 0 0 0', fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 'bold' }}>
              Akses Mod: {role}
            </div>
          </div>

          {/* Messages Loop */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', backgroundColor: '#F9FAFB' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', fontSize: '13px',
                  backgroundColor: msg.sender === 'user' ? '#1E40AF' : '#E5E7EB',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#1F2937'
                }}>
                  {msg.text}

                  {/* Recommendation Module nested cleanly inside chat bubble without using span tags */}
                  {msg.recommendation && (
                    <div style={{
                      marginTop: '8px', padding: '8px', backgroundColor: '#FFFFFF',
                      borderRadius: '6px', border: '1px solid #CBD5E1', display: 'flex',
                      flexDirection: 'column', gap: '2px'
                    }}>
                      <div style={{ fontSize: '10px', color: '#E4A11B', fontWeight: 'bold' }}>DOKUMEN CADANGAN ({role.toUpperCase()}):</div>
                      <a href={msg.recommendation.link} style={{ fontSize: '12px', color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>
                        📄 {msg.recommendation.title}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '10px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '6px' }}>
            <input type="text" placeholder="Tanya sesuatu..." style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }} />
            <button style={{ backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Hantar</button>
          </div>
        </div>
      )}

      {/* Floating Chat Bubble Toggle */}
      <button 
        onClick={() => { setIsChatOpen(!isChatOpen); setIsTasksOpen(false); }}
        style={{
          width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#1E40AF',
          color: '#FFFFFF', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
        }}
      >
        {isChatOpen ? '✕' : '🤖'}
      </button>


      {/* ========================================================= */}
      {/* INTERACTIVE TUGASAN AKTIF WINDOW                          */}
      {/* ========================================================= */}
      {isTasksOpen && (
        <div style={{
          width: '320px', backgroundColor: '#FFFFFF', borderRadius: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #E5E7EB', padding: '14px',
          marginBottom: '4px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1F2937', marginBottom: '12px' }}>
            📋 Tugasan Aktif Hari Ini ({role})
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map((task) => {
              const isChecked = !!completedTasks[task.id];
              return (
                <div 
                  key={task.id} 
                  style={{ 
                    padding: '10px', 
                    backgroundColor: isChecked ? '#F0FDF4' : '#F3F4F6', 
                    borderRadius: '8px', 
                    borderLeft: isChecked ? '4px solid #16A34A' : '4px solid #D97706',
                    opacity: isChecked ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => handleToggleTask(task.id)}
                      style={{ marginTop: '2px', cursor: 'pointer' }}
                    />
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#1F2937', 
                      textDecoration: isChecked ? 'line-through' : 'none',
                      fontWeight: '500',
                      lineHeight: '1.4'
                    }}>
                      {task.text}
                    </div>
                  </div>

                  {/* Activity Jump Action Button */}
                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                    <a 
                      href={task.path}
                      style={{ 
                        fontSize: '11px', 
                        color: isChecked ? '#15803D' : '#2563EB', 
                        textDecoration: 'none', 
                        fontWeight: '600',
                        backgroundColor: '#FFFFFF',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: isChecked ? '#BBF7D0' : '#BFDBFE'
                      }}
                    >
                      Mula Aktiviti →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Tasks Bubble Toggle */}
      <button 
        onClick={() => { setIsTasksOpen(!isTasksOpen); setIsChatOpen(false); }}
        style={{
          width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#D97706',
          color: '#FFFFFF', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
        }}
      >
        {isTasksOpen ? '✕' : '📋'}
      </button>

    </div>
  );
};

export default ChatbotSubsystem;