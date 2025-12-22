# Donasiku API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
API menggunakan Laravel Sanctum untuk autentikasi. Token harus disertakan dalam header untuk endpoint yang memerlukan autentikasi.

```
Authorization: Bearer {token}
```

---

## Public Endpoints

### Register User
**POST** `/register`

**Request Body:**
```json
{
  "name": "string (required, max:255)",
  "email": "string (required, email, unique, max:255)",
  "password": "string (required, min:6)",
  "role": "string (required, enum: donatur|penerima)",
  "phone": "string (optional, max:20)"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "donatur",
      "phone": "081234567890",
      "photo": null
    },
    "token": "1|abc123..."
  }
}
```

---

### Login
**POST** `/login`

**Request Body:**
```json
{
  "email": "string (required, email)",
  "password": "string (required)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "donatur",
      "phone": "081234567890",
      "photo": null
    },
    "token": "1|abc123..."
  }
}
```

**Error 422:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Email atau password salah"]
  }
}
```

---

### Get All Donations
**GET** `/donations`

**Query Parameters:**
- `status` (optional): aktif|selesai
- `kategori` (optional): pakaian|elektronik|buku|mainan|perabotan|lainnya
- `search` (optional): string
- `per_page` (optional): integer (default: 15)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "userId": 1,
        "nama": "Laptop Bekas",
        "kategori": "elektronik",
        "jumlah": 5,
        "deskripsi": "Laptop bekas kondisi baik",
        "lokasi": "Jakarta Selatan",
        "image": "data:image/jpeg;base64,...",
        "status": "aktif",
        "createdAt": "2025-12-01T10:00:00.000000Z",
        "updatedAt": "2025-12-01T10:00:00.000000Z"
      }
    ],
    "meta": {
      "total": 100,
      "per_page": 15,
      "current_page": 1,
      "last_page": 7
    }
  }
}
```

---

### Get Donation by ID
**GET** `/donations/{id}`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "nama": "Laptop Bekas",
    "kategori": "elektronik",
    "jumlah": 5,
    "deskripsi": "Laptop bekas kondisi baik",
    "lokasi": "Jakarta Selatan",
    "image": "data:image/jpeg;base64,...",
    "status": "aktif",
    "donatur": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "photo": null,
      "phone": "081234567890"
    },
    "createdAt": "2025-12-01T10:00:00.000000Z",
    "updatedAt": "2025-12-01T10:00:00.000000Z"
  }
}
```

**Error 404:**
```json
{
  "success": false,
  "message": "Donasi tidak ditemukan"
}
```

---

## Protected Endpoints

### Logout
**POST** `/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### Get Current User
**GET** `/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donatur",
    "phone": "081234567890",
    "photo": null
  }
}
```

---

## Donation Management

### Create Donation
**POST** `/donations`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nama": "string (required, max:255)",
  "kategori": "string (required, enum: pakaian|elektronik|buku|mainan|perabotan|lainnya)",
  "jumlah": "integer (required, min:1)",
  "deskripsi": "string (required)",
  "lokasi": "string (required)",
  "image": "string (optional, base64)"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Donasi berhasil dibuat",
  "data": {
    "id": 1,
    "userId": 1,
    "nama": "Laptop Bekas",
    "kategori": "elektronik",
    "jumlah": 5,
    "deskripsi": "Laptop bekas kondisi baik",
    "lokasi": "Jakarta Selatan",
    "image": "data:image/jpeg;base64,...",
    "status": "aktif",
    "createdAt": "2025-12-01T10:00:00.000000Z",
    "updatedAt": "2025-12-01T10:00:00.000000Z"
  }
}
```

**Error 422:**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "nama": ["Nama barang harus diisi"],
    "jumlah": ["Jumlah minimal 1"]
  }
}
```

---

