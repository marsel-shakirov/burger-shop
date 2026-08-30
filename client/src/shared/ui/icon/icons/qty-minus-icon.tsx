import type { SVGProps } from 'react';

export const QtyMinusIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
        <path d="M3 12c0-7.411 1.588-9 9-9s9 1.588 9 9-1.588 9-9 9c-7.411 0-9-1.588-9-9Z" />
      </g>
    </svg>
  );
};
