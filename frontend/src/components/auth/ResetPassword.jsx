import React, { useState } from 'react';

export const ResetPassword = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = () => {
    if (!email.includes("@")) {
      setError("Alamat e-mel tidak dikenali. Sila masukkan e-mel berdaftar MBPG.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleVerifyOTP = () => {
    if (otp.length < 4) {
      setError("Masukkan OTP 6 digit yang dihantar ke e-mel anda.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleReset = () => {
    if (newPassword.length < 8 || !/[!@#$%^&*]/.test(newPassword)) {
      setError("Kata laluan mesti sekurang-kurangnya 8 aksara dan mengandungi aksara khas (!@#$%^&*).");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Kata laluan tidak sepadan.");
      return;
    }
    setError("");
    setStep(4);
    if (onComplete) {
      setTimeout(onComplete, 2000);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 68px)",
      background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
      padding: "40px 20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: 20,
        padding: "48px 40px",
        maxWidth: 420,
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)"
      }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6B7280",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
            padding: 0
          }}
        >
          ← Kembali
        </button>

        {/* Progress Bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 4,
                background: step >= s ? "#2563EB" : "#E5E7EB",
                transition: "background 0.3s"
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
              Masukkan e-mel anda
            </div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>
              Kami akan menghantar kod OTP ke e-mel berdaftar anda.
            </div>

            {error && (
              <div style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                color: "#DC2626",
                marginBottom: 16
              }}>
                ⚠️ {error}
              </div>
            )}

            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6B7280",
              marginBottom: 4,
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>E-mel Berdaftar</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@mbpg.gov.my"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid #D1D5DB",
                borderRadius: 10,
                fontSize: 14,
                background: "#fff",
                color: "#111827",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 20
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563EB"}
              onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
            />

            <button
              onClick={handleSendOTP}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                background: "#2563EB",
                color: "#fff",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#3B82F6"}
              onMouseLeave={(e) => e.target.style.background = "#2563EB"}
            >
              Hantar OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
              Masukkan OTP
            </div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>
              Kod 6 digit telah dihantar ke <strong style={{ color: "#111827" }}>{email}</strong>.
            </div>

            {error && (
              <div style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                color: "#DC2626",
                marginBottom: 16
              }}>
                ⚠️ {error}
              </div>
            )}

            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6B7280",
              marginBottom: 4,
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>Kod Pengesahan</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="• • • • • •"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid #D1D5DB",
                borderRadius: 10,
                fontSize: 20,
                fontWeight: 700,
                textAlign: "center",
                letterSpacing: "0.3em",
                background: "#fff",
                color: "#111827",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 20
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563EB"}
              onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
            />

            <button
              onClick={handleVerifyOTP}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                background: "#2563EB",
                color: "#fff",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#3B82F6"}
              onMouseLeave={(e) => e.target.style.background = "#2563EB"}
            >
              Sahkan OTP
            </button>

            <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#6B7280" }}>
              Tidak terima? <span style={{ color: "#2563EB", cursor: "pointer" }}>Hantar semula</span>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
              Kata laluan baharu
            </div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>
              Minimum 8 aksara dengan sekurang-kurangnya satu aksara khas (!@#$%^&*).
            </div>

            {error && (
              <div style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                color: "#DC2626",
                marginBottom: 16
              }}>
                ⚠️ {error}
              </div>
            )}

            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6B7280",
              marginBottom: 4,
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>Kata Laluan Baharu</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Kata laluan baharu"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid #D1D5DB",
                borderRadius: 10,
                fontSize: 14,
                background: "#fff",
                color: "#111827",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 12
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563EB"}
              onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
            />

            <label style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6B7280",
              marginBottom: 4,
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>Sahkan Kata Laluan</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulang kata laluan"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid #D1D5DB",
                borderRadius: 10,
                fontSize: 14,
                background: "#fff",
                color: "#111827",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 20
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563EB"}
              onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
            />

            <button
              onClick={handleReset}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                background: "#2563EB",
                color: "#fff",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#3B82F6"}
              onMouseLeave={(e) => e.target.style.background = "#2563EB"}
            >
              Kemaskini Kata Laluan
            </button>
          </>
        )}

        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20 }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              background: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              marginBottom: 20
            }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 8, textAlign: "center" }}>
              Kata laluan berjaya dikemaskini
            </div>
            <div style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>
              Kata laluan baharu anda telah disimpan. Sila log masuk semula.
            </div>
            <button
              onClick={onBack}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                background: "#2563EB",
                color: "#fff",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#3B82F6"}
              onMouseLeave={(e) => e.target.style.background = "#2563EB"}
            >
              Kembali Log Masuk
            </button>
          </div>
        )}
      </div>
    </div>
  );
};