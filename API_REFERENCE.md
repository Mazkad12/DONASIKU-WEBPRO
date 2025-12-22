# 📖 Referensi API Donasiku

Dokumentasi ini menjelaskan secara rinci seluruh endpoint REST API yang tersedia dalam platform **Donasiku**. API ini digunakan untuk komunikasi antara klien (Frontend React) dan server (Backend Laravel).

## 🌍 Base URL
Semua permintaan API harus diarahkan ke:
```
http://localhost:8000/api
```
Atau domain produksi yang sesuai.

## 🔐 Otentikasi
Sebagian besar endpoint memerlukan otentikasi menggunakan **Bearer Token** (Laravel Sanctum).
Tambahkan header berikut pada setiap permintaan yang dilindungi:
```
Authorization: Bearer <your_access_token>
Accept: application/json
```

---

## 🚀 Daftar Endpoint

### 1. Otentikasi & Akun
Kumpulan endpoint untuk manajemen sesi dan registrasi pengguna.

#### `POST /register`
Mendaftarkan pengguna baru ke dalam sistem.

**Body Parameter:**
| Key | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| `name` | string | Ya | Nama lengkap pengguna |
| `email` | string | Ya | Alamat email unik |
| `password` | string | Ya | Kata sandi (min. 8 karakter) |
| `role` | string | Ya | Peran pengguna: `donatur` atau `penerima` |

**Contoh Response (201 Created):**
```json
{
  "message": "Registrasi berhasil",
  "data": {
    "user": { "id": 1, "name": "Budi", "email": "budi@example.com", "role": "donatur" },
    "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz"
  }
}
```

#### `POST /login`
Masuk ke sistem untuk mendapatkan akses token.

**Body Parameter:**
| Key | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| `email` | string | Ya | Email terdaftar |
| `password` | string | Ya | Kata sandi |

#### `POST /logout`
Mengakhiri sesi dan menghapus token akses saat ini.
*Memerlukan Auth Token.*

#### `GET /me`
Mengambil data pengguna yang sedang login.
*Memerlukan Auth Token.*

---

### 2. 📦 Donasi (Donations)
Manajemen postingan barang donasi oleh Donatur.

#### `GET /donations`
Mengambil daftar semua donasi aktif (Public).

#### `POST /donations`
Membuat postingan donasi baru.
*Hanya untuk Role: Donatur*

**Body Parameter:**
| Key | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| `title` | string | Ya | Judul barang donasi |
| `description` | string | Ya | Deskripsi kondisi dan detail barang |
| `category` | string | Ya | Kategori: `pakaian`, `buku`, `elektronik`, dll |
| `image` | file | Ya | Foto barang (JPG/PNG, max 2MB) |
| `location` | string | Ya | Alamat atau koordinat lokasi barang |

#### `GET /donations/{id}`
Melihat detail satu postingan donasi.

#### `GET /my-donations`
Melihat daftar donasi yang dibuat oleh user yang sedang login.
*Hanya untuk Role: Donatur*

#### `PATCH /donations/{id}/status`
Memperbarui status donasi (misal: dari `available` ke `unavailable`).

---

### 3. 🤲 Permintaan Saya (My Requests)
Manajemen permintaan barang yang diajukan oleh Penerima.

#### `POST /permintaan-sayas`
Mengajukan permintaan untuk barang donasi tertentu.
*Hanya untuk Role: Penerima*

**Body Parameter:**
| Key | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| `donation_id` | integer | Ya | ID donasi yang diinginkan |
| `reason` | string | Ya | Alasan mengapa membutuhkan barang tersebut |
| `quantity` | integer | Tidak | Jumlah barang (default 1) |

#### `GET /permintaan-sayas`
Melihat daftar semua permintaan yang pernah diajukan oleh user.

#### `PATCH /permintaan-sayas/{id}/received`
Menandai bahwa barang telah diterima oleh Penerima. Mengubah status transaksi menjadi selesai.

---

### 4. 🔀 Workflow Transaksi
Endpoint khusus untuk mengubah status alur donasi.

#### `PATCH /permintaan-sayas/{id}/approve`
**Aktor:** Donatur
**Fungsi:** Menyetujui permintaan dari Penerima.

#### `PATCH /permintaan-sayas/{id}/reject`
**Aktor:** Donatur
**Fungsi:** Menolak permintaan dari Penerima.

#### `PATCH /permintaan-sayas/{id}/sent`
**Aktor:** Donatur
**Fungsi:** Konfirmasi bahwa barang telah dikirim/diserahkan.

---

### 5. 👤 Profil Pengguna
Mengelola informasi dan pengaturan akun.

#### `GET /profile`
Melihat detail profil lengkap.

#### `POST /profile/update`
Memperbarui data profil (termasuk avatar).
*Mendukung Multipart Form Data*

---

### 6. 💬 Chat System
Komunikasi real-time antara Donatur dan Penerima.

#### `GET /chat/conversations`
Mengambil daftar percakapan yang aktif.

#### `GET /chat/messages/{peerId}`
Mengambil riwayat pesan dengan pengguna tertentu (`peerId`).

#### `POST /chat/send`
Mengirim pesan baru.

**Body Parameter:**
| Key | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| `receiver_id` | integer | Ya | ID pengguna tujuan |
| `message` | string | Ya | Isi pesan teks |

---

### 7. 🔔 Notifikasi
Sistem pemberitahuan aktivitas.

#### `GET /notifications`
Mengambil daftar notifikasi terbaru.

#### `PATCH /notifications/{id}/read`
Menandai satu notifikasi telah dibaca.

#### `PATCH /notifications/read-all`
Menandai semua notifikasi sebagai telah dibaca.

---

## ⚠️ Kode Status HTTP
Berikut adalah kode status umum yang digunakan dalam respon API:

- `200 OK`: Permintaan berhasil diproses.
- `201 Created`: Resource baru berhasil dibuat.
- `400 Bad Request`: Input tidak valid atau format salah.
- `401 Unauthorized`: Token tidak ada, kedaluwarsa, atau tidak valid.
- `403 Forbidden`: Pengguna tidak memiliki izin untuk akses ini (misal: Penerima mencoba akses fitur Donatur).
- `404 Not Found`: Endpoint atau resource tidak ditemukan.
- `422 Unprocessable Entity`: Validasi form gagal.
- `500 Internal Server Error`: Terjadi kesalahan pada server.

---
*Dokumentasi ini digenerate secara manual dan mungkin memerlukan pembaruan seiring perkembangan fitur.*