### Update Donation
**PUT** `/donations/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nama": "string (optional, max:255)",
  "kategori": "string (optional, enum: pakaian|elektronik|buku|mainan|perabotan|lainnya)",
  "jumlah": "integer (optional, min:0)",
  "deskripsi": "string (optional)",
  "lokasi": "string (optional)",
  "image": "string (optional, base64)",
  "status": "string (optional, enum: aktif|selesai)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Donasi berhasil diperbarui",
  "data": {
    "id": 1,
    "user_id": 1,
    "nama": "Laptop Bekas Updated",
    "kategori": "elektronik",
    "jumlah": 3,
    "deskripsi": "Laptop bekas kondisi sangat baik",
    "lokasi": "Jakarta Selatan",
    "image": "data:image/jpeg;base64,...",
    "status": "aktif",
    "created_at": "2025-12-01T10:00:00.000000Z",
    "updated_at": "2025-12-01T11:00:00.000000Z"
  }
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### Delete Donation
**DELETE** `/donations/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Donasi berhasil dihapus"
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses untuk menghapus donasi ini"
}
```

**Error 404:**
```json
{
  "success": false,
  "message": "Donasi tidak ditemukan"
}
```

---

### Get My Donations
**GET** `/my-donations`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): aktif|selesai
- `per_page` (optional): integer (default: 15)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "userId": 1,
        "nama": "Laptop Bekas",
        "kategori": "elektronik",
        "jumlah": 5,
        "deskripsi": "Laptop bekas kondisi baik",
        "lokasi": "Jakarta Selatan",
        "image": "data:image/jpeg;base64,...",
        "status": "aktif",
        "createdAt": "2025-12-01T10:00:00.000000Z",
        "updatedAt": "2025-12-01T10:00:00.000000Z"
      }
    ],
    "meta": {
      "total": 10,
      "per_page": 15,
      "current_page": 1,
      "last_page": 1
    }
  }
}
```

---

### Update Donation Status
**PATCH** `/donations/{id}/status`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "string (required, enum: aktif|selesai)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Status donasi berhasil diupdate"
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses untuk mengupdate status donasi ini"
}
```

**Error 404:**
```json
{
  "success": false,
  "message": "Donasi tidak ditemukan"
}
```

---

## Detail Donasi Management

### Get All Detail Donasi
**GET** `/detail-donasis`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): menunggu|diterima|ditolak

**Response 200:**
```json
{
  "success": true,
  "message": "Data detail donasi berhasil diambil",
  "data": [
    {
      "id": 1,
      "donation_id": 1,
      "user_id": 2,
      "nama_penerima": "Jane Doe",
      "email_penerima": "jane@example.com",
      "nomor_hp": "081234567890",
      "alamat": "Jl. Merdeka No. 10",
      "keperluan": "Untuk anak sekolah",
      "jumlah_diterima": 2,
      "status_penerimaan": "menunggu",
      "catatan": null,
      "tanggal_penerimaan": null,
      "created_at": "2025-12-01T10:00:00.000000Z",
      "updated_at": "2025-12-01T10:00:00.000000Z",
      "donation": {
        "id": 1,
        "user_id": 1,
        "nama": "Laptop Bekas",
        "kategori": "elektronik",
        "jumlah": 5,
        "deskripsi": "Laptop bekas kondisi baik",
        "lokasi": "Jakarta Selatan",
        "image": "data:image/jpeg;base64,...",
        "status": "aktif",
        "created_at": "2025-12-01T10:00:00.000000Z",
        "updated_at": "2025-12-01T10:00:00.000000Z"
      }
    }
  ]
}
```

---

### Get Detail Donasi by ID
**GET** `/detail-donasis/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Data detail donasi berhasil diambil",
  "data": {
    "id": 1,
    "donation_id": 1,
    "user_id": 2,
    "nama_penerima": "Jane Doe",
    "email_penerima": "jane@example.com",
    "nomor_hp": "081234567890",
    "alamat": "Jl. Merdeka No. 10",
    "keperluan": "Untuk anak sekolah",
    "jumlah_diterima": 2,
    "status_penerimaan": "menunggu",
    "catatan": null,
    "tanggal_penerimaan": null,
    "created_at": "2025-12-01T10:00:00.000000Z",
    "updated_at": "2025-12-01T10:00:00.000000Z",
    "donation": {
      "id": 1,
      "user_id": 1,
      "nama": "Laptop Bekas",
      "kategori": "elektronik",
      "jumlah": 5,
      "deskripsi": "Laptop bekas kondisi baik",
      "lokasi": "Jakarta Selatan",
      "image": "data:image/jpeg;base64,...",
      "status": "aktif",
      "created_at": "2025-12-01T10:00:00.000000Z",
      "updated_at": "2025-12-01T10:00:00.000000Z"
    }
  }
}
```

**Error 404:**
```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

