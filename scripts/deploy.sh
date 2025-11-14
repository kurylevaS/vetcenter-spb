#!/bin/bash

# Скрипт для ручного деплоя на VPS
# Использование: ./scripts/deploy.sh

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Конфигурация (можно переопределить через переменные окружения)
VPS_USER="${VPS_USER:-your-user}"
VPS_HOST="${VPS_HOST:-your-server-ip}"
APP_DIR="${APP_DIR:-/var/www/vetcenter-spb}"
RELEASE_DIR="${APP_DIR}/releases/$(date +%Y%m%d%H%M%S)"

echo -e "${GREEN}🚀 Starting deployment...${NC}"

# Проверка наличия SSH ключа
if [ ! -f ~/.ssh/id_rsa ] && [ ! -f ~/.ssh/id_ed25519 ]; then
  echo -e "${RED}❌ SSH key not found. Please set up SSH access first.${NC}"
  exit 1
fi

# Проверка подключения к серверу
echo -e "${YELLOW}📡 Checking server connection...${NC}"
if ! ssh -o ConnectTimeout=5 ${VPS_USER}@${VPS_HOST} "echo 'Connection successful'" > /dev/null 2>&1; then
  echo -e "${RED}❌ Cannot connect to server. Please check your SSH configuration.${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Server connection OK${NC}"

# Сборка проекта локально
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build
echo -e "${GREEN}✅ Build completed${NC}"

# Создание директорий на сервере
echo -e "${YELLOW}📁 Creating directories on server...${NC}"
ssh ${VPS_USER}@${VPS_HOST} << EOF
  mkdir -p ${APP_DIR}/releases
  mkdir -p ${APP_DIR}/shared/logs
  mkdir -p ${RELEASE_DIR}
EOF
echo -e "${GREEN}✅ Directories created${NC}"

# Копирование файлов на сервер
echo -e "${YELLOW}📤 Copying files to server...${NC}"
rsync -avz --progress \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.env*' \
  --exclude '.github' \
  --exclude '*.log' \
  ./ ${VPS_USER}@${VPS_HOST}:${RELEASE_DIR}/

# Копирование собранных файлов
echo -e "${YELLOW}📤 Copying build files...${NC}"
rsync -avz --progress \
  .next/ ${VPS_USER}@${VPS_HOST}:${RELEASE_DIR}/.next/
rsync -avz --progress \
  public/ ${VPS_USER}@${VPS_HOST}:${RELEASE_DIR}/public/

# Установка зависимостей на сервере
echo -e "${YELLOW}📦 Installing dependencies on server...${NC}"
ssh ${VPS_USER}@${VPS_HOST} << EOF
  cd ${RELEASE_DIR}
  npm ci --production
EOF
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Деплой на сервере
echo -e "${YELLOW}🚀 Deploying on server...${NC}"
ssh ${VPS_USER}@${VPS_HOST} << DEPLOY_SCRIPT
  set -e
  
  # Проверяем наличие .env файла
  if [ ! -f "${APP_DIR}/shared/.env.production" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.production not found${NC}"
    echo "Please create it in ${APP_DIR}/shared/.env.production"
  else
    cp ${APP_DIR}/shared/.env.production ${RELEASE_DIR}/.env.production
    echo -e "${GREEN}✅ Environment file copied${NC}"
  fi
  
  # Создаем симлинк
  ln -sfn ${RELEASE_DIR} ${APP_DIR}/current
  echo -e "${GREEN}✅ Symlink created${NC}"
  
  # Перезапускаем приложение
  cd ${APP_DIR}/current
  if pm2 list | grep -q "vetcenter-spb"; then
    pm2 restart vetcenter-spb
    echo -e "${GREEN}✅ Application restarted${NC}"
  else
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✅ Application started${NC}"
  fi
  
  # Очистка старых релизов (оставляем последние 5)
  cd ${APP_DIR}/releases
  ls -t | tail -n +6 | xargs -r rm -rf
  echo -e "${GREEN}✅ Old releases cleaned up${NC}"
DEPLOY_SCRIPT

# Проверка деплоя
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
sleep 5
if ssh ${VPS_USER}@${VPS_HOST} "curl -f http://localhost:3000 > /dev/null 2>&1"; then
  echo -e "${GREEN}✅ Application is running${NC}"
else
  echo -e "${RED}❌ Application is not responding${NC}"
  exit 1
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}📍 Release directory: ${RELEASE_DIR}${NC}"

