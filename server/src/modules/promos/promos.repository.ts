import { pool } from '../../db.ts';
import type { PromoRow } from './promos.types.ts';

export async function findActivePromos(): Promise<PromoRow[]> {
  const result = await pool.query<PromoRow>(
    `SELECT
       promos.id,
       promos.kind,
       promos.title,
       promos.description,
       promos.terms,
       promos.theme,
       promos.image_path,
       promos.value,
       promos.value_caption,
       promos.code,
       promos.cta_label,
       promos.product_id,
       COALESCE(menus.slug, category_menus.slug, product_menus.slug) AS menu_slug,
       COALESCE(categories.slug, product_categories.slug) AS category_slug
     FROM promos
     LEFT JOIN products ON products.id = promos.product_id
     LEFT JOIN categories AS product_categories ON product_categories.id = products.category_id
     LEFT JOIN menus AS product_menus ON product_menus.id = product_categories.menu_id
     LEFT JOIN categories ON categories.id = promos.category_id
     LEFT JOIN menus AS category_menus ON category_menus.id = categories.menu_id
     LEFT JOIN menus ON menus.id = promos.menu_id
     WHERE promos.starts_at <= now()
       AND (promos.ends_at IS NULL OR promos.ends_at > now())
     ORDER BY promos.sort_order, promos.id`,
  );

  return result.rows;
}
