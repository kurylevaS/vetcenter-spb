# Гайд по установке WordPress на Orange Pi Zero 3

## Обзор системы
- **Устройство**: Orange Pi Zero 3
- **RAM**: 4GB
- **ОС**: Ubuntu
- **Домен**: zaburdaev.space

## Шаг 1: Подготовка системы

### Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
```

### Установка необходимых пакетов
```bash
sudo apt install -y curl wget unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

## Шаг 2: Установка веб-сервера (Nginx)

### Установка Nginx
```bash
sudo apt install -y nginx
```

### Запуск и автозапуск Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Проверка статуса
```bash
sudo systemctl status nginx
```

## Шаг 3: Установка PHP

### Добавление репозитория PHP
```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
```

### Установка PHP и необходимых модулей
```bash
sudo apt install -y php8.2-fpm php8.2-mysql php8.2-curl php8.2-gd php8.2-mbstring php8.2-xml php8.2-zip php8.2-intl php8.2-bcmath php8.2-soap php8.2-readline php8.2-common php8.2-cli
```

### Настройка PHP-FPM
```bash
sudo systemctl start php8.2-fpm
sudo systemctl enable php8.2-fpm
```

## Шаг 4: Установка базы данных (MariaDB)

### Установка MariaDB
```bash
sudo apt install -y mariadb-server mariadb-client
```

### Запуск и автозапуск MariaDB
```bash
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

### Настройка безопасности MariaDB
```bash
sudo mysql_secure_installation
```

**Рекомендуемые настройки:**
- Set root password? **Y** (установите надежный пароль)
- Remove anonymous users? **Y**
- Disallow root login remotely? **Y**
- Remove test database? **Y**
- Reload privilege tables now? **Y**

### Создание базы данных для WordPress
```bash
sudo mysql -u root -p
```

В MySQL консоли выполните:
```sql
CREATE DATABASE wordpress_db;
CREATE USER 'wordpress_user'@'localhost' IDENTIFIED BY 'надежный_пароль';
GRANT ALL PRIVILEGES ON wordpress_db.* TO 'wordpress_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Шаг 5: Настройка Nginx для WordPress

### Создание конфигурации сайта
```bash
sudo nano /etc/nginx/sites-available/zaburdaev.space
```

Содержимое файла:
```nginx
server {
    listen 80;
    server_name zaburdaev.space www.zaburdaev.space;
    root /var/www/zaburdaev.space;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        log_not_found off;
        access_log off;
        allow all;
    }

    location ~* \.(css|gif|ico|jpeg|jpg|js|png)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Активация сайта
```bash
sudo ln -s /etc/nginx/sites-available/zaburdaev.space /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Шаг 6: Установка WordPress

### Создание директории сайта
```bash
sudo mkdir -p /var/www/zaburdaev.space
sudo chown -R www-data:www-data /var/www/zaburdaev.space
sudo chmod -R 755 /var/www/zaburdaev.space
```

### Скачивание WordPress
```bash
cd /tmp
wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz
sudo cp -R wordpress/* /var/www/zaburdaev.space/
```

### Настройка прав доступа
```bash
sudo chown -R www-data:www-data /var/www/zaburdaev.space
sudo chmod -R 755 /var/www/zaburdaev.space
```

### Создание wp-config.php
```bash
sudo cp /var/www/zaburdaev.space/wp-config-sample.php /var/www/zaburdaev.space/wp-config.php
sudo nano /var/www/zaburdaev.space/wp-config.php
```

Найдите и измените следующие строки:
```php
define('DB_NAME', 'wordpress_db');
define('DB_USER', 'wordpress_user');
define('DB_PASSWORD', 'надежный_пароль');
define('DB_HOST', 'localhost');
```

