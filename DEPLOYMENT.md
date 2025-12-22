# 🚀 Panduan Deployment Donasiku

Dokumen ini adalah panduan teknis komprehensif untuk men-deploy aplikasi **Donasiku** ke lingkungan produksi. Panduan ini mencakup tiga skenario deployment yang umum digunakan: **Shared Hosting (cPanel)**, **Virtual Private Server (VPS/Ubuntu)**, dan **Docker Container**.

---

## 📋 Prasyarat Umum

Sebelum memulai proses deployment, pastikan server atau lingkungan hosting Anda memenuhi persyaratan minimum berikut:

*   **PHP**: Versi 8.2 atau lebih baru.
*   **Ekstensi PHP**: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML.
*   **Database**: MySQL 5.7+ atau MariaDB 10.3+.
*   **Node.js**: Versi 18+ (LTS) untuk build frontend.
*   **Web Server**: Nginx atau Apache.
*   **Composer**: Terinstal secara global.

---

## 🛠️ Skenario 1: Shared Hosting (cPanel)

Metode ini cocok untuk deployment biaya rendah dan mudah dikelola. Karena Shared Hosting memiliki keterbatasan akses terminal, kita akan membangun (build) aplikasi di lokal terlebih dahulu.

### Langkah 1: Persiapan Build Lokal
1.  Buka terminal di komputer lokal Anda.
2.  **Build Frontend**:
    ```bash
    cd frontend
    # Pastikan file .env.production sudah diatur dengan URL backend produksi
    # Contoh: VITE_API_Base_URL=https://websiteanda.com/api
    npm install
    npm run build
    ```
    Hasil build akan muncul di folder `frontend/dist`.
3.  **Persiapan Backend**:
    *   Hapus folder `vendor` dan `node_modules` di dalam folder `backend` (jika ada) untuk mengurangi ukuran upload (kita akan install ulang di hosting jika ada SSH, atau upload vendor jika tidak ada).
    *   *Saran:* Lebih baik menjalankan `composer install --optimize-autoloader --no-dev` di lokal, lalu zip folder `backend` beserta `vendor`-nya jika hosting tidak mendukung SSH Composer.

### Langkah 2: Struktur Folder Hosting
Untuk keamanan, jangan taruh seluruh kode Laravel di dalam `public_html`. Gunakan struktur berikut:
```
/home/username/
├── donasiku-app/    (Kode Laravel & Hasil Build React)
└── public_html/     (Hanya isi folder public Laravel)
```

### Langkah 3: Upload & Konfigurasi
1.  Buat folder `donasiku-app` di root direktori hosting (sejajar dengan `public_html`).
2.  Upload isi folder `backend` ke dalam `donasiku-app`.
3.  Pindahkan isi folder `frontend/dist` (hasil build React) ke dalam folder `public` milik Laravel (`donasiku-app/public`).
4.  Pindahkan **seluruh isi** folder `donasiku-app/public` ke dalam `public_html`.
5.  Edit file `public_html/index.php`:
    Ubah baris:
    ```php
    require __DIR__.'/../storage/framework/maintenance.php';
    require __DIR__.'/../vendor/autoload.php';
    require __DIR__.'/../bootstrap/app.php';
    ```
    Menjadi:
    ```php
    require __DIR__.'/../donasiku-app/storage/framework/maintenance.php';
    require __DIR__.'/../donasiku-app/vendor/autoload.php';
    require __DIR__.'/../donasiku-app/bootstrap/app.php';
    ```

### Langkah 4: Database & Environment
1.  Buat database MySQL baru di cPanel.
2.  Import file SQL jika Anda memilikinya, atau jalankan migrasi via SSH.
3.  Upload file `.env` ke `donasiku-app/.env` dan sesuaikan:
    ```env
    APP_URL=https://websiteanda.com
    DB_DATABASE=nama_db_cpanel
    DB_USERNAME=user_db_cpanel
    DB_PASSWORD=password_db_cpanel
    ```
4.  Jika tersedia akses terminal/SSH di cPanel, jalankan:
    ```bash
    cd donasiku-app
    php artisan storage:link
    php artisan config:cache
    ```

---

## 🖥️ Skenario 2: VPS (Ubuntu 22.04 + Nginx)

Metode ini memberikan kontrol penuh dan performa terbaik. Kita akan menggunakan Nginx sebagai web server dan supervisor untuk menjaga proses tetap berjalan.

