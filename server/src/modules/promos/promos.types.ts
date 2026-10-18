export type PromoTheme = 'mustard' | 'pickle' | 'ketchup';

interface PromoRowBase {
  id: number;
  title: string;
  description: string;
  terms: string;
  theme: PromoTheme;
  image_path: string | null;
  product_id: number | null;
  menu_slug: string | null;
  category_slug: string | null;
}

interface CouponPromoRow extends PromoRowBase {
  kind: 'coupon';
  value: string;
  value_caption: string;
  code: string;
}

interface BonusPromoRow extends PromoRowBase {
  kind: 'bonus';
  value: string;
  value_caption: string;
  cta_label: string;
}

export type PromoRow = CouponPromoRow | BonusPromoRow;
