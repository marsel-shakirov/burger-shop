import type { Product } from '../product.types';
import bigHitPng from './images/big-hit.png';
import bigHitWebp from './images/big-hit.webp';
import bigSpecialPng from './images/big-special.png';
import bigSpecialWebp from './images/big-special.webp';
import doubleBigHitPng from './images/double-big-hit.png';
import doubleBigHitWebp from './images/double-big-hit.webp';
import doubleCheeseburgerPng from './images/double-cheeseburger.png';
import doubleCheeseburgerWebp from './images/double-cheeseburger.webp';
import grandDeluxePng from './images/grand-deluxe.png';
import grandDeluxeWebp from './images/grand-deluxe.webp';
import hamburgerPng from './images/hamburger.png';
import hamburgerWebp from './images/hamburger.webp';
import triplePng from './images/triple-cheeseburger.png';
import tripleWebp from './images/triple-cheeseburger.webp';

export const productsMock: Product[] = [
  {
    id: 1,
    name: 'Гамбургер',
    description:
      'Рубленый бифштекс из натуральной цельной говядины на карамелизованной булочке, заправленной горчицей, кетчупом, луком и кусочком маринованного огурчика',
    gram: 97,
    price: 91,
    image: {
      png: hamburgerPng,
      webp: hamburgerWebp,
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
      png: triplePng,
      webp: tripleWebp,
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
      png: bigHitPng,
      webp: bigHitWebp,
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
      png: grandDeluxePng,
      webp: grandDeluxeWebp,
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
      png: doubleCheeseburgerPng,
      webp: doubleCheeseburgerWebp,
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
      png: doubleBigHitPng,
      webp: doubleBigHitWebp,
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
      png: bigSpecialPng,
      webp: bigSpecialWebp,
      alt: 'Биг Спешиал',
    },
  },
];
