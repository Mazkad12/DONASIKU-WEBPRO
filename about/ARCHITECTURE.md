# 🏗️ Arsitektur Sistem Donasiku

Dokurmen ini menjelaskan arsitektur teknis dari platform **Donasiku**. Kami menggunakan pendekatan **Modular Monolith** yang memisahkan Frontend dan Backend secara jelas namun tetap dalam satu ekosistem pengembangan untuk kemudahan maintenance.

---

## 🗺️ Diagram Arsitektur Tingkat Tinggi (High-Level Architecture)

Berikut adalah gambaran bagaimana komponen-komponen utama dalam sistem saling berinteraksi:

```mermaid
graph TD
    Client[User Browser / Client]
    
    subgraph Frontend_Layer
        ReactApp[React JS Application]
        Axios[Axios HTTP Client]
        Router[React Router]
    end

    subgraph Backend_Layer
        Laravel[Laravel Framework]
        Sanctum[Laravel Sanctum Auth]
        Controllers[API Controllers]
        Eloquent[Eloquent ORM]
    end

    subgraph Data_Layer
        MySQL[(MySQL Database)]
        Storage[File Storage / Images]
    end

    Client -->|User Interaction| ReactApp
    ReactApp -->|Page Navigation| Router
    ReactApp -->|API Request (JSON)| Axios
    Axios -->|HTTP/HTTPS| Laravel
    
    Laravel -->|Auth Check| Sanctum
    Laravel -->|Business Logic| Controllers
    Controllers -->|Query Data| Eloquent
    Eloquent -->|SQL Query| MySQL
    Controllers -->|Upload/Fetch| Storage
```

---

## 🧩 Komponen Utama

### 1. Frontend Layer (React.js)
Frontend bertugas menangani interaksi pengguna dan menampilkan data. Arsitekturnya bersifat **Single Page Application (SPA)**.
- **Vite**: Digunakan sebagai build tool super cepat.
- **Component Based**: UI dipecah menjadi komponen kecil (`Button`, `Card`, `Navbar`) yang reusable.
- **Tailwind CSS**: Digunakan untuk styling dengan pendekatan *utility-first*.
- **State Management**: Menggunakan React Context untuk *Global State* (seperti data User Login & Theme).

### 2. Backend Layer (Laravel)
Backend berfungsi sebagai penyedia API (RESTful Service).
- **API Routes**: Titik masuk request (`routes/api.php`).
- **Controllers**: Mengatur logika alur data (misal: `DonationController`).
- **Middleware**: Menangani keamanan (CORS, Auth Sanctum, Role Check).
- **Requests**: Validasi input data sebelum diproses controller.

### 3. Database Layer (MySQL)
Penyimpanan data relasional yang terstruktur.
- **Migrations**: Version control untuk skema database.
- **Seeders**: Data awal (dummy) untuk keperluan development.
- **Relationships**: Menggunakan Eloquent (`hasMany`, `belongsTo`) untuk menghubungkan tabel User, Donation, dan Request.

---

## 🔄 Alur Data (Data Flow)

### Contoh Kasus: Proses Donasi Barang
1.  **User Input**: Donatur mengisi form "Buat Donasi" di Frontend.
2.  **Client Validation**: React memvalidasi kelengkapan form (judul tidak boleh kosong).
3.  **API Call**: Axios mengirim `POST` request ke `/api/donations` dengan Bearer Token.
4.  **Auth Check**: Laravel Sanctum memverifikasi token valid.
5.  **Controller Logic**: `DonationController` menerima request, menyimpan gambar ke `storage`, dan menyimpan data teks ke MySQL.
6.  **Response**: Server mengembalikan JSON status `201 Created`.
7.  **UI Update**: React menerima respon dan menampilkan notifikasi "Sukses" lalu redirect ke Dashboard.

---

## 🛡️ Desain Keamanan

- **Stateless Authentication**: Menggunakan Token Based Auth, sehingga server tidak menyimpan session state yang berat.
- **CSRF Protection**: Meskipun API stateless, Laravel tetap memvalidasi asal request.
- **XSS Prevention**: React secara default melakukan *escaping* pada output data untuk mencegah injeksi script.
- **Env Security**: Credential sensitif (DB Password, API Keys) disimpan di `.env` dan tidak di-commit ke Git.

---

## 📂 Struktur Direktori Utama

### Backend
*   `app/Http/Controllers`: Logika inti aplikasi.
*   `app/Models`: Representasi tabel database.
*   `routes/api.php`: Definisi endpoint API.
*   `database/migrations`: Definisi struktur tabel.

### Frontend
*   `src/components`: Elemen UI kecil (Button, Input).
*   `src/features`: Fitur modular (Auth, Donation, Profile).
*   `src/pages`: Halaman utama yang menggabungkan fitur.
*   `src/services`: Konfigurasi panggilan API (Axios).

---
*Dokumen arsitektur ini dibuat untuk membantu developer baru memahami "Big Picture" dari sistem Donasiku.*
