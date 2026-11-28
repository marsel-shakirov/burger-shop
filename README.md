# Burger Shop

Учебный full-stack приложение для онлайн-заказа еды. Проект показывает полный путь покупателя: от каталога и регистрации до оформления заказа и просмотра истории покупок.

[Открыть приложение](https://burger-shop-indol.vercel.app/) · [Swagger UI](https://burger-shop-indol.vercel.app/api/docs) · [OpenAPI JSON](https://burger-shop-indol.vercel.app/api/openapi.json)

## Возможности продукта

- Каталог с категориями, фильтрацией и сортировкой товаров.
- Регистрация и вход с подтверждением email; профиль с редактированием личных данных.
- Избранное и корзина, которые сохраняются для пользователя и объединяются с гостевыми данными после входа.
- Оформление заказа с проверкой состава и цен на сервере, историей и деталями заказов.
- Акции и бонусный баланс с историей начислений.
- Адаптивный интерфейс и состояния загрузки, ошибок и пустых списков.

## Что показывает проект

- Клиент и REST API разделены на самостоятельные приложения в одном npm workspace.
- React-клиент организован по Feature-Sliced Design; сервер построен на Express с отдельными модулями, контроллерами и сценариями использования.
- Zod используется для проверки входных данных и описания API через OpenAPI.
- Supabase Auth работает через серверную интеграцию с сессионной cookie; сервер также ограничивает частоту запросов и проверяет пароли по базе известных утечек.
- Оформление заказа проверяет актуальность корзины и цен, поддерживает идемпотентность и сохраняет заказ с позициями в транзакции.

## Технологии

**Клиент:** React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Zustand.

**Сервер:** Node.js, Express, TypeScript, PostgreSQL, Zod, Supabase Auth.

## Локальный запуск

Требуется Node.js `26.13.1` (версия закреплена в `.nvmrc`) и npm.

```bash
nvm install
nvm use
npm ci
```

Создайте `server/.env` на основе [`server/.env.example`](server/.env.example) и заполните настройки Supabase и PostgreSQL. Затем запустите оба приложения из корня:

```bash
npm run dev
```

Клиент доступен на `http://localhost:5173`, сервер — на `http://localhost:3000`. API-документация появится по адресу `http://localhost:3000/api/docs`.

### Переменные окружения сервера

| Переменная            | Назначение                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`        | Строка подключения к PostgreSQL (Supabase).                                                                    |
| `SUPABASE_URL`        | URL проекта Supabase.                                                                                          |
| `SUPABASE_SECRET_KEY` | Секретный ключ Supabase; хранить только на сервере.                                                            |
| `CLIENT_ORIGIN`       | Origin клиента; используется для проверок запросов и ссылок подтверждения. Локально — `http://localhost:5173`. |
| `ALLOWED_ORIGINS`     | Необязательные дополнительные Origin через запятую.                                                            |
| `PORT`                | Необязательный порт сервера, по умолчанию `3000`.                                                              |
| `COOKIE_SECURE`       | Необязательная настройка флага `Secure` для cookie.                                                            |
| `TRUST_PROXY`         | Необязательная настройка доверия к reverse proxy.                                                              |

Для email-подтверждения в Supabase включите **Confirm email** и **Secure email change**, добавьте адреса `/api/auth/callback` и `/api/auth/email-callback` в **Redirect URLs** и настройте SMTP для реальных пользователей.

## Команды

| Команда                                               | Назначение                              |
| ----------------------------------------------------- | --------------------------------------- |
| `npm run dev`                                         | Запустить клиент и сервер одновременно. |
| `npm run dev:client` / `npm run dev:server`           | Запустить только клиент или сервер.     |
| `npm run build -w client` / `npm run build -w server` | Собрать клиент или сервер.              |
| `npm run lint -w client` / `npm run lint -w server`   | Проверить код ESLint.                   |
| `npm run test:run --workspaces`                       | Запустить тесты во всех workspace.      |
| `npm run test:coverage --workspaces`                  | Запустить тесты с покрытием.            |
| `npm run format`                                      | Проверить форматирование.               |

## API

Интерактивная документация: [Swagger UI](https://burger-shop-indol.vercel.app/api/docs). Спецификация: [OpenAPI JSON](https://burger-shop-indol.vercel.app/api/openapi.json).

Основные публичные маршруты — `GET /api/menu`, `GET /api/products` и `GET /api/promos`. Остальные группы API покрывают аутентификацию, профиль, избранное, корзину, заказы и бонусы. Подробности параметров, ответов, ошибок и правил авторизации доступны ниже.

<details>
<summary>Полный справочник API</summary>

### Каталог и акции

```text
GET /api/menu
GET /api/products?menu=burgers&category=beef&sort=popularity&order=desc
GET /api/promos
```

- `/api/menu` — список меню с категориями.
- `/api/products` — параметры необязательны: `menu` и `category` — slug; `sort` — `popularity | price | rating` (по умолчанию `rating`); `order` — `asc | desc` (по умолчанию `desc`).
- `/api/promos` — активные акции в порядке `sort_order`. Акция активна, если `starts_at` уже наступил, а `ends_at` пуст или ещё не наступил. `kind` определяет тип акции: `coupon` содержит `value`, `valueCaption`, `code`; `bonus` — `value`, `valueCaption`, `ctaLabel`. Необязательный `link` ведёт к меню, категории или товару.

### Аутентификация и профиль

```text
POST /api/auth/sign-up       { email, password }
POST /api/auth/sign-in       { email, password }
POST /api/auth/sign-out
GET  /api/auth/session       текущий пользователь или null
GET  /api/auth/callback      переход по ссылке из письма
POST /api/auth/password      { currentPassword, newPassword }
POST /api/auth/email         { newEmail, currentPassword }
GET  /api/auth/email-callback

GET   /api/profile           { name, phone, birthDate, gender }
PATCH /api/profile           { name?, phone?, birthDate?, gender? }
```

- Смена пароля и email требует сессию. Новый пароль должен содержать 8–72 символа, не встречаться в известных утечках и отличаться от текущего. Для смены email Supabase отправляет ссылки на текущий и новый адрес.
- Запросы смены пароля ограничены пятью неудачными попытками за 15 минут; запросы смены email — пятью запросами в час. При превышении возвращается `429`.
- `PATCH /api/profile` принимает только изменяемые поля; `null` очищает поле. `birthDate` — дата `YYYY-MM-DD` от `1900-01-01` до текущего дня; `gender` — `female | male`.
- Телефон хранится в формате `+7` и 10 цифр. Сервер принимает номер через `8`, без префикса, а также пробелы, скобки и дефисы.

### Избранное и корзина

```text
GET    /api/favorites             { productIds }
PUT    /api/favorites/:productId  добавить, 204
DELETE /api/favorites/:productId  удалить, 204
POST   /api/favorites/merge       { productIds }

GET    /api/cart                  { items: [{ productId, quantity }] }
PUT    /api/cart/:productId       { quantity }
DELETE /api/cart/:productId       удалить позицию, 204
DELETE /api/cart                  очистить, 204
POST   /api/cart/merge            { items: [{ productId, quantity }] }
```

- Все запросы избранного и корзины требуют сессию. Повторное добавление или удаление безопасно. Слияние принимает до 100 товаров; отсутствующие товары пропускаются.
- Количество товара в корзине — целое от 1 до 50. `PUT` задаёт количество; при слиянии количество складывается с текущим, но не превышает 50.

### Заказы и бонусы

```text
POST /api/orders      { idempotencyKey, customerName, customerPhone, customerComment?, items: [{ productId, quantity, unitPrice }] }
GET  /api/orders      список с пагинацией
GET  /api/orders/:id  детали заказа
GET  /api/bonus       { balance, transactions }
```

- Все маршруты заказов требуют сессию. Сервер сверяет состав и цены с актуальной корзиной, рассчитывает сумму и в одной транзакции сохраняет заказ с позициями и удаляет оформленные товары из корзины.
- Для повторной отправки одной попытки оформления используется тот же `idempotencyKey`. Если корзина изменилась, сервер возвращает `409 cart_changed`, чтобы клиент обновил заказ и запросил подтверждение. Пустая корзина даёт `409 cart_empty`.
- История заказов отсортирована от новых к старым. `limit` — целое от 1 до 50 (по умолчанию 20); `nextCursor` передаётся как `cursor` для следующей страницы. Детали доступны только владельцу заказа.
- `/api/bonus` требует сессию. Перед ответом сервер проверяет право на приветственный бонус; одно начисление по акции происходит только один раз.

POST-, PUT-, PATCH- и DELETE-запросы принимаются только с `Origin` из `CLIENT_ORIGIN` или `ALLOWED_ORIGINS`.

</details>

## Деплой

Приложение опубликовано на [Vercel](https://burger-shop-indol.vercel.app/). Клиент и сервер развёрнуты как отдельные Vercel-проекты из одного репозитория; для каждого задана своя корневая директория. Rewrite в `client/vercel.json` направляет `/api/*` на сервер. Требуемая версия Node.js указана в `.nvmrc` и `engines` обоих workspace.

## Структура проекта

```text
client/  React-приложение, интерфейс и клиентские сценарии
server/  Express API, бизнес-логика и доступ к PostgreSQL/Supabase
```
