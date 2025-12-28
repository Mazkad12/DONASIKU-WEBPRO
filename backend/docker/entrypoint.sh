#!/bin/bash

# Set environment defaults if not set
export APP_ENV="${APP_ENV:-production}"
export APP_DEBUG="${APP_DEBUG:-true}"
export DB_CONNECTION="${DB_CONNECTION:-sqlite}"

# Create SQLite database file if using SQLite
if [ "$DB_CONNECTION" = "sqlite" ]; then
    touch /var/www/database/database.sqlite
    chmod 777 /var/www/database/database.sqlite
fi

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Run migrations
php artisan migrate --force || true

# Cache configuration for production
php artisan config:clear
php artisan view:clear

# Fix storage permissions and symlink
rm -rf public/storage
php artisan storage:link
chmod -R 777 storage/app/public public/storage

# Start Laravel development server on Railway's PORT
echo "Starting Laravel server on port ${PORT:-8000}..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
