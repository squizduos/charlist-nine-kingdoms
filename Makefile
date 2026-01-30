# =============================================================================
# Makefile для Чар-лист Девяти Королевств
# =============================================================================

# Конфигурация
IMAGE_NAME ?= charlist-nine-kingdoms
IMAGE_TAG ?= latest
REGISTRY ?= docker.io
REGISTRY_USER ?= $(shell whoami)
FULL_IMAGE_NAME = $(REGISTRY)/$(REGISTRY_USER)/$(IMAGE_NAME):$(IMAGE_TAG)

# Порты
DEV_PORT ?= 5173
PROD_PORT ?= 8080

# =============================================================================
# Разработка
# =============================================================================

.PHONY: install
install: ## Установка зависимостей
	npm install

.PHONY: dev
dev: ## Запуск в режиме разработки
	npm run dev

.PHONY: build
build: ## Сборка приложения
	npm run build

.PHONY: preview
preview: ## Предпросмотр production-сборки
	npm run preview

.PHONY: lint
lint: ## Проверка TypeScript типов
	npx vue-tsc --noEmit

.PHONY: clean
clean: ## Очистка артефактов сборки
	rm -rf dist node_modules

# =============================================================================
# Docker
# =============================================================================

.PHONY: docker-build
docker-build: ## Сборка Docker-образа
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

.PHONY: docker-run
docker-run: ## Запуск Docker-контейнера
	docker run -d -p $(PROD_PORT):80 --name $(IMAGE_NAME) $(IMAGE_NAME):$(IMAGE_TAG)

.PHONY: docker-stop
docker-stop: ## Остановка Docker-контейнера
	docker stop $(IMAGE_NAME) || true
	docker rm $(IMAGE_NAME) || true

.PHONY: docker-restart
docker-restart: docker-stop docker-run ## Перезапуск Docker-контейнера

.PHONY: docker-logs
docker-logs: ## Просмотр логов контейнера
	docker logs -f $(IMAGE_NAME)

.PHONY: docker-shell
docker-shell: ## Подключение к контейнеру
	docker exec -it $(IMAGE_NAME) /bin/sh

# =============================================================================
# Docker Registry (публикация)
# =============================================================================

.PHONY: docker-tag
docker-tag: ## Тегирование образа для registry
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(FULL_IMAGE_NAME)

.PHONY: docker-push
docker-push: docker-tag ## Публикация образа в registry
	docker push $(FULL_IMAGE_NAME)

.PHONY: docker-login
docker-login: ## Вход в Docker registry
	docker login $(REGISTRY)

.PHONY: docker-publish
docker-publish: docker-build docker-push ## Сборка и публикация образа
	@echo "Образ опубликован: $(FULL_IMAGE_NAME)"

# =============================================================================
# Docker Compose
# =============================================================================

.PHONY: up
up: ## Запуск через docker-compose
	docker-compose up -d

.PHONY: down
down: ## Остановка docker-compose
	docker-compose down

.PHONY: up-build
up-build: ## Пересборка и запуск через docker-compose
	docker-compose up -d --build

# =============================================================================
# Полный цикл
# =============================================================================

.PHONY: all
all: install build ## Установка зависимостей и сборка

.PHONY: release
release: docker-build docker-push ## Сборка и публикация релиза
	@echo "Релиз $(IMAGE_TAG) опубликован!"

# =============================================================================
# Справка
# =============================================================================

.PHONY: help
help: ## Показать эту справку
	@echo "Доступные команды:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Переменные окружения:"
	@echo "  IMAGE_NAME    = $(IMAGE_NAME)"
	@echo "  IMAGE_TAG     = $(IMAGE_TAG)"
	@echo "  REGISTRY      = $(REGISTRY)"
	@echo "  REGISTRY_USER = $(REGISTRY_USER)"
	@echo "  FULL_IMAGE    = $(FULL_IMAGE_NAME)"
	@echo ""
	@echo "Примеры:"
	@echo "  make docker-build                          # Сборка образа"
	@echo "  make docker-publish REGISTRY_USER=myuser   # Публикация в docker.io/myuser/..."
	@echo "  make release IMAGE_TAG=v1.0.0              # Релиз с тегом v1.0.0"

.DEFAULT_GOAL := help
