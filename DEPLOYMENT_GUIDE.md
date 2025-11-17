# Полный гайд по развертыванию проекта на VPS

## Информация о сервере

- **IP адрес:** 2.59.42.223
- **Домен:** vetcenterspb.ru
- **API поддомен:** api.vetcenterspb.ru
- **Git репозиторий:** git@github.com:kurylevaS/vetcenter-spb.git

## Шаг 1: Первоначальная настройка сервера

### 1.1. Подключитесь к серверу

```bash
ssh root@2.59.42.223
# или если есть другой пользователь
ssh your-user@2.59.42.223
```

### 1.2. Обновите систему

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3. Установите базовое ПО

```bash
# Установка необходимых пакетов
sudo apt install -y curl wget git build-essential software-properties-common

# Установка Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка версии Node.js (должна быть >= 20.11.0)
node --version
npm --version

# Установка PM2
sudo npm install -g pm2

# Установка Nginx
sudo apt install -y nginx

# Установка MySQL для WordPress
sudo apt install -y mysql-server

# Установка PHP и необходимых расширений для WordPress
sudo apt install -y php-fpm php-mysql php-mbstring php-xml php-curl php-gd php-zip php-imagick

# Проверка версии PHP (должна быть >= 8.0)
php --version

# Проверьте версию PHP-FPM сокета (нужно для конфигурации Nginx)
ls /var/run/php/
# Обычно это php8.2-fpm.sock или php8.1-fpm.sock
```

### 1.4. Настройте firewall

```bash
# Установка UFW (если еще не установлен)
sudo apt install -y ufw

# Разрешить SSH
sudo ufw allow 22/tcp

# Разрешить HTTP и HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включить firewall
sudo ufw enable

# Проверить статус
sudo ufw status
```

## Шаг 2: Настройка MySQL для WordPress

### 2.1. Настройте безопасность MySQL

```bash
sudo mysql_secure_installation
```

Следуйте инструкциям:
- Установите пароль для root (запомните его!)
- Удалите анонимных пользователей: `Y`
- Отключите удаленный вход root: `Y`
- Удалите тестовую БД: `Y`
- Перезагрузите привилегии: `Y`

### 2.2. Создайте базу данных для WordPress

```bash
sudo mysql -u root -p
```

В MySQL консоли выполните:

```sql
-- Создать базу данных
CREATE DATABASE vetcenter_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создать пользователя для WordPress
CREATE USER 'wp_user'@'localhost' IDENTIFIED BY 'ВАШ_СИЛЬНЫЙ_ПАРОЛЬ_ЗДЕСЬ';

-- Дать права пользователю
GRANT ALL PRIVILEGES ON vetcenter_wp.* TO 'wp_user'@'localhost';

-- Применить изменения
FLUSH PRIVILEGES;

-- Выйти
EXIT;
```

**Важно:** Замените `ВАШ_СИЛЬНЫЙ_ПАРОЛЬ_ЗДЕСЬ` на надежный пароль (запишите его!).

### 2.3. Как изменить пароль пользователя MySQL

Если нужно изменить пароль для пользователя `wp_user`:

```bash
sudo mysql -u root -p
```

В MySQL консоли выполните:

```sql
-- Изменить пароль для пользователя
ALTER USER 'wp_user'@'localhost' IDENTIFIED BY 'paracels_is_human0409';

-- Применить изменения
FLUSH PRIVILEGES;

-- Выйти
EXIT;
```

**После смены пароля** не забудьте обновить пароль в файле `wp-config.php`:

```bash
nano /var/www/api.vetcenterspb.ru/wp-config.php
```

Найдите строку `define( 'DB_PASSWORD', ... )` и обновите пароль.

## Шаг 3: Установка WordPress

### 3.1. Создайте директорию для WordPress

```bash
sudo mkdir -p /var/www/api.vetcenterspb.ru
sudo chown -R $USER:$USER /var/www/api.vetcenterspb.ru
cd /var/www/api.vetcenterspb.ru
```

### 3.2. Скачайте WordPress