### Langkah 1: Setup Server Awal
Masuk ke VPS Anda sebagai root dan update sistem:
```bash
ssh root@ip-address-vps
apt update && apt upgrade -y
```

Install dependensi dasar:
```bash
apt install -y software-properties-common curl git unzip supervisor
```

### Langkah 2: Install PHP 8.2 & Extensions
```bash
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-bcmath php8.2-curl php8.2-zip
```

### Langkah 3: Install Database (MariaDB)
```bash
apt install -y mariadb-server
mysql_secure_installation
# Jawab pertanyaan keamanan sesuai preferensi
```
Buat database dan user:
```sql
mysql -u root -p
CREATE DATABASE donasiku;
CREATE USER 'donasi_user'@'localhost' IDENTIFIED BY 'password_kuat';
GRANT ALL PRIVILEGES ON donasiku.* TO 'donasi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Langkah 4: Install Composer & Node.js
```bash
# Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### Langkah 5: Deployment App
1.  Clone repositori ke `/var/www/donasiku`:
    ```bash
    mkdir -p /var/www/donasiku
    cd /var/www/donasiku
    git clone https://github.com/kelompok3/donasiku.git .
    chown -R www-data:www-data /var/www/donasiku
    chmod -R 775 storage bootstrap/cache
    ```
2.  **Setup Backend**:
    ```bash
    cd backend
    composer install --optimize-autoloader --no-dev
    cp .env.example .env
    # Edit .env sesuaikan DB dan APP_URL
    nano .env
    php artisan key:generate
    php artisan migrate --force
    php artisan storage:link
    php artisan config:cache
    ```
3.  **Setup Frontend**:
    ```bash
    cd ../frontend
    npm install
    npm run build
    # Pindahkan hasil build ke folder public backend agar disajikan oleh Laravel atau Nginx root
    cp -r dist/* ../backend/public/
    ```

### Langkah 6: Konfigurasi Nginx
Buat file konfigurasi: `/etc/nginx/sites-available/donasiku`
```nginx
server {
    listen 80;
    server_name donasiku.com www.donasiku.com;
    root /var/www/donasiku/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
Aktifkan konfigurasi:
```bash
ln -s /etc/nginx/sites-available/donasiku /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Langkah 7: SSL (HTTPS)
Amankan situs dengan Let's Encrypt:
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d donasiku.com -d www.donasiku.com
```

---

## 🐳 Skenario 3: Docker (Docker Compose)

Metode ini paling portabel dan memastikan lingkungan yang identik antara dev dan prod.

### Prasyarat
Install Docker Desktop atau Docker Engine & Docker Compose di server.

### Konfigurasi `docker-compose.yml`
Buat file `docker-compose.yml` di root project:

```yaml
version: '3.8'
services:
  app:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: donasiku-app
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./backend:/var/www
    depends_on:
      - db
    networks:
      - donasiku-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./backend:/var/www
      - ./nginx/conf.d:/etc/nginx/conf.d
    networks:
      - donasiku-network

  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_USER: ${DB_USERNAME}
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - donasiku-network

networks:
  donasiku-network:
    driver: bridge

volumes:
  dbdata:
```

### Langkah Deployment Docker
1.  Pastikan file `Dockerfile` tersedia di dalam folder backend.
2.  Setup environment variables di `.env` root.
3.  Jalankan perintah:
    ```bash
    docker-compose up -d --build
    ```
4.  Jalankan migrasi di dalam container:
    ```bash
    docker-compose exec app php artisan migrate
    ```

---

## 🔧 Troubleshooting Umum

### 1. Permission Denied (Storage/Cache)
Pastikan web server (www-data) memiliki akses tulis ke folder storage.
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 2. 500 Internal Server Error
Cek log error Laravel untuk detailnya:
```bash
tail -f storage/logs/laravel.log
```
Biasanya disebabkan oleh `.env` yang salah atau key belum digenerate.

### 3. Halaman Frontend Blank (Putih)
Jika menggunakan metode build React terpisah, pastikan `base` di `vite.config.js` sesuai dengan path deployment Anda. Jika ditaruh di root domain, biarkan default `/`.

---
*Panduan ini dibuat untuk memastikan proses deployment berjalan lancar dan aman. Hubungi tim DevOps jika Anda memerlukan arsitektur yang lebih kompleks (Load Balancing, AWS, dll).*
