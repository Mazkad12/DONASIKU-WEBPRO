#!/bin/bash

# Install dependencies if vendor directory is missing
if [ ! -d "vendor" ]; then
    composer install
fi

# Run migrations (force for automation, use with caution in production)
php artisan migrate --force

# Start PHP-FPM
php-fpm
