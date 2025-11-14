# Настройка CI/CD для автоматического деплоя на VPS

Этот документ описывает настройку автоматического деплоя проекта на VPS сервер через GitHub Actions.

## Архитектура CI/CD

1. **CI (Continuous Integration)** — автоматическая проверка кода при создании Pull Request
2. **CD (Continuous Deployment)** — автоматический деплой на VPS при push в основную ветку

## Что происходит при деплое

1. ✅ Проверка кода (lint, format)
2. ✅ Сборка проекта
3. ✅ Копирование файлов на VPS через SSH
4. ✅ Установка зависимостей на сервере
5. ✅ Перезапуск приложения через PM2
6. ✅ Проверка работоспособности

## Подготовка VPS сервера

### 1. Установите необходимые пакеты

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Установка Nginx (если еще не установлен)
sudo apt install -y nginx

# Установка rsync (для копирования файлов)
sudo apt install -y rsync
```

### 2. Создайте пользователя для деплоя (опционально)

```bash
# Создание пользователя
sudo adduser deployer

# Добавление в группу sudo (если нужно)
sudo usermod -aG sudo deployer

# Переключение на пользователя
su - deployer
```

### 3. Настройте SSH доступ

#### На вашем локальном компьютере:

```bash
# Генерация SSH ключа (если еще нет)
ssh-keygen -t ed25519 -C "github-actions-deploy"

# Копирование публичного ключа на сервер
ssh-copy-id deployer@your-server-ip
```

#### На сервере:

```bash
# Убедитесь, что SSH доступен
sudo systemctl status ssh

# Если нужно, разрешите доступ по SSH ключу в /etc/ssh/sshd_config
# PubkeyAuthentication yes
# AuthorizedKeysFile .ssh/authorized_keys
```

### 4. Создайте структуру директорий на сервере

```bash
# Создание директорий
sudo mkdir -p /var/www/vetcenter-spb/{releases,shared/logs}
sudo chown -R $USER:$USER /var/www/vetcenter-spb

# Создание файла с переменными окружения
nano /var/www/vetcenter-spb/shared/.env.production
```

Добавьте все необходимые переменные окружения в `.env.production` (см. раздел "Переменные окружения" в README.md).

### 5. Настройте PM2 для автозапуска

```bash
# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска при перезагрузке сервера
pm2 startup
# Выполните команду, которую выведет PM2
```

### 6. Настройте Nginx (если еще не настроен)

Создайте конфигурацию Nginx:

```bash
sudo nano /etc/nginx/sites-available/vetcenter-spb
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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
    }
}
```

```bash
# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/vetcenter-spb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Настройка SSL через Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Настройка GitHub Secrets

В репозитории GitHub перейдите в **Settings → Secrets and variables → Actions** и добавьте следующие секреты:

### Обязательные секреты:

| Secret Name | Описание | Пример |
|------------|----------|--------|
| `VPS_HOST` | IP адрес или домен вашего VPS сервера | `123.45.67.89` или `server.example.com` |
| `VPS_USER` | Имя пользователя для SSH подключения | `deployer` или `root` |
| `VPS_SSH_PRIVATE_KEY` | Приватный SSH ключ для подключения к серверу | Содержимое файла `~/.ssh/id_ed25519` |

### Переменные для сборки (опционально):

| Secret Name | Описание |
|------------|----------|
| `NEXT_PUBLIC_FRONT_BASE_URL` | URL бэкенда (для сборки) |
| `NEXT_PUBLIC_FRONT_API_URL` | URL REST API бэкенда |
| `NEXT_PUBLIC_FRONT_PROXY_API_URL` | URL для прокси |

### Как получить SSH приватный ключ:

```bash
# На вашем локальном компьютере
cat ~/.ssh/id_ed25519
# или
cat ~/.ssh/id_rsa

# Скопируйте весь вывод (включая -----BEGIN и -----END строки)
# и вставьте в GitHub Secret VPS_SSH_PRIVATE_KEY
```

**Важно:** Никогда не коммитьте приватные ключи в репозиторий!

## Настройка workflow файлов

Workflow файлы уже созданы в `.github/workflows/`:

- **`ci.yml`** — проверка кода при создании Pull Request
- **`deploy.yml`** — автоматический деплой при push в main/master

### Настройка веток для деплоя

По умолчанию деплой происходит при push в `main` или `master`. Чтобы изменить это, отредактируйте `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main  # Измените на нужную ветку
      - production  # Добавьте дополнительные ветки
```

## Ручной деплой (без CI/CD)

Если нужно задеплоить вручную, используйте скрипт:

