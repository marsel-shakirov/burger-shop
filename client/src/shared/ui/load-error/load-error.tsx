import { cn } from '@/shared/lib';

interface LoadErrorProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

export const LoadError = ({ message, onRetry, className }: LoadErrorProps) => {
  return (
    <div role="alert" className={cn('flex items-center justify-between gap-x-4', className)}>
      <p className="text-balance text-stone-500">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="h-10 shrink-0 cursor-pointer rounded-md bg-orange-500 px-4 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600"
      >
        Повторить
      </button>
    </div>
  );
};
