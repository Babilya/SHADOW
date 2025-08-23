# QuantumX

QuantumX — ультрасучасна екосистема Telegram WebApp + AI/OSINT платформа.

"QuantumX — це еволюція SHADOW FORCE.
Створено, щоб дати користувачам найпотужніші AI, OSINT та кіберзахисні інструменти у світі.
Developed by SHADOW and COMPANY (R&D partner)."

## Модулі
- **Bot (aiogram v3)**: Telegram-бот з WebApp інтеграцією
- **Backend (FastAPI)**: API, JWT, rate-limit, Alembic, Postgres, Redis
- **WebApp (React + Vite + TS)**: glassmorphism, dark/light, Framer Motion

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

## Команди бота
/start, /help, /profile, /balance, /bonus, /app, /osint, /casino, /shop, /vip

## Брендинг
- Назва: QuantumX
- Стиль: high-tech, glassmorphism, неон, анімації
- Футер: Developed by SHADOW and COMPANY (R&D partner)

## Ліцензія
MIT
