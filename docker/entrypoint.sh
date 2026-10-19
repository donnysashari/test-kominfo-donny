#!/bin/sh
set -e

echo "🚀 Memulai kontainer Inventaris Perangkat TI..."

# 1. Pastikan berkas .env ada
if [ ! -f /var/www/html/.env ]; then
    echo "📋 Membuat berkas .env dari .env.example..."
    cp /var/www/html/.env.example /var/www/html/.env
fi

# 2. Pastikan berkas aset build Vite tersedia di public/build
if [ ! -f /var/www/html/public/build/manifest.json ] && [ -d /var/www/build-dist ]; then
    echo "📦 Memulihkan berkas build Vite ke public/build..."
    mkdir -p /var/www/html/public/build
    cp -r /var/www/build-dist/* /var/www/html/public/build/ 2>/dev/null || true
    chown -R www-data:www-data /var/www/html/public/build 2>/dev/null || true
fi

# 3. Pastikan dependensi composer terinstal jika folder vendor kosong
if [ ! -d /var/www/html/vendor ] || [ ! -f /var/www/html/vendor/autoload.php ]; then
    echo "📦 Menginstal dependensi PHP (Composer)..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# 4. Pastikan APP_KEY terisi
if ! grep -q "^APP_KEY=base64:" /var/www/html/.env; then
    echo "🔑 Membuat APP_KEY Laravel..."
    php artisan key:generate --force
fi

# 4. Tunggu koneksi database siap
if [ "$DB_CONNECTION" = "mysql" ] || [ "$DB_CONNECTION" = "mariadb" ]; then
    echo "⏳ Menunggu database $DB_HOST:$DB_PORT siap..."
    until php -r "
        try {
            new PDO(
                'mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'),
                getenv('DB_USERNAME'),
                getenv('DB_PASSWORD'),
                [PDO::ATTR_TIMEOUT => 2]
            );
            exit(0);
        } catch (Exception \$e) {
            exit(1);
        }
    " 2>/dev/null; do
        sleep 2
    done
    echo "✅ Database terhubung!"
fi

# 5. Jalankan migrasi dan seeder data
echo "🗄️ Menjalankan migrasi dan seeder database..."
php artisan migrate --force
php artisan db:seed --force

# 6. Bersihkan cache aplikasi
echo "🧹 Membersihkan & mengoptimasi cache Laravel..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 7. Sesuaikan izin direktori storage dan cache
echo "🔒 Memastikan izin folder storage dan bootstrap/cache..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

echo "✨ Sistem siap! Menjalankan PHP-FPM..."
exec "$@"
