import { PRODUCT_SORT_COLUMNS } from './products.constants.ts';
import { toProductResponse } from './products.mapper.ts';
import { findProducts } from './products.repository.ts';
import type { GetProductQuery } from './products.schema.ts';

export async function getProductsUseCase(query: GetProductQuery) {
  const rows = await findProducts({
    menu: query.menu,
    category: query.category,
    orderColumn: PRODUCT_SORT_COLUMNS[query.sort],
    order: query.order,
  });

  return rows.map(toProductResponse);
}
