export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  gram: number;
  image: {
    png: string;
    webp?: string;
    alt: string;
  };
}
