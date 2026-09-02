import type { NextFunction, Request, Response } from 'express';

const MOCK_API_URL = 'https://6a58f0ff68601fc330e98c3a.mockapi.io/products';

const CATEGORY_IDS = new Set(['fish', 'beef', 'chicken']);

const PRODUCT_SORT_OPTIONS = ['popularity', 'price', 'rating'] as const;

type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number];
type ProductCategory = (typeof PRODUCT_SORT_OPTIONS)[number];

const isProductCategory = (value: unknown): value is ProductCategory => {
  return typeof value === 'string' && CATEGORY_IDS.has(value);
};

const isProductSort = (value: unknown): value is ProductSort => {
  return typeof value === 'string' && PRODUCT_SORT_OPTIONS.includes(value as ProductSort);
};

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const categoryId = req.query.categoryId;

    const sortBy = req.query.sortBy ?? 'popularity';

    if (!isProductSort(sortBy)) {
      res.status(400).json({ message: `Invalid sortBy value: ${sortBy}` });
      return;
    }

    if (categoryId && !isProductCategory(categoryId)) {
      res.status(400).json({ message: `Invalid categoryId value: ${categoryId}` });
      return;
    }

    const url = new URL(MOCK_API_URL);

    if (categoryId) {
      url.searchParams.set('categoryId', categoryId);
    }

    url.searchParams.set('sortBy', sortBy);

    const response = await fetch(url);

    if (!response.ok) {
      res.status(502).json({ message: 'MockAPI request failed' });
      return;
    }

    const products = await response.json();

    res.json(products);
  } catch (error) {
    next(error);
  }
}
