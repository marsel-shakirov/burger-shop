import type { Menu } from '../model/menu.types';

interface MenuTabsProps {
  menus: Menu[];
  selectedMenuSlug: string;
  onChange: (slug: string) => void;
}

export const MenuTabs = ({ menus, selectedMenuSlug, onChange }: MenuTabsProps) => {
  return (
    <fieldset className="pt-2.5 sm:pt-5">
      <legend className="sr-only">Меню</legend>

      <ul role="list" className="flex gap-x-5">
        {menus.map(({ id, name, slug }) => (
          <li key={id}>
            <label>
              <input
                onChange={() => onChange(slug)}
                checked={selectedMenuSlug === slug}
                type="radio"
                className="peer sr-only"
                value={slug}
                name="menu"
              />
              <span className="block cursor-pointer border-b-2 border-transparent text-lg font-bold text-stone-400 peer-focus-ring transition-colors duration-300 peer-checked:border-orange-500 peer-checked:text-stone-900 peer-not-checked:hover:text-orange-500">
                {name}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};
