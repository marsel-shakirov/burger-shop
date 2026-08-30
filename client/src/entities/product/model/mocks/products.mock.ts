import type { Product } from '../product.types';
import bigHitPng from './images/card/big-hit.png';
import bigHitWebp from './images/card/big-hit.webp';
import bigSpecialPng from './images/card/big-special.png';
import bigSpecialWebp from './images/card/big-special.webp';
import doubleBigHitPng from './images/card/double-big-hit.png';
import doubleBigHitWebp from './images/card/double-big-hit.webp';
import doubleCheeseburgerPng from './images/card/double-cheeseburger.png';
import doubleCheeseburgerWebp from './images/card/double-cheeseburger.webp';
import grandDeluxePng from './images/card/grand-deluxe.png';
import grandDeluxeWebp from './images/card/grand-deluxe.webp';
import hamburgerPng from './images/card/hamburger.png';
import hamburgerWebp from './images/card/hamburger.webp';
import triplePng from './images/card/triple-cheeseburger.png';
import tripleWebp from './images/card/triple-cheeseburger.webp';
import bigHitCartPng from './images/cart/big-hit.png';
import bigHitCartWebp from './images/cart/big-hit.webp';
import bigSpecialCartPng from './images/cart/big-special.png';
import bigSpecialCartWebp from './images/cart/big-special.webp';
import doubleBigHitCartPng from './images/cart/double-big-hit.png';
import doubleBigHitCartWebp from './images/cart/double-big-hit.webp';
import doubleCheeseburgerCartPng from './images/cart/double-cheeseburger.png';
import doubleCheeseburgerCartWebp from './images/cart/double-cheeseburger.webp';
import grandDeluxeCartPng from './images/cart/grand-deluxe.png';
import grandDeluxeCartWebp from './images/cart/grand-deluxe.webp';
import hamburgerCartPng from './images/cart/hamburger.png';
import hamburgerCartWebp from './images/cart/hamburger.webp';
import tripleCartPng from './images/cart/triple-cheeseburger.png';
import tripleCartWebp from './images/cart/triple-cheeseburger.webp';

export const productsMock: Product[] = [
  {
    id: 1,
    name: 'Гамбургер',
    description:
      'Рубленый бифштекс из натуральной цельной говядины на карамелизованной булочке, заправленной горчицей, кетчупом, луком и кусочком маринованного огурчика',
    gram: 97,
    price: 91,
    image: {
      card: {
        png: hamburgerPng,
        webp: hamburgerWebp,
      },
      cart: {
        png: hamburgerCartPng,
        webp: hamburgerCartWebp,
      },
      alt: 'Бургер с говяжьей котлетой',
    },
  },
  {
    id: 2,
    name: 'Тройной Чизбургер Три Сыра',
    description:
      'Три сочных бифштекса из натуральной цельной говядины с тремя видами сыра: Чеддер, Эмменталь и пикантный сыр твердых сортов. А еще лук и два кусочка хрустящего маринованного огурчика на классической карамелизованной булочке, заправленные кетчупом и горчицей',
    gram: 202,
    price: 262,
    image: {
      card: {
        png: triplePng,
        webp: tripleWebp,
      },
      cart: {
        png: tripleCartPng,
        webp: tripleCartWebp,
      },
      alt: 'Тройной Чизбургер Три Сыра',
    },
  },

  {
    id: 3,
    name: 'Биг Хит',
    description:
      'Легендарный бургер с двумя рублеными бифштексами из 100% говядины, маринованными огурчиками, свежим салатом «Айсберг», ломтиком плавленого сыра Чеддер и специальным соусом «Биг Хит» на новой булочке с двумя видами кунжута',
    gram: 216,
    price: 221,
    image: {
      card: {
        png: bigHitPng,
        webp: bigHitWebp,
      },
      cart: {
        png: bigHitCartPng,
        webp: bigHitCartWebp,
      },
      alt: 'Биг Хит',
    },
  },

  {
    id: 4,
    name: 'Гранд Де Люкс',
    description:
      'Сочный бифштекс из натуральной говядины, приготовленный на гриле, карамелизованная булочка с кунжутом, два ломтика сыра Чеддер, свежий салат, кусочек помидора и лук, маринованные огурчики, кетчуп, горчица и специальный соус',
    gram: 240,
    price: 269,
    image: {
      card: {
        png: grandDeluxePng,
        webp: grandDeluxeWebp,
      },
      cart: {
        png: grandDeluxeCartPng,
        webp: grandDeluxeCartWebp,
      },
      alt: 'Гранд Де Люкс',
    },
  },

  {
    id: 5,
    name: 'Двойной Чизбургер',
    description:
      'Два рубленых бифштекса из натуральной цельной говядины с двумя кусочками сыра Чеддер на карамелизованной булочке, заправленной горчицей, кетчупом, луком и двумя кусочками маринованного огурчика',
    gram: 158,
    price: 183,
    image: {
      card: {
        png: doubleCheeseburgerPng,
        webp: doubleCheeseburgerWebp,
      },
      cart: {
        png: doubleCheeseburgerCartPng,
        webp: doubleCheeseburgerCartWebp,
      },

      alt: 'Тройной Чизбургер Три Сыра',
    },
  },

  {
    id: 6,
    name: 'Двойной Биг Хит',
    description:
      'Большой бургер с четырьмя рублеными бифштексами из 100% говядины, маринованными огурчиками, свежим салатом «Айсберг», ломтиком плавленого сыра Чеддер и специальным соусом «Биг Хит» на новой булочке с двумя видами кунжута',
    gram: 311,
    price: 284,
    image: {
      card: {
        png: doubleBigHitPng,
        webp: doubleBigHitWebp,
      },
      cart: {
        png: doubleBigHitCartPng,
        webp: doubleBigHitCartWebp,
      },

      alt: 'Двойной Биг Хит',
    },
  },

  {
    id: 7,
    name: 'Биг Спешиал',
    description:
      'Это неповторимый сандвич с большим рубленым бифштексом из 100% отборной говядины на большой булочке с кунжутом. Особенный вкус сандвичу придают три кусочка сыра Эмменталь, два ломтика помидора, свежий салат, лук и соус с дымком',
    gram: 326,
    price: 335,
    image: {
      card: {
        png: bigSpecialPng,
        webp: bigSpecialWebp,
      },
      cart: {
        png: bigSpecialCartPng,
        webp: bigSpecialCartWebp,
      },
      alt: 'Биг Спешиал',
    },
  },
];
