import { useSearchParams } from 'react-router';

type Mutator = (params: URLSearchParams) => void;

export const useUpdateSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const update = (mutate: Mutator) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mutate(next);
        return next;
      },
      { replace: true },
    );

  return [searchParams, update] as const;
};
