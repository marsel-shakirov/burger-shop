# Burger Shop

Интернет-магазин бургеров: Burger-shop

## Стек

- Client: React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Zustand
- Server: Node.js, Express, TypeScript, Zod validation, PostgreSQL
- Архитектура клиента: Feature-Sliced Design
- Архитектура сервера: REST api

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

## Структура

```text
client/  React-приложение
server/  Express API (PostgreSQL на Supabase, изображения — в Supabase Storage)
```

Для деплоя на Vercel используются два проекта из одного репозитория: `client` и `server` задаются как отдельные Root Directory. Запросы `/api/*` с клиента перенаправляются на backend через `client/vercel.json`.
Проект на Vercel https://burger-shop-indol.vercel.app/
