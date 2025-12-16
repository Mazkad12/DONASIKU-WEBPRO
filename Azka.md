# 🧾 Laporan Perkembangan Fitur — Donasiku  
**Oleh:** Azka Darmawan — [103032300144]  
**Tanggal:** 09 November 2025  

---

## 1. Manajemen Profil (Profile Management)  
✅ **Selesai Dikerjakan (Done)**  

### 📄 Pembuatan Halaman  
- `src/features/profile/Profile.jsx` telah dibuat untuk menampilkan informasi pengguna (nama, email, dan role).  
- Komponen terintegrasi dengan data pengguna yang disimpan di `localStorage` melalui `getAuthData()`.  

### ⚙️ Fungsionalitas Inti
- Menampilkan data profil pengguna **(nama, email, role,)** secara otomatis sesuai akun yang login.  
- Menampilkan **foto profil** default bila pengguna belum mengunggah gambar.  
- Menampilkan tampilan berbeda berdasarkan role Penerima

### 🎨 UI/UX
- Desain konsisten dengan dashboard (sidebar dan topbar).  
- Foto profil berbentuk lingkaran dengan nama & email di bawahnya.  
- Efek hover dan animasi ringan pada tombol edit.  

### 🧩 Perbaikan Bug & Integrasi
- [FIX] Data profil tidak muncul setelah login → memanggil ulang `getAuthData()` setelah `setAuthData()`.  
- [FIX] Navigasi 404 saat menuju `/profile` → route sudah ditambahkan ke `DashboardLayout`.  
- [UI] Penyesuaian warna latar dan teks agar seragam dengan halaman lain.  


---

## 2. Edit Profil & Update Foto  
⚙️ **Dalam Progres (On Progress)**  

### 📄 Pembuatan Halaman
- `src/features/profile/EditProfile.jsx` telah dibuat sebagai form untuk memperbarui data pengguna.  

### ⚙️ Fungsionalitas Inti
- Pengguna dapat mengubah:
  - Nama lengkap  
  - Email  
  - Foto profil (upload file dari device)
  - nomor telepon
- File gambar disimpan sementara menggunakan `URL.createObjectURL()` agar langsung terlihat pratinjau-nya.  
- Data hasil edit disimpan ke `localStorage` agar tetap tersimpan setelah refresh.  


---

## 🧭 Status Umum Fitur
| Fitur | Deskripsi | Status | PIC |
|-------|------------|--------|-----|
| **Lihat Profil** | Menampilkan data penerima (nama, email, role, dsb) dari localStorage | ✅ Selesai | Azka |
| **Edit Profil** | Mengubah data profil seperti nama, email, dan foto profil | ✅ Selesai | Azka |
| **Update Status Barang** | Mengubah status barang menjadi *Diproses*, *Dikirim*, *Diterima*, atau *Selesai* | ⏳ Belum Progress | Azka |

---

## 🧑‍💻 Catatan Akhir
Fitur profil sudah menampilkan data pengguna yang login dan memungkinkan pengeditan informasi dasar secara lokal. Fokus pengembangan berikutnya adalah sinkronisasi data ke backend serta penambahan validasi input agar sistem lebih stabil.  

📅 **Update Terakhir:** 09 November 2025  
✍️ **Disusun oleh:** Muhammad Azka Darmawan  
