import type { SVGProps } from 'react';

export const MinusIcon = (props: SVGProps<SVGSVGElement>) => {
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
        d="M10.8 4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
        fill="currentColor"
      />
    </svg>
  );
};
