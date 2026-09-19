import { pool } from '../../db.ts';

interface MenuRow {
  id: number;
  slug: string;
  name: string;
  categories: { id: number; slug: string; name: string }[];
}

export async function findMenus(): Promise<MenuRow[]> {
  const result = await pool.query<MenuRow>(
    `SELECT
       menus.id,
       menus.slug,
       menus.name,
       COALESCE(
         json_agg(
           json_build_object('id', categories.id, 'slug', categories.slug, 'name', categories.name)
           ORDER BY categories.id
         ) FILTER (WHERE categories.id IS NOT NULL),
         '[]'
       ) AS categories
     FROM menus
     LEFT JOIN categories ON categories.menu_id = menus.id
     GROUP BY menus.id
     ORDER BY menus.id`,
  );

  return result.rows;
}
