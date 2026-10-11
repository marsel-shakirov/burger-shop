import type { SVGProps } from 'react';

export const ArrowIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="currentColor"
      viewBox="-4.5 0 20 20"
      aria-hidden="true"
      {...props}
    >
      <path d="M10.634 0.292C10.229-0.097 9.573-0.097 9.17 0.292L0.607 8.556C-0.202 9.336-0.202 10.603 0.607 11.383L9.232 19.708C9.632 20.093 10.28 20.098 10.686 19.718 11.101 19.329 11.105 18.688 10.697 18.293L2.803 10.676C2.398 10.286 2.398 9.653 2.803 9.262L10.634 1.705C11.039 1.316 11.039 0.683 10.634 0.292Z" />
    </svg>
  );
};
