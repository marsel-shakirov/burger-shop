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
        className="cursor-pointer text-[clamp(10px,3vw,16px)] font-bold [anchor-name:--sort]"
      >
        Сортировка по:&nbsp;&nbsp;
        <span className="border-b border-dashed text-orange-400">популярности</span>
      </button>

      <div
        id="sort-menu"
        popover="auto"
        className="inset-auto top-[anchor(bottom)] right-[anchor(right)] mt-2 rounded-[10px] shadow-xl/10 [position-anchor:--sort]"
      >
        <ul className="py-3.25 text-[14px]">
          {SORT_OPTIONS.map(({ value, label }, index) => (
            <li key={`${value}_${index}`}>
              <label>
                <input className="peer sr-only" type="radio" name="sort" value={`${value}`} />
                <span className="block cursor-pointer px-4 py-2 font-bold opacity-50 peer-checked:bg-orange-200/20 peer-checked:text-[#FE5F1E] peer-checked:opacity-100">
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
