# 🕊️ Donasiku: Platform Penyaluran Donasi Barang Layak Pakai

**Donasiku** adalah platform berbasis web yang dirancang untuk memfasilitasi penyaluran donasi barang fisik layak pakai secara efisien, aman, dan transparan. Aplikasi ini menghubungkan **Donatur** (pemilik barang) dengan **Penerima** (individu atau organisasi yang membutuhkan) dengan fitur berbasis lokasi dan real-time chat.

---

## ✨ Fitur Utama

### 1. 📦 Manajemen Donasi & Permintaan
- **Postingan Donasi**: Donatur dapat mengunggah barang dengan foto, deskripsi, dan lokasi.
- **Permintaan Barang**: Penerima dapat membuat permintaan untuk barang yang dibutuhkan.
- **Status Transaksi**: Pelacakan status donasi (Diposting -> Dipesan -> Dikirim -> Diterima/Selesai).

### 2. � Keamanan & Verifikasi
- **Otentikasi Aman**: Login dan Register menggunakan Laravel Sanctum.
- **Verifikasi Akun**: Validasi dokumen untuk akun Penerima untuk memastikan keaslian.

### 3. 💬 Komunikasi & Interaksi
- **Real-time Chat**: Fitur pesan langsung antara Donatur dan Penerima untuk koordinasi.
- **Notifikasi**: Pemberitahuan real-time untuk status donasi dan pesan baru.

### 4. 👤 Profil Pengguna
- **Manajemen Profil**: Pengguna dapat memperbarui informasi pribadi dan avatar.
- **Riwayat**: Melihat riwayat donasi yang pernah diberikan atau diterima.

---

## 💻 Teknologi yang Digunakan

Proyek ini dibangun menggunakan arsitektur **Monorepo** (Backend dan Frontend dalam satu repositori) dengan teknologi modern:

### Backend (API)
- **Framework**: [Laravel 12.x](https://laravel.com)
- **Language**: PHP 8.2+
- **Authentication**: Laravel Sanctum
- **Database**: MySQL / SQLite (Development)

### Frontend (Client)
- **Framework**: [React 19](https://react.dev)
- **Build Tool**: [Vite 7.x](https://vitejs.dev)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com)
- **HTTP Client**: Axios
- **State/Icons**: React Icons, SweetAlert2

---

## ⚙️ Prasyarat Instalasi

Sebelum memulai, pastikan perangkat Anda telah terinstal:
- **PHP** >= 8.2
- **Composer** (Manajer paket PHP)
- **Node.js** (Versi LTS disarankan) & **NPM**
- **Git**

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal Anda:

### Menggunakan Docker (Cara Paling Mudah)
Pastikan Anda sudah menginstall Docker Desktop.

1.  **Jalankan Aplikasi:**
    ```bash
    docker-compose -f docker-compose.dev.yml up -d --build
    ```
2.  **Akses Aplikasi**:
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:8000`
    - Database Viewer (Adminer): `http://localhost:8081`

> Lihat panduan lengkap di [TUTORIAL_DOCKER.md](TUTORIAL_DOCKER.md).

### 🔧 Cara Manual (Tanpa Docker)
Jika Anda ingin menjalankan secara manual:

#### 1. Clone Repositori
```bash
git clone https://github.com/kelompok3/donasiku.git
cd donasiku
```

### 2. Setup Backend (Laravel)
Masuk ke folder backend dan instal dependensi:
```bash
cd backend
composer install
```

Salin konfigurasi environment dan generate key aplikasi:
```bash
cp .env.example .env
php artisan key:generate
```
> **Catatan**: Sesuaikan pengaturan database di file `.env` jika Anda menggunakan MySQL (DB_DATABASE, DB_USERNAME, dll). Secara default, script setup mungkin menggunakan SQLite.

Jalankan migrasi database:
```bash
php artisan migrate
```

Jalankan server backend:
```bash
php artisan serve
```
Backend akan berjalan di `http://127.0.0.1:8000`.

### 3. Setup Frontend (React + Vite)
Buka terminal baru, masuk ke folder frontend dan instal dependensi:
```bash
cd ../frontend
npm install
```

Jalankan server pengembangan frontend:
```bash
npm run dev
```
Frontend akan berjalan (biasanya) di `http://127.0.0.1:5173`.

---

## 📂 Struktur Direktori Proyek

```
donasiku/
├── backend/            # Kode sumber Backend (Laravel)
│   ├── app/            # Controllers, Models, Middleware
│   ├── database/       # Migrations, Seeders
│   ├── routes/         # Definisi API Routes (api.php)
│   └── ...
├── frontend/           # Kode sumber Frontend (React)
│   ├── src/
│   │   ├── components/ # Komponen UI Reusable
│   │   ├── pages/      # Halaman-halaman utama
│   │   ├── services/   # Konfigurasi API (Axios)
│   │   └── ...
│   └── ...
└── README.md           # Dokumentasi Proyek
```

---

## 👥 Tim Pengembang (Kelompok 3)

| Nama | NIM | Peran Utama (PIC) |
|------|-----|-------------------|
| Nabiel Muhammad Irfani | 103032330140 | PIC Tim Donatur |
| Muhammad Bayu Satrio | 103032300167 | PIC Tim Penerima |
| Syahril Arfian Almazril | 103032300013 | PIC Tim Donatur |
| Muhammad Azka Darmawan | 103032300144 | PIC Tim Penerima |
| Muhammad Arief Ridwan Syah | 103032300064 | PIC Tim Donatur |
| Nauval Yusriya Athalla | 103032330022 | PIC Tim Penerima |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat [LICENSE](LICENSE) untuk detail lebih lanjut.

---
*Dikembangkan untuk tugas Pemrograman Web - S1 Teknologi Informasi, Universitas Telkom 2025/2026.*
