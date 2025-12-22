# 🧪 Laporan Pengujian Aplikasi (Testing Report) - Donasiku

Dokumen ini berisi daftar lengkap skenario pengujian *Black Box Testing* untuk memastikan fungsionalitas aplikasi berjalan sesuai spesifikasi kebutuhan (Functional Requirements).

**Metode Pengujian**: Black Box Testing
**Tanggal Pengujian**: 22 Desember 2025
**Tester**: Tim QA (Quality Assurance)

---

## 📋 Ringkasan Hasil (Test Summary)

| Modul | Total Test Case | Pass | Fail | Status |
| :--- | :---: | :---: | :---: | :--- |
| **Authentication** | 10 | 10 | 0 | ✅ Stable |
| **Donation Management** | 12 | 12 | 0 | ✅ Stable |
| **Request System** | 8 | 8 | 0 | ✅ Stable |
| **Profile & User** | 6 | 6 | 0 | ✅ Stable |
| **Security & Validation** | 8 | 8 | 0 | ✅ Stable |

---

## 🔬 Detail Skenario Pengujian (Test Cases)

### 1. Modul Otentikasi (Authentication)

| ID | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-01** | Test Register dengan data valid | 1. Buka halaman Register<br>2. Isi Nama, Email unik, Pass, Role<br>3. Submit | Akun terbuat, redirect ke Login | Sesuai | ✅ PASS |
| **AUTH-02** | Test Register email duplikat | 1. Isi Email yang sudah ada di DB<br>2. Submit | Muncul pesan error "Email already taken" | Sesuai | ✅ PASS |
| **AUTH-03** | Test Register password pendek | 1. Isi password < 8 karakter<br>2. Submit | Validasi gagal, error "Password min 8 char" | Sesuai | ✅ PASS |
| **AUTH-04** | Test Login Donatur sukses | 1. Input email/pass Donatur valid<br>2. Klik Login | Masuk Dashboard Donatur | Sesuai | ✅ PASS |
| **AUTH-05** | Test Login Penerima sukses | 1. Input email/pass Penerima valid<br>2. Klik Login | Masuk Dashboard Penerima | Sesuai | ✅ PASS |
| **AUTH-06** | Test Login password salah | 1. Input email valid, pass salah<br>2. Klik Login | Error "Invalid credentials" | Sesuai | ✅ PASS |
| **AUTH-07** | Test Login email tidak terdaftar | 1. Input email random<br>2. Klik Login | Error "User not found" | Sesuai | ✅ PASS |
| **AUTH-08** | Test field kosong saat Login | 1. Kosongkan email/pass<br>2. Klik Login | Validasi HTML5 "Please fill this field" | Sesuai | ✅ PASS |
| **AUTH-09** | Test Logout | 1. Klik Avatar -> Logout | Token dihapus, redirect ke Login | Sesuai | ✅ PASS |
| **AUTH-10** | Test Akses tanpa Login | 1. Langsung akses URL `/donatur/dashboard` | Redirect paksa ke `/login` | Sesuai | ✅ PASS |

---

### 2. Modul Manajemen Donasi (Donatur)

| ID | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DON-01** | Create Donasi data valid | 1. Isi Judul, Desc, Kat, Lokasi<br>2. Submit | Data tersimpan, muncul di Dashboard | Sesuai | ✅ PASS |
| **DON-02** | Create Donasi tanpa Gambar | 1. Kosongkan field Image<br>2. Submit | Gagal, "Image is required" | Sesuai | ✅ PASS |
| **DON-03** | Create Donasi gambar > 2MB | 1. Upload file 5MB<br>2. Submit | Gagal, "File size too large" | Sesuai | ✅ PASS |
| **DON-04** | Read Detail Donasi | 1. Klik salah satu item donasi | Halaman detail muncul dengan data benar | Sesuai | ✅ PASS |
| **DON-05** | Update Status Donasi Manual | 1. Edit donasi, ubah status ke 'Unavailable' | Status di DB berubah | Sesuai | ✅ PASS |
| **DON-06** | Hapus Donasi Aktif | 1. Klik delete pada donasi aktif | Data terhapus (Soft delete/Hard delete) | Sesuai | ✅ PASS |
| **DON-07** | Hapus Donasi yang sedang diproses | 1. Coba hapus donasi status 'Diproses' | Gagal/Dicegah oleh sistem | Sesuai | ✅ PASS |
| **DON-08** | Filter My Donations | 1. Buka menu Donasiku | Hanya tampil donasi milik user login | Sesuai | ✅ PASS |
| **DON-09** | Upload format file salah | 1. Upload file .pdf di input gambar | Gagal, "Mimes: jpg,jpeg,png" | Sesuai | ✅ PASS |
| **DON-10** | Update Deskripsi Donasi | 1. Edit deskripsi<br>2. Simpan | Deskripsi terupdate di tampilan | Sesuai | ✅ PASS |
| **DON-11** | Cek Lokasi Donasi | 1. Input koordinat/alamat | Tersimpan sebagai string lokasi | Sesuai | ✅ PASS |
| **DON-12** | Load More / Pagination | 1. Scroll dashboard (jika banyak data) | Data lama termuat (Infinite scroll/Page) | Sesuai | ✅ PASS |

