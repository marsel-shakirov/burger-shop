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
ALLOWED_ORIGINS=       # необязательно: дополнительные Origin через запятую, например http://192.168.31.43:5173
COOKIE_SECURE=         # необязательно: false — cookie сессии без флага Secure (для входа по http с IP в локальной сети)
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
```

```text
GET   /api/profile   { name, phone, birthDate, gender }
PATCH /api/profile   { name?, phone?, birthDate?, gender? } — вернуть обновлённый профиль
```

- `/api/profile` — оба запроса требуют сессию. В `PATCH` передаются только меняемые поля, хотя бы одно. `null` очищает поле. `birthDate` — `YYYY-MM-DD`, от `1900-01-01` до сегодня. `gender` — `female | male`. Неверное поле — `400` с `code`: `invalid_name`, `invalid_phone`, `invalid_birth_date` или `invalid_gender`.

```text
GET    /api/favorites              { productIds }, новые первыми
PUT    /api/favorites/:productId   добавить в избранное, 204
DELETE /api/favorites/:productId   убрать из избранного, 204
POST   /api/favorites/merge        { productIds } — добавить список гостя, вернуть итоговый
```

- `/api/favorites` — все запросы требуют сессию. `PUT` и `DELETE` можно повторять: повторное добавление или удаление ничего не меняет. Несуществующий товар в `PUT` — `400` с `code: "product_not_found"`. В `merge` до 100 id, несуществующие товары пропускаются.

```text
GET    /api/cart              { items: [{ productId, quantity }] }, в порядке добавления
PUT    /api/cart/:productId   { quantity } — задать количество товара, 204
DELETE /api/cart/:productId   убрать товар из корзины, 204
DELETE /api/cart              очистить корзину, 204
POST   /api/cart/merge        { items: [{ productId, quantity }] } — добавить корзину гостя, вернуть итоговую
```

- `/api/cart` — все запросы требуют сессию. `quantity` — целое число от 1 до 50. `PUT` задаёт количество, а не прибавляет его, поэтому повтор запроса ничего не меняет. Несуществующий товар в `PUT` — `400` с `code: "product_not_found"`. В `merge` до 100 позиций: количество складывается с тем, что уже лежит в корзине, но не больше 50, несуществующие товары пропускаются.

POST-, PUT-, PATCH- и DELETE-запросы принимаются только с `Origin` из `CLIENT_ORIGIN` или `ALLOWED_ORIGINS`.

## Структура

```text
client/  React-приложение
server/  Express API (PostgreSQL на Supabase, изображения — в Supabase Storage)
```

Для деплоя на Vercel используются два проекта из одного репозитория: `client` и `server` задаются как отдельные Root Directory. Запросы `/api/*` с клиента перенаправляются на backend через `client/vercel.json`.
Проект на Vercel https://burger-shop-indol.vercel.app/
