import { CodeIcon, DevelopmentIcon } from '../icon';

export const UnderConstruction = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-6">
      <DevelopmentIcon className="size-36 md:size-46" />
      <div className="flex items-center">
        <CodeIcon className="size-13" />
        <span className="text-2xl font-extrabold md:text-3xl">В разработке</span>
        <CodeIcon className="size-13" />
      </div>
    </div>
  );
};
