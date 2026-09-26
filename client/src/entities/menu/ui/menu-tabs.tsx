import type { Menu } from '../model/menu.types';

interface MenuTabsProps {
  menus: Menu[];
  selectedMenuSlug: string;
  onChange: (slug: string) => void;
}

export const MenuTabs = ({ menus, selectedMenuSlug, onChange }: MenuTabsProps) => {
  return (
    <fieldset className="pt-2.5 sm:pt-5">
      <legend className="sr-only">Раздел меню»</legend>

      <ul role="list" className="flex gap-x-5">
        {menus.map(({ id, name, slug }) => (
          <li key={id}>
            <label className="group">
              <input
                onChange={() => onChange(slug)}
                checked={selectedMenuSlug === slug}
                type="radio"
                className="peer sr-only"
                value={slug}
                name="menu"
              />
              <span className="-mx-1 -my-1 block cursor-pointer rounded-md p-1 text-lg font-bold text-stone-600 peer-focus-ring transition-colors duration-150 peer-checked:text-stone-900 peer-not-checked:hover:text-stone-900">
                <span className="block border-b-2 border-transparent transition-colors duration-150 group-has-checked:border-orange-600">
                  {name}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};