---

### Create Detail Donasi
**POST** `/detail-donasis`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "donation_id": "integer (required, exists:donations,id)",
  "nama_penerima": "string (required, max:255)",
  "email_penerima": "string (required, email, max:255)",
  "nomor_hp": "string (required, max:20)",
  "alamat": "string (required)",
  "keperluan": "string (required)",
  "jumlah_diterima": "integer (required, min:1)"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Permintaan donasi berhasil dibuat",
  "data": {
    "id": 1,
    "donation_id": 1,
    "user_id": 2,
    "nama_penerima": "Jane Doe",
    "email_penerima": "jane@example.com",
    "nomor_hp": "081234567890",
    "alamat": "Jl. Merdeka No. 10",
    "keperluan": "Untuk anak sekolah",
    "jumlah_diterima": 2,
    "status_penerimaan": "menunggu",
    "catatan": null,
    "tanggal_penerimaan": null,
    "created_at": "2025-12-01T10:00:00.000000Z",
    "updated_at": "2025-12-01T10:00:00.000000Z"
  }
}
```

**Error 400:**
```json
{
  "success": false,
  "message": "Donasi ini tidak tersedia"
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Hanya penerima yang dapat menerima donasi"
}
```

---

### Update Detail Donasi Status
**PATCH** `/detail-donasis/{id}/status`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status_penerimaan": "string (required, enum: menunggu|diterima|ditolak)",
  "catatan": "string (optional)",
  "tanggal_penerimaan": "date (optional)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Status donasi berhasil diperbarui",
  "data": {
    "id": 1,
    "donation_id": 1,
    "user_id": 2,
    "nama_penerima": "Jane Doe",
    "email_penerima": "jane@example.com",
    "nomor_hp": "081234567890",
    "alamat": "Jl. Merdeka No. 10",
    "keperluan": "Untuk anak sekolah",
    "jumlah_diterima": 2,
    "status_penerimaan": "diterima",
    "catatan": "Terima kasih",
    "tanggal_penerimaan": "2025-12-01",
    "created_at": "2025-12-01T10:00:00.000000Z",
    "updated_at": "2025-12-01T11:00:00.000000Z"
  }
}
```

---

### Delete Detail Donasi
**DELETE** `/detail-donasis/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Detail donasi berhasil dihapus"
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses untuk menghapus data ini"
}
```

---

## Permintaan Saya Management

### Get All Permintaan Saya
**GET** `/permintaan-sayas`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): aktif|terpenuhi|dibatalkan

**Response 200:**
```json
{
  "success": true,
  "message": "Data permintaan berhasil diambil",
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "donation_id": 1,
      "judul": "Butuh Laptop untuk Belajar",
      "deskripsi": "Membutuhkan laptop untuk anak sekolah",
      "kategori": "elektronik",
      "target_jumlah": 2,
      "lokasi": "Jakarta Timur",
      "image": "storage/permintaan/req_123.png",
      "status": "aktif",
      "status_permohonan": "pending",
      "status_pengiriman": "draft",
      "bukti_kebutuhan": null,
      "approved_at": null,
      "sent_at": null,
      "received_at": null,
      "created_at": "2025-12-01T10:00:00.000000Z",
      "updated_at": "2025-12-01T10:00:00.000000Z",
      "donation": {
        "id": 1,
        "user_id": 1,
        "nama": "Laptop Bekas",
        "image": "data:image/jpeg;base64,...",
        "kategori": "elektronik",
        "jumlah": 5,
        "lokasi": "Jakarta Selatan",
        "donatur": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "photo": null
        }
      },
      "user": {
        "id": 2,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "photo": null,
        "phone": "081234567890"
      }
    }
  ]
}
```

