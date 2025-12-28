# Tutorial Docker untuk Proyek DONASIKU-WEBPRO

Panduan ini akan membantu Anda menjalankan proyek Donasiku menggunakan Docker.

## Prasyarat
- [Docker Desktop](https://www.docker.com/products/docker-desktop) harus sudah terinstal dan berjalan.

## Struktur Docker
Proyek ini sekarang memiliki layanan berikut yang berjalan dalam container:
1. **app**: Backend Laravel (PHP 8.2).
2. **frontend**: Frontend React (Node.js/Vite).
3. **webserver**: Nginx untuk melayani aplikasi.
4. **db**: Database MySQL 8.0.

## Cara Menjalankan

### 1. Bangun dan Jalankan Container
Buka terminal di folder root proyek dan jalankan perintah:

```bash
docker-compose up -d --build
```
> Opsi `-d` menjalankan container di background (detached mode).
> Opsi `--build` memaksa pembuatan ulang image jika ada perubahan.

### 2. Verifikasi Instalasi
Setelah perintah selesai, cek apakah semua container berjalan dengan:

```bash
docker-compose ps
```
Anda harus melihat 4 container dengan status `Up`.

### 3. Akses Aplikasi
- **Frontend**: Buka [http://localhost:5173](http://localhost:5173) di browser.
- **Backend API**: Akses [http://localhost:8000/api](http://localhost:8000/api).
- **Database**: Host `localhost`, Port `3307` (Mapping dari 3306), User `root`, Password `rootpassword`.

## Perintah Berguna Lainnya

### Melihat Log
Untuk melihat log dari semua service:
```bash
docker-compose logs -f
```
Untuk service tertentu (misal backend):
```bash
docker-compose logs -f app
```

### Masuk ke dalam Container
Jika Anda perlu menjalankan perintah artisan atau composer secara manual di dalam container backend:
```bash
docker-compose exec app bash
```
Contoh menjalankan migrasi manual:
```bash
docker-compose exec app php artisan migrate
```

### Menghentikan Aplikasi
```bash
docker-compose down
```

## Catatan Penting
- **Database**: Data database disimpan secara persisten di volume docker `dbdata`. Jika Anda menghapus volume ini, data database akan hilang.
- **Hot Reload**: Frontend sudah dikonfigurasi untuk mendukung hot-reload, jadi perubahan kode yang Anda buat di `frontend/src` akan langsung terlihat di browser tanpa perlu restart container.
- **Dependencies**: Jika Anda menambahkan package baru (composer atau npm), Anda perlu membangun ulang container dengan `docker-compose up -d --build`.
