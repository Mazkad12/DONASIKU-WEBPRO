# 🗄️ Skema Database Lengkap & Detail Teknis (Database Schema)

Dokumen ini menyediakan referensi teknis mendalam mengenai struktur basis data **Donasiku**. Dokumen ini mencakup definisi tabel, tipe data, *constraints*, *indexing*, serta contoh query SQL untuk pembuatan tabel. Digunakan sebagai acuan tunggal bagi Tim Backend dan Database Administrator.

---

## 📐 Entity Relationship Diagram (ERD) Textual & Relationships

Sistem Donasiku menggunakan database relasional dengan normalisasi tingkat ke-3 (3NF). Berikut hubungan antar entitas:

1.  **Users (One) to (Many) Donations**:
    *   Seorang User (Role: Donatur) dapat membuat banyak Donation.
    *   Setiap Donation dimiliki oleh satu User.
    *   *Constraint*: `donations.user_id` references `users.id` (ON DELETE CASCADE).

2.  **Users (One) to (Many) Requests**:
    *   Seorang User (Role: Penerima) dapat membuat banyak Request.
    *   Setiap Request dimiliki oleh satu User.
    *   *Constraint*: `requests.user_id` references `users.id` (ON DELETE CASCADE).

3.  **Donations (One) to (Many) Requests**:
    *   Satu Donation dapat memiliki banyak Request (dari berbagai penerima berbeda).
    *   Namun, hanya satu Request yang bisa disetujui (*Approved*).
    *   *Constraint*: `requests.donation_id` references `donations.id` (ON DELETE CASCADE).

---

## 📋 Definisi Tabel & Struktur SQL

### 1. Tabel `users`
Tabel ini merupakan tabel inti yang menyimpan informasi kredensial dan profil untuk semua jenis pengguna (Donatur & Penerima).

**Spesifikasi Kolom:**

| Nama Kolom | Tipe Data | Atribut | Default | Deskripsi Detail |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT(20)` | `UNSIGNED`, `AUTO_INCREMENT`, `PRIMARY KEY` | - | Identifikasi unik untuk setiap pengguna. |
| `name` | `VARCHAR(255)` | `NOT NULL` | - | Nama lengkap pengguna sesuai KTP/Identitas. Disimpan dalam format Title Case disarankan. |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | - | Alamat email unik untuk login. Diindeks untuk pencarian cepat. Mencakup validasi format email. |
| `email_verified_at` | `TIMESTAMP` | `NULLABLE` | `NULL` | Stempel waktu kapan pengguna memverifikasi email mereka. Jika NULL, status belum verifikasi. |
| `password` | `VARCHAR(255)` | `NOT NULL` | - | Hash kata sandi menggunakan algoritma Bcrypt (cost factor default 10). Panjang hash 60 karakter. |
| `role` | `ENUM` | `NOT NULL` | - | Peran pengguna. Nilai yang diizinkan: `'donatur'`, `'penerima'`. Menentukan hak akses API. |
| `avatar` | `VARCHAR(255)` | `NULLABLE` | `NULL` | Path relatif ke penyimpanan file (storage/app/public/avatars). Jika NULL, frontend menampilkan placeholder. |
| `phone_number` | `VARCHAR(20)` | `NULLABLE` | `NULL` | Nomor telepon atau WhatsApp. Disimpan sebagai string untuk mengakomodasi kode negara (misal +62). |
| `address` | `TEXT` | `NULLABLE` | `NULL` | Alamat lengkap domisili pengguna. Tipe TEXT digunakan untuk menampung alamat panjang. |
| `remember_token` | `VARCHAR(100)` | `NULLABLE` | `NULL` | Token acak untuk fitur "Remember Me" pada sesi login browser. |
| `created_at` | `TIMESTAMP` | `NULLABLE` | `CURRENT_TIMESTAMP` | Waktu pembuatan record. Otomatis diisi oleh Eloquent. |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | `CURRENT_TIMESTAMP` | Waktu terakhir record diubah. Update otomatis on update. |

**SQL Create Statement:**
```sql
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('donatur','penerima') COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2. Tabel `donations`
Menyimpan semua data terkait barang yang didonasikan. Tabel ini memiliki relasi berat dengan tabel `users` dan `requests`.

**Spesifikasi Kolom:**

| Nama Kolom | Tipe Data | Atribut | Default | Deskripsi Detail |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT(20)` | `UNSIGNED`, `AUTO_INCREMENT`, `PRIMARY KEY` | - | ID Unik Donasi. |
| `user_id` | `BIGINT(20)` | `UNSIGNED`, `NOT NULL`, `FOREIGN KEY` | - | ID Donatur pemilik barang. Berelasi ke `users.id`. |
| `title` | `VARCHAR(255)` | `NOT NULL` | - | Judul deskriptif barang donasi (mis: "Laptop Bekas Layak Pakai"). Max 255 chars. |
| `description` | `TEXT` | `NOT NULL` | - | Penjelasan lengkap mengenai kondisi, spesifikasi, cacat, dan sejarah barang. |
| `category` | `ENUM` | `NOT NULL` | - | Kategori barang untuk filtering. Nilai: `'pakaian'`, `'buku'`, `'elektronik'`, `'perabotan'`, `'lainnya'`. |
| `image_path` | `VARCHAR(255)` | `NOT NULL` | - | Path file gambar barang di server. Wajib ada. |
| `location` | `VARCHAR(255)` | `NOT NULL` | - | Lokasi barang saat ini (Kota/Kecamatan/Alamat Lengkap). Digunakan untuk estimasi jarak. |
| `status` | `ENUM` | `NOT NULL` | `'available'` | Status alur donasi. Nilai: `'available'`, `'pending'`, `'processed'`, `'shipped'`, `'completed'`. |
| `created_at` | `TIMESTAMP` | `NULLABLE` | `CURRENT_TIMESTAMP` | Waktu posting dibuat. |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | `CURRENT_TIMESTAMP` | Waktu update terakhir (saat status berubah). |

**SQL Create Statement:**
```sql
CREATE TABLE `donations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('pakaian','buku','elektronik','perabotan','lainnya') COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('available','pending','processed','shipped','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `donations_user_id_foreign` (`user_id`),
  CONSTRAINT `donations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3. Tabel `requests`
