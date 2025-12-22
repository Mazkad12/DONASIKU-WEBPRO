# 🧠 Catatan Keputusan Arsitektur (Architecture Decision Log)

Dokumen ini merekam semua keputusan arsitektur penting, konteksnya, dan konsekuensinya bagi proyek **Donasiku**. Format yang digunakan adalah **ADR (Architecture Decision Record)**.

---

## ADR-001: Menggunakan Arsitektur Modular Monolith

*   **Status**: Diterima
*   **Tanggal**: 10 Oktober 2025
*   **Pengambil Keputusan**: Tim Pengembang (Kelompok 3)

### Konteks
Kami perlu membangun aplikasi yang cukup kompleks dengan tim yang terdiri dari 6 orang. Kami mempertimbangkan antara *Microservices* yang sedang tren atau *Monolith* tradisional.

### Keputusan
Kami memilih pendekatan **Modular Monolith**.

### Alasan
1.  **Kompleksitas Operasional**: Microservices membutuhkan orkestrasi (Kubernetes/Docker Swarm) yang terlalu rumit untuk skala tim mahasiswa dan deadline tugas.
2.  **Kecepatan Pengembangan**: Monolith memungkinkan refactoring kode lebih cepat karena semua ada dalam satu repositori.
3.  **Modularitas**: Kami tetap memisahkan kode secara logis (folder `features` di frontend, `Modules` di backend jika perlu) agar tidak terjadi *Spaghetti Code*.

### Konsekuensi
*   (+) Setup environment lokal jauh lebih mudah (hanya perlu 1 server backend & 1 server frontend).
*   (+) Debugging end-to-end lebih simpel.
*   (-) Skalabilitas terbatas pada satu mesin (Vertical Scaling) kecuali dipecah nantinya.

---

## ADR-002: Frontend dengan React.js ecosystem Vite

*   **Status**: Diterima
*   **Tanggal**: 12 Oktober 2025

### Konteks
Pilihan framework frontend sangat beragam: Vue, React, Angular, atau Blade (Server-Side).

### Keputusan
Menggunakan **React.js** v18+ dengan build tool **Vite**.

### Alasan
1.  **Ekosistem**: React memiliki pustaka UI terbesar.
2.  **Performa Dev**: Vite jauh lebih cepat daripada Webpack (CRA) dalam hal Hot Module Replacement (HMR).
3.  **Skillset**: Mayoritas anggota tim sudah familiar atau ingin mendalami React.

### Konsekuensi
*   Kami harus mengelola state management di sisi klien (menggunakan React Context).
*   SEO memerlukan konfigurasi tambahan (walaupun ini dashboard tertutup, jadi bukan isu besar).

---

## ADR-003: Backend dengan Laravel Framework

*   **Status**: Diterima
*   **Tanggal**: 12 Oktober 2025

### Konteks
Kami membutuhkan backend yang stabil, aman, dan cepat dalam pengembangan API CRUD. Pilihan: Node.js (Express) atau PHP (Laravel).

### Keputusan
Menggunakan **Laravel** v10/11.

### Alasan
1.  **Kelengkapan Fitur**: Laravel sudah menyediakan Auth, ORM (Eloquent), Validation, dan Migration *out-of-the-box*. Di Express, kami harus merakit sendiri.
2.  **Keamanan**: Proteksi CSRF, XSS, dan SQL Injection sudah ditangani framework.
3.  **Dokumentasi**: Laravel memiliki dokumentasi terbaik di kelasnya.

### Konsekuensi
*   Server harus mendukung PHP (agak lebih berat dibanding Node.js untuk I/O bound tasks, tapi cukup untuk CRUD).

---

## ADR-004: Otentikasi Stateless dengan Laravel Sanctum

*   **Status**: Diterima
*   **Tanggal**: 15 Oktober 2025

### Konteks
Bagaimana cara mengamankan komunikasi antara React (Port 5173) dan Laravel (Port 8000)? Pilihan: JWT manual, Passport (OAuth2), atau Sanctum.

### Keputusan
Menggunakan **Laravel Sanctum**.

### Alasan
1.  **Kesederhanaan**: Sanctum dirancang khusus untuk SPA (Single Page Application). Setup jauh lebih mudah dibanding Passport.
2.  **Keamanan**: Mendukung perlindungan CSRF cookie-based untuk SPA, atau Token-based untuk Mobile Apps.

---

## ADR-005: Styling dengan Tailwind CSS

*   **Status**: Diterima
*   **Tanggal**: 16 Oktober 2025

### Konteks
Kami butuh cara cepat untuk membuat UI yang konsisten tanpa menulis CSS dari nol. Pilihan: Bootstrap, Material UI, atau Tailwind.

### Keputusan
Menggunakan **Tailwind CSS**.

### Alasan
1.  **Fleksibilitas**: Tidak terpaku pada desain "bawaan pabrik" seperti Bootstrap.
2.  **Ukuran File**: Dengan Tree-shaking, CSS bundle di produksi sangat kecil.
3.  **DX (Developer Experience)**: Tidak perlu pindah-pindah file antara `.jsx` dan `.css`.

### Konsekuensi
*   Kode HTML/JSX menjadi agak "kotor" dengan banyak nama class, namun bisa diatasi dengan ekstraksi komponen.

---

## ADR-006: Database MySQL

*   **Status**: Diterima
*   **Tanggal**: 18 Oktober 2025

### Konteks
Penyimpanan data yang relasional dan terstruktur. Pilihan: PostgreSQL atau MySQL.

### Keputusan
Menggunakan **MySQL** (atau MariaDB).

### Alasan
1.  **Ketersediaan**: Hampir semua hosting murah mendukung MySQL/MariaDB.
2.  **Kompatibilitas**: Sangat kompatibel dengan Eloquent Laravel.

---
*Catatan: Dokumen ini bersifat hidup dan akan bertambah seiring keputusan teknis baru diambil.*
