FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN pecl install redis && docker-php-ext-enable redis
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy custom PHP config
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Set working directory
# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www

# Copy custom entrypoint
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Change current user to www
USER www-data

# Entrypoint setup
ENTRYPOINT ["/bin/bash", "/usr/local/bin/entrypoint.sh"]