---

### Get Permintaan Saya by ID
**GET** `/permintaan-sayas/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Data permintaan berhasil diambil",
  "data": {
    "id": 1,
    "user_id": 2,
    "donation_id": 1,
    "judul": "Butuh Laptop untuk Belajar",
    "deskripsi": "Membutuhkan laptop untuk anak sekolah",
    "target_jumlah": 2,
    "image": "storage/permintaan/req_123.png",
    "status": "aktif",
    "user": {
      "id": 2,
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "donation": {
      "id": 1,
      "user_id": 1,
      "nama": "Laptop Bekas",
      "image": "data:image/jpeg;base64,...",
      "kategori": "elektronik",
      "jumlah": 5,
      "lokasi": "Jakarta Selatan",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "photo": null,
        "phone": "081234567890"
      }
    },
    "createdAt": "2025-12-01T10:00:00.000000Z",
    "updatedAt": "2025-12-01T10:00:00.000000Z"
  }
}
```

**Error 404:**
```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

---

### Create Permintaan Saya
**POST** `/permintaan-sayas`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "judul": "string (required, max:255)",
  "deskripsi": "string (optional)",
  "kategori": "string (required, max:255)",
  "target_jumlah": "integer (required, min:1)",
  "lokasi": "string (required, max:255)",
  "image": "string (optional, base64)",
  "batas_waktu": "date (optional)",
  "bukti_kebutuhan": "file (optional, image, max:2048KB)",
  "donation_id": "integer (optional, exists:donations,id)"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Permintaan berhasil dibuat",
  "data": {
    "id": 1,
    "user_id": 2,
    "donation_id": 1,
    "judul": "Butuh Laptop untuk Belajar",
    "deskripsi": "Membutuhkan laptop untuk anak sekolah",
    "kategori": "elektronik",
    "target_jumlah": 2,
    "jumlah_terkumpul": 0,
    "lokasi": "Jakarta Timur",
    "image": "storage/permintaan/req_123.png",
    "status": "aktif",
    "batas_waktu": null,
    "bukti_kebutuhan": null,
    "created_at": "2025-12-01T10:00:00.000000Z",
    "updated_at": "2025-12-01T10:00:00.000000Z"
  }
}
```

**Error 400:**
```json
{
  "success": false,
  "message": "Stok donasi tidak cukup. Stok tersedia: 3, diminta: 5"
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Hanya penerima yang dapat membuat permintaan"
}
```

---

### Update Permintaan Saya
**PUT** `/permintaan-sayas/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body (Penerima):**
```json
{
  "judul": "string (optional, max:255)",
  "deskripsi": "string (optional)",
  "kategori": "string (optional, max:255)",
  "target_jumlah": "integer (optional, min:1)",
  "lokasi": "string (optional, max:255)",
  "image": "string (optional, base64)",
  "status": "string (optional, enum: aktif|terpenuhi|dibatalkan)",
  "batas_waktu": "date (optional)",
  "bukti_kebutuhan": "string (optional)"
}
```

**Request Body (Donatur):**
```json
{
  "status": "string (required, enum: aktif|terpenuhi|dibatalkan)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Permintaan berhasil diperbarui",
  "data": {
    "id": 1,
    "user_id": 2,
    "donation_id": 1,
    "judul": "Butuh Laptop untuk Belajar Online",
    "deskripsi": "Membutuhkan laptop untuk anak sekolah online",
    "kategori": "elektronik",
    "target_jumlah": 2,
    "jumlah_terkumpul": 0,
    "lokasi": "Jakarta Timur",
    "image": "storage/permintaan/req_123.png",
    "status": "aktif",
    "batas_waktu": null,
    "bukti_kebutuhan": null,
    "created_at": "2025-12-01T10:00:00.000000Z",
    "updated_at": "2025-12-01T11:00:00.000000Z"
  }
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Anda tidak berhak mengubah permintaan ini"
}
```

---

### Delete Permintaan Saya
**DELETE** `/permintaan-sayas/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Permintaan berhasil dihapus"
}
```

---

### Approve Permintaan
**PATCH** `/permintaan-sayas/{id}/approve`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Permintaan disetujui",
  "data": {
    "id": 1,
    "user_id": 2,
    "donation_id": 1,
    "judul": "Butuh Laptop untuk Belajar",
    "status_permohonan": "approved",
    "approved_at": "2025-12-01T11:00:00.000000Z",
    "status_pengiriman": "draft"
  }
}
```

