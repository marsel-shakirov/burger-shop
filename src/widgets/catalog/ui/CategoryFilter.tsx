const CATALOG_ITEMS = ['Все', 'Говядина', 'Курица', 'Рыба'];

export const CategoryFilter = () => {
  return (
    <ul className="flex items-center gap-x-2.5">
      {CATALOG_ITEMS.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="cursor-pointer rounded-4xl bg-[#F9F9F9] px-7.25 py-2 font-bold"
        >
          <a href="#">{item}</a>
        </li>
      ))}
    </ul>
  );
};