```bash
# Скачать последнюю версию WordPress
wget https://wordpress.org/latest.tar.gz

# Распаковать
tar -xzf latest.tar.gz --strip-components=1

# Удалить архив
rm latest.tar.gz
```

### 3.3. Установите WP-CLI (опционально, но рекомендуется)

WP-CLI упрощает управление WordPress через командную строку:

```bash
cd /tmp
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

# Проверка установки
wp --info
```

### 3.4. Настройте WordPress

```bash
# Скопировать конфигурационный файл
cp wp-config-sample.php wp-config.php

# Открыть для редактирования
nano wp-config.php
```

Найдите и замените следующие строки:

```php
define( 'DB_NAME', 'vetcenter_wp' );
define( 'DB_USER', 'wp_user' );
define( 'DB_PASSWORD', 'ВАШ_ПАРОЛЬ_ИЗ_ШАГА_2.2' );
define( 'DB_HOST', 'localhost' );
```

Добавьте в конец файла (перед `/* That's all, stop editing! */`):

```php
// Настройки безопасности
define('AUTH_KEY',         'сгенерируйте_уникальные_ключи');
define('SECURE_AUTH_KEY',  'сгенерируйте_уникальные_ключи');
define('LOGGED_IN_KEY',    'сгенерируйте_уникальные_ключи');
define('NONCE_KEY',        'сгенерируйте_уникальные_ключи');
define('AUTH_SALT',        'сгенерируйте_уникальные_ключи');
define('SECURE_AUTH_SALT', 'сгенерируйте_уникальные_ключи');
define('LOGGED_IN_SALT',   'сгенерируйте_уникальные_ключи');
define('NONCE_SALT',       'сгенерируйте_уникальные_ключи');

// Настройки для REST API
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
```

**Сгенерируйте ключи безопасности:**
Перейдите на https://api.wordpress.org/secret-key/1.1/salt/ и скопируйте сгенерированные ключи в `wp-config.php`.

### 3.5. Установите права доступа

```bash
sudo chown -R www-data:www-data /var/www/api.vetcenterspb.ru
sudo find /var/www/api.vetcenterspb.ru -type d -exec chmod 755 {} \;
sudo find /var/www/api.vetcenterspb.ru -type f -exec chmod 644 {} \;
```

## Шаг 4: Настройка Nginx для WordPress (api.vetcenterspb.ru)

### 4.1. Создайте конфигурацию Nginx для WordPress

```bash
sudo nano /etc/nginx/sites-available/api.vetcenterspb.ru
```

Добавьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name api.vetcenterspb.ru;

    root /var/www/api.vetcenterspb.ru;
    index index.php index.html index.htm;

    # Логи
    access_log /var/log/nginx/api.vetcenterspb.ru.access.log;
    error_log /var/log/nginx/api.vetcenterspb.ru.error.log;

    # Максимальный размер загружаемых файлов
    client_max_body_size 64M;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # Обработка PHP файлов
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Запретить доступ к скрытым файлам
    location ~ /\. {
        deny all;
    }

    # Запретить доступ к файлам конфигурации
    location ~ wp-config.php {
        deny all;
    }
}
```

**Важно:** Замените `php8.2-fpm.sock` на версию вашего PHP. Проверьте версию:

```bash
php -v
ls /var/run/php/
```

### 4.2. Активируйте конфигурацию

```bash
sudo ln -s /etc/nginx/sites-available/api.vetcenterspb.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Шаг 5: Настройка DNS

### 5.1. Настройте DNS записи у вашего регистратора домена

Добавьте следующие A записи:

```
Тип: A
Имя: @
Значение: 2.59.42.223
TTL: 3600

Тип: A
Имя: api
Значение: 2.59.42.223
TTL: 3600
```

Это создаст:
- `vetcenterspb.ru` → 2.59.42.223
- `api.vetcenterspb.ru` → 2.59.42.223

**Время распространения DNS:** Обычно 15 минут - 24 часа.

Проверить можно командой:

```bash
dig vetcenterspb.ru
dig api.vetcenterspb.ru
```

## Шаг 6: Установка SSL сертификатов (Let's Encrypt)

