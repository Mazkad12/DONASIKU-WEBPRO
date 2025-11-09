# Dokumentasi Azrll — Do & Done

##  Setup & Konfigurasi Awal
- Setup struktur folder frontend menggunakan **React.js + Vite (JavaScript)**.  
- Integrasi **TailwindCSS**, **PostCSS**, dan konfigurasi build environment lengkap.  
- Penyesuaian folder utama (`src`, `public`, `assets`, `components`, `features`, `services`, `utils`) agar modular dan mudah dikembangkan.


## Layout & Struktur Komponen
- Membuat folder `layout/` yang berisi komponen tata letak utama:
  - `Navbar`
  - `Sidebar`
  - `Topbar`
  - `Footer`
- Layout digunakan di **dua dashboard utama**:
  - Dashboard Main (Landing Page)
  - Dashboard Donation (Donatur)



## Komponen UI Reusable
- Membuat komponen **reusable UI** agar dapat digunakan ulang di berbagai halaman:
  - `Button` — tombol utama dengan gaya konsisten.  
  - `Card` — komponen untuk menampilkan informasi donasi.  
  - `Input` — field input dengan validasi dan state binding.



## Sistem Autentikasi (Auth)
- Implementasi fitur **Login** dan **Register** untuk Donatur & Penerima.  
- Data user (token, role, dan informasi akun) disimpan di **localStorage**.  
- Manajemen session diatur melalui helper `utils/localStorage.js`.



## Dashboard Donatur (CRUD Donasi)
- Pembuatan **Dashboard Donatur** lengkap dengan fitur CRUD:
  - **DaftarDonasi** → Menampilkan seluruh donasi pengguna.  
  - **FormDonasi** → Menambahkan donasi baru.  
  - **EditDonasi** → Mengubah data donasi yang sudah ada.  
  - **DeleteDonasi** → Menghapus donasi dari daftar.



## Dashboard Main (Landing Page)
- Menyediakan **Landing Page utama** untuk pengenalan aplikasi DonasiKu.  
- Menampilkan hero section dan navigasi menuju login/register.  
- Desain responsif dan ringan menggunakan TailwindCSS.



## Error Handling
- Membuat halaman **NotFound (404 Page)** untuk menangani route yang tidak ditemukan.  
- Menampilkan pesan error yang interaktif dan menyediakan tombol navigasi kembali ke Home.



## Services Layer
- Folder `services/` berisi logika dan fungsi utama untuk komunikasi antar komponen:
  - `authService.js` → proses login dan register.  
  - `donationService.js` → proses CRUD donasi (create, update, delete, fetch).



## Utilities
- Folder `utils/` menyimpan helper dan function penting:
  - `localStorage.js` → manajemen session & autentikasi pengguna.  
  - `validation.js` → validasi input form (email, password, dan lainnya).



## Configuration Files
- Konfigurasi utama proyek sudah lengkap:
  - `App.jsx` & `main.jsx` → routing utama dan root React DOM.  
  - `tailwind.config.js` & `postcss.config.js` → setup Tailwind & PostCSS.  
  - `vite.config.js` → pengaturan path alias & environment.  
  - `assets/` & `public/` → aset gambar dan ikon sudah terorganisir.

---

