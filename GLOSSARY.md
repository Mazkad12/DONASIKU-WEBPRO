# 📖 Glosarium Lengkap Istilah Teknis & Bisnis

Dokumen ini adalah kamus komprehensif yang memuat definisi istilah, akronim, dan jargon teknis yang digunakan dalam ekosistem pengembangan **Donasiku**. Tujuannya adalah menyamakan pemahaman antara pengembang frontend, backend, desainer, dan pemangku kepentingan non-teknis.

---

## A

### **API (Application Programming Interface)**
Antarmuka standar yang memungkinkan dua aplikasi software (dalam hal ini Frontend React dan Backend Laravel) untuk saling berkomunikasi dan bertukar data. Donasiku menggunakan gaya REST API.

### **Authentication (Otentikasi)**
Proses keamanan untuk memverifikasi identitas pengguna, biasanya melalui kombinasi email dan kata sandi. Jika valid, sistem memberikan token akses.

### **Authorization (Otorisasi)**
Proses setelah otentikasi yang menentukan apa saja yang *boleh* dilakukan oleh pengguna tersebut. Contoh: Penerima bisa login (otentikasi), tapi tidak boleh menghapus data donasi orang lain (otorisasi).

### **Axios**
Pustaka (library) JavaScript berbasis Promise yang digunakan di sisi Client (React) untuk melakukan HTTP Request (GET, POST, PUT, DELETE) ke server backend. Terkenal karena kemudahannya menangani JSON otomatis.

### **Avatar**
Representasi grafis atau foto profil dari pengguna. Dalam sistem ini, avatar disimpan sebagai file gambar yang diunggah pengguna.

---

## B

### **Backend**
Bagian "server-side" dari aplikasi yang menangani logika bisnis, database, otentikasi, dan API. Donasiku menggunakan framework **Laravel**.

### **Bearer Token**
String kriptografi panjang yang digunakan sebagai "kunci akses". Frontend harus mengirim token ini di header `Authorization: Bearer <token>` setiap kali meminta data pribadi ke backend.

### **Blade Template**
Mesin templating bawaan Laravel. Meskipun Donasiku menggunakan React sebagai frontend utama, Blade mungkin masih digunakan untuk halaman email atau error server default.

### **Bug**
Kesalahan atau cacat dalam kode program yang menyebabkan aplikasi berperilaku tidak semestinya atau crash.

---

## C

### **Client-Side Rendering (CSR)**
Teknik di mana browser pengguna mendownload file JavaScript minimal, lalu JavaScript tersebut (React) membangun antarmuka halaman secara dinamis. Ini membuat navigasi terasa cepat seperti aplikasi native.

### **Component (React)**
Blok bangunan dasar UI dalam React. Sebuah tombol, formulir input, atau kartu donasi adalah komponen terpisah yang digabungkan menjadi halaman utuh.

### **Composer**
Manajer paket (Dependency Manager) untuk bahasa PHP. Digunakan untuk menginstal Laravel dan pustaka pendukung backend lainnya.

### **Controller**
Bagian dari arsitektur MVC di Laravel yang bertindak sebagai "polisi lalu lintas". Menerima request dari user, memprosesnya (lewat Model), dan mengembalikan response.

### **CORS (Cross-Origin Resource Sharing)**
Mekanisme keamanan browser yang mengizinkan atau memblokir akses resource dari domain berbeda. Frontend (port 5173) dan Backend (port 8000) memerlukan konfigurasi CORS yang benar agar bisa bicara.

### **CRUD (Create, Read, Update, Delete)**
Empat operasi dasar penyimpanan data persisten. Aksi standar di aplikasi: Buat donasi, Lihat donasi, Edit donasi, Hapus donasi.

---

## D

### **Dashboard**
Halaman pusat kontrol pengguna yang muncul setelah login. Dashboard Donatur menampilkan statistik donasi, Dashboard Penerima menampilkan katalog barang.

### **Database Migration**
File kode (PHP) yang mendefinisikan struktur tabel database. Memungkinkan semua developer memiliki struktur database yang sama dengan menjalankan perintah `php artisan migrate`.

### **Dependency Injection**
Pola desain di mana objek menerima objek lain yang diperlukannya (dependensi) dari luar, meningkatkan modularitas kode Laravel.

### **Deployment**
Proses memindahkan kode aplikasi dari komputer developer (Local) ke server produksi (Live) agar bisa diakses pengguna umum internet.

### **Donatur**
Role pengguna yang memiliki barang berlebih dan ingin menyumbangkannya. Memiliki akses untuk membuat (Post) donasi baru.

---

## E

### **Eloquent ORM**
Fitur andalan Laravel yang memungkinkan interaksi dengan database menggunakan sintaks PHP berorientasi objek yang elegan, tanpa harus menulis query SQL manual yang rumit.

### **Endpoint**
URL spesifik di API yang menerima request. Contoh: `http://localhost:8000/api/login` adalah endpoint untuk login.

### **Environment Variable (.env)**
File konfigurasi yang menyimpan data sensitif atau spesifik lingkungan (seperti password DB, API Key) yang tidak boleh di-hardcode di dalam script program.

---

## F

### **Faker**
Pustaka PHP yang digunakan dalam `Seeder` untuk men-generate data palsu (nama, alamat, teks dummy) secara massal untuk keperluan testing.

