import { type RefObject, useEffect, useEffectEvent } from 'react';

import { findActiveSection, getCatalogSectionId } from '../lib/catalog-section';
import type { CatalogSection, CatalogSectionPosition } from './catalog.types';
import type { ScrollLock } from './use-scroll-lock';

interface SectionSpyOptions {
  sections: CatalogSection[];
  barRef: RefObject<HTMLElement | null>;
  scrollLock: ScrollLock;
  onChange: (section: CatalogSection | undefined) => void;
}

const getSectionPositions = (sections: CatalogSection[]): CatalogSectionPosition[] =>
  sections.flatMap((section) => {
    const element = document.getElementById(getCatalogSectionId(section));
    return element ? [{ section, top: element.getBoundingClientRect().top }] : [];
  });

const isScrolledToBottom = () =>
  window.scrollY > 0 &&
  window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;

export const useSectionSpy = ({ sections, barRef, scrollLock, onChange }: SectionSpyOptions) => {
  const handleScroll = useEffectEvent(() => {
    if (scrollLock.isLocked()) {
      scrollLock.lock();
      return;
    }

    const line = (barRef.current?.getBoundingClientRect().bottom ?? 0) + 1;
    onChange(findActiveSection(getSectionPositions(sections), line, isScrolledToBottom()));
  });

  const handleScrollEnd = useEffectEvent(() => scrollLock.unlock());

  useEffect(() => {
    const onScroll = () => handleScroll();
    const onScrollEnd = () => handleScrollEnd();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
    };
  }, []);
};
