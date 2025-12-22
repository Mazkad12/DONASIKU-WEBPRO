# Dokumentasi Azrll — Do & Done

## Setup & Konfigurasi Awal Frontend
- Setup struktur folder frontend menggunakan React.js + Vite (JavaScript)
- Integrasi TailwindCSS, PostCSS, dan konfigurasi build environment lengkap
- Penyesuaian folder utama (src, public, assets, components, features, services, utils) agar modular dan mudah dikembangkan

## Layout & Struktur Komponen Frontend
- Membuat folder layout/ yang berisi komponen tata letak utama: Navbar, Sidebar, Topbar, Footer
- Layout digunakan di dua dashboard utama: Dashboard Main (Landing Page) dan Dashboard Donation (Donatur)

## Komponen UI Reusable Frontend
- Membuat komponen reusable UI agar dapat digunakan ulang di berbagai halaman
- Button: tombol utama dengan gaya konsisten
- Card: komponen untuk menampilkan informasi donasi
- Input: field input dengan validasi dan state binding

## Sistem Autentikasi Frontend
- Implementasi fitur Login dan Register untuk Donatur & Penerima
- Data user (token, role, dan informasi akun) disimpan di localStorage
- Manajemen session diatur melalui helper utils/localStorage.js

## Dashboard Donatur Frontend
- Pembuatan Dashboard Donatur lengkap dengan fitur CRUD
- DaftarDonasi: Menampilkan seluruh donasi pengguna
- FormDonasi: Menambahkan donasi baru
- EditDonasi: Mengubah data donasi yang sudah ada
- DeleteDonasi: Menghapus donasi dari daftar

## Dashboard Main Frontend
- Menyediakan Landing Page utama untuk pengenalan aplikasi DonasiKu
- Menampilkan hero section dan navigasi menuju login/register
- Desain responsif dan ringan menggunakan TailwindCSS

## Error Handling Frontend
- Membuat halaman NotFound (404 Page) untuk menangani route yang tidak ditemukan
- Menampilkan pesan error yang interaktif dan menyediakan tombol navigasi kembali ke Home

## Services Layer Frontend
- Folder services/ berisi logika dan fungsi utama untuk komunikasi antar komponen
- authService.js: proses login dan register
- donationService.js: proses CRUD donasi (create, update, delete, fetch)
- api.js: konfigurasi axios dan interceptors untuk komunikasi dengan backend

## Utilities Frontend
- Folder utils/ menyimpan helper dan function penting
- localStorage.js: manajemen session & autentikasi pengguna
- validation.js: validasi input form (email, password, dan lainnya)

## Configuration Files Frontend
- Konfigurasi utama proyek sudah lengkap
- App.jsx & main.jsx: routing utama dan root React DOM
- tailwind.config.js & postcss.config.js: setup Tailwind & PostCSS
- vite.config.js: pengaturan path alias & environment
- assets/ & public/: aset gambar dan ikon sudah terorganisir

## Setup & Konfigurasi Backend
- Setup struktur folder backend menggunakan Laravel Framework versi 10+ dengan PHP 8.1+
- Konfigurasi Laravel Sanctum untuk API authentication
- Setup CORS Configuration untuk komunikasi frontend-backend
- Konfigurasi MySQL Database via PHPMyAdmin untuk data persistence
- Environment Variables di .env untuk konfigurasi sensitif (database, app key, sanctum)

## Struktur Folder Backend
- app/Http/Controllers: AuthController.php dan DonationController.php
- app/Http/Middleware: Authenticate.php untuk proteksi route
- app/Http/Requests: StoreDonationRequest.php dan UpdateDonationRequest.php untuk validasi
- app/Models: User.php dan Donation.php untuk model database
- config: cors.php, sanctum.php, database.php
- database/migrations: migrasi untuk tabel users dan donations
- routes/api.php: definisi endpoint API

## Database Schema
- Membuat database di PHPMyAdmin/MySQL dengan nama donasiku
- Tabel users: id, name, email, password, role (enum: donatur/penerima), timestamps
- Tabel donations: id, user_id (FK), nama, kategori (enum), jumlah, deskripsi, lokasi, image (longtext), status (enum: aktif/selesai), timestamps
- Relasi one-to-many antara users dan donations

## Sistem Autentikasi Backend
- Implementasi endpoint POST /api/register untuk pendaftaran user baru dengan role
- Implementasi endpoint POST /api/login untuk autentikasi dengan email dan password
- Generate Sanctum token setelah login berhasil
- Implementasi endpoint POST /api/logout untuk revoke token
- Implementasi endpoint GET /api/me untuk retrieve data user yang sedang login
- Middleware Sanctum untuk proteksi endpoint yang memerlukan autentikasi

## API Endpoints Donasi
- GET /api/donations: list semua donasi (public)
- GET /api/donations/{id}: detail donasi by ID
- POST /api/donations: create donasi baru (authenticated, donatur only)
- PUT /api/donations/{id}: update donasi (authenticated, owner only)
- DELETE /api/donations/{id}: delete donasi (authenticated, owner only)
- GET /api/my-donations: list donasi user yang login (authenticated)
- PATCH /api/donations/{id}/status: update status donasi (authenticated, owner only)

