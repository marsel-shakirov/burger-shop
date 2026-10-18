import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';
import { ArrowIcon, PauseIcon, PlayIcon } from '@/shared/ui/icon';

const controlButtonClass =
  'flex size-9 items-center cursor-pointer justify-center rounded-full bg-white text-stone-600 shadow-(--shadow-sm) transition-colors hover:text-stone-900 focus-ring';

interface CarouselControlsProps {
  slidesCount: number;
  activeIndex: number;
  isPlaying: boolean;
  onTogglePlaying: () => void;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  hoverHandlers: HTMLAttributes<HTMLDivElement>;
}

export const CarouselControls = ({
  slidesCount,
  activeIndex,
  isPlaying,
  onTogglePlaying,
  onSelect,
  onPrevious,
  onNext,
  hoverHandlers,
}: CarouselControlsProps) => {
  return (
    <div className="flex items-center justify-between gap-x-4">
      <div className="flex items-center gap-x-2" {...hoverHandlers}>
        {Array.from({ length: slidesCount }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Показать слайд ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => onSelect(index)}
            className="relative h-2 w-2 cursor-pointer rounded-full bg-stone-300 focus-ring transition-[width,background-color] duration-300 hover:bg-stone-400 aria-current:w-6 aria-current:bg-orange-600 pointer-coarse:after:absolute pointer-coarse:after:-inset-2"
          />
        ))}
      </div>

      <div className="flex items-center gap-x-2" {...hoverHandlers}>
        <button
          type="button"
          aria-label={isPlaying ? 'Остановить автопрокрутку' : 'Включить автопрокрутку'}
          onClick={onTogglePlaying}
          className={controlButtonClass}
        >
          {isPlaying ? <PauseIcon className="size-3" /> : <PlayIcon className="size-3" />}
        </button>
        <button
          type="button"
          aria-label="Предыдущий слайд"
          onClick={onPrevious}
          className={cn(controlButtonClass, 'hidden sm:flex')}
        >
          <ArrowIcon className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Следующий слайд"
          onClick={onNext}
          className={cn(controlButtonClass, 'hidden sm:flex')}
        >
          <ArrowIcon className="size-3.5 rotate-180" />
        </button>
      </div>
    </div>
  );
};
