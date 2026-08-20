interface ImageSource {
  png: string;
  webp?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  gram: number;
  image: {
    card: ImageSource;
    cart: ImageSource;
    alt: string;
  };
}
