const SORT_OPTIONS = [
  { value: 'popular', label: 'популярности' },
  { value: 'price', label: 'по цене' },
  { value: 'alphabet', label: 'по алфавиту' },
];

export const SortSelect = () => {
  return (
    <div className="flex">
      <button
        type="button"
        popoverTarget="sort-menu"
        className="cursor-pointer text-[clamp(0.625rem,3vw,1rem)] font-bold [anchor-name:--sort]"
      >
        Сортировка по:&nbsp;&nbsp;
        <span className="border-b border-dashed text-orange-400">популярности</span>
      </button>

      <div
        id="sort-menu"
        popover="auto"
        className="inset-auto top-[anchor(bottom)] right-[anchor(right)] mt-2 rounded-[10px] shadow-(--shadow-base) [position-anchor:--sort]"
      >
        <ul className="py-3.25 text-[0.75rem] md:text-sm">
          {SORT_OPTIONS.map(({ value, label }, index) => (
            <li key={`${value}_${index}`}>
              <label>
                <input className="peer sr-only" type="radio" name="sort" value={`${value}`} />
                <span className="block cursor-pointer px-4 py-2 font-bold opacity-50 peer-checked:bg-orange-200/20 peer-checked:text-orange-500 peer-checked:opacity-100">
                  {label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
