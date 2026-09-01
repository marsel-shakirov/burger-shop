export const getProducts = async (categoryId?: string) => {
  const params = new URLSearchParams();

  if (categoryId && categoryId !== 'all') {
    params.set('categoryId', categoryId);
  }

  const query = params.size > 0 ? `?${params}` : '';
  const response = await fetch(`/api/products${query}`);

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  return response.json();
};
