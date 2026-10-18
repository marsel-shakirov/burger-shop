import type { SVGProps } from 'react';

export const PauseIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <rect x="1.5" y="0.5" width="3" height="11" rx="1" fill="currentColor" />
      <rect x="7.5" y="0.5" width="3" height="11" rx="1" fill="currentColor" />
    </svg>
  );
};
