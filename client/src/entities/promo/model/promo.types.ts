export type PromoTheme = 'mustard' | 'pickle' | 'ketchup';

export interface PromoLink {
  menu: string;
  category?: string;
  productId?: number;
}

interface PromoBase {
  id: number;
  title: string;
  description: string;
  terms: string;
  theme: PromoTheme;
  value: string;
  valueCaption: string;
  link?: PromoLink;
  imageUrl?: string;
  imageSrcSet?: string;
}

export interface CouponPromo extends PromoBase {
  kind: 'coupon';
  code: string;
}

export interface BonusPromo extends PromoBase {
  kind: 'bonus';
  ctaLabel: string;
}

export type Promo = CouponPromo | BonusPromo;