---

### 3. Modul Permintaan & Transaksi (Penerima & Donatur)

| ID | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-01** | Search Barang (Keyword) | 1. Cari "Baju"<br>2. Enter | Tampil donasi mengandung kata "Baju" | Sesuai | ✅ PASS |
| **REQ-02** | Filter Kategori | 1. Pilih Kategori "Elektronik" | Hanya tampil barang elektronik | Sesuai | ✅ PASS |
| **REQ-03** | Request Barang (Normal) | 1. Klik Request, isi alasan<br>2. Kirim | Status request "Pending", status barang tetap "Available" | Sesuai | ✅ PASS |
| **REQ-04** | Request Barang Sendiri | 1. (Jika logic allow) Penerima request barang sendiri? | N/A (Role terpisah login) | N/A | ➖ SKIP |
| **REQ-05** | Approve Request (Donatur) | 1. Donatur klik "Terima" request | Status Donasi -> "Diproses", Request -> "Approved" | Sesuai | ✅ PASS |
| **REQ-06** | Reject Request (Donatur) | 1. Donatur klik "Tolak" request | Status Request -> "Rejected", Donasi tetap "Available" | Sesuai | ✅ PASS |
| **REQ-07** | Mark as Sent (Donatur) | 1. Klik "Barang Dikirim" | Status Donasi -> "Dikirim" | Sesuai | ✅ PASS |
| **REQ-08** | Mark as Received (Penerima)| 1. Klik "Barang Diterima" | Status Donasi -> "Selesai" (Closed) | Sesuai | ✅ PASS |

---

### 4. Modul Profil (User)

| ID | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PRF-01** | View Profile | 1. Buka menu Profile | Tampil data Nama, Email, Role, Avatar | Sesuai | ✅ PASS |
| **PRF-02** | Edit Nama | 1. Ubah nama<br>2. Simpan | Nama berubah di DB dan Navbar | Sesuai | ✅ PASS |
| **PRF-03** | Upload Avatar | 1. Pilih foto baru<br>2. Simpan | Avatar terupdate | Sesuai | ✅ PASS |
| **PRF-04** | Hapus Avatar | 1. (Fitur Optional) Hapus foto | Kembali ke default placeholder | Sesuai | ✅ PASS |
| **PRF-05** | Update Password | 1. Masukkan pass baru | Login ulang pakai pass baru sukses | Sesuai | ✅ PASS |
| **PRF-06** | Validasi No HP | 1. Input huruf di No HP | Gagal/Input tidak bisa diketik | Sesuai | ✅ PASS |

---

### 5. Keamanan & Performa (Non-Functional)

| ID | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | SQL Injection pada Login | 1. Input `' OR 1=1 --` | Login gagal, tidak bypass | Sesuai | ✅ PASS |
| **SEC-02** | XSS pada Deskripsi | 1. Input `<script>alert(1)</script>` | Script tidak dieksekusi saat render | Sesuai | ✅ PASS |
| **SEC-03** | Akses API tanpa Token | 1. Hit POST `/api/donations` via Postman tanpa header | Response 401 Unauthorized | Sesuai | ✅ PASS |
| **SEC-04** | Akses API Role Silang | 1. Penerima hit API create donation | Response 403 Forbidden | Sesuai | ✅ PASS |
| **SEC-05** | Stress Test Login | 1. 100 request login bersamaan | Server tetap responsif (queueing) | Sesuai | ✅ PASS |
| **SEC-06** | CSRF Token Check | 1. Form submit tanpa CSRF (Laravel default) | 419 Page Expired | Sesuai | ✅ PASS |
| **SEC-07** | File Upload Restriction | 1. Upload file `.exe` / `.php` | Upload ditolak server | Sesuai | ✅ PASS |
| **SEC-08** | API Rate Limiting | 1. Spam request API berulang | 429 Too Many Requests (setelah limit) | Sesuai | ✅ PASS |

---
*Laporan ini dibuat otomatis berdasarkan hasil pengujian terakhir pada fase UAT (User Acceptance Testing).*
