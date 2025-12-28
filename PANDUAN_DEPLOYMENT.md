# Panduan Deployment (Cara Onlinekan Aplikasi)

## 1. Persiapan Wajib: Upload ke GitHub
Sebelum menggunakan PaaS (Render/Railway) atau VPS, kode Anda harus ada di GitHub dulu.
1.  Buat repository baru di [GitHub](https://github.com/new).
2.  Buka terminal di project Anda, lalu jalankan:
    ```bash
    git init
    git add .
    git commit -m "Siap deploy"
    git branch -M main
    git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
    git push -u origin main
    ```

---

## 2. Pilihan PaaS (Mudah & Cepat)
Ini adalah cara yang Anda pilih. Tidak perlu setting server, cukup sambungkan GitHub.

### Opsi A: Railway (Paling Mudah untuk Docker)
Railway bisa membaca `docker-compose.yml` Anda dan langsung menjalankannya semua (Backend, Frontend, Database, Adminer) sekaligus.
1.  Buka [Railway.app](https://railway.app/) dan Login dengan GitHub.
2.  Klik **+ New Project** > **Deploy from GitHub repo**.
3.  Pilih repository Anda.
4.  Railway akan mendeteksi `docker-compose.yml` dan menyiapkan semua service.
5.  Masuk ke menu **Variables**, sesuaikan environment variable jika perlu.
6.  Klik deploy. Done!

### Opsi B: Render (Paling Populer untuk Gratisan)
Render lebih cocok jika Anda ingin deploy layanan satu per satu secara gratis.
> **Catatan Penting**: Render "Free Tier" hanya menyediakan database **PostgreSQL** (bukan MySQL). Jika Anda ingin tetap pakai MySQL di Render, Anda harus sewa database MySQL di tempat lain (misal: Aiven.io) atau modifikasi Dockerfile backend Anda untuk support PostgreSQL.

**Langkah Deploy di Render:**

**1. Database (PostgreSQL)**
1.  Di Dashboard Render, klik **New +** > **PostgreSQL**.
2.  Beri nama, pilih "Free Tier".
3.  Copy `Internal Database URL` yang diberikan.

**2. Backend (Web Service)**
1.  Klik **New +** > **Web Service**.
2.  Connect repository GitHub Anda.
3.  Pilih folder **Root Directory**: `backend` (Penting!).
4.  Environment: **Docker**.
5.  Pada bagian **Environment Variables**, masukkan isi dari `.env` backend Anda, TAPI ubah bagian database agar konek ke PostgreSQL yang baru dibuat (DB_CONNECTION=pgsql, dst).

**3. Frontend (Static Site / Web Service)**
1.  Klik **New +** > **Static Site** (Lebih hemat).
2.  Build Command: `npm install && npm run build`
3.  Publish Directory: `dist`
4.  Add Rewrites: Source `/*`, Destination `/index.html`, Action `Rewrite`.

---

## 3. Metode Permanen (VPS) - Tingkat Lanjut
Hanya gunakan ini jika Anda ingin kontrol penuh dan performa maksimal.

### Langkah Singkat:
1.  Sewa VPS (Ubuntu 22.04).
2.  SSH ke server.
3.  Install Docker & Docker Compose.
4.  Clone repo GitHub Anda.
5.  Jalankan `docker-compose up -d`.

---

## 4. Metode Sementara (Ngrok) - Untuk Demo Sekarang
Hanya untuk tes ke teman saat ini juga (laptop harus nyala).
1.  Pastikan aplikasi jalan di laptop.
2.  Jalankan `ngrok http 5173`.
3.  Copy link yang muncul dan kirim ke teman.