**Error 400:**
```json
{
  "success": false,
  "message": "Status permohonan sudah diproses"
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Hanya donatur yang dapat approve"
}
```

---

### Reject Permintaan
**PATCH** `/permintaan-sayas/{id}/reject`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "reason": "string (optional)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Permintaan ditolak",
  "data": {
    "id": 1,
    "user_id": 2,
    "donation_id": 1,
    "judul": "Butuh Laptop untuk Belajar",
    "status_permohonan": "rejected",
    "bukti_kebutuhan": "Ditolak - Stok tidak mencukupi"
  }
}
```

---

### Mark Permintaan as Sent
**PATCH** `/permintaan-sayas/{id}/sent`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Permintaan sudah dikirim",
  "data": {
    "id": 1,
    "status_pengiriman": "sent",
    "sent_at": "2025-12-01T12:00:00.000000Z"
  }
}
```

**Error 400:**
```json
{
  "success": false,
  "message": "Hanya permintaan yang diapprove yang dapat dikirim"
}
```

---

### Mark Permintaan as Received
**PATCH** `/permintaan-sayas/{id}/received`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Terima kasih! Permintaan telah dikonfirmasi diterima",
  "data": {
    "id": 1,
    "status_pengiriman": "received",
    "received_at": "2025-12-01T13:00:00.000000Z",
    "status": "terpenuhi"
  }
}
```

**Error 400:**
```json
{
  "success": false,
  "message": "Permintaan belum dikirim"
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Anda bukan pemilik permintaan ini"
}
```

---

### Fulfill Permintaan
**POST** `/permintaan-sayas/{id}/fulfill`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nama": "string (required, max:255)",
  "kategori": "string (required, max:255)",
  "jumlah": "integer (required, min:1)",
  "deskripsi": "string (required)",
  "lokasi": "string (required)",
  "image": "string (required, base64)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Terima kasih! Permintaan berhasil dipenuhi. Silakan proses pengiriman.",
  "data": {
    "id": 1,
    "user_id": 2,
    "donation_id": 10,
    "judul": "Butuh Laptop untuk Belajar",
    "status_permohonan": "approved",
    "approved_at": "2025-12-01T11:00:00.000000Z",
    "status_pengiriman": "draft",
    "donation": {
      "id": 10,
      "user_id": 1,
      "nama": "Laptop untuk Belajar",
      "kategori": "elektronik",
      "jumlah": 2,
      "status": "aktif"
    }
  }
}
```

**Error 400:**
```json
{
  "success": false,
  "message": "Permintaan ini sudah dipenuhi oleh orang lain"
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Hanya donatur yang dapat memenuhi permintaan"
}
```

---

## Profile Management

### Get Profile
**GET** `/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donatur",
    "phone": "081234567890",
    "photo": null,
    "avatar": null,
    "is_verified": false,
    "verification_document": null,
    "created_at": "2025-12-01T10:00:00.000000Z",
    "updated_at": "2025-12-01T10:00:00.000000Z"
  }
}
```

---

