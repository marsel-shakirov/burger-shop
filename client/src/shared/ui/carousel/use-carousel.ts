import {
  type FocusEvent,
  type PointerEvent,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const ACTIVE_SLIDE_THRESHOLD = 0.6;

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const getPrefersReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

interface UseCarouselOptions {
  slidesCount: number;
  autoplayDelay: number;
}

export const useCarousel = ({ slidesCount, autoplayDelay }: UseCarouselOptions) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => !getPrefersReducedMotion());
  const [isPointerOver, setIsPointerOver] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getPrefersReducedMotion,
  );

  const isAutoplayActive = isPlaying && !isPointerOver && !isFocusWithin && slidesCount > 1;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.children);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= ACTIVE_SLIDE_THRESHOLD) {
            setActiveIndex(slides.indexOf(entry.target));
          }
        });
      },
      { root: track, threshold: ACTIVE_SLIDE_THRESHOLD },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [slidesCount]);

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track || slidesCount === 0) return;

    const slides = track.children;
    const target = slides[(index + slidesCount) % slidesCount];
    const first = slides[0];
    if (!(target instanceof HTMLElement) || !(first instanceof HTMLElement)) return;

    track.scrollTo({
      left: target.offsetLeft - first.offsetLeft,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  };

  const showNextSlideOnTick = useEffectEvent(() => {
    if (!document.hidden) scrollToSlide(activeIndex + 1);
  });

  useEffect(() => {
    if (!isAutoplayActive) return;

    const intervalId = setInterval(showNextSlideOnTick, autoplayDelay);
    return () => clearInterval(intervalId);
  }, [isAutoplayActive, activeIndex, autoplayDelay]);

  const hoverHandlers = {
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setIsPointerOver(true);
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setIsPointerOver(false);
    },
    onTouchStart: () => setIsPointerOver(true),
    onTouchEnd: () => setIsPointerOver(false),
    onTouchCancel: () => setIsPointerOver(false),
  };

  const focusHandlers = {
    onFocus: (event: FocusEvent) => {
      if (event.target.matches(':focus-visible')) setIsFocusWithin(true);
    },
    onBlur: (event: FocusEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusWithin(false);
    },
  };

  return {
    trackRef,
    hoverHandlers,
    focusHandlers,
    activeIndex,
    isPlaying,
    isAutoplayActive,
    togglePlaying: () => setIsPlaying((playing) => !playing),
    scrollToSlide,
    showPreviousSlide: () => scrollToSlide(activeIndex - 1),
    showNextSlide: () => scrollToSlide(activeIndex + 1),
  };
};
