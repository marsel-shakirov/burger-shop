import { useQuery } from '@tanstack/react-query';

const ALL_CATEGORY = {
  id: 'all',
  name: 'Все',
  category: 'all',
};

interface CategoryFilterProps {
  activeCategory: string;
  onClick: (category: string) => void;
}

export const CategoryFilter = ({ activeCategory, onClick }: CategoryFilterProps) => {
  const getCategories = async () => {
    const response = await fetch('/api/categories');

    if (!response.ok) {
      throw new Error('Failed to load categories');
    }

    return response.json();
  };

  const { isPending, data } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isPending) {
    return <div>Hello</div>;
  }

  const categories = [ALL_CATEGORY, ...data];

  return (
    <ul className="flex items-center gap-x-2.5">
      {categories.map(({ id, name, category }) => (
        <li
          onClick={() => onClick(category)}
          key={id}
          className={`cursor-pointer rounded-4xl px-[clamp(8px,4vw,29px)] py-2 text-[clamp(0.625rem,3vw,1rem)] font-bold transition-colors ${
            activeCategory === category ? 'bg-primary' : 'bg-accent hover:bg-primary/50'
          }`}
        >
          <button type="button" className="cursor-pointer">
            {name}
          </button>
        </li>
      ))}
    </ul>
  );
};