### Update Profile
**POST** `/user/profile`  
**POST** `/profile/update`  
**PUT** `/profile`  
**PATCH** `/profile`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "name": "string (required, max:255)",
  "email": "string (optional, email, unique, max:255)",
  "phone": "string (optional, max:15)",
  "photo": "file (optional, image, max:5MB)",
  "avatar": "file (optional, image, max:5MB)"
}
```

**Response 200:**
```json
{
  "message": "Profil berhasil diperbarui.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe Updated",
      "email": "john@example.com",
      "role": "donatur",
      "phone": "081234567890",
      "photo": "avatars/abc123.jpg",
      "avatar": null,
      "is_verified": false,
      "verification_document": null,
      "created_at": "2025-12-01T10:00:00.000000Z",
      "updated_at": "2025-12-01T12:00:00.000000Z"
    }
  }
}
```

**Error 422:**
```json
{
  "errors": {
    "email": ["The email has already been taken."],
    "photo": ["The photo must be an image."]
  }
}
```

---

## Chat Management

### Send Message
**POST** `/chat/send`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "receiver_id": "integer (required, exists:users,id)",
  "message": "string (required)"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "message": "Halo, apakah donasi masih tersedia?",
    "is_read": false,
    "created_at": "2025-12-01T10:00:00.000000Z",
    "updated_at": "2025-12-01T10:00:00.000000Z"
  }
}
```

---

### Get Conversations
**GET** `/chat/conversations`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "peer": {
        "id": 2,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "penerima",
        "phone": "081234567890",
        "photo": null
      },
      "last_message": {
        "id": 5,
        "sender_id": 2,
        "receiver_id": 1,
        "message": "Terima kasih banyak!",
        "is_read": false,
        "created_at": "2025-12-01T11:00:00.000000Z",
        "updated_at": "2025-12-01T11:00:00.000000Z"
      }
    }
  ]
}
```

---

### Get Messages with User
**GET** `/chat/messages/{peerId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sender_id": 1,
      "receiver_id": 2,
      "message": "Halo, apakah donasi masih tersedia?",
      "is_read": true,
      "created_at": "2025-12-01T10:00:00.000000Z",
      "updated_at": "2025-12-01T10:05:00.000000Z"
    },
    {
      "id": 2,
      "sender_id": 2,
      "receiver_id": 1,
      "message": "Ya masih tersedia",
      "is_read": true,
      "created_at": "2025-12-01T10:10:00.000000Z",
      "updated_at": "2025-12-01T10:15:00.000000Z"
    }
  ]
}
```

---

### Delete Message
**DELETE** `/chat/messages/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Pesan berhasil dihapus"
}
```

**Error 403:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Notification Management

### Get Notifications
**GET** `/notifications`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Permintaan Masuk",
      "message": "Jane Doe mengajukan permintaan untuk donasi: Laptop Bekas",
      "type": "application_received",
      "is_read": false,
      "link": "/dashboard-donatur",
      "created_at": "2025-12-01T10:00:00.000000Z",
      "updated_at": "2025-12-01T10:00:00.000000Z"
    }
  ],
  "unread_count": 5
}
```

---

### Mark Notification as Read
**PATCH** `/notifications/{id}/read`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true
}
```

---

### Mark All Notifications as Read
**PATCH** `/notifications/read-all`

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Terjadi kesalahan: {error_message}"
}
```

---

## Notes

### Image Handling
- Images can be sent as Base64 strings in the `image` field
- Maximum file size for image uploads: 5MB
- Supported formats: jpeg, png, jpg, gif, webp

### Roles
- `donatur`: Can create donations, approve/reject requests, fulfill requests
- `penerima`: Can create requests, receive donations, confirm receipt

### Status Workflows

**Donation Status:**
- `aktif`: Donation is available
- `selesai`: Donation is completed

**Permintaan Status:**
- `aktif`: Request is active
- `terpenuhi`: Request is fulfilled
- `dibatalkan`: Request is cancelled

**Status Permohonan:**
- `pending`: Awaiting approval
- `approved`: Approved by donor
- `rejected`: Rejected by donor

**Status Pengiriman:**
- `draft`: Not yet sent
- `sent`: Item has been sent
- `received`: Item has been received by recipient