## Fitur CRUD Donasi Backend
- Create Donation: form dengan validasi nama, kategori, jumlah, deskripsi, lokasi, upload foto (base64)
- Validasi backend: required fields, enum validation, integer validation, max length
- Edit Donation: update semua field donasi termasuk status (aktif/selesai)
- Authorization check: hanya owner yang dapat edit dan delete donasi
- Delete Donation: soft delete dengan authorization check
- View Donations: pagination, filter by status, filter by kategori
- Set Lokasi: field lokasi required saat create/update donasi untuk informasi pengambilan

## Controller Implementation Backend
- DonationController dengan method index, myDonations, store, show, update, destroy, updateStatus
- AuthController dengan method register, login, logout, me
- Try-catch block untuk error handling pada setiap method
- Transaction management dengan DB::beginTransaction dan DB::commit
- Response format konsisten dengan structure: success, message, data
- Format data camelCase untuk konsistensi dengan frontend

## Request Validation Backend
- StoreDonationRequest: validasi untuk create donasi
- UpdateDonationRequest: validasi untuk update donasi
- Rules: required, string, max, integer, min, enum, nullable
- Custom error messages dalam bahasa Indonesia
- Validation untuk base64 image dengan max size 5MB

## Dashboard Penerima Backend
- Endpoint GET /api/donations untuk view semua donasi aktif
- Query parameter untuk filter by kategori
- Query parameter untuk search by nama, deskripsi, atau lokasi
- Response include pagination meta (total, per_page, current_page, last_page)
- Penerima dapat browse dan search donasi dari semua donatur

## Integrasi Frontend Backend
- Setup axios instance dengan baseURL http://localhost:8000/api
- Request interceptor untuk menambahkan Bearer token ke setiap request
- Response interceptor untuk handle 401 Unauthorized dan auto redirect
- Service layer di frontend untuk wrapping API calls
- Error handling dengan try-catch di setiap service function
- Abort controller untuk cancel pending requests saat component unmount

## State Management & Data Flow
- LocalStorage untuk menyimpan auth_token, user data, dan isAuthenticated flag
- React useState untuk managing component state (donations, loading, error)
- useEffect dengan cleanup function untuk prevent memory leak
- Mounted flag untuk check component lifecycle sebelum setState
- AbortController pattern untuk prevent infinite loop request

## Error Handling & Recovery
- Frontend: error state dengan retry button, loading spinner, empty state
- Backend: try-catch block dengan proper error response
- API timeout: 10 detik untuk setiap request
- 401 handling: auto clear localStorage dan redirect ke login
- Network error handling: return empty array untuk graceful degradation
- Validation error: display error message dari backend

## Image Upload Implementation
- Upload foto donasi menggunakan base64 encoding
- Frontend: file reader untuk convert image ke base64 string
- Backend: store base64 string di database column longtext
- Validation: max file size 5MB di frontend
- Display: render base64 string directly di img tag
- Fallback: display category icon jika tidak ada image

## Dashboard Donatur Integration
- Stats cards menampilkan total donasi, donasi aktif, donasi selesai
- Filter tabs: semua, aktif, selesai
- Card layout dengan image preview, kategori badge, status badge
- Action buttons: edit dan delete untuk setiap donasi
- Confirmation dialog sebelum delete
- Auto refresh list setelah create, update, atau delete
- Loading state dan empty state dengan call-to-action

## Dashboard Penerima Integration
- Browse semua donasi aktif dari database
- Search functionality untuk cari donasi by nama atau deskripsi
- Filter by kategori: pakaian, elektronik, buku, mainan, perabotan, lainnya
- Card layout dengan informasi lengkap: nama, jumlah, lokasi, tanggal
- Detail donasi dengan lokasi pengambilan
- Responsive grid layout: 1 kolom mobile, 2 kolom tablet, 3 kolom desktop

## Response Format Standardization
- Backend response structure: { success: boolean, message: string, data: object }
- Data donasi format: id, userId, nama, kategori, jumlah, deskripsi, lokasi, image, status, createdAt (ISO8601), updatedAt (ISO8601)
- Error response: { success: false, message: string }
- Pagination meta: { total, per_page, current_page, last_page }
- Consistent camelCase naming di seluruh response

## Security Implementation
- Laravel Sanctum token-based authentication
- CORS configuration untuk allow localhost:5173
- Password hashing dengan bcrypt
- Authorization check: user_id match dengan Auth::id() untuk update/delete
- Protected routes dengan auth:sanctum middleware
- Token expiration handling di frontend interceptor
- SQL injection prevention dengan Eloquent ORM

## Status Proyek
- Backend API endpoints fully functional
- Frontend dashboard donatur complete dengan CRUD
- Frontend dashboard penerima complete dengan browse & search
- Authentication system working (login, register, logout)
- Image upload via base64 implemented
- Database integration success
- CORS configuration working
- Error handling implemented
- Infinite loop issue resolved
- Role-based access control working

