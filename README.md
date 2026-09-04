# Burger Shop

Интернет-магазин бургеров: Burger-shop

## Стек

- Client: React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Zustand
- Server: Node.js, Express, TypeScript
- Архитектура клиента: Feature-Sliced Design
- Архитектура сервера: REST api

## Запуск

Установите зависимости из корня проекта:

```bash
npm install
```

Создайте `client/.env`:

```env
VITE_SERVER_URL=http://localhost:3000
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
npm run format              # форматирование проекта
npm run format:check        # проверка форматирования
```

## API

```text
GET /api/categories
GET /api/products?categoryId=beef&sortBy=popularity&order=desc
```

## Структура

```text
client/  React-приложение
server/  Express API и статические изображения
```

Для деплоя на Vercel используются два проекта из одного репозитория: `client` и `server` задаются как отдельные Root Directory. Запросы `/api/*` с клиента перенаправляются на backend через `client/vercel.json`.
VERCEL: https://burger-shop-xi.vercel.app/
