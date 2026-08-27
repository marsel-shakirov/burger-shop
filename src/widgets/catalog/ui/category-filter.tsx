import { useState } from 'react';
const CATALOG_ITEMS = ['Все', 'Говядина', 'Курица', 'Рыба'];

export const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState(CATALOG_ITEMS[0]);

  return (
    <ul className="flex items-center gap-x-2.5">
      {CATALOG_ITEMS.map((item, index) => (
        <li
          onClick={() => setActiveCategory(item)}
          key={`${item}-${index}`}
          className={`cursor-pointer rounded-4xl px-[clamp(8px,4vw,29px)] py-2 text-[clamp(0.625rem,3vw,1rem)] font-bold transition-colors ${
            activeCategory === item ? 'bg-primary' : 'bg-accent hover:bg-primary/50'
          }`}
        >
          <button type="button" className="cursor-pointer">
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
};
