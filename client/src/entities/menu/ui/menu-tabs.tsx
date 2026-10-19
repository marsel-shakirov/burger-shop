import type { Menu } from '../model/menu.types';

interface MenuTabsProps {
  menus: Menu[];
  selectedMenuSlug: string;
  onChange: (slug: string) => void;
}

export const MenuTabs = ({ menus, selectedMenuSlug, onChange }: MenuTabsProps) => {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Раздел меню</legend>

      <ul
        role="list"
        className="flex gap-1 rounded-full bg-white p-1 shadow-[0_1px_3px_rgb(0_0_0/0.08)] sm:w-fit"
      >
        {menus.map(({ id, name, slug }) => {
          return (
            <li key={id} className="flex-1 sm:flex-none">
              <label className="block">
                <input
                  onChange={() => onChange(slug)}
                  checked={selectedMenuSlug === slug}
                  type="radio"
                  className="peer sr-only"
                  value={slug}
                  name="menu"
                />
                <span className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4.5 text-base font-bold whitespace-nowrap text-stone-600 peer-focus-ring transition-colors duration-150 peer-checked:bg-stone-900 peer-checked:text-white peer-not-checked:hover:text-stone-900">
                  {name}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
};
