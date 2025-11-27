# Dokumentasi Kemajuan Fitur - Donasiku
**Oleh:** Nauval Yusriya Athalla - 103032330022
**Tanggal:**  09 November 2025  

Dokumen ini merangkum perkembangan implementasi fitur pada proyek **Donasiku**, termasuk fitur yang telah selesai (✅ *Done*) dan rencana pengembangan berikutnya (🛠️ *To-Do*).

---

##  1. ✅ Login dan Registrasi (Auth)

###  **Selesai Dikerjakan (Done)**

#### 📄 Pembuatan Halaman
- `src/features/auth/Login.jsx` telah dibuat.  
- `src/features/auth/Register.jsx` telah dibuat.  

#### ⚙️ Logika Inti
- Kedua halaman terhubung dengan `authService.js` untuk memproses **pendaftaran** dan **login** pengguna.  
- Data pengguna (termasuk `role`) disimpan di `localStorage` (melalui `users_db` dan `user`).  

#### 💡 Fungsionalitas
- Pengguna dapat memilih **role** (Donatur atau Penerima) saat mendaftar.  
- Halaman Login memverifikasi **role** yang dipilih saat login.  

#### 🧩 Perbaikan Bug & UI
- [BUG FIX] Navbar publik yang menutupi halaman **Login/Register** telah diperbaiki dengan menambahkan `padding-top (pt-40)`.  
- [REVISI UI] Desain halaman **Login** kini konsisten dengan **Register** (menghapus header biru pada kartu).  
- [UI/UX] Menambahkan animasi *fade-in* dan *focus interaction* pada input field.  

### 🛠️ **Rencana Selanjutnya (To-Do)**
- [SELESAI] Fitur fungsional sudah lengkap sesuai spesifikasi.  
- (Opsional) Tambah fitur **Lupa Password** di masa depan.  

---

##  2. Dashboard Penerima

### ✅ **Selesai Dikerjakan (Done)**

#### 📄 Pembuatan Halaman
- `src/features/penerima/DashboardPenerima.jsx` telah dibuat.  

#### 🧭 Routing & Layout
- [BUG FIX] Rute `/dashboard-penerima` kini berada di dalam `DashboardLayout` di `App.jsx`.  
  → Memperbaiki bug *sidebar* dan *topbar* yang tidak muncul.  
- `DashboardSidebar.jsx` kini **dinamis**, menampilkan menu sesuai role Penerima.  

#### ⚙️ Fungsionalitas Inti
- Halaman berhasil memuat data donasi dari `getAllDonasi()`.  
- [BUG FIX] Perbaikan kunci `localStorage` dari `'donations'/'donaasi'` → `'donasi'`.  
  → Memastikan data donasi tampil di dashboard.  
- Data yang ditampilkan: hanya donasi dengan status **aktif**.  

#### 🎨 UI (Sesuai Desain)
- Implementasi **header biru**, **search bar**, dan **filter kategori**.  
- Grid menampilkan kartu donasi (foto, nama, kategori, status).  

### 🛠️ **Rencana Selanjutnya (To-Do)**

#### 📌 Langkah 3 & 4 – *Permintaan Barang*
- Buat halaman `DetailDonasi.jsx` (tombol “Lihat Detail & Ajukan” belum berfungsi).  
- Tambahkan `requestService.js` untuk pengelolaan data permintaan.  
- Tambahkan fungsi baru di `localStorage.js` untuk data `'requests'`.  
- Implementasikan tombol “Kirim Permintaan Donasi” di halaman detail.  

#### 📌 Langkah 5 – *Permintaan Saya*
- Buat `PermintaanSaya.jsx` (rute `/penerima/permintaan-saya`)  
  untuk menampilkan status permintaan (*pending, approved, completed*).  

#### 📌 Langkah 6 & 7 – *Integrasi dengan Donatur*
- Modifikasi `DashboardDonatur.jsx` untuk menampilkan **Permintaan Masuk**.  
- Tambahkan tombol “Setujui” / “Tolak” untuk Donatur.  
- Tambahkan tombol “Konfirmasi Barang Diterima” untuk Penerima.  

---

## 📦 3. Riwayat / Cek Status

### ✅ **Selesai Dikerjakan (Done)**

#### 📄 Pembuatan Halaman
- `src/features/riwayat/Riwayat.jsx` telah dibuat dengan struktur sesuai spesifikasi.  

#### 🧭 Routing
- [BUG FIX] Menambahkan rute:
  - `/donatur/riwayat`  
  - `/penerima/riwayat`  
  ke dalam `App.jsx` di `DashboardLayout`.  
  → Memperbaiki error *404 Halaman Tidak Ditemukan*.  

#### ⚙️ Logika Awal
- Halaman mendeteksi **role** pengguna (Donatur / Penerima).  
- Untuk **Donatur:** menampilkan donasi dengan status *selesai*.  
- Untuk **Penerima:** menampilkan pesan *“Fitur Dalam Pengembangan”*.  

---

## 🧭 Status Umum Proyek

| Fitur | Status | Catatan |
|-------|---------|----------|
| Login & Register | ✅ Selesai | Sudah sesuai spesifikasi |
| Dashboard Donatur | ⚙️ Dalam Progres | Menunggu integrasi dengan permintaan penerima |
| Dashboard Penerima | ✅ Dasar selesai | Butuh pengembangan halaman detail dan permintaan |
| Riwayat Donasi | ✅ Selesai (Donatur) | Penerima masih *on progress* |
| Request System | 🛠️ Belum dimulai | Direncanakan di tahap berikutnya |

---

## 🧑‍💻 Catatan Akhir
Progres pengembangan berjalan sesuai jadwal. Fokus pengembangan berikutnya adalah **integrasi antara Donatur dan Penerima melalui sistem permintaan donasi**, serta **penyempurnaan alur Riwayat dan Notifikasi**.

---

📅 **Update Terakhir:** 9 November 2025  
✍️ *Disusun oleh Nauval Yusriya Athalla*
