# Kebijakan Keamanan (Security Policy)

Kami di tim **Donasiku** menganggap serius keamanan data pengguna dan integritas sistem kami. Dokumen ini menjelaskan kebijakan keamanan kami dan prosedur untuk melaporkan kerentanan.

## 📦 Versi yang Didukung

Kami secara aktif memantau dan memberikan pembaruan keamanan untuk versi-versi berikut dari proyek kami:

| Versi | Status |
| :---: | :--- |
| **1.x** | ✅ **Didukung Secara Aktif** (Versi saat ini) |
| < 1.0 | ❌ Tidak Lagi Didukung |

Jika Anda menggunakan versi yang tidak didukung, kami sangat menyarankan Anda untuk segera memperbarui ke versi terbaru untuk mendapatkan perbaikan keamanan terkini.

## 🛡️ Melaporkan Kerentanan

Jika Anda menemukan celah keamanan atau kerentanan dalam aplikasi Donasiku, kami sangat menghargai bantuan Anda untuk mengungkapkannya kepada kami secara bertanggung jawab.

### Prosedur Pelaporan

1. **JANGAN** mempublikasikan kerentanan secara terbuka (issue tracker, media sosial, dll) sebelum memberikan kami waktu untuk memperbaikinya.
2. Kirimkan laporan detail mengenai kerentanan tersebut melalui email ke salah satu PIC kami (lihat README) atau buat issue bersifat **Confidential** di repositori ini jika platform mendukungnya.
3. Sertakan informasi berikut dalam laporan Anda:
    - Deskripsi kerentanan.
    - Langkah-langkah untuk mereproduksi (Steps to Reproduce).
    - Dampak potensial dari kerentanan tersebut.
    - Screenshot atau _proof of concept_ (jika ada).

### Respons Tim Kami

- Kami akan berusaha merespons laporan Anda dalam waktu **2 x 24 jam**.
- Jika kerentanan dikonfirmasi, kami akan menjadwalkan perbaikan sesegera mungkin.
- Kami akan memberi tahu Anda setelah perbaikan dirilis.

## 🔒 Praktik Keamanan Teknis

Proyek ini dibangun dengan mempertimbangkan praktik keamanan standar industri, termasuk namun tidak terbatas pada:

- **Otentikasi Aman**: Menggunakan **Laravel Sanctum** untuk manajemen token API yang aman dan terenkripsi.
- **Perlindungan CSRF**: Backend Laravel secara otomatis memproteksi dari serangan _Cross-Site Request Forgery_.
- **Sanitasi Input**: Mencegah serangan _SQL Injection_ dan _XSS_ melalui penggunaan ORM (Eloquent) dan sanitasi otomatis React.
- **Enkripsi**: Password pengguna di-hash menggunakan algoritma **Bcrypt** yang kuat.
- **Validasi Data**: Validasi ketat diterapkan di sisi Server (Backend) dan Client (Frontend) untuk memastikan integritas data.

## 🚫 Di Luar Cakupan (Out of Scope)

Hal-hal berikut dianggap di luar cakupan program keamanan kami:

- Serangan Spam atau Social Engineering.
- Serangan fisik terhadap infrastruktur pengguna.
- Kerentanan yang mempengaruhi pengguna versi browser yang sudah usang/tidak didukung.
- Serangan DDoS (Distributed Denial of Service) pada layanan hosting.

## 📝 Pengungkapan Bertanggung Jawab

Kami berjanji untuk tidak mengambil tindakan hukum terhadap peneliti keamanan yang melaporkan kerentanan dengan mengikuti pedoman ini dan tidak mengeksploitasi kerentanan tersebut untuk merugikan pengguna kami.

Terima kasih telah membantu menjaga **Donasiku** tetap aman untuk semua orang! ❤️
