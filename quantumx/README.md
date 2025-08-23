# QuantumX

QuantumX — ультрасучасна екосистема Telegram WebApp + AI/OSINT платформа.

"QuantumX — це еволюція. Створено, щоб дати користувачам найпотужніші AI, OSINT та кіберзахисні інструменти у світі."

## Модулі
- **Bot (aiogram v3)**: Telegram-бот з WebApp інтеграцією
- **Backend (FastAPI)**: API, JWT, rate-limit (опційно), Alembic, Postgres, Redis
- **WebApp (React + Vite + TS)**: glassmorphism, i18n, Framer Motion

## Швидкий старт
1. Заповніть `.env` на основі `.env.example`
2. Запустіть docker-compose
```bash
cp .env.example .env
docker compose up -d --build
```
3. Міграції БД
```bash
docker compose exec backend alembic upgrade head
```
4. Відкрийте WebApp: `http://localhost:5173`

## Ключові ендпоїнти (ядро)
- `GET /wallet/{telegram_id}` — отримати баланс
- `POST /bonus/claim/{telegram_id}` — щоденний бонус
- `GET/POST /profile/{telegram_id}` — профіль (username, language)
- `POST /payments/topup/{telegram_id}` — поповнення (dev)
- `POST /vip/buy/{telegram_id}` — купівля VIP
- `POST /purchase/{telegram_id}` — покупка в магазині
- `POST /analytics/` — подія аналітики

## Логи та метрики
- structlog JSON, middleware таймінгу запитів (мета p95 ≤ 800 мс)

## Локалізація
- ua/ru/en (автовизначення з Telegram), i18n ключі у WebApp `src/i18n.ts`

## Прийомка (Sprint 1)
- P0 ядро працює: Лобі, Профіль, Баланс/Платежі/VIP, Магазин, Логи/Аналітика, i18n
- Критичних багів немає

## Ліцензія
MIT
