import {
  extendZodWithOpenApi,
  OpenApiGeneratorV32,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { env } from './config/env.ts';
import { productIdParamsSchema } from './lib/product-id.schema.ts';
import {
  authCallbackQuerySchema,
  changeEmailBodySchema,
  changePasswordBodySchema,
  emailCallbackQuerySchema,
  signInBodySchema,
  signUpBodySchema,
} from './modules/auth/auth.schema.ts';
import { mergeCartBodySchema, updateCartItemBodySchema } from './modules/cart/cart.schema.ts';
import { mergeFavoritesBodySchema } from './modules/favorites/favorites.schema.ts';
import { createOrderBodySchema, orderParamsSchema } from './modules/orders/orders.schema.ts';
import { getProductsQuerySchema } from './modules/products/products.schema.ts';
import { updateProfileBodySchema } from './modules/profile/profile.schema.ts';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const projectRef = new URL(env.SUPABASE_URL).hostname.split('.')[0];

registry.registerComponent('securitySchemes', 'SessionCookie', {
  type: 'apiKey',
  in: 'cookie',
  name: `sb-${projectRef}-auth-token`,
  description: 'Сессионная cookie Supabase. Браузер отправляет её автоматически.',
});

const errorSchema = registry.register(
  'Error',
  z.object({
    message: z.string(),
    code: z.string().optional(),
    reasons: z.array(z.string()).optional(),
  }),
);

const sessionUserSchema = registry.register(
  'SessionUser',
  z.object({ id: z.string(), email: z.email().nullable() }),
);

const authUserResponseSchema = z.object({ user: sessionUserSchema.nullable() });

const currentSessionResponseSchema = z.object({ user: sessionUserSchema.nullable() });

const profileResponseSchema = registry.register(
  'Profile',
  z.object({
    name: z.string().nullable(),
    phone: z.string().nullable(),
    birthDate: z.iso.date().nullable(),
    gender: z.enum(['female', 'male']).nullable(),
  }),
);

const favoritesResponseSchema = registry.register(
  'Favorites',
  z.object({ productIds: z.array(z.number().int()) }),
);

const cartItemSchema = registry.register(
  'CartItem',
  z.object({ productId: z.number().int(), quantity: z.number().int() }),
);

const cartResponseSchema = registry.register('Cart', z.object({ items: z.array(cartItemSchema) }));

const bonusResponseSchema = registry.register(
  'Bonus',
  z.object({
    balance: z.number(),
    transactions: z.array(
      z.object({
        id: z.uuid(),
        amount: z.number(),
        title: z.string(),
        createdAt: z.iso.datetime(),
      }),
    ),
  }),
);

const orderResponseSchema = registry.register(
  'Order',
  z.object({
    id: z.uuid(),
    orderNumber: z.string(),
    status: z.string(),
    totalPrice: z.number().int(),
  }),
);

const orderSummarySchema = registry.register(
  'OrderSummary',
  orderResponseSchema.extend({ createdAt: z.iso.datetime() }),
);

const orderItemSchema = registry.register(
  'OrderItem',
  z.object({
    lineNumber: z.number().int(),
    productName: z.string(),
    unitPrice: z.number().int(),
    quantity: z.number().int(),
  }),
);

const orderDetailsSchema = registry.register(
  'OrderDetails',
  orderSummarySchema.extend({ items: z.array(orderItemSchema) }),
);

const orderListResponseSchema = registry.register(
  'OrderList',
  z.object({ items: z.array(orderSummarySchema), nextCursor: z.string().nullable() }),
);

const listOrdersOpenApiQuerySchema = z.object({
  limit: z.number().int().min(1).max(50).default(20),
  cursor: z.string().min(1).max(256).base64url().optional(),
});

const categorySchema = registry.register(
  'Category',
  z.object({ id: z.number().int(), slug: z.string(), name: z.string() }),
);

const menuSchema = registry.register(
  'Menu',
  z.object({
    id: z.number().int(),
    slug: z.string(),
    name: z.string(),
    categories: z.array(categorySchema),
  }),
);

const productSchema = registry.register(
  'Product',
  z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    amount: z.number(),
    unit: z.enum(['g', 'ml']),
    rating: z.number(),
    popularity: z.number(),
    categoryId: z.number().int(),
    imageUrl: z.string(),
    imageSrcSet: z.string(),
  }),
);

