# 📄 Dokumentasi Kontribusi & Progres Pengembangan
**Proyek:** Donasiku - Platform Donasi Barang Layak Pakai  
**PIC:** Nauval Yusriya Athalla  
**NIM:** 103032330022  
**Peran:** PIC Tim Penerima (Frontend & Integration)

---

## 👨‍💻 Profil Kontributor

Sebagai **PIC Tim Penerima**, tanggung jawab utama saya adalah merancang dan mengembangkan antarmuka serta logika bisnis untuk pengguna dengan peran **Penerima** (individu/organisasi yang membutuhkan donasi). Fokus saya mencakup alur registrasi, validasi, pencarian donasi, hingga manajemen permintaan barang.

---

## 🚀 Fitur Utama yang Dikembangkan

Berikut adalah rincian fitur-fitur yang telah berhasil diimplementasikan dan diintegrasikan ke dalam sistem secara penuh:

### 1. 🔐 Sistem Otentikasi (Authentication)
*Status: ✅ Selesai (Stable)*

- **Halaman Login & Register**: Membangun antarmuka responsif untuk masuk dan mendaftar akun baru.
- **Role-Based Routing**: Mengimplementasikan logika untuk memisahkan akses dashboard antara *Donatur* dan *Penerima*.
- **Integrasi API**: Menghubungkan form frontend dengan endpoint `api/login` dan `api/register` menggunakan Axios.
- **Keamanan**: Penyimpanan token otentikasi (Sanctum) yang aman di `localStorage` dan redirect otomatis jika sesi habis.

### 2. 🏠 Dashboard Penerima
*Status: ✅ Selesai (Stable)*

- **Tampilan Dinamis**: Dashboard yang menampilkan daftar donasi yang tersedia secara *real-time* dari backend.
- **Filtering & Pencarian**: Fitur untuk mencari barang donasi berdasarkan kata kunci (misal: "baju", "buku") dan kategori.
- **Desain Responsif**: Layout grid yang rapi menggunakan Tailwind CSS, menyesuaikan tampilan di desktop dan mobile.
- **Sidebar Navigasi**: Menu navigasi khusus untuk akses cepat ke profil, riwayat, dan notifikasi.

### 3. 📦 Manajemen Permintaan (Request System)
*Status: ✅ Selesai (Stable)*

- **Ajukan Permintaan**: Formulir bagi Penerima untuk mengajukan permintaan barang kepada Donatur telah berfungsi dengan baik.
- **Validasi Permintaan**: Logika sistem berhasil memastikan satu barang hanya bisa dipinta oleh satu pengguna dalam satu waktu.
- **Status Tracking**: Penerima dapat memantau status permintaan mereka (Pending -> Disetujui -> Ditolak) secara real-time.

### 4. 📜 Riwayat & Aktifitas
*Status: ✅ Selesai (Stable)*

- **Riwayat Donasi Masuk**: Halaman untuk melihat daftar barang yang telah sukses diterima berfungsi sempurna.
- **Log Aktivitas**: Sistem mencatat setiap interaksi penting untuk transparansi.

### 5. 💬 Fitur Tambahan & Integrasi
*Status: ✅ Selesai (Stable)*

- **Penyempurnaan Profil**: Peningkatan UI/UX pada halaman profil dan penambahan validasi data diri.
- **Chat System**: Integrasi fitur pesan untuk komunikasi langsung antara Penerima dan Donatur.
- **Notifikasi**: Sistem notifikasi yang memberitahu pengguna tentang perubahan status donasi.

---

## 🛠️ Teknologi & Tools

Dalam pengembangan fitur-fitur di atas, saya memanfaatkan stack teknologi berikut:

- **Frontend Core**: React 19 (Hooks, Context API).
- **Styling**: Tailwind CSS (Utility-first framework).
- **State Management**: React Context & Local State.
- **HTTP Client**: Axios untuk komunikasi REST API.
- **Alerts**: SweetAlert2 untuk notifikasi interaktif yang user-friendly.

---

## 📝 Catatan Milestone Mingguan

### Minggu 1-2: Inisiasi & Setup
- Setup proyek React dengan Vite.
- Konfigurasi Tailwind CSS dan struktur folder.
- Membuat desain dasar (Wireframe) untuk Dashboard Penerima.

### Minggu 3-4: Implementasi Auth & Core UI
- Menyelesaikan fitur Login dan Register.
- Membuat komponen-komponen UI reusable (Button, Card, Input).
- Integrasi awal dengan dummy API untuk testing UI.

### Minggu 5-6: Integrasi Backend & Fitur Lanjutan
- Menghubungkan Dashboard dengan Real Backend API.
- Debugging masalah CORS dan Token Auth.
- Mengembangkan fitur pencarian dan filter kategori.
- Menyelesaikan fitur Request, Chat, dan Notifikasi.

---

## 🎯 Status Akhir

Semua tugas yang direncanakan untuk **Tim Penerima** telah **100% Selesai**. Sistem berjalan stabil dan siap untuk tahap pengujian pengguna (UAT) dan deployment.

---

*Dokumen ini diperbarui terakhir pada: 22 Desember 2025*