Добавьте уникальные ключи безопасности (сгенерируйте на https://api.wordpress.org/secret-key/1.1/salt/):
```php
define('AUTH_KEY',         'ваш-уникальный-ключ');
define('SECURE_AUTH_KEY',  'ваш-уникальный-ключ');
define('LOGGED_IN_KEY',    'ваш-уникальный-ключ');
define('NONCE_KEY',        'ваш-уникальный-ключ');
define('AUTH_SALT',        'ваш-уникальный-ключ');
define('SECURE_AUTH_SALT', 'ваш-уникальный-ключ');
define('LOGGED_IN_SALT',   'ваш-уникальный-ключ');
define('NONCE_SALT',       'ваш-уникальный-ключ');
```

## Шаг 7: Настройка домена

### Настройка DNS
В панели управления вашего доменного регистратора добавьте A-записи:
- `zaburdaev.space` → IP адрес вашего Orange Pi
- `www.zaburdaev.space` → IP адрес вашего Orange Pi

### Проверка доступности
```bash
ping zaburdaev.space
```

## Шаг 8: Установка SSL сертификата (Let's Encrypt)

### Установка Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Получение SSL сертификата
```bash
sudo certbot --nginx -d zaburdaev.space -d www.zaburdaev.space
```

### Автоматическое обновление сертификата
```bash
sudo crontab -e
```

Добавьте строку:
```
0 12 * * * /usr/bin/certbot renew --quiet
```

## Шаг 9: Настройка безопасности

### Настройка файрвола
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Настройка fail2ban
```bash
sudo apt install -y fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### Ограничение доступа к wp-admin
```bash
sudo nano /etc/nginx/sites-available/zaburdaev.space
```

Добавьте в блок server:
```nginx
location /wp-admin {
    allow ваш_ip_адрес;
    deny all;
    
    try_files $uri $uri/ /index.php?$args;
}
```

## Шаг 10: Оптимизация производительности

### Настройка PHP-FPM
```bash
sudo nano /etc/php/8.2/fpm/pool.d/www.conf
```

Измените:
```ini
pm = dynamic
pm.max_children = 10
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
pm.max_requests = 500
```

### Настройка Nginx для кэширования
```bash
sudo nano /etc/nginx/sites-available/zaburdaev.space
```

Добавьте в блок server:
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

## Шаг 11: Завершение установки

1. Откройте браузер и перейдите на `https://zaburdaev.space`
2. Выберите язык
3. Заполните информацию о сайте
4. Создайте учетную запись администратора
5. Завершите установку

## Мониторинг и обслуживание

### Проверка статуса сервисов
```bash
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status mariadb
```

### Просмотр логов
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/php8.2-fpm.log
```

### Резервное копирование
```bash
# Создание скрипта резервного копирования
sudo nano /root/backup-wordpress.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Резервное копирование базы данных
mysqldump -u wordpress_user -p wordpress_db > $BACKUP_DIR/wordpress_db_$DATE.sql

# Резервное копирование файлов
tar -czf $BACKUP_DIR/wordpress_files_$DATE.tar.gz /var/www/zaburdaev.space

# Удаление старых резервных копий (старше 7 дней)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

```bash
sudo chmod +x /root/backup-wordpress.sh
```

### Настройка автоматического резервного копирования
```bash
sudo crontab -e
```

Добавьте:
```
0 2 * * * /root/backup-wordpress.sh
```

## Возможные проблемы и решения

### Проблема с правами доступа
```bash
sudo chown -R www-data:www-data /var/www/zaburdaev.space
sudo chmod -R 755 /var/www/zaburdaev.space
```

### Проблема с памятью
```bash
# Добавление swap файла
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Проблема с SSL
```bash
sudo certbot renew --dry-run
```

## Заключение

Ваш Orange Pi Zero 3 с 4GB RAM отлично подходит для WordPress сайта. После выполнения всех шагов у вас будет:

- ✅ Рабочий WordPress сайт
- ✅ SSL сертификат
- ✅ Настроенная безопасность
- ✅ Автоматические резервные копии
- ✅ Оптимизированная производительность

Сайт будет доступен по адресу `https://zaburdaev.space`
