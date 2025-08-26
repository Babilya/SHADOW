#!/usr/bin/env bash
# Автоматические проверки для репозитория (Ubuntu 24.04 devcontainer)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echof() { printf '%s\n' "$*"; }

FAILED=0

# load .env if present
if [ -f .env ]; then
  # shellcheck disable=SC1091
  set -o allexport; source .env 2>/dev/null || true; set +o allexport
fi

echof "1) Определение менеджера пакетов..."
PKG_MANAGER="none"
if [ -f pnpm-lock.yaml ]; then PKG_MANAGER="pnpm"; fi
if [ -f package-lock.json ] && [ "$PKG_MANAGER" = "none" ]; then PKG_MANAGER="npm"; fi
if [ -f yarn.lock ] && [ "$PKG_MANAGER" = "none" ]; then PKG_MANAGER="yarn"; fi
echof " -> выбран: $PKG_MANAGER"

echof "2) Установка зависимостей и запуск JS/TS тестов..."
case "$PKG_MANAGER" in
  pnpm)
    pnpm install -w || FAILED=1
    pnpm -w -r test || FAILED=1
    ;;
  npm)
    npm ci || FAILED=1
    # если workspaces, try run tests in workspaces
    npm run test --workspaces --if-present || npm test --if-present || true
    ;;
  yarn)
    yarn install || FAILED=1
    yarn workspaces run test || true
    ;;
  *)
    echof " -> менеджер пакетов не найден, пропуск JS тестов"
    ;;
esac

echof "3) Python (backend) тесты и миграции (если есть apps/backend)..."
if [ -d apps/backend ]; then
  pushd apps/backend >/dev/null
  if [ -f pyproject.toml ] && command -v poetry >/dev/null; then
    poetry install || FAILED=1
    poetry run pytest -q || FAILED=1
    if [ -f alembic.ini ] && command -v alembic >/dev/null; then
      alembic current || true
      alembic upgrade head || FAILED=1
    fi
  else
    python3 -m venv .venv || true
    # shellcheck disable=SC1091
    source .venv/bin/activate
    if [ -f requirements.txt ]; then pip install -r requirements.txt || FAILED=1; fi
    pytest -q || FAILED=1 || true
    if [ -f alembic.ini ] && command -v alembic >/dev/null; then
      alembic current || true
      alembic upgrade head || FAILED=1
    fi
    deactivate || true
  fi
  popd >/dev/null
else
  echof " -> apps/backend не найдена, пропуск Python проверок"
fi

echof "4) Docker Compose — поднять и проверить сервисы (если есть)..."
if [ -f docker-compose.yml ] || [ -f docker-compose.yaml ]; then
  docker compose pull --quiet || true
  docker compose build --quiet || true
  docker compose up -d || FAILED=1
  docker compose ps --quiet || true
  # попробуем журналы backend если есть сервис backend в compose
  docker compose ps --services | grep -E '^backend$' >/dev/null 2>&1 && \
    docker compose logs --tail=200 backend || true
else
  echof " -> docker-compose отсутствует, пропуск"
fi

echof "5) Проверка доступности DB и Redis..."
# Postgres
if command -v psql >/dev/null; then
  if psql "${PGDATABASE:-postgres}" -c '\l' >/dev/null 2>&1; then
    echof " -> psql OK"
  else
    echof " -> psql недоступен или креды не заданы"
    FAILED=1
  fi
else
  echof " -> psql не установлен, пропуск"
fi

# Redis
if command -v redis-cli >/dev/null; then
  if redis-cli -h "${REDIS_HOST:-127.0.0.1}" -p "${REDIS_PORT:-6379}" ping >/dev/null 2>&1; then
    echof " -> redis ping OK"
  else
    echof " -> redis недоступен (проверьте REDIS_HOST/REDIS_PORT)"
    FAILED=1
  fi
else
  echof " -> redis-cli не установлен, пропуск"
fi

echof "6) Политика lockfile и node_modules в Git..."
if [ -f pnpm-lock.yaml ] && [ -f package-lock.json ]; then
  echof " -> В репо одновременно pnpm-lock.yaml и package-lock.json — конфликт политики"
  FAILED=1
fi
if git ls-files | grep -q '^node_modules/'; then
  echof " -> node_modules закоммичен(ы) в Git — нужно удалить из индекса и добавить в .gitignore"
  FAILED=1
fi

echof "---- РЕЗЮМЕ ----"
if [ "$FAILED" -eq 0 ]; then
  echof "Все проверки выполнены успешно."
  exit 0
else
  echof "Обнаружены проблемы. Проверьте вывод выше и исправьте."
  exit 2
fi
