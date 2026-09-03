import type { SVGProps } from 'react';

export const ArrowDownSort = (props: SVGProps<SVGSVGElement>) => {
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
        <path d="M0 5h3v11h2V5h3V4L4 0 0 4zM16 16h-6v-2h6zM10 12h4v-2h-4zM12 8h-2V6h2z" />
      </g>
    </svg>
  );
};
