FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    zip \
    unzip \
    sqlite3

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (including SQLite)
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY backend/ /var/www

# Create database directory with proper permissions
RUN mkdir -p /var/www/database && \
    mkdir -p /var/www/storage/logs && \
    mkdir -p /var/www/storage/framework/sessions && \
    mkdir -p /var/www/storage/framework/views && \
    mkdir -p /var/www/storage/framework/cache && \
    chmod -R 777 /var/www/storage && \
    chmod -R 777 /var/www/database

# Install composer dependencies during build
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy and set up entrypoint
COPY backend/docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port (Railway will override with PORT env)
EXPOSE 8000

# Start the application
ENTRYPOINT ["/bin/bash", "/usr/local/bin/entrypoint.sh"]