### **Foreign Key**
Kolom dalam tabel database yang merujuk ke Primary Key di tabel lain, menciptakan hubungan (relasi) antar data. Contoh: `user_id` di tabel donasi.

### **Frontend**
Bagian "client-side" aplikasi yang dilihat pengguna. Donasiku menggunakan **React.js**.

---

## H

### **Header (HTTP)**
Bagian dari permintaan HTTP yang membawa meta-data, seperti tipe konten (`application/json`) atau token otentikasi.

### **Hook (React)**
Fungsi spesial di React (diawali `use...` seperti `useState`, `useEffect`) yang memungkinkan penggunaan state di dalam function component.

### **HTTP Status Codes**
Kode angka standar dari server:
*   **200 OK**: Sukses.
*   **201 Created**: Data berhasil dibuat.
*   **401 Unauthorized**: Gagal login / Token salah.
*   **403 Forbidden**: Login benar tapi tidak punya hak akses.
*   **404 Not Found**: Data tidak ditemukan.
*   **422 Unprocessable Entity**: Validasi input gagal.
*   **500 Server Error**: Server meledak/error koding.

---

## J

### **JSON (JavaScript Object Notation)**
Format pertukaran data berbasis teks yang ringan. Digunakan sebagai format standar komunikasi antara React dan Laravel di proyek ini.

### **JWT (JSON Web Token)**
Standar terbuka untuk token akses yang ringkas dan aman URL, sering digunakan dalam otentikasi stateless seperti Sanctum.

---

## L

### **Laravel Sanctum**
Paket otentikasi ringan untuk Laravel, dirancang khusus untuk SPA (Single Page Application) dan API token sederhana.

### **Local Storage**
Penyimpanan data key-value di browser pengguna. Kita menyimpan Bearer Token di sini agar user tetap login meskipun browser di-refresh.

---

## M

### **Middleware**
Lapisan penengah di backend yang memfilter request HTTP masuk. Contoh: Middleware `auth` menendang user yang belum login sebelum mereka sampai ke Controller.

### **Model**
Kelas PHP yang merepresentasikan tabel database (misal: Model `Donation` mewakili tabel `donations`).

---

## N

### **Node.js**
Runtime JavaScript di sisi server. Di proyek ini, Node.js diperlukan untuk menjalankan alat pengembangan frontend (Vite, NPM).

### **NPM (Node Package Manager)**
Gudang paket untuk JavaScript. Digunakan untuk menginstal React, Tailwind, Axios, dll.

---

## P

### **Pagination**
Teknik memecah data dalam jumlah besar menjadi beberapa halaman (misal: menampilkan 10 donasi per halaman) agar loading tidak berat.

### **Penerima**
Role pengguna yang mencari barang donasi. Memiliki akses untuk mencari dan me-request barang.

### **Primary Key**
Kolom unik (biasanya `id`) yang mengidentifikasi setiap baris dalam tabel database secara eksklusif.

### **Props (React)**
Singkatan dari "Properties". Cara mengirim data dari komponen induk (Parent) ke komponen anak (Child) di React.

---

## R

### **React Router**
Pustaka standar untuk routing di React, memungkinkan navigasi antar "halaman" (URL berbeda) tanpa me-reload browser sepenuhnya.

### **Responsive Design**
Pendekatan desain web yang membuat tampilan web menyesuaikan diri secara otomatis dengan ukuran layar pengguna (HP, Tablet, Laptop) menggunakan Tailwind CSS.

### **REST (Representational State Transfer)**
Gaya arsitektur standar untuk mendesain aplikasi jaringan (API).

---

## S

### **Seeder**
Kelas di Laravel yang berfungsi untuk mengisi database dengan data awal. Sangat berguna saat setup server baru agar database tidak kosong melompong.

### **SPA (Single Page Application)**
Aplikasi web yang memuat satu halaman HTML tunggal dan memperbarui konten secara dinamis. Memberikan pengalaman pengguna yang mulus seperti aplikasi desktop.

### **State (React)**
Objek yang menyimpan data internal sebuah komponen yang bisa berubah seiring waktu (misal: isi input form, status loading). Perubahan state memicu render ulang komponen.

---

## T

### **Tailwind CSS**
Framework CSS *utility-first* yang memungkinkan pembuatan desain custom dengan cepat langsung di dalam kelas HTML tanpa menulis file CSS terpisah.

### **Timestamp**
Format waktu (Tgl-Bln-Thn Jam:Mnt:Dtk) yang mencatat kapan data dibuat (`created_at`) atau diubah (`updated_at`).

---

## U

### **UI (User Interface)**
Tampilan visual aplikasi: apa yang dilihat pengguna (tombol, warna, layout).

### **UX (User Experience)**
Pengalaman pengguna saat berinteraksi: kemudahan penggunaan, kejelasan alur, kecepatan respon.

---

## V

### **Validation**
Proses memeriksa data input pengguna (di Frontend dan Backend) untuk memastikan data tersebut aman, lengkap, dan sesuai format sebelum diproses.

### **Vite**
Build tool modern untuk frontend yang sangat cepat dalam proses development server dan bundling produksi.

---
*Glosarium ini akan terus berkembang seiring penambahan fitur baru pada Donasiku.*
