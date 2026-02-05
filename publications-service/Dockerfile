FROM php:8.2-fpm

WORKDIR /var/www

# Instalación de extensiones para PostgreSQL y herramientas de sistema
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    curl \
    && docker-php-ext-install pdo pdo_pgsql

# Instalamos Composer de forma oficial
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .

# Instalamos dependencias de PHP
RUN composer install --no-interaction --optimize-autoloader

# Exponemos el puerto 8001
EXPOSE 8001

# Ejecutamos artisan serve en el puerto 8001
CMD php artisan serve --host=0.0.0.0 --port=8001