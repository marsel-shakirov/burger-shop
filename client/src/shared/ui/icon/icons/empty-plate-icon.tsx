import type { SVGProps } from 'react';

export const EmptyPlate = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 240 72" width="64" height="64" aria-hidden="true" {...props}>
      <ellipse cx="120" cy="44" rx="118" ry="26" className="fill-black/6" />
      <ellipse cx="120" cy="38" rx="116" ry="28" className="fill-stone-200" />
      <ellipse cx="120" cy="36" rx="86" ry="18" className="fill-stone-100" />
      <path
        d="M44 30 A 86 18 0 0 1 196 30"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-white/90"
      />
    </svg>
  );
};
