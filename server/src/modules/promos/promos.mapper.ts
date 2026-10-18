import { toProductImage } from '../products/products.mapper.ts';
import type { PromoRow } from './promos.types.ts';

function toPromoLink(promo: PromoRow) {
  if (!promo.menu_slug) return undefined;

  return {
    menu: promo.menu_slug,
    ...(promo.category_slug && { category: promo.category_slug }),
    ...(promo.product_id && { productId: promo.product_id }),
  };
}

function toPromoDetails(promo: PromoRow) {
  switch (promo.kind) {
    case 'coupon':
      return {
        kind: promo.kind,
        value: promo.value,
        valueCaption: promo.value_caption,
        code: promo.code,
      };
    case 'bonus':
      return {
        kind: promo.kind,
        value: promo.value,
        valueCaption: promo.value_caption,
        ctaLabel: promo.cta_label,
      };
  }
}

export function toPromoResponse(promo: PromoRow) {
  return {
    id: promo.id,
    title: promo.title,
    description: promo.description,
    terms: promo.terms,
    theme: promo.theme,
    link: toPromoLink(promo),
    ...(promo.image_path && toProductImage(promo.image_path)),
    ...toPromoDetails(promo),
  };
}
