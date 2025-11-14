# Инструкция по деплою проекта

## Подготовка к деплою

### 1. Переменные окружения

Перед деплоем убедитесь, что у вас настроены все необходимые переменные окружения. Создайте файл `.env.production` или настройте их в панели хостинга.

#### Обязательные переменные:

```env
# API URLs
NEXT_PUBLIC_FRONT_BASE_URL=https://your-backend-domain.com
NEXT_PUBLIC_FRONT_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_FRONT_PROXY_API_URL=/api/proxy

# Revalidation (для автоматического обновления страниц)
REVALIDATE_SECRET=your-super-secret-key-here

# Sentry (опционально)
ENABLE_SENTRY=1
SENTRY_DSN=your-sentry-dsn
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token

# Оптимизация изображений (опционально)
UNOPTIMIZED_IMAGES=0

# Базовая аутентификация (если требуется)
NEXT_PUBLIC_BASIC_AUTH_LOGIN=
NEXT_PUBLIC_BASIC_AUTH_PASSWORD=

# Telegram бот (для формы обратной связи)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

**Важно:**

- `REVALIDATE_SECRET` — сгенерируйте сложный случайный ключ (например, через `openssl rand -base64 32`)
- Никогда не коммитьте файлы `.env*` в git
- Используйте разные значения для development и production

---

## Вариант 1: Деплой на Vercel (Рекомендуется)

Vercel — это платформа, созданная командой Next.js. Она идеально подходит для деплоя Next.js приложений.

### Шаги деплоя:

1. **Установите Vercel CLI** (опционально):

   ```bash
   npm i -g vercel
   ```

2. **Подключите проект к Vercel:**

   - Зайдите на [vercel.com](https://vercel.com)
   - Войдите через GitHub/GitLab/Bitbucket
   - Нажмите "New Project"
   - Выберите ваш репозиторий
   - Vercel автоматически определит Next.js

3. **Настройте переменные окружения:**

   - В настройках проекта перейдите в "Environment Variables"
   - Добавьте все переменные из списка выше
   - Убедитесь, что они применены для Production, Preview и Development

4. **Настройте Build Settings:**

   - **Build Command:** `npm run build` (по умолчанию)
   - **Output Directory:** `.next` (по умолчанию)
   - **Install Command:** `npm install` (по умолчанию)
   - **Node.js Version:** `20.x` или выше

5. **Деплой:**
   - Нажмите "Deploy"
   - Vercel автоматически соберет и задеплоит проект
   - После успешного деплоя вы получите URL вида `your-project.vercel.app`

### Дополнительные настройки Vercel:

#### Настройка домена:

1. В настройках проекта → Domains
2. Добавьте ваш домен
3. Следуйте инструкциям по настройке DNS

#### Настройка webhook для автоматического деплоя:

- Vercel автоматически деплоит при каждом push в основную ветку
- Для других веток создаются preview deployments

#### Переменные окружения для разных окружений:

- **Production:** для production деплоев
- **Preview:** для preview деплоев (pull requests)
- **Development:** для локальной разработки с `vercel dev`

### Преимущества Vercel:

- ✅ Автоматический деплой при push в git
- ✅ Preview deployments для pull requests
- ✅ Автоматический SSL
- ✅ Edge Network (CDN)
- ✅ Аналитика и мониторинг
- ✅ Бесплатный план для небольших проектов

---

## Вариант 2: Деплой на VPS (Ubuntu/Debian)

Для деплоя на VPS сервер (например, DigitalOcean, Hetzner, AWS EC2) используйте PM2 для управления процессом.

### Требования:

- Ubuntu 20.04+ или Debian 11+
- Node.js 20.x или выше
- Nginx (для reverse proxy)
- PM2 (для управления процессами)

### Шаги деплоя:

1. **Подключитесь к серверу по SSH:**

   ```bash
   ssh user@your-server-ip
   ```

2. **Установите Node.js:**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Установите PM2:**

   ```bash
   sudo npm install -g pm2
   ```

4. **Клонируйте репозиторий:**

   ```bash
   cd /var/www
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

5. **Установите зависимости:**

   ```bash
   npm install --production
   ```

6. **Создайте файл с переменными окружения:**

   ```bash
   nano .env.production
   ```

   Добавьте все переменные окружения (см. раздел выше)

7. **Соберите проект:**

   ```bash
   npm run build
   ```

8. **Создайте ecosystem.config.js для PM2:**

   ```bash
   nano ecosystem.config.js
   ```

   ```javascript
   module.exports = {
     apps: [
       {
         name: 'vetcenter-spb',
         script: 'node_modules/next/dist/bin/next',
         args: 'start',
         cwd: '/var/www/your-repo',
         instances: 2,
         exec_mode: 'cluster',
         env: {
           NODE_ENV: 'production',
           PORT: 3000,
         },
       },
     ],
   };
   ```

9. **Запустите приложение через PM2:**

   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

10. **Настройте Nginx как reverse proxy:**

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
sudo ln -s /etc/nginx/sites-available/vetcenter-spb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

11. **Настройте SSL через Let's Encrypt:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

