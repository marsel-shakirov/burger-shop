# Burger Shop

Интернет-магазин бургеров: Burger-shop

## Стек

- Client: React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Zustand
- Server: Node.js, Express, TypeScript, Zod validation, PostgreSQL
- Auth: Supabase Auth через сервер — сессия в httpOnly cookie, подтверждение email (PKCE), проверка пароля по Pwned Passwords, rate limit
- Архитектура клиента: Feature-Sliced Design
- Архитектура сервера: REST api, BFF

## Переменные окружения

`server/.env`:

```bash
DATABASE_URL=          # PostgreSQL (Supabase)
SUPABASE_URL=          # https://<project>.supabase.co
SUPABASE_SECRET_KEY=   # секретный ключ Supabase, только на сервере
CLIENT_ORIGIN=         # http://localhost:5173 — проверка Origin и адрес callback из письма
TRUST_PROXY=           # необязательно: настройка trust proxy для IP клиента за прокси
```

В Supabase: включить **Confirm email**, добавить `<CLIENT_ORIGIN>/api/auth/callback` в **Redirect URLs**, для реальных пользователей подключить свой SMTP.

## Запуск

Установите зависимости из корня проекта:

```bash
npm install
```

Запустите client и server одновременно:

```bash
npm run dev
```

Client запускается через Vite, server — на `http://localhost:3000`.

## Команды

```bash
npm run dev                 # client и server
npm run dev:client          # только client
npm run dev:server          # только server
npm run build -w client     # сборка client
npm run build -w server     # сборка server
npm run lint -w client      # проверка client
npm run format              # проверка форматирования
npm run format:fix          # форматирование проекта
```

## API

```text
GET /api/menu
GET /api/products?menu=burgers&category=beef&sort=popularity&order=desc
```

- `/api/menu` — список меню с их категориями.
- `/api/products` — все параметры необязательные: `menu` и `category` — slug, `sort` — `popularity | price | rating` (по умолчанию `rating`), `order` — `asc | desc` (по умолчанию `desc`).

```text
POST /api/auth/sign-up     { email, password }
POST /api/auth/sign-in     { email, password }
POST /api/auth/sign-out
GET  /api/auth/session     текущий пользователь или null
GET  /api/auth/callback    переход по ссылке из письма
GET  /api/me               требует сессию
GET  /api/profile          требует сессию
PUT  /api/profile          требует сессию
```

POST-запросы принимаются только с `Origin`, равным `CLIENT_ORIGIN`.

## Структура

```text
client/  React-приложение
server/  Express API (PostgreSQL на Supabase, изображения — в Supabase Storage)
```

Для деплоя на Vercel используются два проекта из одного репозитория: `client` и `server` задаются как отдельные Root Directory. Запросы `/api/*` с клиента перенаправляются на backend через `client/vercel.json`.
Проект на Vercel https://burger-shop-indol.vercel.app/
