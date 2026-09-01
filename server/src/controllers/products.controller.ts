import type { NextFunction, Request, Response } from 'express';

const MOCK_API_URL = 'https://6a58f0ff68601fc330e98c3a.mockapi.io/products';

const CATEGORY_IDS = new Set(['fish', 'beef', 'chicken']);

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;

    if (categoryId && !CATEGORY_IDS.has(categoryId)) {
      res.status(400).json({ message: `Unknown categoryId: ${categoryId}` });
      return;
    }

    const url = new URL(MOCK_API_URL);

    if (categoryId) {
      url.searchParams.set('categoryId', categoryId);
    }

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
