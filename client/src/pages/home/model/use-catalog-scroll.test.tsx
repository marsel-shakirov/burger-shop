import { act, renderHook } from '@testing-library/react';
import { useLocation } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { SCROLL_IDLE_TIMEOUT_MS } from '../config/catalog.constants';
import type { CatalogMenuGroup } from './catalog.types';
import { useCatalogScroll } from './use-catalog-scroll';

const beef = { id: 11, slug: 'beef', name: 'Говядина' };
const chicken = { id: 12, slug: 'chicken', name: 'Курица' };
const cola = { id: 21, slug: 'cola', name: 'Кола' };

const groups: CatalogMenuGroup[] = [
  {
    menu: { id: 1, slug: 'burgers', name: 'Бургеры', categories: [beef, chicken] },
    categories: [
      { category: beef, products: [] },
      { category: chicken, products: [] },
    ],
  },
  {
    menu: { id: 2, slug: 'drinks', name: 'Напитки', categories: [cola] },
    categories: [{ category: cola, products: [] }],
  },
];

const BAR_HEIGHT = 80;

const setTop = (element: Element, top: number) => {
  element.getBoundingClientRect = () => ({ top, bottom: top }) as DOMRect;
};

const addSection = (id: string, top: number) => {
  const element = document.createElement('section');
  element.id = id;
  setTop(element, top);
  document.body.append(element);
  return element;
};

const createBar = () => {
  const bar = document.createElement('div');
  Object.defineProperty(bar, 'offsetHeight', { value: BAR_HEIGHT });
  bar.getBoundingClientRect = () => ({ top: 0, bottom: BAR_HEIGHT }) as DOMRect;
  return bar;
};

const render = (initialEntry = '/', isLoaded = true) => {
  const hook = renderHook(
    ({ groups }) => {
      const scroll = useCatalogScroll(groups);
      scroll.barRef.current ??= createBar();
      return { scroll, location: useLocation() };
    },
    {
      initialProps: { groups: isLoaded ? groups : undefined },
      wrapper: createWrapper({ initialEntries: [initialEntry] }),
    },
  );

  return hook;
};

const scroll = () => {
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
};

const scrollEnd = () => {
  act(() => {
    window.dispatchEvent(new Event('scrollend'));
  });
};

const sections: Record<string, HTMLElement> = {};

let scrollTo: ReturnType<typeof vi.fn>;

beforeEach(() => {
  sections.beef = addSection('catalog-burgers-beef', 300);
  sections.chicken = addSection('catalog-burgers-chicken', 900);
  sections.cola = addSection('catalog-drinks-cola', 1500);
  scrollTo = vi.fn();
  vi.stubGlobal('scrollTo', scrollTo);
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('useCatalogScroll: активный раздел', () => {
  it('без раздела в адресе активна первая категория', () => {
    const { result } = render();

    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'beef',
    });
  });

  it('берёт раздел из адреса', () => {
    const { result } = render('/?menu=burgers&category=chicken');

    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'chicken',
    });
  });

  it('пока товары не загружены, активного раздела нет', () => {
    const { result } = render('/', false);

    expect(result.current.scroll.activeSection).toBeUndefined();
  });
});

describe('useCatalogScroll: прокрутка при открытии', () => {
  it('прокручивает к разделу из адреса без анимации с учётом высоты панели', () => {
    render('/?menu=drinks');

    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({
      top: 1500 - BAR_HEIGHT,
      behavior: 'instant',
    });
  });

  it('без раздела в адресе не прокручивает', () => {
    render();

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('ждёт загрузки товаров и прокручивает один раз', () => {
    const { rerender } = render('/?menu=burgers&category=chicken', false);
    expect(scrollTo).not.toHaveBeenCalled();

    rerender({ groups });
    rerender({ groups: [...groups] });

    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({
      top: 900 - BAR_HEIGHT,
      behavior: 'instant',
    });
  });
});

describe('useCatalogScroll: выбор в панели', () => {
  it('выбор меню записывает его в адрес, делает активной первую категорию и прокручивает', () => {
    const { result } = render('/?menu=burgers&category=chicken');

    act(() => result.current.scroll.selectMenu('drinks'));

    expect(result.current.location.search).toBe('?menu=drinks');
    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'drinks',
      categorySlug: 'cola',
    });
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1500 - BAR_HEIGHT, behavior: 'smooth' });
  });

  it('выбор первого меню очищает адрес', () => {
    const { result } = render('/?menu=drinks&category=cola');

    act(() => result.current.scroll.selectMenu('burgers'));

    expect(result.current.location.search).toBe('');
    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'beef',
    });
  });

  it('выбор первой категории очищает адрес', () => {
    const { result } = render('/?menu=drinks&category=cola');

    act(() => result.current.scroll.selectCategory({ menuSlug: 'burgers', categorySlug: 'beef' }));

    expect(result.current.location.search).toBe('');
  });

  it('неизвестное меню ничего не меняет', () => {
    const { result } = render();

    act(() => result.current.scroll.selectMenu('desserts'));

    expect(result.current.location.search).toBe('');
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('выбор категории записывает её в адрес и прокручивает', () => {
    const { result } = render();

    act(() =>
      result.current.scroll.selectCategory({ menuSlug: 'burgers', categorySlug: 'chicken' }),
    );

    expect(result.current.location.search).toBe('?menu=burgers&category=chicken');
    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'chicken',
    });
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 900 - BAR_HEIGHT, behavior: 'smooth' });
  });

  it('при включённом уменьшении движения прокручивает без анимации', () => {
    const matchMedia = vi
      .spyOn(window, 'matchMedia')
      .mockReturnValue({ matches: true } as MediaQueryList);
    const { result } = render();

    act(() => result.current.scroll.selectCategory({ menuSlug: 'drinks', categorySlug: 'cola' }));

    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1500 - BAR_HEIGHT, behavior: 'instant' });
    matchMedia.mockRestore();
  });

  it('если раздела нет на странице, не прокручивает', () => {
    sections.chicken?.remove();
    const { result } = render();

    act(() =>
      result.current.scroll.selectCategory({ menuSlug: 'burgers', categorySlug: 'chicken' }),
    );

    expect(scrollTo).not.toHaveBeenCalled();
  });
});