### 6.1. Установите Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2. Получите SSL сертификаты

```bash
# Для основного домена
sudo certbot --nginx -d vetcenterspb.ru -d www.vetcenterspb.ru

# Для API поддомена
sudo certbot --nginx -d api.vetcenterspb.ru
```

Certbot автоматически обновит конфигурации Nginx для использования HTTPS.

### 6.3. Проверьте автообновление сертификатов

```bash
sudo certbot renew --dry-run
```

## Шаг 7: Развертывание Next.js приложения

### 7.1. Создайте директорию для проекта

```bash
sudo mkdir -p /var/www/vetcenter-spb
sudo chown -R $USER:$USER /var/www/vetcenter-spb
cd /var/www/vetcenter-spb
```

### 7.2. Настройте SSH ключ для Git

```bash
# Сгенерируйте SSH ключ (если еще нет)
ssh-keygen -t ed25519 -C "deploy@vetcenterspb.ru"

# Покажите публичный ключ
cat ~/.ssh/id_ed25519.pub
```

**Добавьте публичный ключ в GitHub:**
1. Откройте https://github.com/kurylevaS/vetcenter-spb/settings/keys
2. Нажмите "New SSH key"
3. Вставьте содержимое `~/.ssh/id_ed25519.pub`

### 7.3. Клонируйте репозиторий

```bash
cd /var/www/vetcenter-spb
git clone git@github.com:kurylevaS/vetcenter-spb.git repo
cd repo
```

### 7.4. Создайте файл с переменными окружения

```bash
nano /var/www/vetcenter-spb/repo/.env.production
```

Добавьте следующие переменные:

```env
# Базовый URL сайта
NEXT_PUBLIC_FRONT_BASE_URL=https://vetcenterspb.ru

# URL WordPress API
NEXT_PUBLIC_FRONT_API_URL=https://api.vetcenterspb.ru/wp-json/wp/v2

# URL для прокси (используется на клиенте)
NEXT_PUBLIC_FRONT_PROXY_API_URL=/api/proxy

# Секретный ключ для revalidation (сгенерируйте случайный ключ)
REVALIDATE_SECRET=ваш-случайный-секретный-ключ-здесь

# Node окружение
NODE_ENV=production
```

**Сгенерируйте секретный ключ:**

```bash
openssl rand -base64 32
```

Скопируйте результат в `REVALIDATE_SECRET`.

### 7.5. Установите зависимости и соберите проект

```bash
cd /var/www/vetcenter-spb/repo
npm install
npm run build
```

### 7.6. Создайте директорию для логов

```bash
mkdir -p /var/www/vetcenter-spb/logs
```

### 7.7. Запустите приложение через PM2

```bash
cd /var/www/vetcenter-spb/repo
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Выполните команду, которую выведет PM2 (для автозапуска при перезагрузке сервера).

### 7.8. Проверьте статус

```bash
pm2 status
pm2 logs vetcenter-spb --lines 50
```

## Шаг 8: Настройка Nginx для Next.js (vetcenterspb.ru)

### 8.1. Создайте конфигурацию Nginx для основного домена

```bash
sudo nano /etc/nginx/sites-available/vetcenterspb.ru
```

Добавьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name vetcenterspb.ru www.vetcenterspb.ru;

    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vetcenterspb.ru www.vetcenterspb.ru;

    # SSL сертификаты (будут добавлены автоматически Certbot)
    ssl_certificate /etc/letsencrypt/live/vetcenterspb.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vetcenterspb.ru/privkey.pem;

    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Логи
    access_log /var/log/nginx/vetcenterspb.ru.access.log;
    error_log /var/log/nginx/vetcenterspb.ru.error.log;

    # Проксирование на Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Увеличиваем таймауты для долгих запросов
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Проксирование для API запросов (если нужно)
    location /api/proxy {
        proxy_pass https://api.vetcenterspb.ru/wp-json/wp/v2;
        proxy_http_version 1.1;
        proxy_set_header Host api.vetcenterspb.ru;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 8.2. Активируйте конфигурацию

```bash
sudo ln -s /etc/nginx/sites-available/vetcenterspb.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8.3. Обновите SSL сертификат для основного домена