12. **Настройте автоматическое обновление:**
    Создайте скрипт для автоматического обновления:

```bash
nano /var/www/your-repo/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/your-repo
git pull origin main
npm install --production
npm run build
pm2 restart vetcenter-spb
```

```bash
chmod +x deploy.sh
```

### Обновление проекта:

```bash
cd /var/www/your-repo
./deploy.sh
```

---

## Вариант 3: Деплой через Docker

Docker позволяет упаковать приложение в контейнер для универсального деплоя.

### Создайте Dockerfile:

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Обновите next.config.js для standalone output:

```javascript
/** @type {import('next').NextConfig} */
const moduleExports = {
  reactStrictMode: false,
  output: 'standalone', // Добавьте эту строку
  images: {
    unoptimized: Boolean(Number(process.env.UNOPTIMIZED_IMAGES)),
    deviceSizes: [767, 980, 1156, 1400, 1920],
    formats: ['image/webp'],
    domains: ['via.placeholder.com', 'zaburdaev.space'],
  },
  // ... остальная конфигурация
};
```

### Создайте .dockerignore:

```
node_modules
.next
.git
.env*.local
*.log
.DS_Store
```

### Создайте docker-compose.yml:

```yaml
version: '3.8'

services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      # Добавьте все переменные окружения здесь
      - NEXT_PUBLIC_FRONT_API_URL=${NEXT_PUBLIC_FRONT_API_URL}
      - NEXT_PUBLIC_FRONT_PROXY_API_URL=${NEXT_PUBLIC_FRONT_PROXY_API_URL}
      - REVALIDATE_SECRET=${REVALIDATE_SECRET}
      # ... остальные переменные
    restart: unless-stopped
```

### Сборка и запуск:

```bash
# Сборка образа
docker build -t vetcenter-spb .

# Запуск контейнера
docker run -p 3000:3000 --env-file .env.production vetcenter-spb

# Или через docker-compose
docker-compose up -d
```

---

## Вариант 4: Деплой на Shared Hosting (cPanel)

Для shared hosting с поддержкой Node.js:

1. **Загрузите файлы через FTP/SFTP:**

   - Загрузите все файлы проекта в папку `public_html` или `www`

2. **Настройте переменные окружения:**

   - В панели управления хостингом найдите раздел "Environment Variables"
   - Добавьте все необходимые переменные

3. **Установите зависимости и соберите проект:**

   - Через SSH или терминал хостинга:

   ```bash
   npm install --production
   npm run build
   ```

4. **Настройте запуск приложения:**

   - Создайте файл `start.sh`:

   ```bash
   #!/bin/bash
   cd /path/to/your/project
   node_modules/.bin/next start -p $PORT
   ```

5. **Настройте процесс-менеджер:**
   - Используйте встроенный процесс-менеджер хостинга или PM2

---

## Проверка после деплоя

После деплоя проверьте:

1. ✅ Главная страница открывается
2. ✅ API запросы работают (проверьте Network tab в DevTools)
3. ✅ Изображения загружаются
4. ✅ Форма обратной связи отправляет данные в Telegram
5. ✅ Страницы акций, услуг, врачей открываются
6. ✅ SEO метатеги присутствуют (проверьте через View Source)
7. ✅ Sitemap доступен: `https://your-domain.com/sitemap.xml`
8. ✅ Robots.txt доступен: `https://your-domain.com/robots.txt`

---

## Настройка webhook для автоматического обновления

После деплоя настройте webhook в WordPress для автоматического обновления страниц. См. файл `WEBHOOK_SETUP.md` для подробных инструкций.

**Важно:** Убедитесь, что URL webhook указывает на ваш production домен:

```
https://your-production-domain.com/api/revalidate
```

---

## Мониторинг и логи

### Vercel:

- Логи доступны в панели Vercel → Deployments → View Function Logs
- Аналитика в разделе Analytics

### VPS (PM2):

```bash
# Просмотр логов
pm2 logs vetcenter-spb

# Мониторинг
pm2 monit

# Статус
pm2 status
```

### Docker:

```bash
# Логи контейнера
docker logs vetcenter-spb

# Или через docker-compose
docker-compose logs -f
```

---

## Troubleshooting

### Ошибка при сборке:

- Проверьте версию Node.js (должна быть >= 20.11.0)
- Убедитесь, что все зависимости установлены
- Проверьте логи сборки

### Страницы не обновляются:

- Проверьте переменную `REVALIDATE_SECRET`
- Убедитесь, что webhook настроен правильно
- Проверьте логи API route `/api/revalidate`

### Ошибки API запросов:

- Проверьте переменные `NEXT_PUBLIC_FRONT_API_URL` и `NEXT_PUBLIC_FRONT_PROXY_API_URL`
- Убедитесь, что CORS настроен на бэкенде
- Проверьте базовую аутентификацию (если используется)

### Проблемы с изображениями:

- Проверьте переменную `UNOPTIMIZED_IMAGES`
- Убедитесь, что домены добавлены в `next.config.js` → `images.domains`

---

## Полезные ссылки

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
