# 🕊️ Donasiku: Platform Penyaluran Donasi Barang Layak Pakai

Donasiku adalah platform berbasis web yang memfasilitasi donasi barang fisik layak pakai secara efisien, aman, dan transparan. Dengan memanfaatkan sistem berbasis lokasi, aplikasi ini mengoptimalkan jarak antara Donatur dan Penerima untuk meminimalkan biaya logistik.

## 💻 Tech Stack & Arsitektur

Sistem ini dirancang menggunakan arsitektur Client-Server yang memisahkan logika bisnis dengan antarmuka pengguna:

- **Frontend**: React.js – Digunakan untuk membangun antarmuka yang responsif dan interaktif
- **Backend**: Laravel – Menangani logika bisnis, otentikasi, dan API
- **Database**: MySQL – Penyimpanan data terpusat untuk pengguna, postingan, dan transaksi
- **API**: RESTful API untuk komunikasi antara React dan Laravel

## 🛠️ Skema Database (E-R Highlights)

Berdasarkan Functional Requirements (FR), database MySQL akan mencakup tabel-tabel utama berikut:

- **users**: Menyimpan data akun, kata sandi terenkripsi, profil, dan role (Donatur/Penerima)
- **donations**: Menyimpan detail barang seperti foto, deskripsi, kategori (pakaian, buku, elektronik), dan lokasi koordinat
- **requests**: Mencatat permintaan barang dari Penerima kepada Donatur
- **chats**: Menyimpan riwayat percakapan antar pengguna untuk koordinasi pengambilan
- **verifications**: Data dokumen resmi untuk proses validasi akun Penerima oleh Admin
- **histories**: Catatan riwayat donasi yang telah selesai (arsip)

## 👥 Tim Pengembang (Kelompok 3)

| Nama | NIM | Peran Utama (PIC) |
|------|-----|-------------------|
| Nabiel Muhammad Irfani | 103032330140 | PIC Tim Donatur |
| Muhammad Bayu Satrio | 103032300167 | PIC Tim Penerima |
| Syahril Arfian Almazril | 103032300013 | PIC Tim Donatur |
| Muhammad Azka Darmawan | 103032300144 | PIC Tim Penerima |
| Muhammad Arief Ridwan Syah | 103032300064 | PIC Tim Donatur |
| Nauval Yusriya Athalla | 103032330022 | PIC Tim Penerima |

## 🌍 Dampak Sosial & SDGs

Aplikasi ini selaras dengan tujuan global berikut:

1. **Tanpa Kemiskinan (SDG 1)**: Membantu akses barang kebutuhan secara gratis
2. **Berkurangnya Kesenjangan (SDG 10)**: Mempertemukan pemilik kelebihan barang dengan mereka yang kekurangan
3. **Konsumsi & Produksi Bertanggung Jawab (SDG 12)**: Mengurangi limbah melalui konsep penggunaan kembali (reuse)

## ⚙️ Langkah Instalasi

### 1. Clone & Backend Setup
```bash
git clone https://github.com/kelompok3/donasiku.git
cd donasiku/backend
composer install
cp .env.example .env # Sesuaikan DB_DATABASE=donasiku
php artisan key:generate
php artisan migrate
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

---

Dikembangkan untuk tugas Pemrograman Web - S1 Teknologi Informasi, Universitas Telkom 2025/2026.
