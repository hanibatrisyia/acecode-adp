export const mockUsers = [
  { 
    id: 1, 
    name: "Ahmad bin Abdullah", 
    email: "ahmad@mbpg.gov.my", 
    role: "admin", 
    jabatan: "Unit IT", 
    status: "Aktif", 
    loginTerakhir: "27/06/2025 09:14" 
  },
  { 
    id: 2, 
    name: "Siti binti Abu", 
    email: "siti@mbpg.gov.my", 
    role: "executive", 
    jabatan: "Unit Pentadbiran", 
    status: "Aktif", 
    loginTerakhir: "27/06/2025 08:45" 
  },
  { 
    id: 3, 
    name: "Ali bin Ismail", 
    email: "ali@mbpg.gov.my", 
    role: "experienced", 
    jabatan: "Unit Cukai", 
    status: "Aktif", 
    loginTerakhir: "26/06/2025 16:30" 
  },
  { 
    id: 4, 
    name: "Nurul Ain binti Hamzah", 
    email: "nurulain@mbpg.gov.my", 
    role: "normal", 
    jabatan: "Unit Cukai", 
    status: "Aktif", 
    loginTerakhir: "25/06/2025 11:00" 
  },
];

export const loginCredentials = {
  admin: { username: "admin", password: "password", role: "admin" },
  executive: { username: "executive", password: "password", role: "executive" },
  experienced: { username: "experienced", password: "password", role: "experienced" },
  normal: { username: "normal", password: "password", role: "normal" },
};

export const publicFAQ = [
  {
    id: 1,
    soalan: "Apakah itu cukai taksiran?",
    jawapan: "Cukai taksiran (cukai pintu) adalah cukai yang dikenakan ke atas pemilik hartanah oleh MBPG. Ianya dikira berdasarkan Nilai Tahunan (annual value) hartanah anda dan kadar cukai yang ditetapkan oleh Majlis.",
  },
  {
    id: 2,
    soalan: "Bagaimana cara bayar cukai taksiran MBPG?",
    jawapan: "Cukai taksiran boleh dibayar melalui:\n• Portal dalam talian MBPG (mbpg.gov.my)\n• Kaunter MBPG, Jalan Bandaraya, Pasir Gudang\n• Perbankan dalam talian atau ATM\n• Cek atas nama 'Majlis Bandaraya Pasir Gudang'\n\nBayaran perlu diselesaikan sebelum 28 Februari (separuh pertama) dan 31 Ogos (separuh kedua).",
  },
  {
    id: 3,
    soalan: "Bila tarikh akhir bayaran cukai taksiran?",
    jawapan: "Cukai taksiran perlu dibayar dalam dua ansuran:\n• Separuh pertama: sebelum 28 Februari\n• Separuh kedua: sebelum 31 Ogos\n\nDenda 10% akan dikenakan ke atas bayaran lewat.",
  },
  {
    id: 4,
    soalan: "Apakah dokumen diperlukan untuk rayuan cukai?",
    jawapan: "Untuk membuat rayuan cukai taksiran, anda perlu:\n• Borang Rayuan (boleh diperoleh di kaunter MBPG)\n• Salinan kad pengenalan pemohon\n• Notis taksiran terkini\n• Dokumen sokongan (penilaian bebas, geran tanah)\n\nRayuan perlu dikemukakan dalam tempoh 30 hari dari tarikh notis.",
  },
  {
    id: 5,
    soalan: "Cara mohon pengecualian cukai taksiran?",
    jawapan: "Pengecualian boleh dimohon oleh bangunan keagamaan, institusi pendidikan berdaftar, dan hospital/klinik kesihatan awam. Sila kemukakan permohonan bertulis kepada Unit Cukai MBPG bersama dokumen sokongan.",
  },
  {
    id: 6,
    soalan: "Apa yang perlu dilakukan jika menerima notis tuntutan?",
    jawapan: "Jika menerima notis tuntutan:\n1. Semak jumlah tunggakan\n2. Hubungi Unit Cukai MBPG di 07-251 1111\n3. Mohon pelan ansuran jika perlu\n4. Jangan abaikan notis — tindakan undang-undang boleh diambil",
  },
  {
    id: 7,
    soalan: "Bagaimana untuk tahu amaun cukai saya?",
    jawapan: "Anda boleh semak melalui:\n• Portal MBPG: mbpg.gov.my\n• Hubungi Unit Cukai: 07-251 1111\n• Kaunter MBPG (Isnin–Jumaat, 8:00 pagi – 5:00 petang)\n• Notis taksiran tahunan yang dihantar ke alamat berdaftar",
  },
  {
    id: 8,
    soalan: "Apakah kadar cukai taksiran di MBPG?",
    jawapan: "Kadar cukai taksiran bergantung kepada jenis hartanah:\n• Kediaman: 4% – 6% daripada Nilai Tahunan\n• Komersial: 8% – 12% daripada Nilai Tahunan\n• Industri: 6% – 10% daripada Nilai Tahunan\n\nNilai Tahunan ditetapkan oleh Jabatan Penilaian & Pengurusan Harta (JPPH).",
  },
];

export const matchFAQ = (input) => {
  const lower = input.toLowerCase();
  const rules = [
    { pattern: /taksiran|assessment|cukai apa|cukai tu|apakah cukai/, id: 1 },
    { pattern: /bayar|cara bayar|pembayaran|payment|macam mana bayar/, id: 2 },
    { pattern: /tarikh|tarikh akhir|due date|deadline|bila|when/, id: 3 },
    { pattern: /rayuan|appeal|bantah|tidak setuju/, id: 4 },
    { pattern: /pengecualian|exempt|bebas cukai/, id: 5 },
    { pattern: /notis tuntutan|tuntutan|tunggak|arrear|saman/, id: 6 },
    { pattern: /semak|amaun|jumlah|berapa|check|berapa cukai/, id: 7 },
    { pattern: /kadar|rate|peratusan|percent|berapa peratus/, id: 8 },
  ];
  for (const r of rules) {
    if (r.pattern.test(lower)) {
      return publicFAQ.find(f => f.id === r.id);
    }
  }
  return null;
};