```bash
sudo certbot --nginx -d vetcenterspb.ru -d www.vetcenterspb.ru
```

Certbot автоматически обновит конфигурацию.

## Шаг 9: Завершение установки WordPress

### 9.1. Откройте WordPress в браузере

Перейдите на: `https://api.vetcenterspb.ru`

Вы увидите мастер установки WordPress. Заполните:
- **Название сайта:** Ветеринарный центр Приморский
- **Имя пользователя:** (создайте админа)
- **Пароль:** (создайте надежный пароль)
- **Email:** (ваш email)

### 9.2. Настройте WordPress для REST API

После установки войдите в админку WordPress и установите необходимые плагины:

1. **ACF (Advanced Custom Fields)** — для кастомных полей
   - Скачайте с https://www.advancedcustomfields.com/
   - Или установите через админку: Плагины → Добавить новый → Поиск "Advanced Custom Fields"

2. **ACF to REST API** — для экспорта ACF полей в REST API
   - Установите через админку: Плагины → Добавить новый → Поиск "ACF to REST API"

**Или установите через WP-CLI:**

```bash
cd /var/www/api.vetcenterspb.ru
wp plugin install advanced-custom-fields --activate
wp plugin install acf-to-rest-api --activate
```

### 9.3. Настройте постоянные ссылки

В админке WordPress:
1. Перейдите в **Настройки → Постоянные ссылки**
2. Выберите "Название записи" или "Произвольно"
3. Нажмите "Сохранить изменения"

Это активирует REST API endpoints.

## Шаг 10: Настройка GitHub Actions для автоматического деплоя

### 10.1. Сгенерируйте SSH ключ для GitHub Actions

На вашем **локальном компьютере**:

```bash
# Сгенерируйте SSH ключ специально для деплоя
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/vps_deploy_key

# НЕ устанавливайте пароль (просто нажмите Enter)
```

### 10.2. Скопируйте публичный ключ на сервер

```bash
# Скопируйте публичный ключ на сервер
ssh-copy-id -i ~/.ssh/vps_deploy_key.pub root@2.59.42.223

# Или вручную
cat ~/.ssh/vps_deploy_key.pub | ssh root@2.59.42.223 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 10.3. Добавьте приватный ключ в GitHub Secrets

1. Откройте https://github.com/kurylevaS/vetcenter-spb/settings/secrets/actions
2. Нажмите **New repository secret**
3. Добавьте следующие секреты:

| Secret Name | Значение | Как получить |
|------------|----------|--------------|
| `VPS_HOST` | `2.59.42.223` | IP адрес сервера |
| `VPS_USER` | `root` | Пользователь для SSH |
| `VPS_SSH_PRIVATE_KEY` | Содержимое `~/.ssh/vps_deploy_key` | `cat ~/.ssh/vps_deploy_key` (весь вывод) |
| `NEXT_PUBLIC_FRONT_BASE_URL` | `https://vetcenterspb.ru` | URL сайта |
| `NEXT_PUBLIC_FRONT_API_URL` | `https://api.vetcenterspb.ru/wp-json/wp/v2` | URL WordPress API |
| `NEXT_PUBLIC_FRONT_PROXY_API_URL` | `/api/proxy` | URL для прокси |

**Важно:** Для `VPS_SSH_PRIVATE_KEY` скопируйте весь вывод команды `cat ~/.ssh/vps_deploy_key`, включая строки `-----BEGIN OPENSSH PRIVATE KEY-----` и `-----END OPENSSH PRIVATE KEY-----`.

## Шаг 11: Проверка работоспособности

### 11.1. Проверьте WordPress API

```bash
curl https://api.vetcenterspb.ru/wp-json/wp/v2
```

Должен вернуться JSON с информацией о REST API.

### 11.2. Проверьте Next.js приложение

```bash
curl http://localhost:3000
```

Должен вернуться HTML главной страницы.

### 11.3. Проверьте в браузере

