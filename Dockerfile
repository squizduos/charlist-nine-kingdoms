# =============================================================================
# Build stage - сборка приложения
# =============================================================================
FROM node:20-alpine AS build

# Метаданные
LABEL maintainer="Semyon Bochkaryov"
LABEL description="Чар-лист Девяти Королевств - веб-приложение"
LABEL version="0.1.0"

WORKDIR /app

# Копируем только файлы зависимостей для кэширования слоя
COPY package*.json ./

# Устанавливаем зависимости (ci для более быстрой и надёжной установки)
RUN npm ci --prefer-offline --no-audit

# Копируем исходный код
COPY . .

# Собираем приложение в production-режиме
RUN npm run build

# =============================================================================
# Production stage - nginx для раздачи статики
# =============================================================================
FROM nginx:alpine AS production

# Метаданные
LABEL maintainer="Semyon Bochkaryov"
LABEL description="Чар-лист Девяти Королевств - production"
LABEL version="0.1.0"

# Удаляем дефолтную конфигурацию nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Копируем собственную конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранное приложение из build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Создаём пользователя без привилегий для безопасности
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Порт
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