const promoLinkSchema = z.object({
  menu: z.string(),
  category: z.string().optional(),
  productId: z.number().int().optional(),
});

const promoBaseSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  terms: z.string(),
  theme: z.enum(['mustard', 'pickle', 'ketchup']),
  link: promoLinkSchema.optional(),
  imageUrl: z.string().optional(),
  imageSrcSet: z.string().optional(),
});

const promoSchema = registry.register(
  'Promo',
  z.discriminatedUnion('kind', [
    promoBaseSchema.extend({
      kind: z.literal('coupon'),
      value: z.string(),
      valueCaption: z.string(),
      code: z.string(),
    }),
    promoBaseSchema.extend({
      kind: z.literal('bonus'),
      value: z.string(),
      valueCaption: z.string(),
      ctaLabel: z.string(),
    }),
  ]),
);

registry.registerPath({
  method: 'post',
  path: '/auth/sign-up',
  summary: 'Зарегистрировать пользователя',
  description:
    'Создаёт аккаунт. Если для проекта включено подтверждение email, пользователь подтвердит адрес по ссылке из письма.',
  tags: ['Auth'],
  request: {
    body: { content: { 'application/json': { schema: signUpBodySchema } } },
  },
  responses: {
    201: {
      description: 'Аккаунт создан.',
      content: { 'application/json': { schema: authUserResponseSchema } },
    },
    400: {
      description: 'Некорректные данные или слабый пароль.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    409: {
      description: 'Email уже зарегистрирован.',
      content: { 'application/json': { schema: errorSchema } },
    },
    429: {
      description: 'Превышен лимит попыток регистрации.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
    502: {
      description: 'Ошибка провайдера авторизации.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/sign-in',
  summary: 'Войти',
  tags: ['Auth'],
  request: {
    body: { content: { 'application/json': { schema: signInBodySchema } } },
  },
  responses: {
    200: {
      description: 'Вход выполнен. Сервер устанавливает сессионные cookie.',
      content: { 'application/json': { schema: z.object({ user: sessionUserSchema }) } },
    },
    400: {
      description: 'Некорректные данные или ошибка входа.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    429: {
      description: 'Превышен лимит попыток входа.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
    502: {
      description: 'Ошибка провайдера авторизации.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/sign-out',
  summary: 'Выйти',
  tags: ['Auth'],
  responses: {
    204: { description: 'Сессия завершена.' },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
    502: {
      description: 'Ошибка провайдера авторизации.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/session',
  summary: 'Получить текущую сессию',
  description: 'Возвращает пользователя или null, если сессии нет. Ответ не кэшируется.',
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Текущее состояние сессии.',
      content: { 'application/json': { schema: currentSessionResponseSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/password',
  summary: 'Сменить пароль',
  description:
    'Требует активную сессию. Новый пароль проверяется на минимальную длину и наличие в известных утечках.',
  tags: ['Auth'],
  security: [{ SessionCookie: [] }],
  request: {
    body: { content: { 'application/json': { schema: changePasswordBodySchema } } },
  },
  responses: {
    204: { description: 'Пароль изменён.' },
    400: {
      description: 'Некорректный или слабый пароль.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    429: {
      description: 'Превышен лимит попыток смены пароля.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
    502: {
      description: 'Ошибка провайдера авторизации.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/email',
  summary: 'Запросить смену email',
  description:
    'Требует активную сессию и текущий пароль. Провайдер отправляет подтверждения на текущий и новый адрес.',
  tags: ['Auth'],
  security: [{ SessionCookie: [] }],
  request: {
    body: { content: { 'application/json': { schema: changeEmailBodySchema } } },
  },
  responses: {
    204: { description: 'Письма для подтверждения отправлены.' },
    400: {
      description: 'Некорректный email или пароль.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    429: {
      description: 'Превышен лимит запросов на смену email.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
    502: {
      description: 'Ошибка провайдера авторизации.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/callback',
  summary: 'Обработать подтверждение регистрации',
  description:
    'Callback из письма подтверждения email. Устанавливает сессию и перенаправляет пользователя в приложение.',
  tags: ['Auth'],
  request: { query: authCallbackQuerySchema },
  responses: {
    302: {
      description: 'Перенаправление в профиль или на страницу входа с результатом подтверждения.',
      headers: { Location: { schema: { type: 'string' } } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/email-callback',
  summary: 'Обработать подтверждение смены email',
  description:
    'Callback из писем смены email. Перенаправляет на страницу редактирования профиля со статусом операции.',
  tags: ['Auth'],
  request: { query: emailCallbackQuerySchema },
  responses: {
    302: {
      description:
        'Перенаправление на страницу редактирования профиля со статусом changed, confirm_other или failed.',
      headers: { Location: { schema: { type: 'string' } } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/menu',
  summary: 'Получить меню и категории',
  tags: ['Menu'],
  responses: {
    200: {
      description: 'Список меню с категориями.',
      content: { 'application/json': { schema: z.array(menuSchema) } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/products',
  summary: 'Получить список товаров',
  tags: ['Products'],
  request: { query: getProductsQuerySchema },
  responses: {
    200: {
      description: 'Список товаров.',
      content: { 'application/json': { schema: z.array(productSchema) } },
    },
    400: {
      description: 'Некорректные параметры запроса.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/promos',
  summary: 'Получить активные акции',
  tags: ['Promos'],
  responses: {
    200: {
      description: 'Активные акции в порядке сортировки.',
      content: { 'application/json': { schema: z.array(promoSchema) } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/profile',
  summary: 'Получить профиль',
  tags: ['Profile'],
  security: [{ SessionCookie: [] }],
  responses: {
    200: {
      description: 'Профиль пользователя.',
      content: { 'application/json': { schema: profileResponseSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/profile',
  summary: 'Обновить профиль',
  description: 'Можно передать одно или несколько полей профиля. Пустое тело не принимается.',
  tags: ['Profile'],
  security: [{ SessionCookie: [] }],
  request: {
    body: { content: { 'application/json': { schema: updateProfileBodySchema } } },
  },
  responses: {
    200: {
      description: 'Обновлённый профиль.',
      content: { 'application/json': { schema: profileResponseSchema } },
    },
    400: {
      description: 'Некорректные поля профиля.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/favorites',
  summary: 'Получить избранное',
  tags: ['Favorites'],
  security: [{ SessionCookie: [] }],
  responses: {
    200: {
      description: 'Идентификаторы избранных товаров.',
      content: { 'application/json': { schema: favoritesResponseSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/favorites/merge',
  summary: 'Объединить избранное гостя с аккаунтом',
  description: 'Принимает до 100 идентификаторов товаров и возвращает итоговый список избранного.',
  tags: ['Favorites'],
  security: [{ SessionCookie: [] }],
  request: {
    body: { content: { 'application/json': { schema: mergeFavoritesBodySchema } } },
  },
  responses: {
    200: {
      description: 'Итоговый список избранного.',
      content: { 'application/json': { schema: favoritesResponseSchema } },
    },
    400: {
      description: 'Некорректный список идентификаторов.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/favorites/{productId}',
  summary: 'Добавить товар в избранное',
  tags: ['Favorites'],
  security: [{ SessionCookie: [] }],
  request: { params: productIdParamsSchema },
  responses: {
    204: { description: 'Товар добавлен в избранное.' },
    400: {
      description: 'Некорректный ID товара или товар не найден.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/favorites/{productId}',
  summary: 'Удалить товар из избранного',
  tags: ['Favorites'],
  security: [{ SessionCookie: [] }],
  request: { params: productIdParamsSchema },
  responses: {
    204: { description: 'Товар удалён из избранного.' },
    400: {
      description: 'Некорректный ID товара.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/cart',
  summary: 'Получить корзину',
  tags: ['Cart'],
  security: [{ SessionCookie: [] }],
  responses: {
    200: {
      description: 'Товары в корзине.',
      content: { 'application/json': { schema: cartResponseSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/cart',
  summary: 'Очистить корзину',
  tags: ['Cart'],
  security: [{ SessionCookie: [] }],
  responses: {
    204: { description: 'Корзина очищена.' },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/cart/merge',
  summary: 'Объединить корзину гостя с аккаунтом',
  description:
    'Принимает до 100 позиций. Количество суммируется с корзиной аккаунта и ограничивается 50 на товар; отсутствующие товары пропускаются.',
  tags: ['Cart'],
  security: [{ SessionCookie: [] }],
  request: { body: { content: { 'application/json': { schema: mergeCartBodySchema } } } },
  responses: {
    200: {
      description: 'Итоговая корзина.',
      content: { 'application/json': { schema: cartResponseSchema } },
    },
    400: {
      description: 'Некорректный список позиций.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/cart/{productId}',
  summary: 'Задать количество товара в корзине',
  description: 'Количество товара задаётся напрямую и должно быть от 1 до 50.',
  tags: ['Cart'],
  security: [{ SessionCookie: [] }],
  request: {
    params: productIdParamsSchema,
    body: { content: { 'application/json': { schema: updateCartItemBodySchema } } },
  },
  responses: {
    204: { description: 'Количество обновлено.' },
    400: {
      description: 'Некорректный ID, количество или товар не найден.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/cart/{productId}',
  summary: 'Удалить товар из корзины',
  tags: ['Cart'],
  security: [{ SessionCookie: [] }],
  request: { params: productIdParamsSchema },
  responses: {
    204: { description: 'Товар удалён из корзины.' },
    400: {
      description: 'Некорректный ID товара.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/bonus',
  summary: 'Получить бонусный баланс и историю',
  description:
    'Перед ответом сервер может начислить бонус активной акции за регистрацию; повторное начисление не дублируется.',
  tags: ['Bonus'],
  security: [{ SessionCookie: [] }],
  responses: {
    200: {
      description: 'Текущий баланс и транзакции, новые первыми.',
      content: { 'application/json': { schema: bonusResponseSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/orders',
  summary: 'Создать заказ',
  description:
    'Проверяет переданные позиции и цены по текущей корзине, рассчитывает итог на сервере и атомарно сохраняет заказ с удалением оформленных товаров из корзины. Повтор с тем же idempotencyKey возвращает существующий заказ.',
  tags: ['Orders'],
  security: [{ SessionCookie: [] }],
  request: {
    body: { content: { 'application/json': { schema: createOrderBodySchema } } },
  },
  responses: {
    200: {
      description: 'Заказ с таким ключом идемпотентности уже существует.',
      content: { 'application/json': { schema: orderResponseSchema } },
    },
    201: {
      description: 'Заказ создан.',
      content: { 'application/json': { schema: orderResponseSchema } },
    },
    400: {
      description: 'Некорректные данные заказа.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Запрос отклонён проверкой Origin.',
      content: { 'application/json': { schema: errorSchema } },
    },
    409: {
      description:
        'Заказ не создан: корзина пуста, изменилась после подтверждения или сумма превышает допустимый предел.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/orders',
  summary: 'Получить историю заказов',
  description:
    'Новые заказы идут первыми. Передайте nextCursor из предыдущего ответа для получения следующей страницы.',
  tags: ['Orders'],
  security: [{ SessionCookie: [] }],
  request: { query: listOrdersOpenApiQuerySchema },
  responses: {
    200: {
      description: 'Страница заказов и курсор следующей страницы, либо null.',
      content: { 'application/json': { schema: orderListResponseSchema } },
    },
    400: {
      description: 'Некорректные параметры пагинации.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/orders/{id}',
  summary: 'Получить заказ по ID',
  description:
    'Возвращает сохранённые данные заказа и его позиции в порядке lineNumber. Чужие заказы не раскрываются.',
  tags: ['Orders'],
  security: [{ SessionCookie: [] }],
  request: { params: orderParamsSchema },
  responses: {
    200: {
      description: 'Детали заказа.',
      content: { 'application/json': { schema: orderDetailsSchema } },
    },
    400: {
      description: 'Некорректный UUID заказа.',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Требуется активная сессия.',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Заказ не найден.',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Внутренняя ошибка сервера.',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

const generator = new OpenApiGeneratorV32(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: '3.2.0',
  info: {
    title: 'Burger Shop API',
    version: '1.0.0',
    description: 'REST API Burger Shop.',
  },
  servers: [{ url: '/api', description: 'Burger Shop API' }],
});
