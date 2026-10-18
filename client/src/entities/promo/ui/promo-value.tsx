interface PromoValueProps {
  value: string;
  caption: string;
}

export const PromoValue = ({ value, caption }: PromoValueProps) => {
  return (
    <div className="min-w-0">
      <p className="font-display text-[min(2.25rem,10.5cqi)] leading-[0.9] font-extrabold tracking-tighter whitespace-nowrap text-ketchup sm:text-[min(3.25rem,24cqi)] lg:text-[min(4rem,24cqi)]">
        {value}
      </p>
      <p className="mt-1 text-xs leading-tight font-bold text-stone-600">{caption}</p>
    </div>
  );
};
