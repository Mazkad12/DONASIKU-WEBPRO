# 📄 Dokumentasi Kontribusi & Progres Pengembangan
**Proyek:** Donasiku - Platform Donasi Barang Layak Pakai  
**PIC:** Muhammad Azka Darmawan  
**NIM:** 103032300144  
**Peran:** PIC Tim Penerima (Profile & Transaction Mgmt)

---

## 👨‍💻 Profil Kontributor

Sebagai bagian dari **Tim Penerima**, fokus utama saya adalah memastikan pengalaman pengguna dalam mengelola identitas dan status transaksi berjalan lancar. Saya bertanggung jawab penuh atas modul **Manajemen Profil** dan sistem **Pelacakan Status Barang** untuk sisi Penerima.

---

## 🚀 Fitur Utama yang Dikembangkan

Berikut adalah rincian fitur-fitur yang telah berhasil diimplementasikan secara makro dan mikro:

### 1. 👤 Manajemen Profil (Profile Management)
*Status: ✅ Selesai (Stable)*

- **Halaman Profil Pengguna**:
  - Mengembangkan tampilan profil yang informatif menampilkan Nama, Email, Role, dan statistik singkat.
  - Implementasi *Avatar Placeholder* otomatis jika pengguna belum mengunggah foto.
  
- **Edit Profil & Validasi**:
  - Membuat formulir edit profile dengan validasi input (email format, max length name).
  - Integrasi dengan endpoint `POST /api/profile` untuk update data ke database.
  - Fitur **Upload Foto Profil** dengan preview gambar instan sebelum disimpan.

### 2. 🚚 Pelacakan Status & Barang
*Status: ✅ Selesai (Stable)*

- **Logic Perubahan Status**:
  - Merancang *State Machine* sederhana untuk status donasi: `Pending` -> `Diproses` -> `Dikirim` -> `Diterima`.
  - Memastikan user hanya bisa mengubah status sesuai alur yang logis (misal: tidak bisa 'Diterima' sebelum 'Dikirim').

- **Integrasi Dashboard**:
  - Menampilkan status terkini pada kartu donasi di Dashboard Penerima.
  - Memberikan indikator visual (Badge warna-warni) untuk setiap status agar mudah dikenali.

### 3. 🛠️ Utilitas & Komponen UI
*Status: ✅ Selesai*

- **Reusable Badge Component**: Membuat komponen Label/Badge status yang bisa dipakai ulang di berbagai halaman.
- **Error Handling**: Menangani kasus gagal load data profil atau gagal update dengan pesan error yang ramah pengguna.

---

## 🛠️ Teknologi yang Digunakan

- **React Function Components**: Menggunakan pendekatan modern dengan Hooks (`useState`, `useEffect`, `useRef`).
- **Form Handling**: Mengelola state formulir edit profil secara efisien.
- **Axios Interceptors**: Memastikan token otentikasi selalu terlampir saat melakukan request ke API profile.
- **Tailwind CSS**: Styling responsif untuk tampilan mobile dan desktop profile.

---

## 📝 Catatan Milestone Mingguan

### Minggu 1-2: Riset & Desain
- Merancang alur User Story untuk fitur "Edit Profil".
- Membuat mockup UI halaman profil Penerima.

### Minggu 3-4: Implementasi Frontend
- _Coding_ halaman `src/features/profile/Profile.jsx`.
- Implementasi logika upload gambar di frontend.
- Integrasi data dummy untuk tes tampilan.

### Minggu 5-6: Integrasi Backend & Finalisasi
- Menghubungkan form edit profile dengan Real API.
- Menangani respon sukses/gagal dari server.
- Melakukan *Unit Testing* manual untuk memastikan data tersimpan persisten.

---

## 🎯 Status Akhir

Seluruh tanggung jawab fitur yang dibebankan kepada saya, khususnya modul **Profil** dan **Status**, telah **100% Selesai**. Tidak ada hutang teknis (technical debt) yang tersisa untuk sprint ini.

---

*Dokumen ini diperbarui terakhir pada: 22 Desember 2025*
