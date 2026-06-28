export const getInitials = (name) => {
  if (!name) return "??";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
};

export const getRoleColor = (role) => {
  const colors = {
    admin: { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
    executive: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
    experienced: { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
    normal: { bg: "#F9FAFB", text: "#374151", border: "#E5E7EB" },
  };
  return colors[role] || colors.normal;
};

export const getStatusColor = (status) => {
  const colors = {
    Aktif: { bg: "#DCFCE7", text: "#166534" },
    "Tidak Aktif": { bg: "#FEE2E2", text: "#991B1B" },
    Dikunci: { bg: "#FEE2E2", text: "#991B1B" },
  };
  return colors[status] || colors["Tidak Aktif"];
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};