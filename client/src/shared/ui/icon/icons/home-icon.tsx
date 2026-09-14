import type { SVGProps } from 'react';

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="currentColor"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 10v10.3a.77.77 0 0 1-.83.7H14.3v-6.9H9.7V21H5.83a.77.77 0 0 1-.83-.7V10l7-7Z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 10v10.3a.77.77 0 0 1-.83.7H14.3v-6.9H9.7V21H5.83a.77.77 0 0 1-.83-.7V10"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 12-9-9-9 9" />
    </svg>
  );
};
