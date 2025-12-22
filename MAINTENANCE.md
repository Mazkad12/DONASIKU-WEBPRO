# 🧹 Prosedur Pemeliharaan Sistem (Maintenance SOP)

Dokumen ini berisi Standar Operasional Prosedur (SOP) untuk pemeliharaan rutin, backup, dan penanganan insiden pada sistem **Donasiku** di lingkungan produksi (Live Server).

---

## 1. Jadwal Pemeliharaan Rutin

### ☀️ Harian (Daily)
*   **Pukul 02:00**: Rotasi Log Otomatis.
    *   Pastikan log aplikasi tidak memenuhi disk server. Log lama diarsipkan dalam format `.gz`.
*   **Pukul 03:00**: Backup Database Inkremental.
    *   Backup data transaksi hari berjalan.

### 📅 Mingguan (Weekly) - Setiap Minggu Dini Hari
*   **Full Backup Database**: Dump seluruh database MySQL dan simpan ke Cloud Storage terpisah (AWS S3 / Google Drive).
*   **Cek Kapasitas Disk**: Pastikan sisa ruang penyimpanan server > 20%.
*   **Update OS Server**: Menjalankan `apt update && apt upgrade` (Kecuali kernel critical, butuh restart).

### 🗓️ Bulanan (Monthly) - Tanggal 1
*   **Review Access Log**: Memeriksa log Nginx untuk mendeteksi anomali akses atau upaya peretasan.
*   **Cleanup Storage**: Menghapus file gambar sementara atau sampah (`orphaned files`) yang tidak terpakai di database.
*   **Token Pruning**: Menghapus token otentikasi (Sanctum) yang sudah kedaluwarsa atau tidak dipakai > 30 hari.
    ```bash
    php artisan sanctum:prune-expired --hours=720
    ```

---

## 2. Prosedur Backup & Restore

### A. Strategi Backup
Kami menggunakan aturan **3-2-1**:
*   **3** Salinan data (Live, Backup Local, Backup Cloud).
*   **2** Media berbeda (Disk Server, Cloud Storage).
*   **1** Lokasi off-site (Cloud).

### B. Cara Manual Backup Database
Jika auto-backup gagal, jalankan perintah ini via SSH:
```bash
# Format: mysqldump -u [user] -p[pass] [dbname] > [filename].sql
mysqldump -u root -p donasiku > /var/backups/donasiku_manual_$(date +%F).sql
gzip /var/backups/donasiku_manual_$(date +%F).sql
```

### C. Cara Restore Database (Darurat)
1.  Stop layanan web sementara (opsional): `php artisan down`.
2.  Import file SQL:
    ```bash
    gunzip < /var/backups/donasiku_backup.sql.gz | mysql -u root -p donasiku
    ```
3.  Hidupkan layanan kembali: `php artisan up`.

---

## 3. Kebijakan Keamanan (Security Patches)

### Monitoring Vulnerability
Tim DevOps wajib berlangganan notifikasi keamanan untuk:
*   Laravel Framework (via GitHub Security Advisories).
*   PHP & Nginx (via OS Vendor).

### Prosedur Patching
1.  **Test Lokal**: Coba update di komputer lokal/staging terlebih dahulu.
    ```bash
    composer update --no-dev
    ```
2.  **Backup**: Lakukan backup database & kodingan sebelum update di produksi.
3.  **Eksekusi**: Jalankan update di jam sepi trafik (00:00 - 05:00).
4.  **Verifikasi**: Cek semua fitur krusial (Login, CRUD Donasi) setelah update.

---

## 4. Disaster Recovery Plan (DRP)

Jika terjadi bencana total (Server meledak, Data Center terbakar, Peretasan Ransomware):

1.  **Isolasi**: Putuskan koneksi server dari internet jika ada dugaan serangan aktif.
2.  **Provisioning**: Sewa VPS baru di provider berbeda (misal: pindah dari Google Cloud ke AWS).
3.  **Deploy Code**: Pull kode terbaru dari repositori GitHub.
    ```bash
    git clone ...
    composer install
    ```
4.  **Restore Data**: Ambil backup database terakhir dari Cloud Storage.
5.  **DNS Switch**: Ubah IP domain `donasiku.com` ke IP server baru via Cloudflare.
6.  **Post-Mortem**: Analisis penyebab kejadian dan buat laporan insiden dalam 1x24 jam.

---

## 5. Kontak Darurat (Emergency Contacts)
Jika sistem down di luar jam kerja, hubungi urutan berikut:

1.  **Ketua Tim / Lead Dev**: Nauval (0812-xxxx-xxxx) - *Respon < 1 Jam*.
2.  **Database Admin**: Azka (0813-xxxx-xxxx) - *Respon < 2 Jam*.
3.  **Hosting Provider Support**: Tiket Prioritas #Critical.

---
*Kepatuhan terhadap SOP ini adalah kunci reliabilitas layanan aplikasi Donasiku.*