- **Основной сайт:** https://vetcenterspb.ru
- **API:** https://api.vetcenterspb.ru
- **WordPress админка:** https://api.vetcenterspb.ru/wp-admin

## Шаг 12: Полезные команды

### Мониторинг

```bash
# Статус PM2
pm2 status
pm2 logs vetcenter-spb

# Статус Nginx
sudo systemctl status nginx

# Статус MySQL
sudo systemctl status mysql

# Статус PHP-FPM
sudo systemctl status php8.2-fpm

# Использование ресурсов
htop
df -h
free -h
```

### Обновление WordPress

```bash
cd /var/www/api.vetcenterspb.ru
wp core update
wp plugin update --all
wp theme update --all
```

### Обновление Next.js приложения вручную

```bash
cd /var/www/vetcenter-spb/repo
git pull origin main
npm install
npm run build
pm2 restart vetcenter-spb
```

### Просмотр логов

```bash
# Логи Nginx
sudo tail -f /var/log/nginx/vetcenterspb.ru.access.log
sudo tail -f /var/log/nginx/api.vetcenterspb.ru.error.log

# Логи PM2
pm2 logs vetcenter-spb

# Логи PHP-FPM
sudo tail -f /var/log/php8.2-fpm.log
```

## Troubleshooting

### Проблема: WordPress не открывается

**Решение:**
1. Проверьте права доступа: `sudo chown -R www-data:www-data /var/www/api.vetcenterspb.ru`
2. Проверьте конфигурацию Nginx: `sudo nginx -t`
3. Проверьте логи: `sudo tail -f /var/log/nginx/api.vetcenterspb.ru.error.log`

### Проблема: Next.js приложение не запускается

**Решение:**
1. Проверьте переменные окружения: `cat /var/www/vetcenter-spb/repo/.env.production`
2. Проверьте логи PM2: `pm2 logs vetcenter-spb`
3. Проверьте порт: `sudo lsof -i :3000`

### Проблема: REST API не работает

**Решение:**
1. Проверьте настройки постоянных ссылок в WordPress
2. Убедитесь, что установлен плагин ACF to REST API
3. Проверьте доступность: `curl https://api.vetcenterspb.ru/wp-json/wp/v2`

### Проблема: SSL сертификат не работает

**Решение:**
1. Проверьте DNS записи: `dig vetcenterspb.ru`
2. Убедитесь, что порты 80 и 443 открыты: `sudo ufw status`
3. Перевыпустите сертификат: `sudo certbot renew --force-renewal`

## Безопасность

### Рекомендации:

1. ✅ Регулярно обновляйте систему: `sudo apt update && sudo apt upgrade`
2. ✅ Используйте сильные пароли для всех сервисов
3. ✅ Настройте регулярные бэкапы базы данных WordPress
4. ✅ Ограничьте SSH доступ по IP (если возможно)
5. ✅ Регулярно обновляйте WordPress и плагины
6. ✅ Мониторьте логи на подозрительную активность

### Настройка бэкапов (опционально)

Создайте скрипт для автоматических бэкапов:

```bash
sudo nano /usr/local/bin/backup-wordpress.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/wordpress"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Бэкап базы данных
mysqldump -u wp_user -p'ВАШ_ПАРОЛЬ' vetcenter_wp > $BACKUP_DIR/db_$DATE.sql

# Бэкап файлов
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/api.vetcenterspb.ru

# Удалить бэкапы старше 30 дней
find $BACKUP_DIR -type f -mtime +30 -delete
```

Сделайте исполняемым:

```bash
sudo chmod +x /usr/local/bin/backup-wordpress.sh
```

Добавьте в crontab:

```bash
crontab -e

# Бэкап каждый день в 2:00
0 2 * * * /usr/local/bin/backup-wordpress.sh
```

## Готово! 🎉

Теперь у вас:
- ✅ WordPress работает на https://api.vetcenterspb.ru
- ✅ Next.js приложение работает на https://vetcenterspb.ru
- ✅ Автоматический деплой через GitHub Actions настроен
- ✅ SSL сертификаты установлены и обновляются автоматически

При каждом push в ветку `main` проект будет автоматически обновляться на сервере!

