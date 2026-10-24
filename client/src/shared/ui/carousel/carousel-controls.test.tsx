import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CarouselControls } from './carousel-controls';

const renderControls = (props: { activeIndex?: number; isPlaying?: boolean } = {}) => {
  const handlers = {
    onTogglePlaying: vi.fn(),
    onSelect: vi.fn(),
    onPrevious: vi.fn(),
    onNext: vi.fn(),
  };

  render(
    <CarouselControls
      slidesCount={3}
      activeIndex={props.activeIndex ?? 0}
      isPlaying={props.isPlaying ?? true}
      hoverHandlers={{}}
      {...handlers}
    />,
  );

  return handlers;
};

describe('CarouselControls', () => {
  it('показывает точку на каждый слайд и отмечает активный', () => {
    renderControls({ activeIndex: 1 });

    const dots = screen.getAllByRole('button', { name: /^Показать слайд/ });

    expect(dots).toHaveLength(3);
    expect(dots.map((dot) => dot.getAttribute('aria-current'))).toEqual(['false', 'true', 'false']);
  });

  it('точка выбирает свой слайд', () => {
    const { onSelect } = renderControls();

    fireEvent.click(screen.getByRole('button', { name: 'Показать слайд 3' }));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith(2);
  });

  it('во время автопрокрутки предлагает её остановить', () => {
    const { onTogglePlaying } = renderControls({ isPlaying: true });

    fireEvent.click(screen.getByRole('button', { name: 'Остановить автопрокрутку' }));

    expect(onTogglePlaying).toHaveBeenCalledOnce();
  });

  it('на паузе предлагает включить автопрокрутку', () => {
    renderControls({ isPlaying: false });

    expect(screen.getByRole('button', { name: 'Включить автопрокрутку' })).toBeDefined();
  });

  it('стрелки листают назад и вперёд', () => {
    const { onPrevious, onNext } = renderControls();

    fireEvent.click(screen.getByRole('button', { name: 'Предыдущий слайд' }));
    fireEvent.click(screen.getByRole('button', { name: 'Следующий слайд' }));

    expect(onPrevious).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledOnce();
  });
});
