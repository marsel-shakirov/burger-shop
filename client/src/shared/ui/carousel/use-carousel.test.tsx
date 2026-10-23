import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCarousel } from './use-carousel';

const AUTOPLAY_DELAY = 1000;

const SLIDE_WIDTH = 300;

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

const media = { matches: false, listeners: new Set<() => void>() };

const observers: Array<{ callback: ObserverCallback; disconnect: ReturnType<typeof vi.fn> }> = [];

class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: ObserverCallback) {
    observers.push({ callback, disconnect: this.disconnect });
  }
}

const scrollTo = vi.fn();

const TestCarousel = ({ slidesCount }: { slidesCount: number }) => {
  const {
    trackRef,
    hoverHandlers,
    focusHandlers,
    activeIndex,
    isPlaying,
    isAutoplayActive,
    togglePlaying,
    scrollToSlide,
    showPreviousSlide,
    showNextSlide,
  } = useCarousel({ slidesCount, autoplayDelay: AUTOPLAY_DELAY });

  return (
    <section {...focusHandlers}>
      <div ref={trackRef} data-testid="track" {...hoverHandlers}>
        {Array.from({ length: slidesCount }, (_, index) => (
          <div key={index} data-testid="slide">
            <button type="button">{`slide ${index}`}</button>
          </div>
        ))}
      </div>
      <output data-testid="active">{activeIndex}</output>
      <output data-testid="playing">{String(isPlaying)}</output>
      <output data-testid="autoplay">{String(isAutoplayActive)}</output>
      <button type="button" onClick={togglePlaying}>
        toggle
      </button>
      <button type="button" onClick={showPreviousSlide}>
        previous
      </button>
      <button type="button" onClick={showNextSlide}>
        next
      </button>
      <button type="button" onClick={() => scrollToSlide(2)}>
        third
      </button>
    </section>
  );
};

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

const renderCarousel = (slidesCount = 3) => {
  const view = render(<TestCarousel slidesCount={slidesCount} />);

  screen.queryAllByTestId('slide').forEach((slide, index) => {
    Object.defineProperty(slide, 'offsetLeft', { value: 20 + index * SLIDE_WIDTH });
  });

  return view;
};

const getText = (testId: string) => screen.getByTestId(testId).textContent;

const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

const showSlide = (index: number) =>
  act(() =>
    observers
      .at(-1)
      ?.callback([{ target: screen.getAllByTestId('slide')[index], intersectionRatio: 0.8 }]),
  );

const getScrolledLeft = () => (scrollTo.mock.lastCall?.[0] as ScrollToOptions | undefined)?.left;

beforeEach(() => {
  media.matches = false;
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return media.matches;
    },
    addEventListener: (_type: string, listener: () => void) => media.listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => media.listeners.delete(listener),
  }));
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    value: scrollTo,
    configurable: true,
  });
});

