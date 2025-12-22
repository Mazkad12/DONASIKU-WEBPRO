# ❓ Frequently Asked Questions (FAQ)

Selamat datang di halaman Tanya Jawab umum seputar teknis dan penggunaan platform **Donasiku**. Kami mengumpulkan pertanyaan yang paling sering diajukan oleh pengembang dan pengguna.

---

## 🔧 Pertanyaan Teknis & Instalasi

### Q: Saya mendapatkan error "Composer could not find a composer.json file" saat setup backend.
**A:** Pastikan Anda sudah masuk ke direktori `backend` sebelum menjalankan perintah `composer install`. Struktur folder proyek memisahkan `backend` dan `frontend`.
```bash
cd backend
composer install
```

### Q: Kenapa frontend saya blank putih (White Screen of Death)?
**A:** Ini biasanya terjadi karena dependensi belum terinstal sempurna atau ada error sintaks.
1.  Coba hapus `node_modules` dan instal ulang: `rm -rf node_modules && npm install`.
2.  Cek Console Browser (F12) untuk melihat pesan error spesifik.
3.  Pastikan Server Backend sudah jalan (`php artisan serve`) jika frontend mencoba melakukan *fetch* data saat *load* awal.

### Q: Bagaimana cara mengganti database dari SQLite ke MySQL?
**A:**
1.  Buka file `.env` di folder backend.
2.  Ubah blok `DB_CONNECTION` menjadi:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=nama_database_anda
    DB_USERNAME=root
    DB_PASSWORD=
    ```
3.  Buat database kosong di phpMyAdmin/MySQL Workbench.
4.  Jalankan `php artisan migrate`.

### Q: Gambar yang di-upload tidak muncul (404 Not Found).
**A:** Laravel menyimpan file di `storage/app/public`, tapi web server mengakses `public/storage`. Anda perlu membuat *symbolic link*:
```bash
php artisan storage:link
```

---

## 👥 Pertanyaan Penggunaan Aplikasi (Fitur)

### Q: Apakah Penerima bisa menjadi Donatur dengan akun yang sama?
**A:** Saat ini sistem memisahkan Role secara ketat saat registrasi. Jika Anda mendaftar sebagai **Penerima**, Anda hanya bisa fitur penerima. Untuk menjadi Donatur, silakan registrasi akun baru dengan email berbeda dan pilih peran **Donatur**.

### Q: Bagaimana cara membatalkan donasi yang sudah diposting?
**A:**
1.  Masuk ke Dashboard Donatur.
2.  Pilih menu "Donasi Saya".
3.  Klik tombol "Hapus" pada barang yang ingin dibatalkan.
    *Catatan: Barang yang sudah dalam status "Dikirim" atau "Selesai" tidak bisa dihapus demi integritas data.*

### Q: Apakah ada notifikasi lewat email?
**A:** Untuk versi saat ini (MVP), notifikasi hanya tersedia di dalam aplikasi (In-App Notification) pada menu lonceng di pojok kanan atas. Integrasi Email Notification ada dalam *Roadmap* pengembangan selanjutnya.

---

## 🐛 Troubleshooting & Error Umum

### Q: Error "419 PAGE EXPIRED" saat request API.
**A:** Ini biasanya terkait masalah CSRF token jika Anda menggunakan sesi browser biasa. Namun karena kita menggunakan **Laravel Sanctum (API Token)**, pastikan frontend Anda mengirimkan header `Accept: application/json` dan `Authorization: Bearer <token>` dengan benar.

### Q: Error "Target class [AuthController] does not exist".
**A:** Cek file `routes/api.php`. Pastikan Anda sudah mengimpor controller di bagian atas file:
```php
use App\Http\Controllers\AuthController;
```

### Q: Saya lupa password akun Admin / User Dummy.
**A:** Karena fitur "Lupa Password" belum rilis, Anda bisa mereset user lewat database seeder:
```bash
php artisan migrate:fresh --seed
```
Ini akan mengembalikan database ke kondisi awal dengan user default (biasanya `admin@example.com` / `password`). **PERINGATAN: Semua data lama akan hilang.**

---

*Punya pertanyaan lain? Silakan hubungi tim pengembang atau buat Issue di repositori GitHub kami.*
