interface PromoCtaProps {
  label: string;
}

export const PromoCta = ({ label }: PromoCtaProps) => {
  return (
    <span
      aria-hidden="true"
      className="rounded-full bg-stone-900 px-3.5 py-2.5 text-sm leading-none font-bold whitespace-nowrap text-paper"
    >
      {label}
    </span>
  );
};
