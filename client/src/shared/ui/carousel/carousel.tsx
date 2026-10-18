import type { Key, ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { CarouselControls } from './carousel-controls';
import { useCarousel } from './use-carousel';

const DEFAULT_AUTOPLAY_DELAY_MS = 1000;

interface CarouselProps<T> {
  items: T[];
  label: string;
  getKey: (item: T) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  autoplayDelay?: number;
  className?: string;
  trackClassName?: string;
  slideClassName?: string;
}

export const Carousel = <T,>({
  items,
  label,
  getKey,
  renderItem,
  autoplayDelay = DEFAULT_AUTOPLAY_DELAY_MS,
  className,
  trackClassName,
  slideClassName,
}: CarouselProps<T>) => {
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
  } = useCarousel({ slidesCount: items.length, autoplayDelay });
  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('flex flex-col gap-y-3', className)}
      {...focusHandlers}
    >
      <div
        ref={trackRef}
        {...hoverHandlers}
        className={cn(
          'flex snap-x snap-mandatory scrollbar-none gap-2.5 overflow-x-auto overscroll-x-contain py-1 sm:gap-4 [&::-webkit-scrollbar]:hidden',
          trackClassName,
        )}
      >
        {items.map((item, index) => (
          <div
            key={getKey(item)}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} из ${items.length}`}
            className={cn('shrink-0 snap-start snap-always', slideClassName)}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <p aria-live={isAutoplayActive ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
          Слайд {activeIndex + 1} из {items.length}
        </p>
      )}

      {items.length > 1 && (
        <CarouselControls
          slidesCount={items.length}
          activeIndex={activeIndex}
          isPlaying={isPlaying}
          onTogglePlaying={togglePlaying}
          onSelect={scrollToSlide}
          onPrevious={showPreviousSlide}
          onNext={showNextSlide}
          hoverHandlers={hoverHandlers}
        />
      )}
    </section>
  );
};
