/**
 * PM2 Ecosystem Configuration
 * Используется для управления процессом Next.js приложения на VPS
 * 
 * Установка PM2: npm install -g pm2
 * Запуск: pm2 start ecosystem.config.js
 * Перезапуск: pm2 restart vetcenter-spb
 * Статус: pm2 status
 * Логи: pm2 logs vetcenter-spb
 * Мониторинг: pm2 monit
 */

module.exports = {
  apps: [
    {
      name: 'vetcenter-spb',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/vetcenter-spb/repo',
      instances: 2, // Количество инстансов (можно использовать 'max' для использования всех CPU, минимум 2 для кластера)
      exec_mode: 'cluster', // Режим кластера для балансировки нагрузки
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Автоматический перезапуск при сбоях
      autorestart: true,
      // Максимальное количество перезапусков
      max_restarts: 10,
      // Минимальное время между перезапусками (мс)
      min_uptime: '10s',
      // Максимальное использование памяти перед перезапуском
      max_memory_restart: '1G',
      // Логирование
      error_file: '/var/www/vetcenter-spb/logs/error.log',
      out_file: '/var/www/vetcenter-spb/logs/out.log',
      log_file: '/var/www/vetcenter-spb/logs/combined.log',
      time: true,
      // Формат логов
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Слияние логов из всех инстансов
      merge_logs: true,
    },
  ],
};

