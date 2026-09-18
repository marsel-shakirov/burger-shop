export interface Category {
  id: number;
  slug: string;
  name: string;
}

export interface Menu {
  id: number;
  slug: string;
  name: string;
  categories: Category[];
}
