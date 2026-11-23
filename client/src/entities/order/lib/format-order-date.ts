const dateFormatter = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' });

export const formatOrderDate = (createdAt: string) => dateFormatter.format(new Date(createdAt));
