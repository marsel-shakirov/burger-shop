import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { getPrefersReducedMotion } from '@/shared/lib';

import {
  findActiveSection,
  getCatalogSectionId,
  getCatalogSections,
  getSavedSection,
  isFirstSection,
  isSameSection,
  resolveCatalogSection,
} from '../lib/catalog-section';
import type { CatalogMenuGroup, CatalogSection, CatalogSectionPosition } from './catalog.types';
import { useCatalogParams } from './use-catalog-params';
import { useProgrammaticScroll } from './use-programmatic-scroll';

const getScrollBehavior = (): ScrollBehavior => (getPrefersReducedMotion() ? 'instant' : 'smooth');

const getSectionElement = (section: CatalogSection) =>
  document.getElementById(getCatalogSectionId(section));

const getSectionPositions = (sections: CatalogSection[]): CatalogSectionPosition[] =>
  sections.flatMap((section) => {
    const element = getSectionElement(section);
    return element ? [{ section, top: element.getBoundingClientRect().top }] : [];
  });

const isScrolledToBottom = () =>
  window.scrollY > 0 &&
  window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;

const getVisibleSection = (sections: CatalogSection[], bar: HTMLElement | null) => {
  const line = (bar?.getBoundingClientRect().bottom ?? 0) + 1;
  return findActiveSection(getSectionPositions(sections), line, isScrolledToBottom());
};

export const useCatalogScroll = (groups: CatalogMenuGroup[] | undefined) => {
  const barRef = useRef<HTMLDivElement>(null);
  const hasInitialScrollRef = useRef(false);
  const [currentSection, setCurrentSection] = useState<CatalogSection>();
  const {
    menuSlug,
    categorySlug,
    selectMenu: saveMenu,
    selectCategory: saveCategory,
    clearSelection,
  } = useCatalogParams();

  const isLoaded = groups !== undefined;
  const sections = groups ? getCatalogSections(groups) : [];
  const savedSection = getSavedSection(sections, menuSlug, categorySlug);
  const activeSection = currentSection ?? savedSection;

  const saveSection = (section: CatalogSection) => {
    if (isFirstSection(sections, section)) clearSelection();
    else saveCategory(section);
  };

  const followVisibleSection = () => {
    const next = getVisibleSection(sections, barRef.current);
    setCurrentSection((prev) => (prev && next && isSameSection(prev, next) ? prev : next));
  };

  const saveVisibleSection = () => {
    const section = getVisibleSection(sections, barRef.current);
    if (!section || (savedSection && isSameSection(section, savedSection))) return;

    saveSection(section);
  };

  const { scrollTo } = useProgrammaticScroll({
    onUserScroll: followVisibleSection,
    onUserScrollEnd: saveVisibleSection,
  });

  const scrollToSection = (section: CatalogSection, behavior: ScrollBehavior) => {
    const element = getSectionElement(section);
    if (!element) return;

    const offset = barRef.current?.offsetHeight ?? 0;
    scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - offset, behavior });
  };

  const selectSection = (section: CatalogSection) => {
    setCurrentSection(section);
    scrollToSection(section, getScrollBehavior());
  };

  const selectMenu = (slug: string) => {
    const section = resolveCatalogSection(sections, slug);
    if (!section) return;

    if (isFirstSection(sections, section)) clearSelection();
    else saveMenu(slug);
    selectSection(section);
  };

  const selectCategory = (section: CatalogSection) => {
    saveSection(section);
    selectSection(section);
  };

  const scrollToInitialSection = useEffectEvent(() => {
    if (!isLoaded || hasInitialScrollRef.current) return;
    hasInitialScrollRef.current = true;

    const section = resolveCatalogSection(sections, menuSlug, categorySlug);
    if (section) scrollToSection(section, 'instant');
  });

  useEffect(() => {
    scrollToInitialSection();
  }, [isLoaded]);

  return { barRef, activeSection, selectMenu, selectCategory };
};
