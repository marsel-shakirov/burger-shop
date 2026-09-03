import type { SVGProps } from 'react';

export const ArrowTopSort = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 16 16"
      aria-hidden="true"
      {...props}
    >
      <g fill="currentColor">
        <path d="M0 11h3V0h2v11h3v1l-4 4-4-4zM16 0h-6v2h6zM10 4h4v2h-4zM12 8h-2v2h2z" />
      </g>
    </svg>
  );
};
