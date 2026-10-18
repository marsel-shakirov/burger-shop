import { type ReactNode, useId } from 'react';
import { Link, type To } from 'react-router';

import { cn } from '@/shared/lib';

import { PROMO_THEME_CLASS } from '../model/promo.constants';
import type { Promo } from '../model/promo.types';

interface PromoCardProps {
  promo: Promo;
  to: To;
  priority: boolean;
  stub: ReactNode;
}

export const PromoCard = ({ promo, to, priority, stub }: PromoCardProps) => {
  const titleId = useId();

  return (
    <div className="h-full rounded-2xl has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-amber-600 has-[a:focus-visible]:ring-offset-2">
      <article className="relative grid h-full grid-rows-[1fr_5.75rem] [--ticket-cut:calc(100%-5.75rem)] max-sm:ticket-perforation-row sm:grid-cols-[1fr_40%] sm:grid-rows-none sm:ticket-perforation-col sm:[--ticket-cut:60%] lg:grid-cols-[1fr_32%] lg:[--ticket-cut:68%]">
        <div
          className={cn(
            'relative overflow-hidden rounded-t-2xl p-5 sm:rounded-l-2xl sm:rounded-tr-none sm:px-8 sm:py-7',
            PROMO_THEME_CLASS[promo.theme],
          )}
        >
          <h3
            id={titleId}
            className="relative max-w-[62%] font-display text-lg leading-[1.1] font-extrabold text-balance sm:max-w-[70%] sm:text-[1.375rem] lg:max-w-[60%] lg:text-[2rem]"
          >
            {promo.title}
          </h3>

          <p className="relative mt-2 hidden max-w-[52%] leading-snug opacity-80 lg:line-clamp-2">
            {promo.description}
          </p>

          <p className="absolute bottom-4 left-5 text-xs font-semibold opacity-85 sm:bottom-6 sm:left-8">
            {promo.terms}
          </p>

          {promo.imageUrl && (
            <img
              width={256}
              height={256}
              src={promo.imageUrl}
              srcSet={promo.imageSrcSet}
              sizes="(min-width: 64rem) 260px, (min-width: 40rem) 30vw, 46vw"
              alt=""
              className="pointer-events-none absolute right-[-6%] bottom-[-14%] aspect-square w-[52%] max-w-65 -rotate-4 object-contain sm:right-[-4%] sm:bottom-[-18%] sm:w-[46%]"
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
            />
          )}
        </div>

        <div className="@container relative flex origin-top-left items-center justify-between gap-3 rounded-b-2xl border-t-2 border-dashed border-stone-900/20 bg-paper px-5 py-3.5 text-stone-900 transition-transform duration-400 ease-[cubic-bezier(0.2,0.9,0.25,1.2)] has-data-copied:z-2 has-data-copied:translate-y-1.25 has-data-copied:rotate-[-1.6deg] motion-reduce:transition-none sm:flex-col sm:items-start sm:rounded-r-2xl sm:rounded-bl-none sm:border-t-0 sm:border-l-2 sm:px-6 sm:py-6.5 sm:has-data-copied:translate-x-1.5 sm:has-data-copied:translate-y-0 sm:has-data-copied:rotate-[1.4deg]">
          {stub}
        </div>

        <Link to={to} aria-labelledby={titleId} className="absolute inset-0 z-1 outline-none" />
      </article>
    </div>
  );
};
