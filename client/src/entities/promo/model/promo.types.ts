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
  link?: PromoLink;
  imageUrl?: string;
  imageSrcSet?: string;
}

export interface CouponPromo extends PromoBase {
  kind: 'coupon';
  value: string;
  valueCaption: string;
  code: string;
}

export interface BonusPromo extends PromoBase {
  kind: 'bonus';
  value: string;
  valueCaption: string;
  ctaLabel: string;
}

export type Promo = CouponPromo | BonusPromo;
