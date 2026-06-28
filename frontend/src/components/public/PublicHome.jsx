import React, { useState, useRef, useEffect } from 'react';
import { C } from '../../styles/theme';
import { publicFAQ, matchFAQ } from '../../data/mockData';

export const PublicHome = () => {
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "Selamat datang ke SmartWork AI MBPG. Saya sedia membantu anda dengan maklumat perkhidmatan Majlis Bandaraya Pasir Gudang. Sila taip soalan anda." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const quickQuestions = [
    "Cara bayar cukai taksiran",
    "Tarikh akhir bayaran",
    "Kadar cukai hartanah",
    "Cara buat rayuan",
    "Semak amaun cukai",
    "Pengecualian cukai"
  ];

  const handleSend = () => {
    const question = input.trim();
    if (!question) return;

    setMessages(prev => [...prev, { from: "user", text: question }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const match = matchFAQ(question);
      const answer = match
        ? match.jawapan
        : "Terima kasih atas soalan anda. Untuk maklumat lebih terperinci, sila hubungi Unit Cukai MBPG di 07-251 1111 atau kunjungi kaunter kami di Jalan Bandaraya, Pasir Gudang (Isnin–Jumaat, 8:00pg – 5:00ptg). Layari juga mbpg.gov.my untuk maklumat terkini.";
      
      setMessages(prev => [...prev, { from: "bot", text: answer }]);
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div style={{
      minHeight: "calc(100vh - 68px)",
      background: "linear-gradient(180deg, #0F1B3D 0%, #1A2A5A 100%)",
      color: C.white,
      padding: "0",
      fontFamily: "'Segoe UI', 'Inter', sans-serif"
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "60px 32px 40px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center"
      }}>
        {/* Left Column */}
        <div>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(37,99,235,0.2)",
            border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 24
          }}>
            <span style={{ fontSize: 14 }}>🏛️</span>
            <span style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>
              Majlis Bandaraya Pasir Gudang
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 16,
            color: C.white,
            letterSpacing: "-0.02em"
          }}>
            Pusat Pengetahuan<br />
            <span style={{ color: C.accent }}>Digital MBPG</span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 16,
            color: C.text,
            lineHeight: 1.7,
            maxWidth: 460,
            marginBottom: 36
          }}>
            Akses maklumat perkhidmatan, prosedur, dan panduan Majlis Bandaraya Pasir Gudang dengan mudah melalui chatbot AI kami.
          </p>
        </div>

        {/* Right Column - Chatbot */}
        <div style={{
          background: "rgba(30,45,90,0.7)",
          border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)"
        }}>
          {/* Chat Header */}
          <div style={{
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Pembantu AI Orang Awam</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                Tanya tentang perkhidmatan MBPG
              </div>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.1)",
              padding: "4px 12px",
              borderRadius: 20
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: 11, color: "#86EFAC" }}>Dalam talian</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{
            height: 360,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "rgba(15,27,61,0.5)"
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                gap: 8,
                alignItems: "flex-end"
              }}>
                {msg.from === "bot" && (
                  <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "78%",
                  padding: "10px 16px",
                  borderRadius: msg.from === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background: msg.from === "user"
                    ? "linear-gradient(135deg, #2563EB, #1D4ED8)"
                    : "rgba(255,255,255,0.08)",
                  color: C.white,
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  border: msg.from === "bot" ? "1px solid rgba(96,165,250,0.15)" : "none",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14
                }}>🤖</div>
                <div style={{
                  padding: "10px 18px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(96,165,250,0.15)",
                  display: "flex",
                  gap: 5,
                  alignItems: "center"
                }}>
                  {[0, 1, 2].map(n => (
                    <div key={n} style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: C.accent,
                      animation: `bounce 0.9s ${n * 0.2}s ease-in-out infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div style={{
            padding: "10px 16px",
            borderTop: "1px solid rgba(96,165,250,0.15)",
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            background: "rgba(15,27,61,0.4)"
          }}>
            {quickQuestions.map(q => (
              <button
                key={q}
                onClick={() => setInput(q)}
                style={{
                  background: "rgba(37,99,235,0.2)",
                  border: "1px solid rgba(96,165,250,0.25)",
                  color: C.accent,
                  borderRadius: 20,
                  padding: "5px 14px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(37,99,235,0.4)";
                  e.target.style.borderColor = C.accent;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(37,99,235,0.2)";
                  e.target.style.borderColor = "rgba(96,165,250,0.25)";
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(96,165,250,0.15)",
            display: "flex",
            gap: 10,
            background: "rgba(15,27,61,0.6)"
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Taip soalan tentang cukai..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(96,165,250,0.2)",
                borderRadius: 10,
                padding: "11px 16px",
                color: C.white,
                fontSize: 14,
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = C.accent;
                e.target.style.background = "rgba(255,255,255,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(96,165,250,0.2)";
                e.target.style.background = "rgba(255,255,255,0.06)";
              }}
            />
            <button
              onClick={handleSend}
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                border: "none",
                borderRadius: 10,
                width: 48,
                height: 48,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
                transition: "all 0.2s",
                color: "white"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 4px 20px rgba(37,99,235,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div style={{
        background: "rgba(37,99,235,0.08)",
        borderTop: "1px solid rgba(96,165,250,0.1)",
        borderBottom: "1px solid rgba(96,165,250,0.1)",
        padding: "16px 32px"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          gap: 48,
          flexWrap: "wrap"
        }}>
          {[
            { icon: "📞", text: "07-251 1111" },
            { icon: "🕐", text: "Isnin – Jumaat: 8:00pg – 5:00ptg" },
            { icon: "📍", text: "Jalan Bandaraya, Pasir Gudang" },
            { icon: "🌐", text: "mbpg.gov.my" },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              color: C.text
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px 48px" }}>
        <div style={{
          background: "rgba(37,99,235,0.1)",
          border: "1px solid rgba(96,165,250,0.15)",
          borderRadius: 12,
          padding: "16px 20px",
          display: "flex",
          gap: 12,
          alignItems: "flex-start"
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>ℹ️</span>
          <div>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.accent,
              marginBottom: 4
            }}>
              Maklumat Awam Sahaja
            </div>
            <div style={{
              fontSize: 13,
              color: C.muted,
              lineHeight: 1.6
            }}>
              Chatbot ini menyediakan maklumat umum berkaitan cukai taksiran untuk orang awam. 
              Untuk akses sistem dalaman, dokumen SOP organisasi, dan pengetahuan dalaman MBPG, 
              sila log masuk sebagai kakitangan.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(96,165,250,0.4);
          border-radius: 2px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(96,165,250,0.6);
        }
      `}</style>
    </div>
  );
};