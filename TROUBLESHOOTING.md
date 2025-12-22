# 🛠️ Panduan Troubleshooting & Perbaikan Masalah

Dokumen ini ditujukan untuk **Developer** dan **Tim Support** sebagai acuan cepat dalam menangani masalah teknis yang sering muncul selama pengembangan maupun operasional aplikasi Donasiku.

---

## 1. Masalah Setup Environment (Development)

### TS-001: Composer Memory Limit Exhausted
*   **Gejala**: Error `Allowed memory size of X bytes exhausted` saat menjalankan `composer install` atau `update`.
*   **Penyebab**: Alokasi RAM PHP default terlalu kecil.
*   **Solusi**:
    ```bash
    php -d memory_limit=-1 /usr/local/bin/composer install
    # Atau edit php.ini cari 'memory_limit' ubah jadi 2G
    ```

### TS-002: Vite "Network request failed"
*   **Gejala**: Halaman React tidak bisa diakses di jaringan lokal (HP/Laptop lain).
*   **Penyebab**: Vite secara default hanya listen di `localhost`.
*   **Solusi**:
    Edit `package.json`, ubah script dev:
    ```json
    "dev": "vite --host"
    ```
    Lalu akses menggunakan IP Laptop (misal: `http://192.168.1.10:5173`).

---

## 2. Masalah Database & Migrasi

### TS-003: "Base table or view already exists"
*   **Gejala**: Error saat menjalankan `php artisan migrate`.
*   **Penyebab**: Tabel sudah ada di database tapi tidak tercatat di tabel `migrations`.
*   **Solusi**:
    *   *Opsi Destruktif (Hapus Data)*:
        ```bash
        php artisan migrate:fresh --seed
        ```
    *   *Opsi Manual*: Hapus tabel spesifik di phpMyAdmin lalu coba migrate lagi.

### TS-004: "Foreign key constraint is incorrectly formed"
*   **Gejala**: Gagal migrate tabel yang punya relasi.
*   **Penyebab**:
    1.  Tipe data kolom FK tidak sama persis dengan PK referensi (misal: `BIGINT UNSIGNED` vs `INT`).
    2.  Tabel referensi belum dibuat (urutan migrasi salah).
*   **Solusi**:
    *   Pastikan semua ID menggunakan `$table->id()` atau `$table->unsignedBigInteger()`.
    *   Pastikan nama file migration tabel induk (Users) lebih awal alfabet/tanggalnya dibanding tabel anak (Donations).

---

## 3. Masalah API & Komunikasi Data

### TS-005: CORS Error (Cross-Origin Resource Sharing)
*   **Gejala**: Browser memblokir request API dengan pesan merah di console: `Access to fetch at ... has been blocked by CORS policy`.
*   **Penyebab**: Backend Laravel tidak mengizinkan origin React (`http://localhost:5173`).
*   **Solusi**:
    Buka `backend/config/cors.php`. Pastikan:
    ```php
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
    'supports_credentials' => true,
    ```
    Lalu jalankan `php artisan config:clear`.

### TS-006: 419 Page Expired / CSRF Token Mismatch
*   **Gejala**: Request POST/PUT gagal terus menerus.
*   **Solusi**:
    *   Pastikan Axios di React sudah disetup kredensial:
        ```js
        axios.defaults.withCredentials = true;
        ```
    *   Pastikan domain di `.env` (`SESSION_DOMAIN`) sesuai, atau biarkan `null` di localhost.

### TS-007: Image Upload 413 Payload Too Large
*   **Gejala**: Upload gambar gagal, Nginx/Apache menolak.
*   **Solusi**:
    *   Edit `php.ini`: `upload_max_filesize = 10M` dan `post_max_size = 12M`.
    *   Jika pakai Nginx, tambah di `nginx.conf`: `client_max_body_size 10M;`.

---

## 4. Cheat Sheet Perintah Penting

### Backend Clean Up
```bash
# Hapus semua cache konfigurasi (Wajib dijalankan setelah edit .env)
php artisan config:cache
php artisan route:cache
php artisan view:clear
```

### Reset Database Total
```bash
# Bahaya! Menghapus semua data. Gunakan hanya di development.
php artisan migrate:fresh --seed
```

### Membuat Link Storage Gambar
```bash
# Wajib agar folder storage publik bisa diakses browser
php artisan storage:link
```

---

## 5. Alur Eskalasi Masalah
Jika solusi di atas tidak berhasil:
1.  Cek log Laravel: `tail -f storage/logs/laravel.log`.
2.  Cek log Web Server: `/var/log/nginx/error.log`.
3.  Cek Console Browser (F12) -> Tab Network -> Klik request merah -> Tab Response.
4.  Laporkan ke Group Developer dengan menyertakan screenshot log.

---
*Dokumen ini diperbarui terakhir pada 22 Desember 2025.*