afterEach(() => {
  observers.length = 0;
  media.listeners.clear();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('useCarousel: активный слайд', () => {
  it('начинает с первого слайда', () => {
    renderCarousel();

    expect(getText('active')).toBe('0');
  });

  it('делает активным слайд, который виден больше чем на 60%', () => {
    renderCarousel();

    showSlide(2);

    expect(getText('active')).toBe('2');
  });

  it('не меняет активный слайд, если он виден меньше', () => {
    renderCarousel();

    act(() =>
      observers[0]?.callback([
        { target: screen.getAllByTestId('slide')[1], intersectionRatio: 0.3 },
      ]),
    );

    expect(getText('active')).toBe('0');
  });

  it('отключает наблюдатель при размонтировании', () => {
    const { unmount } = renderCarousel();

    unmount();

    expect(observers[0]?.disconnect).toHaveBeenCalledOnce();
  });
});

describe('useCarousel: прокрутка', () => {
  it('прокручивает к слайду относительно первого', () => {
    renderCarousel();

    click('third');

    expect(scrollTo).toHaveBeenCalledExactlyOnceWith({
      left: 2 * SLIDE_WIDTH,
      behavior: 'smooth',
    });
  });

  it('showNextSlide и showPreviousSlide идут от активного слайда', () => {
    renderCarousel();
    showSlide(1);

    click('next');
    expect(getScrolledLeft()).toBe(2 * SLIDE_WIDTH);

    click('previous');
    expect(getScrolledLeft()).toBe(0);
  });

  it('после последнего слайда переходит к первому', () => {
    renderCarousel();
    showSlide(2);

    click('next');

    expect(getScrolledLeft()).toBe(0);
  });

  it('перед первым слайдом переходит к последнему', () => {
    renderCarousel();

    click('previous');

    expect(getScrolledLeft()).toBe(2 * SLIDE_WIDTH);
  });

  it('без слайдов ничего не прокручивает', () => {
    renderCarousel(0);

    click('next');

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('при reduced motion прокручивает без анимации', () => {
    media.matches = true;
    renderCarousel();

    click('next');

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' }));
  });
});

describe('useCarousel: автопрокрутка', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('по таймеру прокручивает к следующему слайду', () => {
    renderCarousel();

    advance(AUTOPLAY_DELAY);

    expect(getScrolledLeft()).toBe(SLIDE_WIDTH);
  });

  it('не прокручивает, пока вкладка скрыта', () => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    renderCarousel();

    advance(AUTOPLAY_DELAY);
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('при смене активного слайда отсчитывает задержку заново', () => {
    renderCarousel();

    advance(AUTOPLAY_DELAY - 100);
    showSlide(1);
    advance(AUTOPLAY_DELAY - 100);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('выключена для одного слайда', () => {
    renderCarousel(1);

    advance(AUTOPLAY_DELAY * 3);

    expect(getText('autoplay')).toBe('false');
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('по умолчанию выключена при reduced motion', () => {
    media.matches = true;
    renderCarousel();

    expect(getText('playing')).toBe('false');
    expect(getText('autoplay')).toBe('false');
  });

  it('togglePlaying ставит на паузу и снова запускает', () => {
    renderCarousel();

    click('toggle');
    advance(AUTOPLAY_DELAY * 2);
    expect(getText('playing')).toBe('false');
    expect(scrollTo).not.toHaveBeenCalled();

    click('toggle');
    advance(AUTOPLAY_DELAY);
    expect(getScrolledLeft()).toBe(SLIDE_WIDTH);
  });
});

describe('useCarousel: пауза при взаимодействии', () => {
  it('ставится на паузу, пока над треком мышь', () => {
    renderCarousel();
    const track = screen.getByTestId('track');

    fireEvent.pointerEnter(track, { pointerType: 'mouse' });
    expect(getText('autoplay')).toBe('false');

    fireEvent.pointerLeave(track, { pointerType: 'mouse' });
    expect(getText('autoplay')).toBe('true');
  });

  it('не реагирует на наведение пером или пальцем', () => {
    renderCarousel();

    fireEvent.pointerEnter(screen.getByTestId('track'), { pointerType: 'touch' });

    expect(getText('autoplay')).toBe('true');
  });

  it('ставится на паузу на время касания', () => {
    renderCarousel();
    const track = screen.getByTestId('track');

    fireEvent.touchStart(track);
    expect(getText('autoplay')).toBe('false');

    fireEvent.touchEnd(track);
    expect(getText('autoplay')).toBe('true');

    fireEvent.touchStart(track);
    fireEvent.touchCancel(track);
    expect(getText('autoplay')).toBe('true');
  });

  it('ставится на паузу, пока фокус с клавиатуры внутри карусели', () => {
    renderCarousel();
    const slideButton = screen.getByRole('button', { name: 'slide 0' });
    vi.spyOn(slideButton, 'matches').mockReturnValue(true);

    fireEvent.focus(slideButton);
    expect(getText('autoplay')).toBe('false');

    fireEvent.blur(slideButton, { relatedTarget: screen.getByRole('button', { name: 'next' }) });
    expect(getText('autoplay')).toBe('false');

    fireEvent.blur(slideButton, { relatedTarget: document.body });
    expect(getText('autoplay')).toBe('true');
  });

  it('не ставится на паузу при фокусе от клика мышью', () => {
    renderCarousel();
    const slideButton = screen.getByRole('button', { name: 'slide 0' });
    vi.spyOn(slideButton, 'matches').mockReturnValue(false);

    fireEvent.focus(slideButton);

    expect(getText('autoplay')).toBe('true');
  });
});