```bash
# Сделайте скрипт исполняемым
chmod +x scripts/deploy.sh

# Установите переменные окружения
export VPS_USER="deployer"
export VPS_HOST="your-server-ip"
export APP_DIR="/var/www/vetcenter-spb"

# Запустите деплой
./scripts/deploy.sh
```

Или используйте напрямую через SSH:

```bash
# На сервере
cd /var/www/vetcenter-spb/current
git pull origin main
npm ci --production
npm run build
pm2 restart vetcenter-spb
```

## Структура директорий на сервере

После настройки структура будет следующей:

```
/var/www/vetcenter-spb/
├── current/              # Симлинк на текущий релиз
├── releases/            # Директория с релизами
│   ├── 20240101120000/  # Релиз с timestamp
│   ├── 20240101130000/
│   └── ...
└── shared/              # Общие файлы между релизами
    ├── .env.production  # Переменные окружения
    └── logs/            # Логи приложения
        ├── error.log
        ├── out.log
        └── combined.log
```

## Мониторинг деплоя

### Просмотр логов GitHub Actions

1. Перейдите в репозиторий на GitHub
2. Откройте вкладку **Actions**
3. Выберите нужный workflow run
4. Просмотрите логи каждого шага

### Просмотр логов на сервере

```bash
# Логи PM2
pm2 logs vetcenter-spb

# Статус приложения
pm2 status

# Мониторинг в реальном времени
pm2 monit

# Логи из файлов
tail -f /var/www/vetcenter-spb/shared/logs/combined.log
```

## Откат к предыдущему релизу

Если что-то пошло не так, можно откатиться к предыдущему релизу:

```bash
# На сервере
cd /var/www/vetcenter-spb/releases
ls -lt  # Просмотр всех релизов

# Выберите нужный релиз и создайте симлинк
ln -sfn /var/www/vetcenter-spb/releases/20240101120000 /var/www/vetcenter-spb/current

# Перезапустите приложение
pm2 restart vetcenter-spb
```

## Troubleshooting

### Ошибка: Permission denied (publickey)

**Причина:** SSH ключ не настроен или не добавлен в GitHub Secrets.

**Решение:**
1. Убедитесь, что публичный ключ добавлен на сервер: `ssh-copy-id user@server`
2. Проверьте, что приватный ключ правильно добавлен в GitHub Secrets
3. Убедитесь, что ключ начинается с `-----BEGIN` и заканчивается `-----END`

### Ошибка: npm ci failed

**Причина:** Проблемы с зависимостями или package-lock.json.

**Решение:**
1. Убедитесь, что `package-lock.json` закоммичен в репозиторий
2. Проверьте версию Node.js на сервере (должна быть >= 20.11.0)

### Ошибка: PM2 process not found

**Причина:** Приложение не запущено через PM2.

**Решение:**
```bash
# На сервере
cd /var/www/vetcenter-spb/current
pm2 start ecosystem.config.js
pm2 save
```

### Ошибка: Application is not responding

**Причина:** Приложение не запустилось или упало.

**Решение:**
1. Проверьте логи: `pm2 logs vetcenter-spb`
2. Проверьте переменные окружения в `.env.production`
3. Убедитесь, что порт 3000 не занят другим процессом

### Деплой работает, но изменения не видны

**Причина:** Кэш браузера или CDN.

**Решение:**
1. Очистите кэш браузера
2. Проверьте, что изменения действительно задеплоены: `pm2 logs vetcenter-spb`
3. Если используете CDN, очистите кэш CDN

## Безопасность

### Рекомендации:

1. ✅ Используйте отдельного пользователя для деплоя (не root)
2. ✅ Ограничьте SSH доступ по IP (через firewall)
3. ✅ Используйте SSH ключи вместо паролей
4. ✅ Регулярно обновляйте систему и зависимости
5. ✅ Храните секреты только в GitHub Secrets, не в коде
6. ✅ Используйте разные ключи для разных серверов
7. ✅ Регулярно ротируйте SSH ключи

### Настройка firewall:

```bash
# Разрешить только необходимые порты
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## Дополнительные возможности

### Деплой только при изменении определенных файлов

Отредактируйте `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'src/**'
      - 'package.json'
      - 'next.config.js'
```

### Уведомления в Telegram/Slack

Добавьте шаг уведомления в workflow:

```yaml
- name: Notify Telegram
  if: always()
  run: |
    curl -X POST "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
      -d "chat_id=${{ secrets.TELEGRAM_CHAT_ID }}" \
      -d "text=Deployment ${{ job.status }}: ${{ github.event.head_commit.message }}"
```

## Полезные ссылки

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