describe('useCatalogScroll: прокрутка страницы', () => {
  it('делает активной категорию, которая дошла до панели', () => {
    const { result } = render();

    setTop(sections.beef!, -500);
    setTop(sections.chicken!, BAR_HEIGHT);
    scroll();

    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'chicken',
    });

    setTop(sections.chicken!, -500);
    setTop(sections.cola!, 20);
    scroll();
    scroll();

    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'drinks',
      categorySlug: 'cola',
    });
  });

  it('в конце страницы делает активной последнюю категорию', () => {
    const { result } = render();
    vi.stubGlobal('scrollY', 2000);
    vi.stubGlobal('innerHeight', 800);
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2800,
      configurable: true,
    });

    setTop(sections.beef!, -1500);
    setTop(sections.chicken!, -900);
    setTop(sections.cola!, 400);
    scroll();

    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'drinks',
      categorySlug: 'cola',
    });
    Reflect.deleteProperty(document.documentElement, 'scrollHeight');
  });

  it('пропускает разделы, которых нет на странице', () => {
    const { result } = render();

    sections.beef?.remove();
    setTop(sections.chicken!, 500);
    scroll();

    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'chicken',
    });
  });
});

describe('useCatalogScroll: адрес после прокрутки', () => {
  it('когда прокрутка закончилась, записывает раздел в адрес', () => {
    const { result } = render();

    setTop(sections.beef!, -500);
    setTop(sections.chicken!, BAR_HEIGHT);
    scroll();

    expect(result.current.location.search).toBe('');

    scrollEnd();

    expect(result.current.location.search).toBe('?menu=burgers&category=chicken');
  });

  it('при возврате к первому разделу очищает адрес', () => {
    const { result } = render('/?menu=drinks&category=cola');
    scrollEnd();

    setTop(sections.beef!, 500);
    scroll();
    scrollEnd();

    expect(result.current.location.search).toBe('');
  });

  it('если раздел в адресе тот же, адрес не перезаписывает', () => {
    const { result } = render('/?menu=burgers&category=chicken');
    const { key } = result.current.location;

    setTop(sections.beef!, -500);
    setTop(sections.chicken!, BAR_HEIGHT);
    scroll();
    scrollEnd();

    expect(result.current.location.key).toBe(key);
  });

  it('раздел без категории в адресе считает тем же, что первая категория меню', () => {
    const { result } = render('/?menu=drinks');
    const { key } = result.current.location;

    setTop(sections.chicken!, -500);
    setTop(sections.cola!, BAR_HEIGHT);
    scroll();
    scrollEnd();

    expect(result.current.location.key).toBe(key);
  });

  it('после прокрутки к выбранному разделу адрес не меняет', () => {
    const { result } = render();
    const cola = { menuSlug: 'drinks', categorySlug: 'cola' };

    act(() => result.current.scroll.selectCategory(cola));
    setTop(sections.chicken!, 0);
    setTop(sections.cola!, 600);
    scroll();
    scrollEnd();

    expect(result.current.location.search).toBe('?menu=drinks&category=cola');
  });
});

describe('useCatalogScroll: блокировка после выбора', () => {
  it('во время прокрутки после выбора не переключает раздел до scrollend', () => {
    const { result } = render();
    const cola = { menuSlug: 'drinks', categorySlug: 'cola' };

    act(() => result.current.scroll.selectCategory(cola));
    setTop(sections.chicken!, 0);
    setTop(sections.cola!, 600);
    scroll();

    expect(result.current.scroll.activeSection).toEqual(cola);

    scrollEnd();
    scroll();

    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'chicken',
    });
  });

  it('пока прокрутка после выбора продолжается, не переключает раздел дольше таймера', () => {
    vi.useFakeTimers();
    const { result } = render();
    const cola = { menuSlug: 'drinks', categorySlug: 'cola' };

    act(() => result.current.scroll.selectCategory(cola));
    setTop(sections.chicken!, 0);
    setTop(sections.cola!, 600);
    for (let step = 0; step < 5; step += 1) {
      act(() => {
        vi.advanceTimersByTime(SCROLL_IDLE_TIMEOUT_MS - 1);
      });
      scroll();
    }

    expect(result.current.scroll.activeSection).toEqual(cola);
  });

  it('снимает блокировку, когда прокрутка затихла, если scrollend не пришёл', () => {
    vi.useFakeTimers();
    const { result } = render();

    act(() => result.current.scroll.selectCategory({ menuSlug: 'drinks', categorySlug: 'cola' }));
    act(() => {
      vi.advanceTimersByTime(SCROLL_IDLE_TIMEOUT_MS);
    });
    setTop(sections.chicken!, 0);
    setTop(sections.cola!, 600);
    scroll();

    expect(result.current.scroll.activeSection).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'chicken',
    });
  });

  it('после размонтирования не слушает прокрутку', () => {
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render();

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith('scrollend', expect.any(Function));
    removeEventListener.mockRestore();
  });
});
