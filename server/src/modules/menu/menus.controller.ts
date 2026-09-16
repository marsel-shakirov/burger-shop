import type { Request, Response } from 'express';

import { pool } from '../../db.ts';

export async function getMenus(_req: Request, res: Response) {
  const menus = await pool.query(
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

  res.json(menus.rows);
}
