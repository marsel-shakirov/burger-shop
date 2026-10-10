import type { SVGProps } from 'react';

export const BagIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2"
      />
      <path d="M5.2 8.5h13.6a1 1 0 0 1 1 .92l.86 10.3A2.1 2.1 0 0 1 18.57 22H5.43a2.1 2.1 0 0 1-2.09-2.28l.86-10.3a1 1 0 0 1 1-.92Z" />
    </svg>
  );
};
