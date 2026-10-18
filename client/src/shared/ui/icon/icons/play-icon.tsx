import type { SVGProps } from 'react';

export const PlayIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 12 12"
      width="24"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2 1.37C2 0.6 2.83 0.12 3.5 0.5L10.88 4.63C11.57 5.01 11.57 5.99 10.88 6.37L3.5 10.5C2.83 10.88 2 10.4 2 9.63V1.37Z"
        fill="currentColor"
      />
    </svg>
  );
};
