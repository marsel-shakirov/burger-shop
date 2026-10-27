import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { getPrefersReducedMotion } from '@/shared/lib';

import {
  getActiveSection,
  getCatalogSectionId,
  getCatalogSections,
  isSameSection,
  resolveCatalogSection,
} from '../lib/catalog-section';
import type { CatalogMenuGroup, CatalogSection } from './catalog.types';
import { useCatalogParams } from './use-catalog-params';
import { useScrollLock } from './use-scroll-lock';
import { useSectionSpy } from './use-section-spy';

const getScrollBehavior = (): ScrollBehavior => (getPrefersReducedMotion() ? 'instant' : 'smooth');

const getSectionElement = (section: CatalogSection) =>
  document.getElementById(getCatalogSectionId(section));

const scrollToElement = (element: Element, offset: number, behavior: ScrollBehavior) =>
  window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - offset, behavior });

export const useCatalogScroll = (groups: CatalogMenuGroup[] | undefined) => {
  const barRef = useRef<HTMLDivElement>(null);
  const hasInitialScrollRef = useRef(false);
  const [currentSection, setCurrentSection] = useState<CatalogSection>();
  const {
    menuSlug,
    categorySlug,
    selectMenu: saveMenu,
    selectCategory: saveCategory,
  } = useCatalogParams();
  const scrollLock = useScrollLock();

  const sections = groups ? getCatalogSections(groups) : [];
  const activeSection = getActiveSection(sections, currentSection, menuSlug, categorySlug);

  const scrollToSection = (section: CatalogSection, behavior: ScrollBehavior) => {
    const element = getSectionElement(section);
    if (!element) return;

    scrollLock.lock();
    scrollToElement(element, barRef.current?.offsetHeight ?? 0, behavior);
  };

  const selectSection = (section: CatalogSection) => {
    setCurrentSection(section);
    scrollToSection(section, getScrollBehavior());
  };

  const selectMenu = (slug: string) => {
    const section = resolveCatalogSection(sections, slug);
    if (!section) return;

    saveMenu(slug);
    selectSection(section);
  };

  const selectCategory = (section: CatalogSection) => {
    saveCategory(section);
    selectSection(section);
  };

  const followSpiedSection = (next: CatalogSection | undefined) =>
    setCurrentSection((prev) => (prev && next && isSameSection(prev, next) ? prev : next));

  const scrollToInitialSection = useEffectEvent(() => {
    if (!groups || hasInitialScrollRef.current) return;
    hasInitialScrollRef.current = true;

    const section = resolveCatalogSection(sections, menuSlug, categorySlug);
    if (section) scrollToSection(section, 'instant');
  });

  useEffect(() => {
    scrollToInitialSection();
  }, [groups]);

  useSectionSpy({ sections, barRef, scrollLock, onChange: followSpiedSection });

  return { barRef, activeSection, selectMenu, selectCategory };
};
