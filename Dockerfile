# ==============================================================================
# Stage 1: Build Frontend Assets (React 19 + Tailwind CSS + IDDS via Vite)
# ==============================================================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Salin package manifest untuk optimasi Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Salin konfigurasi dan kode sumber frontend
COPY vite.config.js ./
COPY resources ./resources
COPY public ./public

# Build aset produksi Vite
RUN npm run build

# ==============================================================================
# Stage 2: PHP Application Container (Laravel 13 + PHP 8.4-FPM)
# ==============================================================================
FROM php:8.4-fpm-alpine AS app

WORKDIR /var/www/html

# Instal dependensi sistem dan ekstensi PHP
RUN apk add --no-cache \
    curl \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    icu-dev \
    oniguruma-dev \
    mariadb-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        intl \
        zip \
        opcache

# Salin binary Composer resmi
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Salin konfigurasi PHP kustom
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

# Salin seluruh kode aplikasi
COPY . /var/www/html

# Salin hasil build frontend dari Stage 1 (disimpan juga ke /var/www/build-dist sebagai cadangan volume mount)
COPY --from=frontend-builder /app/public/build /var/www/build-dist
COPY --from=frontend-builder /app/public/build /var/www/html/public/build

# Instal dependensi Composer produksi
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Siapkan folder storage dan cache
RUN mkdir -p /var/www/html/storage/framework/sessions \
             /var/www/html/storage/framework/views \
             /var/www/html/storage/framework/cache \
             /var/www/html/storage/logs \
             /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Salin entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
