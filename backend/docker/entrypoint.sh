#!/bin/bash

# Install dependencies if vendor directory is missing
if [ ! -d "vendor" ]; then
    composer install --no-dev --optimize-autoloader
fi

# Generate app key if not set
php artisan key:generate --force || true

# Create SQLite database file if using SQLite
if [ "$DB_CONNECTION" = "sqlite" ]; then
    touch database/database.sqlite
fi

# Run migrations
php artisan migrate --force

# Clear and cache config for production
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Start Laravel development server on Railway's PORT
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