Tabel transaksional yang mencatat interaksi antara Penerima dan Barang Donasi.

**Spesifikasi Kolom:**

| Nama Kolom | Tipe Data | Atribut | Default | Deskripsi Detail |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGINT(20)` | `UNSIGNED`, `AUTO_INCREMENT`, `PRIMARY KEY` | - | ID Unik Request. |
| `user_id` | `BIGINT(20)` | `UNSIGNED`, `NOT NULL`, `FOREIGN KEY` | - | ID Penerima yang mengajukan. Berelasi ke `users.id`. |
| `donation_id` | `BIGINT(20)` | `UNSIGNED`, `NOT NULL`, `FOREIGN KEY` | - | ID Barang yang diminta. Berelasi ke `donations.id`. |
| `message` | `TEXT` | `NOT NULL` | - | Pesan/Alasan permohonan yang ditulis penerima untuk meyakinkan donatur. |
| `status` | `ENUM` | `NOT NULL` | `'pending'` | Status persetujuan. Nilai: `'pending'`, `'approved'`, `'rejected'`. |
| `created_at` | `TIMESTAMP` | `NULLABLE` | `CURRENT_TIMESTAMP` | Waktu request diajukan. |
| `updated_at` | `TIMESTAMP` | `NULLABLE` | `CURRENT_TIMESTAMP` | Waktu status berubah (disetujui/ditolak). |

**SQL Create Statement:**
```sql
CREATE TABLE `requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `donation_id` bigint(20) unsigned NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `requests_user_id_foreign` (`user_id`),
  KEY `requests_donation_id_foreign` (`donation_id`),
  CONSTRAINT `requests_donation_id_foreign` FOREIGN KEY (`donation_id`) REFERENCES `donations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 💾 Data Sampel (JSON Format)

Berikut adalah representasi data JSON dari tabel-tabel di atas untuk keperluan debugging API dan testing.

### Sample User (Donatur)
```json
{
  "id": 1,
  "name": "Budi Santoso",
  "email": "budi@donatur.com",
  "email_verified_at": "2025-01-01T10:00:00.000000Z",
  "role": "donatur",
  "avatar": "avatars/budi_profile.jpg",
  "phone_number": "081234567890",
  "address": "Jl. Telekomunikasi No. 1, Bandung",
  "created_at": "2025-01-01T10:00:00.000000Z",
  "updated_at": "2025-01-01T10:00:00.000000Z"
}
```

### Sample Donation
```json
{
  "id": 101,
  "user_id": 1,
  "title": "Koleksi Buku Harry Potter Lengkap",
  "description": "Buku bekas kondisi 90% mulus, bahasa Indonesia. Edisi hard cover.",
  "category": "buku",
  "image_path": "donations/harry_potter_collection.jpg",
  "location": "Jakarta Selatan",
  "status": "available",
  "created_at": "2025-12-10T08:30:00.000000Z",
  "updated_at": "2025-12-10T08:30:00.000000Z"
}
```

### Sample Request
```json
{
  "id": 501,
  "user_id": 2,
  "donation_id": 101,
  "message": "Saya sangat membutuhkan buku ini untuk perpustakaan desa kami.",
  "status": "pending",
  "created_at": "2025-12-11T09:00:00.000000Z",
  "updated_at": "2025-12-11T09:00:00.000000Z"
}
```

---

## 🔐 Logika Bisnis & Validasi Database

Selain struktur fisik, terdapat beberapa logika bisnis yang diimplementasikan di level aplikasi (Laravel Models) namun merefleksikan integritas data:

1.  **Unique Request Rule**: Aplikasi harus mencegah insert ke tabel `requests` jika pasangan `user_id` dan `donation_id` sudah ada dan statusnya `pending` atau `approved`. Mencegah spam request.
2.  **Status Workflow**: Perubahan kolom `status` pada tabel `donations` harus mengikuti alur sekuensial:
    *   `available` -> `processed` (Saat request di-approve)
    *   `processed` -> `shipped` (Saat donatur kirim barang)
    *   `shipped` -> `completed` (Saat penerima konfirmasi terima)
    *   `processed` -> `available` (Jika request dibatalkan/ditolak belakangan)
3.  **Cascade Delete**: Jika User dihapus/banned, semua donasi dan request mereka otomatis terhapus untuk menjaga kebersihan database.

---
*Dokumen ini diperbarui secara otomatis berdasarkan migrasi database Laravel terakhir.*
