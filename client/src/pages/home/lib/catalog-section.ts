import type {
  CatalogMenuGroup,
  CatalogSection,
  CatalogSectionPosition,
} from '../model/catalog.types';

export const getCatalogSectionId = ({ menuSlug, categorySlug }: CatalogSection) =>
  `catalog-${menuSlug}-${categorySlug}`;

export const isSameSection = (a: CatalogSection, b: CatalogSection) =>
  a.menuSlug === b.menuSlug && a.categorySlug === b.categorySlug;

export const getCatalogSections = (groups: CatalogMenuGroup[]): CatalogSection[] =>
  groups.flatMap(({ menu, categories }) =>
    categories.map(({ category }) => ({ menuSlug: menu.slug, categorySlug: category.slug })),
  );

export const resolveCatalogSection = (
  sections: CatalogSection[],
  menuSlug?: string,
  categorySlug?: string,
) => {
  if (!menuSlug) return undefined;

  const menuSections = sections.filter((section) => section.menuSlug === menuSlug);

  return menuSections.find((section) => section.categorySlug === categorySlug) ?? menuSections[0];
};

export const getSavedSection = (
  sections: CatalogSection[],
  menuSlug?: string,
  categorySlug?: string,
) => resolveCatalogSection(sections, menuSlug, categorySlug) ?? sections[0];

export const isFirstSection = (sections: CatalogSection[], section: CatalogSection) =>
  sections[0] !== undefined && isSameSection(sections[0], section);

export const findActiveSection = (
  positions: CatalogSectionPosition[],
  line: number,
  isAtBottom: boolean,
) => {
  if (isAtBottom) return positions.at(-1)?.section;

  return positions.findLast(({ top }) => top <= line)?.section ?? positions[0]?.section;
};
