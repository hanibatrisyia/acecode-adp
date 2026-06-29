import React, { useState } from 'react';
import { C } from '../../styles/theme';
import { mockUsers, roleLabels, rolePermissions, auditLogs } from '../../data/mockData';
import { getInitials, getRoleColor, getStatusColor } from '../../utils/helpers';
import { ChatbotSubsystem } from '/src/components/chatbot/ChatbotSubsystem';

export const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [users, setUsers] = useState(mockUsers);
  const [permissions, setPermissions] = useState(rolePermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tabs = [
    { id: 'users', label: '👥 Pengguna', count: users.length },
    { id: 'audit', label: '🔍 Log Audit', count: auditLogs.length },
    { id: 'permissions', label: '🔐 Kebenaran' },
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleAssignRole = (userId, newRole) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  const handleRevokeAccess = (userId, reason) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: "Tidak Aktif" } : u
    ));
  };

  const handleRestoreAccess = (userId) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: "Aktif" } : u
    ));
    showToast(`Akses dipulihkan untuk ${users.find(u => u.id === userId)?.name}.`, "success");
  };

  // Inline Modals Components
  const AssignRoleModal = ({ user, onClose, onAssign }) => {
    const [selectedRole, setSelectedRole] = useState(user.role);
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
        <div style={{ background: C.white, borderRadius: 20, padding: "32px", maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <h3 style={{ marginBottom: 8, color: "#111827" }}>Tetapkan Peranan</h3>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Menetapkan peranan kepada <strong>{user.name}</strong>. Perubahan berkuat kuasa serta-merta.</p>
          {Object.entries(roleLabels).map(([roleKey, roleLabel]) => (
            <div key={roleKey} onClick={() => setSelectedRole(roleKey)} style={{ padding: "12px 16px", marginBottom: 8, borderRadius: 10, border: selectedRole === roleKey ? "2px solid #2563EB" : "1px solid #E5E7EB", background: selectedRole === roleKey ? "#EFF6FF" : C.white, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedRole === roleKey ? "#2563EB" : "#D1D5DB"}`, background: selectedRole === roleKey ? "#2563EB" : C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {selectedRole === roleKey && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.white }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{roleLabel}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{permissions[roleKey]?.permissions?.length || 0} kebenaran</div>
              </div>
              <span style={{ padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: getRoleColor(roleKey).bg, color: getRoleColor(roleKey).text }}>{roleKey}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid #E5E7EB", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#6B7280" }}>Batal</button>
            <button onClick={() => { if(selectedRole === user.role){ showToast("Pengguna sudah mempunyai peranan ini.", "warning"); return; } onAssign(user.id, selectedRole); showToast(`Peranan dikemaskini kepada ${roleLabels[selectedRole]} untuk ${user.name}.`); onClose(); }} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "#2563EB", color: C.white, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Simpan Perubahan</button>
          </div>
        </div>
      </div>
    );
  };

  const RevokeAccessModal = ({ user, onClose, onRevoke }) => {
    const [reason, setReason] = useState('');
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
        <div style={{ background: C.white, borderRadius: 20, padding: "32px", maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}><div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto" }}>🚫</div></div>
          <h3 style={{ textAlign: "center", marginBottom: 8, color: "#111827" }}>Batalkan akses {user.name}?</h3>
          <p style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>Ini melumpuhkan akaun serta-merta. Pengguna tidak dapat log masuk sehingga admin memulihkan akses.</p>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>Sebab (untuk audit)</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Contoh: Peletakan jawatan / Pelanggaran keselamatan" rows={3} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #D1D5DB", borderRadius: 10, fontSize: 14, resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 20, fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid #E5E7EB", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#6B7280" }}>Kembali</button>
            <button onClick={() => { if(!reason.trim()){ showToast("Sila berikan sebab untuk batalkan akses.", "warning"); return; } onRevoke(user.id, reason); showToast(`Akses dibatalkan untuk ${user.name}.`, "error"); onClose(); }} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "#DC2626", color: C.white, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Ya, Batalkan Akses</button>
          </div>
        </div>
      </div>
    );
  };

  const PermissionsModal = ({ onClose }) => {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)", overflow: "auto", padding: "20px" }}>
        <div style={{ background: C.white, borderRadius: 20, padding: "32px", maxWidth: 700, width: "100%", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <h3 style={{ marginBottom: 8, color: "#111827" }}>Tetapkan Kebenaran Peranan</h3>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Konfigurasi kebenaran global untuk setiap peranan. Perubahan berkuat kuasa untuk semua pengguna dalam peranan tersebut.</p>
          {Object.entries(permissions).map(([roleKey, roleData]) => (
            <div key={roleKey} style={{ marginBottom: 16, padding: "16px", borderRadius: 12, border: "1px solid #E5E7EB", background: "#F9FAFB" }}>
              <div style={{ display: "flex", alignItems: "center", justifycontent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{roleData.label}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{roleData.permissions.length} kebenaran</div>
                </div>
                <span style={{ padding: "2px 12px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: getRoleColor(roleKey).bg, color: getRoleColor(roleKey).text }}>{roleKey}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {roleData.permissions.map((perm, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151", padding: "4px 8px", background: C.white, borderRadius: 6 }}><span style={{ color: "#22C55E" }}>✓</span> {perm}</div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <button onClick={onClose} style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: "#2563EB", color: C.white, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Tutup</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", position: "relative", minHeight: "100vh" }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 2000, background: toast.type === "error" ? "#FEF2F2" : toast.type === "warning" ? "#FFFBEB" : "#F0FDF4", border: `1px solid ${toast.type === "error" ? "#FECACA" : toast.type === "warning" ? "#FDE68A" : "#BBF7D0"}`, borderRadius: 12, padding: "12px 24px", fontSize: 14, color: toast.type === "error" ? "#DC2626" : toast.type === "warning" ? "#92400E" : "#166534", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          {toast.type === "error" ? "⚠️" : toast.type === "warning" ? "⚠️" : "✅"} {toast.message}
        </div>
      )}

      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>Selamat datang, {user?.name}</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Pentadbir Sistem · {user?.jabatan}</p>
      </div>

      {/* Stats Summary Rows */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Jumlah Pengguna", value: users.length, color: C.blue },
          { label: "Pengguna Aktif", value: users.filter(u => u.status === "Aktif").length, color: "#22C55E" },
          { label: "Akaun Tidak Aktif", value: users.filter(u => u.status === "Tidak Aktif").length, color: "#DC2626" },
          { label: "Jabatan", value: new Set(users.map(u => u.jabatan)).size, color: "#8B5CF6" },
        ].map(stat => (
          <div key={stat.label} style={{ background: C.white, padding: "20px", borderRadius: 14, border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs Layout */}
      <div style={{ display: "flex", gap: 4, background: "#F3F4F6", padding: 4, borderRadius: 12, marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedUser(null); }} style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: activeTab === tab.id ? C.white : "transparent", color: activeTab === tab.id ? "#111827" : "#6B7280", boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {tab.label}
            {tab.count && <span style={{ background: activeTab === tab.id ? "#EFF6FF" : "#E5E7EB", color: activeTab === tab.id ? C.blue : "#6B7280", padding: "1px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <input type="text" placeholder="🔍 Cari nama atau jabatan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #D1D5DB", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          {selectedUser ? (
            <div>
              <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>← Kembali ke Senarai Pengguna</button>
              <div style={{ background: C.white, borderRadius: 12, border: "1px solid #E5E7EB", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #F3F4F6" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: getRoleColor(selectedUser.role).bg, color: getRoleColor(selectedUser.role).text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>{getInitials(selectedUser.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{selectedUser.name}</div>
                    <div style={{ fontSize: 14, color: "#6B7280" }}>{selectedUser.email}</div>
                    <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                      <span style={{ padding: "2px 12px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: getStatusColor(selectedUser.status).bg, color: getStatusColor(selectedUser.status).text }}>{selectedUser.status}</span>
                      <span style={{ padding: "2px 12px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: getRoleColor(selectedUser.role).bg, color: getRoleColor(selectedUser.role).text }}>{roleLabels[selectedUser.role] || selectedUser.role}</span>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Kebenaran Aktif</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {(permissions[selectedUser.role]?.permissions || []).map((perm, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151", padding: "4px 8px", background: "#F9FAFB", borderRadius: 6 }}><span style={{ color: "#22C55E" }}>✓</span> {perm}</div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowRoleModal(true)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: C.blue, color: C.white, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Ubah Peranan</button>
                  <button onClick={() => setShowRevokeModal(true)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "#DC2626", color: C.white, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Batalkan Akses</button>
                </div>
                {selectedUser.status === "Tidak Aktif" && (
                  <button onClick={() => handleRestoreAccess(selectedUser.id)} style={{ width: "100%", marginTop: 10, padding: "12px", borderRadius: 10, border: "1px solid #22C55E", background: "transparent", color: "#166534", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Pulihkan Akses</button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredUsers.map(u => (
                <div key={u.id} onClick={() => setSelectedUser(u)} style={{ background: C.white, padding: "16px 20px", borderRadius: 12, border: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.target.style.borderColor = C.blue} onMouseLeave={(e) => e.target.style.borderColor = "#E5E7EB"}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: getRoleColor(u.role).bg, color: getRoleColor(u.role).text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{getInitials(u.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{u.name}</span><span style={{ padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: getStatusColor(u.status).bg, color: getStatusColor(u.status).text }}>{u.status}</span></div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{u.jabatan}</div>
                    <div style={{ marginTop: 4 }}><span style={{ padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: getRoleColor(u.role).bg, color: getRoleColor(u.role).text, border: `1px solid ${getRoleColor(u.role).border}` }}>{roleLabels[u.role] || u.role}</span></div>
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", textAlign: "right" }}>
                    <div>Log masuk terakhir</div>
                    <div style={{ fontWeight: 500, color: "#6B7280" }}>{u.loginTerakhir}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div style={{ background: C.white, borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: 600, color: "#111827" }}>Log Aktiviti</span><button style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #E5E7EB", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#6B7280" }}>📄 Eksport PDF</button></div>
          {auditLogs.map((log, i) => (
            <div key={i} style={{ padding: "14px 20px", borderBottom: i < auditLogs.length - 1 ? "1px solid #F3F4F6" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{log.pengguna}</div>
                <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{log.tindakan}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>🖥 {log.peranti} · 📡 {log.ip}</div>
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{log.masa}</div>
            </div>
          ))}
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div>
          <button onClick={() => setShowPermissionsModal(true)} style={{ marginBottom: 16, padding: "10px 20px", borderRadius: 10, border: "none", background: C.blue, color: C.white, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>✏️ Kemaskini Kebenaran</button>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {Object.entries(permissions).map(([roleKey, roleData]) => (
              <div key={roleKey} style={{ background: C.white, borderRadius: 12, padding: "20px", border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #F3F4F6" }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: getRoleColor(roleKey).bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div><div><div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{roleData.label}</div><div style={{ fontSize: 11, color: "#6B7280" }}>{roleData.permissions.length} kebenaran</div></div></div>
                {roleData.permissions.map((perm, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#374151" }}><span style={{ color: "#22C55E" }}>✓</span> {perm}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- INTEGRATED SMARTWORK AI SUB-SYSTEM WIDGET --- */}
      <div style={{ pointerEvents: "auto" }}>
        {/* Sends down current active user profile roles cleanly to control recommendations */}
        <ChatbotSubsystem role={user?.role || 'normal'} />
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Modals Mapping Portals */}
      {showRoleModal && selectedUser && <AssignRoleModal user={selectedUser} onClose={() => setShowRoleModal(false)} onAssign={handleAssignRole} />}
      {showRevokeModal && selectedUser && <RevokeAccessModal user={selectedUser} onClose={() => setShowRevokeModal(false)} onRevoke={handleRevokeAccess} />}
      {showPermissionsModal && <PermissionsModal onClose={() => setShowPermissionsModal(false)} />}
    </div>
  );
};